# AI School Management — Agent Guide

## Monorepo Map

| Path | Purpose |
|------|---------|
| `apps/mobile` | Flutter + Riverpod + GoRouter |
| `apps/admin` | Next.js admin dashboard |
| `apps/marketing` | Next.js marketing site |
| `packages/shared` | Types, permissions, subscription engine |
| `firebase/` | Rules, indexes, Cloud Functions |
| `services/ai` | Railway AI microservice |
| `docs/` | Architecture documentation |

## Conventions

- **Auth**: OTP-only via Twilio — never add email/password
- **Tenancy**: All school data must include `tenantId`
- **Permissions**: Update `packages/shared` matrix + Firestore rules together
- **Features**: Use `FEATURE_KEYS` and `resolveFeatureFlags()`
- **Student grades**: Use `getStudentLoginMode()` for login rules

## Before PR

```bash
pnpm install
pnpm --filter @ai-school/shared build
pnpm typecheck
cd apps/mobile && flutter analyze
```

## Key Docs

- [Architecture](docs/architecture/README.md)
- [Permission Matrix](docs/security/permission-matrix.md)
- [User Flows](docs/flows/user-flows.md)
