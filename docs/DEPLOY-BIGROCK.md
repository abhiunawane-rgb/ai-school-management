# Deploy AI School Management marketing site to BigRock

## What you get

After running the build script, upload the folder:

`dist/bigrock-upload/`

Upload **everything inside** that folder to BigRock **public_html** (or a subdomain folder like `public_html/demo/`).

## Build (on your PC)

From the project root:

```bash
npx pnpm --filter @ai-school/marketing build:bigrock
```

Or from `apps/marketing`:

```bash
npm run build:bigrock
```

## Important limitations (static hosting)

BigRock shared hosting serves **static HTML/CSS/JS only**. The marketing build:

- Works: home, features, pricing calculator, comparison table, signup wizard UI
- Trial signup on static host: saves to **browser localStorage** if `/api/signup` is unavailable
- For full trial registration + email leads: deploy marketing on **Vercel** (free) and point your domain DNS to Vercel

Recommended production setup:

| Service | Host |
|---------|------|
| Marketing site | Vercel |
| Admin dashboard | Vercel (port 3001 app) |
| Domain DNS | BigRock → Vercel |
| Firebase / AI | Firebase + Railway |

## Team testing checklist

1. Open homepage — branding shows **AI School Management**
2. Pricing — currency dropdown (INR, USD, EUR, GBP, AED), all features visible
3. Add-ons show **minimum monthly charge** when checked
4. Comparison table shows **every feature** with one-line description
5. Signup — school logo upload, 7-day trial terms, auto-renew checkbox
6. Contact form

## Environment variables (Vercel / local dev)

```env
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
```

## After BigRock upload

1. Visit `https://yourdomain.com/` — confirm CSS loads (if broken, ensure `index.html` is in the folder root you uploaded)
2. Test pricing calculator totals when toggling add-ons
3. Complete signup — on static host, check browser DevTools → Application → Local Storage for `aischool_signup_pending`
