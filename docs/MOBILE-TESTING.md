# Mobile app testing (Android & iOS)

## Current status

| Item | Status |
|------|--------|
| Dart code (role-based UI) | Ready |
| Teacher / Parent / Driver / Student / Admin homes | Ready (demo mode) |
| School profile screen | Ready |
| Bus tracking map | Ready (needs Google Maps API key on device) |
| AI chat | UI placeholder |
| Android / iOS project folders | Run setup script once |
| Real OTP (Twilio + Firebase) | Needs Blaze plan + deployed functions |

**Flutter is not bundled in this repo.** You must install Flutter on your PC first.

---

## 1. Install Flutter (one time)

Windows: https://docs.flutter.dev/get-started/install/windows

```bash
flutter doctor
```

Fix anything marked with ✗ (Android Studio for emulator, Xcode for iOS on Mac only).

---

## 2. Generate Android & iOS projects

From repo root:

```powershell
cd "E:\My Cursor Projects\AI School Management\apps\mobile"
..\..\apps\mobile\scripts\setup-mobile.ps1
```

Or manually:

```bash
cd apps/mobile
flutter create . --org com.aischool --project-name ai_school_mobile
flutter pub get
```

Copy `google-services.json` from repo root to `apps/mobile/android/app/google-services.json`.

---

## 3. Run on Android

1. Enable **Developer options** + **USB debugging** on your phone, or start an Android emulator in Android Studio.
2. Connect device / start emulator.
3. Run:

```bash
cd apps/mobile
flutter devices
flutter run
```

---

## 4. Run on iOS (Mac only)

```bash
cd apps/mobile
flutter run
```

Requires Xcode and CocoaPods. Not available on Windows.

---

## 5. Test each role (demo mode)

The app uses **local demo login** (no Firebase required for UI testing).

1. Open the app → **Sign in**
2. Select role chip: **Teacher**, **Parent**, **Driver**, **Student**, or **School Admin**
3. Enter phone number → **Send OTP**
4. Enter OTP **`123456`** → **Sign in**

You will see a **role-specific home screen** with that user’s menu items.

| Role | What you can test |
|------|-------------------|
| **School Admin** | School profile, links to web admin for billing/invites |
| **Teacher** | Attendance, homework, notices, AI chat |
| **Parent** | Fees, bus tracking, homework, AI chat |
| **Driver** | Bus GPS screen (update location demo) |
| **Student** | Timetable, homework, classes, AI chat |

Tap the **school icon** (top right) → **School profile** (name, address, principal).

---

## 6. Match school profile with web admin

Mobile demo uses **Green Valley International School** by default.

To use your own school from marketing signup:

1. Complete signup on http://localhost:3002/signup (with logo).
2. Sign in on http://localhost:3001/login (web admin).
3. On mobile, sign in as **School Admin** — profile shows demo school until Firebase sync is connected.

Full sync between web admin and mobile requires Firebase Firestore (next phase).

---

## 7. What is not production-ready yet

- Real SMS OTP (needs Twilio + Firebase Functions deploy)
- Saving attendance/fees to cloud database
- Push notifications
- Parent ↔ student account linking rules in cloud

---

## Quick command reference

```bash
cd apps/mobile
flutter pub get
flutter run
flutter build apk --release   # Android APK for team testing
```

APK output: `build/app/outputs/flutter-apk/app-release.apk` — share with testers to install on Android.
