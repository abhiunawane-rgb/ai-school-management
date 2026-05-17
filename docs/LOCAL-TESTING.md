# Local testing guide — AI School Management

This guide explains what works today on your computer and how to test each part.

## Quick start (5 minutes)

```bash
cd "E:\My Cursor Projects\AI School Management"
npx pnpm install
npx pnpm dev
```

| App | URL | Purpose |
|-----|-----|---------|
| Marketing website | http://localhost:3002 | Public site, pricing, signup |
| Admin dashboard | http://localhost:3001 | School admin portal |
| Admin login | http://localhost:3001/login | OTP login (test mode) |

---

## What is fully testable locally (no Firebase required)

### Marketing website (port 3002)

- Home, features, how it works, why us, contact
- Pricing calculator (currency, plans, add-ons, live total)
- Full signup wizard with school logo upload
- Signup saves to `.data/leads/` when API runs, or browser `localStorage` as fallback

### Admin dashboard (port 3001)

- **Header:** School name + logo (from signup or demo school)
- **Overview:** Summary cards and quick links
- **School profile:** Edit name, logo, address, principal, contact
- **Team & invites:** Invite parent, teacher, student, driver
- **Sub Admin:** Principal can promote a teacher → Sub Admin (can invite on principal’s behalf)
- **Subscription:** Plan, trial status, billing cycle
- **Billing & invoices:** Invoice history (trial invoice included)
- **Settings:** Timezone, language, notifications
- **Modules:** Attendance, fees, bus, etc. show setup pages (full module logic needs Firebase)

### Test login (admin)

1. Open http://localhost:3001/login
2. Enter any phone number → **Send OTP**
3. Enter OTP **123456** (any 6 digits work in test mode)
4. You land on the dashboard

---

## Best test flow (signup → admin)

1. **Marketing signup:** http://localhost:3002/signup  
   - Fill school name, upload logo, size, plan, accept terms, admin phone/email  
   - Complete wizard (saves to `localStorage` key `aischool_signup_pending`)

2. **Admin login:** http://localhost:3001/login  
   - Sign in with the same phone number  
   - Dashboard loads **your school name and logo** from signup data

3. **Team invites:** Dashboard → **Team & invites**  
   - Invite a teacher, parent, student, or driver  
   - As principal: open a teacher → **Make Sub Admin**  
   - Settings → switch role to **sub admin** → confirm you can still send invites

4. **Profile:** Update school logo → header updates immediately

---

## What requires additional setup (not in local browser-only mode)

| Feature | Status | To enable |
|---------|--------|-----------|
| Real OTP (Twilio) | Stub | Firebase Blaze + Twilio Verify keys in `.env.local` |
| Cloud database | Not connected | Firebase Firestore + deploy rules |
| Live payments | Not connected | Stripe / Razorpay keys |
| Push notifications | Backend only | Firebase + FCM |
| Flutter mobile app | Scaffold | `cd apps/mobile && flutter run` + Firebase config |
| AI chat service | Separate service | `cd services/ai && pnpm dev` on Railway locally |

---

## If marketing shows errors

Clear Next.js cache and restart:

```bash
npx pnpm --filter @ai-school/marketing clean
npx pnpm dev
```

---

## If admin shows empty school

1. Sign out  
2. Complete signup on http://localhost:3002/signup again  
3. Or clear browser storage and sign in again (loads demo school **Green Valley International School**)

Clear admin data only:

- DevTools → Application → Local Storage → delete `aischool_admin_state`

---

## Run production build check

```bash
npx pnpm build
```

All packages should build without errors.

---

## Team testing on BigRock (static site)

See [DEPLOY-BIGROCK.md](./DEPLOY-BIGROCK.md). Static hosting runs marketing only; admin must be run locally or deployed to Vercel for remote team access.
