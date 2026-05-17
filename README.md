# AI School Management

Production-grade global AI-powered school management SaaS platform.

**Repository:** [github.com/abhiunawane-rgb/ai-school-management](https://github.com/abhiunawane-rgb/ai-school-management) — separate from the legacy [school-management](https://github.com/abhiunawane-rgb/school-management) project. See [docs/GITHUB.md](docs/GITHUB.md).

## Monorepo Structure

```
ai-school-management/
├── apps/
│   ├── mobile/          # Flutter (Riverpod + GoRouter)
│   ├── admin/           # Next.js admin dashboard
│   └── marketing/       # Next.js marketing website
├── packages/
│   ├── shared/          # Types, models, permissions, subscription engine
│   └── ui/              # Shared React components (ShadCN)
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   ├── storage.rules
│   └── functions/       # Cloud Functions
├── services/
│   └── ai/              # Railway AI microservices
└── docs/                # Architecture & API documentation
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Flutter 3.24+
- Firebase CLI
- Docker (optional, for local AI service)

### Install

```bash
pnpm install
cp .env.example .env.local
# Configure Firebase, Twilio, Stripe, Razorpay keys
```

### Development

```bash
# All Next.js apps
pnpm dev

# Firebase emulators
pnpm firebase:emulators

# Flutter mobile
cd apps/mobile && flutter pub get && flutter run

# AI microservice
cd services/ai && pnpm dev
```

## Documentation

| Document | Path |
|----------|------|
| Architecture | [docs/architecture/README.md](docs/architecture/README.md) |
| Database Schema | [docs/database/schema.md](docs/database/schema.md) |
| Firestore Collections | [docs/database/firestore-collections.md](docs/database/firestore-collections.md) |
| Permission Matrix | [docs/security/permission-matrix.md](docs/security/permission-matrix.md) |
| User Flows | [docs/flows/user-flows.md](docs/flows/user-flows.md) |
| Subscription Engine | [docs/billing/subscription-engine.md](docs/billing/subscription-engine.md) |
| Feature Flags | [docs/architecture/feature-flags.md](docs/architecture/feature-flags.md) |
| API Structure | [docs/api/README.md](docs/api/README.md) |
| Deployment | [docs/deployment/README.md](docs/deployment/README.md) |
| Environment Setup | [docs/setup/environment.md](docs/setup/environment.md) |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | Flutter, Riverpod, GoRouter |
| Web | Next.js 15, TypeScript, Tailwind, ShadCN |
| Backend | Firebase (Auth, Firestore, Storage, FCM) |
| AI | Railway (Node.js microservices) |
| Auth | Twilio OTP (no email/password) |
| Payments | Stripe + Razorpay |
| Maps | Google Maps |

## Roles

`super_admin` · `school_admin` · `sub_admin` · `teacher` · `parent` · `student` · `driver`

## License

Proprietary — All rights reserved.
