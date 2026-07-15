# Deploy to aischoolmanagement.tech (BigRock)

Live site: [https://aischoolmanagement.tech/](https://aischoolmanagement.tech/)

## Live URLs (current BigRock layout)

| App | URL |
|-----|-----|
| **Marketing** | https://aischoolmanagement.tech |
| **Login (all roles)** | https://aischoolmanagement.tech/login |
| **Admin dashboard** | https://aischoolmanagement.tech/admin/dashboard |
| **Portal (teacher/parent/student/driver)** | https://aischoolmanagement.tech/admin/portal |

> Admin is served from folder `/admin` on the main domain (not a separate subdomain).  
> Demo OTP: **`123456`**

---

## One-command build

```powershell
pnpm build:bigrock
```

| Folder | FTP destination |
|--------|-----------------|
| `dist/bigrock-upload/` | FTP **root** `/` (document root) |
| `dist/bigrock-admin-upload/` | `/admin/` |

## Automated FTP upload

```powershell
$env:BIGROCK_FTP_USER = 'aischoolmanagement@aischoolmanagement.tech'
$env:BIGROCK_FTP_PASS = 'YOUR_PASSWORD'
powershell -ExecutionPolicy Bypass -File .\scripts\upload-bigrock-ftp.ps1
```

FTP host: `ftp.mekbrand.com` · port `21`

---

## What people can use today

| Feature | Status |
|---------|--------|
| Marketing, pricing, signup, contact | Live |
| Login + admin dashboard + portal | Live under `/admin` |
| Native iOS / Android apps | Coming soon |
| Real SMS OTP / cloud DB | Later (Firebase) |

## Demo accounts

See login page → **Demo test numbers**. OTP for all: `123456`.
