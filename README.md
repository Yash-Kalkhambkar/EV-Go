# EV GO ⚡

Find EV charging stations near you. Book a slot. Charge up. Get going.

---

## What is this?

**EV GO** is a web application that makes it super easy for electric vehicle owners to find nearby charging stations, check real-time availability, and book charging slots in just a few clicks.

Think of it like booking a table at a restaurant, but for your car's battery.

### The flow is simple:
1. Open the app
2. Search for charging stations nearby
3. See available time slots
4. Book and pay
5. Show up and charge

---

## What's included (v1)

✅ **User login & profile management** — Sign up, save preferences  
✅ **Station search** — Find chargers on a map  
✅ **Real-time availability** — See which slots are actually open  
✅ **Booking & cancellation** — Reserve a slot, cancel if plans change  
✅ **Payments** — Pay securely via Razorpay (UPI, cards, wallets)  
✅ **Admin dashboard** — Manage stations and bookings  
✅ **AI chatbot** — Ask questions in plain English  

Coming in v2: mobile app, recommendations, review summaries, notifications.

---

## How it's built

| What | Technology | Why |
|---|---|---|
| **Frontend** | React + TypeScript | Fast, reliable, web-first |
| **Backend** | Spring Boot (Java) | Handles complex booking logic & payments |
| **Database** | PostgreSQL | Perfect for users, bookings, stations |
| **Speed layer** | Redis | Keeps availability data super fast |
| **Maps** | Google Maps | Industry standard |
| **Payments** | Razorpay | Works great in India |
| **AI** | Claude API | Natural conversations |
| **Hosting** | GCP (Cloud Run) | Scales automatically |

---

## Project structure

```
EVCharging/
├── docs/                    # Complete docs (read these!)
│   ├── 00_overview.md      # System design
│   ├── 01_frontend.md      # React app
│   ├── 02_backend.md       # Spring Boot API
│   ├── 03_database.md      # Schema & queries
│   ├── 04_api.md           # API endpoints
│   ├── 05_slot_booking_flow.md
│   ├── 06_ai_integration.md
│   └── 07_deployment.md    # How to deploy
│
└── ev-go-backend/          # Backend (Java)
    ├── pom.xml             # Maven dependencies
    └── src/
        ├── main/java       # All the code
        └── test/java       # Tests
```

---

## Getting started

### Run the backend

```bash
cd ev-go-backend
mvn clean install
mvn spring-boot:run
```

The API will be at `http://localhost:8080`

### Set up your environment

Before running, create a `.env` file in `ev-go-backend/src/main/resources/`:

```properties
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/evgo
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=yourpassword

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External services
GOOGLE_MAPS_API_KEY=your_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
CLAUDE_API_KEY=your_key
```

### Need more details?

- **Want to understand the system?** → Read [docs/00_overview.md](docs/00_overview.md)
- **Building the backend?** → Check [docs/02_backend.md](docs/02_backend.md)
- **Working on the database?** → See [docs/03_database.md](docs/03_database.md)
- **API endpoints?** → [docs/04_api.md](docs/04_api.md)
- **How bookings work?** → [docs/05_slot_booking_flow.md](docs/05_slot_booking_flow.md)
- **Deploying to production?** → [docs/07_deployment.md](docs/07_deployment.md)

---

## Quick commands

```bash
# Build the backend
mvn clean install

# Run tests
mvn test

# Start the app
mvn spring-boot:run

# View logs
tail -f logs/app.log
```

---

## Questions?

If something's unclear, that's on us. Check the docs first — they're pretty thorough. If you're still stuck, open an issue or ask in the team chat.

---

**Happy coding! ⚡**
