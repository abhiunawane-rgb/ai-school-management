# Deployment Strategy

## Environments

| Env | Firebase | Admin | Marketing | AI Service |
|-----|----------|-------|-----------|------------|
| dev | Emulators | localhost:3001 | localhost:3002 | localhost:4000 |
| staging | `ai-school-staging` | Vercel preview | Vercel preview | Railway staging |
| prod | `ai-school-prod` | admin.domain.com | www.domain.com | Railway prod |

## Components

### Firebase
```bash
firebase use prod
pnpm firebase:deploy  # rules, indexes, functions
```

### Next.js (Admin + Marketing)
- **Host**: Vercel or Cloudflare Pages
- **Build**: `pnpm --filter @ai-school/admin build`
- **Env**: Firebase public keys, API URLs

### Flutter Mobile
- **Android**: Play Console → internal → production
- **iOS**: TestFlight → App Store
- **CI**: `flutter build apk/ipa` in GitHub Actions
- **Config**: `flutterfire configure` per flavor

### Railway AI
```bash
railway link
railway up --service ai-school-ai
```
Set: `OPENAI_API_KEY`, `AI_SERVICE_API_KEY`, `ALLOWED_ORIGINS`

## Secrets Management

| Secret | Storage |
|--------|---------|
| Firebase Admin | GitHub Secrets / Vercel env |
| Twilio | Firebase Functions config |
| Stripe/Razorpay | Functions + Vercel |
| OpenAI | Railway variables |

## Rollout

1. Deploy Firestore rules + indexes
2. Deploy Cloud Functions
3. Deploy Railway AI
4. Deploy admin + marketing
5. Release mobile (staged rollout 10% → 100%)

## Monitoring

- Firebase Crashlytics (mobile)
- Firebase Performance
- Railway metrics + logs
- Stripe/Razorpay dashboards
