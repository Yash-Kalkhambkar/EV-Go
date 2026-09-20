# EV GO — Deployment & Infrastructure (GCP)

## Architecture Overview

```
GitHub
  │
  ▼ (push to main)
GitHub Actions CI/CD
  │
  ├── Build + test Spring Boot → Docker image → Artifact Registry
  ├── Build React → static files → Cloud Storage
  │
  ▼
GCP Cloud Run          ← Spring Boot container
GCP Cloud SQL          ← PostgreSQL 16
GCP Memorystore        ← Redis 7
GCP Cloud Storage      ← React frontend + station images
GCP Cloud CDN          ← CDN in front of Cloud Storage
GCP Secret Manager     ← All secrets (API keys, DB password, JWT secret)
GCP Artifact Registry  ← Docker images
```

---

## GCP Services Used

| Service | Purpose | Notes |
|---|---|---|
| Cloud Run | Backend container hosting | Scales to 0, scales up on demand |
| Cloud SQL | PostgreSQL 16 managed DB | Automatic backups, failover |
| Memorystore | Redis 7 managed cache | Private VPC, no public exposure |
| Cloud Storage | React static files + assets | Bucket for frontend, separate bucket for uploads |
| Cloud CDN | CDN for frontend and images | Attached to Cloud Storage load balancer |
| Artifact Registry | Docker image storage | Used by Cloud Run |
| Secret Manager | All environment secrets | Never hardcoded anywhere |
| Cloud Run Jobs | Scheduled cleanup task | Replaces Spring `@Scheduled` in production |

---

## Backend — Cloud Run

Cloud Run runs the Spring Boot Docker image. Key config:

```yaml
# cloud-run-service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: ev-go-backend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    spec:
      serviceAccountName: ev-go-sa
      containers:
        - image: asia-south1-docker.pkg.dev/ev-go/backend/ev-go-backend:latest
          ports:
            - containerPort: 8080
          resources:
            limits:
              cpu: "1"
              memory: "512Mi"
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: prod
            - name: DB_URL
              valueFrom:
                secretKeyRef:
                  name: db-url
                  key: latest
            - name: DB_USER
              valueFrom:
                secretKeyRef:
                  name: db-user
                  key: latest
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-password
                  key: latest
            - name: REDIS_HOST
              valueFrom:
                secretKeyRef:
                  name: redis-host
                  key: latest
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: latest
            - name: CLAUDE_API_KEY
              valueFrom:
                secretKeyRef:
                  name: claude-api-key
                  key: latest
            - name: RAZORPAY_KEY_ID
              valueFrom:
                secretKeyRef:
                  name: razorpay-key-id
                  key: latest
            - name: RAZORPAY_KEY_SECRET
              valueFrom:
                secretKeyRef:
                  name: razorpay-key-secret
                  key: latest
      scaling:
        minInstanceCount: 0
        maxInstanceCount: 1   # v1 uses in-memory STOMP broker - single instance required
```

**WebSocket Scalability Note:** The `enableSimpleBroker("/topic")` configuration keeps subscriptions in-memory per instance. With multiple instances, a WebSocket message sent by instance A would not reach clients connected to instance B. For v1, we cap at one instance to ensure broadcast delivery works correctly.

**Scaling path for v2:** Introduce Redis Pub/Sub as a message backplane so any instance can publish messages that reach all connected clients across all instances. This allows horizontal scaling while maintaining real-time broadcast functionality.

**Important:** Cloud Run instances are stateless. WebSocket connections (STOMP) with in-memory broker require a single instance in v1. The config sets `maxInstanceCount: 1` to ensure all WebSocket clients connect to the same instance and receive broadcasts correctly.

**Scaling path for v2:** Introduce Redis Pub/Sub as a message backplane to distribute WebSocket messages across multiple Cloud Run instances, allowing horizontal scaling while maintaining real-time functionality.

---

## Frontend — Cloud Storage + CDN

```bash
# Build React app
npm run build

# Upload to GCS bucket
gsutil -m rsync -r -d dist/ gs://ev-go-frontend/

# Set cache headers
gsutil -m setmeta \
  -h "Cache-Control:public, max-age=31536000, immutable" \
  "gs://ev-go-frontend/assets/**"

gsutil setmeta \
  -h "Cache-Control:public, max-age=0, must-revalidate" \
  gs://ev-go-frontend/index.html
```

