# API Structure

## Firebase Callable Functions

| Function | Auth | Description |
|----------|------|-------------|
| `sendOtp` | Public | Send Twilio Verify SMS |
| `verifyOtp` | Public | Verify OTP → custom token |
| `calculatePrice` | Optional | Live subscription quote |
| `createCheckoutSession` | Required | Stripe/Razorpay checkout |
| `sendPushNotification` | Staff | FCM multicast |
| `sendWhatsAppAlert` | Staff | Twilio WhatsApp |
| `updateBusLocation` | Driver | GPS update |

## HTTP Webhooks

| Endpoint | Provider |
|----------|----------|
| `stripeWebhook` | Stripe subscription events |
| `razorpayWebhook` | Razorpay subscription events |

## Railway AI Service

Base URL: `https://{service}.railway.app`

Headers: `X-API-Key: {AI_SERVICE_API_KEY}`

| Method | Path | Body |
|--------|------|------|
| GET | `/health` | — |
| POST | `/api/v1/chat` | `{ tenantId, userId, message, language, context? }` |
| POST | `/api/v1/translate` | `{ text, targetLanguage, sourceLanguage? }` |

## Firestore (Client SDK)

Direct reads/writes per security rules. Prefer:

- Tenant-scoped queries with composite indexes
- Callable functions for payments, OTP, bus location

## REST Conventions (Future BFF)

```
/api/v1/tenants/{tenantId}/students
/api/v1/tenants/{tenantId}/attendance
/api/v1/tenants/{tenantId}/feed
```

Implemented via Next.js Route Handlers when needed for SSR.
