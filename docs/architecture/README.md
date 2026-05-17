# Architecture Overview

## System Context

```mermaid
flowchart TB
  subgraph clients [Clients]
    Mobile[Flutter Mobile]
    Admin[Next.js Admin]
    Marketing[Next.js Marketing]
  end

  subgraph firebase [Firebase]
    Auth[Auth - Custom Token]
    FS[Firestore]
    FCM[FCM Push]
    CF[Cloud Functions]
    Storage[Cloud Storage]
  end

  subgraph external [External Services]
    Twilio[Twilio OTP + WhatsApp]
    Stripe[Stripe]
    Razorpay[Razorpay]
    Maps[Google Maps]
    RailwayAI[Railway AI Service]
  end

  Mobile --> Auth
  Mobile --> FS
  Admin --> Auth
  Admin --> FS
  Marketing --> FS
  CF --> Twilio
  CF --> Stripe
  CF --> Razorpay
  Mobile --> RailwayAI
  Admin --> RailwayAI
  CF --> RailwayAI
  Mobile --> Maps
```

## Layers

| Layer | Responsibility |
|-------|----------------|
| **Presentation** | Flutter mobile, Next.js admin/marketing |
| **Application** | Riverpod providers, Next.js server actions |
| **Domain** | `@ai-school/shared` — permissions, pricing, features |
| **Infrastructure** | Firebase, Railway, Twilio, payment gateways |

## Multi-Tenancy

- Every school is a **tenant** (`tenants/{tenantId}`)
- Users link via **memberships** (`memberships/{userId}_{tenantId}`)
- All school data carries `tenantId` for isolation
- Firestore rules enforce tenant + role boundaries

## Clean Architecture (Mobile)

```
lib/
├── core/           # Router, theme, auth, network
├── features/       # Feature modules (auth, bus, ai, ...)
│   └── {feature}/
│       ├── data/
│       ├── domain/
│       └── presentation/
└── shared/         # Widgets, models
```

## Scalability

- Firestore composite indexes for tenant-scoped queries
- Feature flags gate modules per subscription
- AI workloads isolated on Railway (horizontal scale)
- CDN for marketing via Vercel/Cloudflare
- Offline: Hive cache + Firestore persistence (mobile)