`index.html` never cached (so deploys take effect immediately). Hashed JS/CSS assets cached for 1 year (Vite fingerprints them).

---

## Database — Cloud SQL

```bash
# Create Cloud SQL instance
gcloud sql instances create ev-go-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \           # Free tier for v1
  --region=asia-south1 \
  --storage-type=SSD \
  --storage-size=20GB \
  --backup-start-time=02:00 \
  --availability-type=ZONAL      # Regional for v2

# Create database + user
gcloud sql databases create evgo --instance=ev-go-db
gcloud sql users create evgo --instance=ev-go-db --password=<secure>
```

Cloud Run connects to Cloud SQL via the **Cloud SQL Auth Proxy** — no public IP needed on the database.

JDBC URL in production:
```
jdbc:postgresql:///evgo?cloudSqlInstance=PROJECT:REGION:ev-go-db&socketFactory=com.google.cloud.sql.postgres.SocketFactory
```

---

## Redis — Memorystore

```bash
# Create Redis instance (private VPC)
gcloud redis instances create ev-go-redis \
  --size=1 \
  --region=asia-south1 \
  --redis-version=redis_7_0 \
  --tier=basic
```

Memorystore is only accessible from inside the VPC — not the public internet. Cloud Run connects via VPC connector.

---

## CI/CD — GitHub Actions

Two pipelines:

### Backend pipeline

```yaml
# .github/workflows/backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['ev-go-backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Java 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Run tests
        run: cd ev-go-backend && mvn test

      - name: Build JAR
        run: cd ev-go-backend && mvn package -DskipTests

      - name: Authenticate to GCP
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Build and push Docker image
        run: |
          gcloud builds submit ev-go-backend \
            --tag asia-south1-docker.pkg.dev/ev-go/backend/ev-go-backend:${{ github.sha }}

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ev-go-backend \
            --image asia-south1-docker.pkg.dev/ev-go/backend/ev-go-backend:${{ github.sha }} \
            --region asia-south1 \
            --platform managed
```

### Frontend pipeline

```yaml
# .github/workflows/frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['ev-go-frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node 20
        uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Install + Build
        run: |
          cd ev-go-frontend
          npm ci
          npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_GOOGLE_MAPS_API_KEY: ${{ secrets.VITE_GOOGLE_MAPS_API_KEY }}
          VITE_RAZORPAY_KEY_ID: ${{ secrets.VITE_RAZORPAY_KEY_ID }}

      - name: Authenticate to GCP
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Upload to Cloud Storage
        run: |
          gsutil -m rsync -r -d ev-go-frontend/dist/ gs://ev-go-frontend/
          gsutil setmeta -h "Cache-Control:no-cache" gs://ev-go-frontend/index.html
```

---

## Secrets Management

All secrets stored in GCP Secret Manager. Never in code, never in `.env` files committed to git.

```bash
# Store a secret
echo -n "my-secret-value" | gcloud secrets create jwt-secret --data-file=-

# Grant Cloud Run service account access
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:ev-go-sa@ev-go.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Monorepo Structure

```
ev-go/
├── ev-go-backend/         # Spring Boot
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── ev-go-frontend/        # React + TypeScript
│   ├── src/
│   ├── vite.config.ts
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── backend.yml
│       └── frontend.yml
│
└── README.md
```

Each sub-project deploys independently — pushing to `ev-go-backend/**` only triggers the backend pipeline, not the frontend.

---

## Estimated Monthly Cost (v1, low traffic)

| Service | Tier | Est. Cost |
|---|---|---|
| Cloud Run | 0 idle, ~2M req/mo | ~$0–5 |
| Cloud SQL (db-f1-micro) | 20GB SSD | ~$10 |
| Memorystore (1GB Basic) | asia-south1 | ~$35 |
| Cloud Storage | < 10GB | ~$0.5 |
| Cloud CDN | Light traffic | ~$1 |
| **Total** | | **~$47/mo** |

Memorystore is the biggest cost in v1. If budget is tight during early dev, run Redis locally via Cloud Run sidecar or use a smaller Memorystore instance. For a real product this cost is acceptable — don't cut corners on Redis for a booking system.
