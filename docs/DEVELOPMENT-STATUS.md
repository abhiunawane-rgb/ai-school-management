# Development status — iOS, Android & websites

Last updated from codebase audit. Use this as the single checklist for what is **done in demo/local mode** vs **still needs production setup**.

---

## Summary

| Platform | Demo / local UI | Production backend |
|----------|-----------------|-------------------|
| **Marketing website** | Complete | Needs Vercel + real signup/payments |
| **Admin website** | Modules complete (localStorage) | Needs Firebase auth + Firestore |
| **Android / iOS app** | Screens complete (Hive demo) | Needs `flutter create`, Firebase, real OTP |

---

## Marketing website (`apps/marketing`)

### Done
- Home, features, how-it-works, why-us, pricing calculator, comparison, signup wizard, contact, privacy, terms
- Signup API (dev: saves to `.data/leads/`)
- Signup **localStorage fallback** when API unavailable (BigRock static)
- Contact **localStorage fallback** when API unavailable
- Mobile menu includes **Login** link
- BigRock static build: `pnpm --filter @ai-school/marketing build:bigrock`

### Still needs your credentials / hosting
- Deploy on **Vercel** (not BigRock alone) for `/api/signup` and `/api/contact`
- Real **Stripe / Razorpay** payment tokens (replace demo `pm_demo_*`)
- Firestore tenant creation on signup
- Env: `NEXT_PUBLIC_ADMIN_URL`

---

## Admin website (`apps/admin`)

### Done
- Dashboard, school profile, team invites, subscription, billing, settings
- **Fees** — full ledger UI
- **Attendance** — mark present/absent/late (localStorage)
- **Timetable** — view/add periods
- **Homework** — assign tasks
- **Bus tracking** — route status
- **AI assistant** — chat with smart demo replies (+ optional `NEXT_PUBLIC_AI_SERVICE_URL`)
- **Analytics** — summary from local data
- Login reads **signup deep link** (`?trial=1&phone=`)
- Env-based marketing URLs (`NEXT_PUBLIC_MARKETING_URL`)

### Still needs your credentials
- Real **Twilio OTP** via Firebase `sendOtp` / `verifyOtp`
- **Firestore** for tenants, memberships, attendance, fees sync with mobile
- **Stripe/Razorpay** checkout + webhooks
- Next.js **middleware** + `hasPermission` / `resolveFeatureFlags`
- Deploy admin to **Vercel** (BigRock cannot run Next.js server)
- Optional: pages for notices, results, social feed, events, gallery, online classes, reports

---

## Mobile app — Android & iOS (`apps/mobile`)

### Done (all roles)
- OTP login (demo)
- Role home screens
- Attendance, leaves, holidays, school profile
- Bus tracking (static map)
- AI chat (context-aware demo replies)
- **Homework**, **notices**, **timetable**, **fees** screens
- Driver **route** and **emergency** screens
- All home tiles are tappable

### Still needs setup on your machine
1. Install Flutter → run `apps/mobile/scripts/setup-mobile.ps1` (creates `android/` and `ios/`)
2. Add **Google Maps API key** (Android manifest + iOS)
3. `flutterfire configure` + copy `google-services.json`
4. Firebase Blaze plan for OTP functions

### Still needs development (production)
- Real OTP (`sendOtp` / `verifyOtp` callables)
- Firestore data layer (replace Hive demo stores)
- Feature flags + route guards from `feature_flags/{tenantId}`
- Live bus GPS (`geolocator` + `updateBusLocation`)
- Push notifications (FCM)
- Parent–student linking
- Student grade login rules (`getStudentLoginMode`)
- Sync with admin web (same Firestore `tenantId`)

---

## Recommended order to go live

1. Firebase project + deploy functions + Firestore rules  
2. Vercel: marketing + admin with env vars  
3. Wire admin login → OTP callables  
4. Signup API → create tenant in Firestore  
5. `setup-mobile.ps1` → test on Android/iOS device  
6. Point BigRock domain DNS to Vercel  

---

## Quick test commands

```bash
# From repo root
pnpm install
pnpm --filter @ai-school/shared build
pnpm typecheck

# Marketing
pnpm --filter @ai-school/marketing dev

# Admin
pnpm --filter @ai-school/admin dev

# Mobile (after Flutter setup)
cd apps/mobile && flutter pub get && flutter run
```
