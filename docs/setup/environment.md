# Environment Setup

## 1. Prerequisites

```bash
node -v    # >= 20
pnpm -v    # >= 9
flutter -v # >= 3.24
firebase --version
```

## 2. Clone & Install

```bash
cd "AI School Management"
pnpm install
cp .env.example .env.local
```

## 3. Firebase Project

```bash
firebase login
firebase init  # select existing project
firebase use dev
```

Enable: Authentication (Phone), Firestore, Storage, Functions, FCM.

Set Functions config:
```bash
firebase functions:config:set \
  twilio.account_sid="..." \
  twilio.auth_token="..." \
  twilio.verify_sid="..." \
  stripe.secret_key="..." \
  stripe.webhook_secret="..."
```

## 4. Twilio

1. Create Verify Service
2. Enable SMS for target countries
3. Enable WhatsApp sandbox / Business API
4. Add credentials to `.env.local` and Functions config

## 5. Stripe & Razorpay

- **Stripe**: Products optional; Checkout uses dynamic `price_data`
- **Razorpay**: Subscription plans with `notes.tenantId`
- Configure webhooks → Functions URLs

## 6. Google Maps

1. Enable Maps SDK (Android/iOS) + Maps JavaScript API
2. Restrict API keys by bundle ID / domain
3. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## 7. Railway AI

```bash
cd services/ai
cp .env.example .env
pnpm dev
```

## 8. Run Stack

```bash
# Terminal 1
pnpm firebase:emulators

# Terminal 2
pnpm dev

# Terminal 3
cd apps/mobile && flutter pub get && flutter run
```

## 9. Flutter Firebase

```bash
dart pub global activate flutterfire_cli
cd apps/mobile
flutterfire configure
```

## 10. Seed Data (optional)

Import sample `plans` and `country_pricing` via Firebase Console or Admin SDK script.
