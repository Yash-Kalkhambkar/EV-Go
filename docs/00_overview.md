# EV GO — System Design Overview

## What We're Building

EV GO is a web application that lets EV owners find nearby charging stations and book slots in real time. The core user journey is:

> Open app → find a station → check availability → book a slot → pay → show up and charge.

Everything in v1 is designed around making that loop fast, reliable, and frustration-free. The AI layer sits on top of that loop — it doesn't replace it, it accelerates it.

---

## V1 Scope

| Feature | Included |
|---|---|
| User auth + profile | ✅ |
| Station search by location (map) | ✅ |
| Real-time slot availability | ✅ |
| Slot booking + cancellation | ✅ |
| Payments via Razorpay | ✅ |
| Admin dashboard | ✅ |
| AI chatbot (natural language search) | ✅ |
| AI review summarization | ❌ v2 |
| AI recommendations | ❌ v2 |
| Push notifications | ❌ v2 |
| React Native mobile app | ❌ v2 |

---

## Out of Scope for V1 (Deliberate Design Decisions)

The following features are intentionally excluded from v1. Each represents a production-grade enhancement that would add complexity without proportional value for a showcase project:

| Feature | Why It's Skipped |
|---|---|
| **Razorpay webhook as payment source of truth** | V1 trusts the frontend-triggered `/payments/verify` call plus signature validation. A webhook-driven flow is more robust (handles interrupted confirmations) but requires additional infrastructure for a project with no real payment volume. |
| **Idempotency keys on POST /bookings** | Real production concern for preventing double-submissions on client retries. V1's payment verification already checks booking status to make retries safe, covering the common case. |
| **Rate limiting** | Essential for public APIs under real load. Not worth the implementation time for a showcase project with controlled access. |
| **Comprehensive audit logging** | V1 logs errors and critical operations. Full audit trail (tracking every state change with actor + timestamp) is production hygiene but overkill for demonstrating core features. |
| **Structured observability (distributed tracing, metrics dashboards)** | Request IDs and basic logging are included. Full OpenTelemetry integration and Grafana dashboards are valuable at scale but not necessary to demonstrate the booking flow works correctly. |
| **AI destructive-action confirmation** | A "confirm before cancel_booking" step in the chatbot would be nice UX. Server-side enforcement already prevents unauthorized cancellations, so the AI can safely call the tool — worst case is a user-initiated cancellation they regret. |
| **Redis Pub/Sub for WebSocket scaling** | V1 caps Cloud Run at 1 instance since the STOMP broker is in-memory. Redis Pub/Sub would enable horizontal scaling but isn't needed until traffic justifies multiple instances. |

These aren't bugs or oversights — they're conscious scope cuts that keep v1 focused on demonstrating a working, well-architected booking system without gold-plating.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend | React + TypeScript | SPA, clean separation, mobile-knowledge reuse later |
| Backend | Spring Boot (Java) | Developer's strength, great for transactional systems |
| Primary DB | PostgreSQL | Relational model fits bookings/slots/users cleanly |
| Cache + Locking | Redis | Slot availability speed + race condition protection |
| AI | Claude API (Anthropic) | Chatbot + natural language station search |
| Maps | Google Maps API | Best in class, integrated billing on GCP |
| Payments | Razorpay | India-first, UPI + cards + wallets |
| Cloud | GCP — Cloud Run | Serverless containers, simpler than ECS for solo dev |
| Database hosting | GCP — Cloud SQL | Managed PostgreSQL |
| Cache hosting | GCP — Memorystore | Managed Redis |
| Static assets | GCP — Cloud Storage | Station images, user avatars |
| Real-time | Spring WebSockets | Live slot updates without polling |
| Auth | Spring Security + JWT | Standard, solid |
| Containers | Docker | Required by Cloud Run |

---

## High Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│        React + TypeScript (Web)                      │
│        React Native (Mobile — v2)                    │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS / WSS
┌────────────────────▼────────────────────────────────┐
│                   BACKEND LAYER                      │
│   Spring Boot REST API    │    AI Service Module     │
│   + WebSocket Server      │    (Claude API Wrapper)  │
└───────┬────────────┬──────┴────────────┬────────────┘
        │            │                   │
┌───────▼──┐  ┌──────▼──────┐  ┌────────▼───────────┐
│PostgreSQL│  │    Redis     │  │   Cloud Storage    │
│ Cloud SQL│  │ Memorystore  │  │   (GCP)            │
└──────────┘  └─────────────┘  └────────────────────┘
        │
┌───────▼──────────────────────────────┐
│           EXTERNAL SERVICES          │
│  Google Maps API  │  Razorpay        │
│  Claude API       │  (future: FCM)   │
└──────────────────────────────────────┘
```

---

## Documents in This Design

| File | What's inside |
|---|---|
| `01_frontend.md` | React project structure, routing, state, pages |
| `02_backend.md` | Spring Boot modules, package structure, security |
| `03_database.md` | PostgreSQL schema, all tables, relationships |
| `04_api.md` | All REST endpoints, request/response contracts |
| `05_slot_booking_flow.md` | Critical booking path with Redis locking |
| `06_ai_integration.md` | Claude API integration, chatbot architecture |
| `07_deployment.md` | GCP Cloud Run, Cloud SQL, CI/CD pipeline |

---

## Key Design Decisions

**Why Redis for slot locking and not just Postgres transactions?**
When two users try to book the same slot at the same millisecond, a Postgres transaction alone creates a race where both reads return "available" before either write commits. Redis `SET NX EX` (set if not exists, with expiry) gives us an atomic distributed lock — first request wins, second gets a clean rejection. Postgres handles the durable write after the lock is acquired.

**Why a separate AI Service module and not direct Claude API calls from controllers?**
All Claude API calls go through one module: `AIService`. This means prompt templates live in one place, context management (conversation history per user) is centralized, token usage can be tracked, and swapping Claude for a different model is a single file change. Controllers know nothing about AI — they just call `aiService.chat(userId, message)`.

**Why WebSockets and not polling?**
Slot availability needs to feel live. If user A books a slot while user B is looking at the same station, B should see that slot disappear within a second — not on their next page refresh. WebSockets make this trivial. Spring has first-class WebSocket support via STOMP over SockJS.

**Why Cloud Run over Cloud Run and a separate VM?**
Cloud Run auto-scales to zero when there's no traffic (cost-efficient for a new product) and scales up on demand without cluster management. For a v1 solo build this removes significant DevOps overhead.
