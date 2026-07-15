# Business launch — AI School Management (live now)

Live site: **https://aischoolmanagement.tech/**

Use this checklist to open for customers with the **browser platform**. Native iOS/Android apps can follow while schools use the web portal on any phone.

---

## What is live today (safe to sell as “web platform”)

| Capability | Status |
|------------|--------|
| Marketing site (features, pricing, trial, SEO) | Live |
| OTP login for all roles (demo OTP `123456`) | Live |
| School admin dashboard (fees, attendance, homework, bus, AI, users…) | Live |
| Teacher / parent / student / driver portal | Live |
| Signup trial wizard | Live (browser / local demo) |
| Contact → opens email to `hello@aischool.app` | Live |
| Favicon + sitemap for Google | Live |

---

## Demo logins (OTP for all = `123456`)

Login: https://aischoolmanagement.tech/login/

| Role | Name | Mobile |
|------|------|--------|
| School admin | Dr. Priya Sharma | `+91 98765 43210` |
| Sub-admin | Anita Desai | `+91 98555 66666` |
| Teacher | Rahul Mehta | `+91 98111 22222` |
| Parent | Priya Nair | `+91 98222 33333` |
| Student | Aarav Patel | `+91 98333 44444` |
| Driver | Suresh Patil | `+91 98444 55555` |

After invite in **Users**, that phone can also sign in (same OTP until real SMS is connected).

---

## Customer journey you can promise now

1. School visits the website → calculates plan → starts trial  
2. Signs in with mobile + OTP  
3. Admin configures profile, fees, attendance, team  
4. Staff/parents use **portal on phone browser** (install homescreen shortcut)  
5. Apps for App Store / Play Store — “coming soon” (already on homepage)

Be clear in sales: **web works today; native apps are next.**

---

## What to say honestly (avoid refunds)

| Topic | Honest position |
|-------|-----------------|
| OTP | Demo uses `123456`. Real SMS needs Twilio + Firebase (next phase). |
| Payments | Trial/card UI is demo. Connect Razorpay/Stripe before charging. |
| Data sync | School data is in the browser until Firebase cloud is connected. Same browser/device recommended for demos. |
| Contact leads | Form opens the visitor’s email to `hello@aischool.app`. |

---

## Next 2 weeks (real business backend)

1. Firebase project + Firestore  
2. Twilio Verify for real OTP  
3. Razorpay (India) / Stripe for paid plans  
4. Deploy admin on Vercel if you outgrow static BigRock  
5. Google Search Console → submit `https://aischoolmanagement.tech/sitemap.xml`  
6. Use a real inbox: `hello@aischoolmanagement.tech` (or keep `hello@aischool.app`)

---

## Redeploy after code changes

```powershell
pnpm build:bigrock
$env:BIGROCK_FTP_USER = 'aischoolmanagement@aischoolmanagement.tech'
$env:BIGROCK_FTP_PASS = 'YOUR_PASSWORD'
powershell -ExecutionPolicy Bypass -File .\scripts\upload-bigrock-ftp.ps1
```

---

## Smoke test before a sales call

1. Hard refresh login page  
2. Admin `98765 43210` → dashboard modules open  
3. Teacher `98111 22222` → portal tiles open  
4. Parent `98222 33333` → fees + bus map  
5. Driver `98444 55555` → update location on map  
6. Signup a new school → login again → school name still there  

You are ready to **soft-launch sales** on the web platform.
