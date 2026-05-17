# Setup Flutter mobile app (Android + iOS folders)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location (Join-Path $root "apps\mobile")

$flutter = $null
foreach ($path in @(
  "flutter",
  "$env:LOCALAPPDATA\flutter\bin\flutter.bat",
  "C:\flutter\bin\flutter.bat",
  "$env:USERPROFILE\flutter\bin\flutter.bat"
)) {
  if (Get-Command $path -ErrorAction SilentlyContinue) {
    $flutter = $path
    break
  }
}

if (-not $flutter) {
  Write-Host "Flutter not found. Install from https://docs.flutter.dev/get-started/install/windows" -ForegroundColor Yellow
  Write-Host "Then run: flutter doctor" -ForegroundColor Yellow
  exit 1
}

& $flutter doctor
& $flutter create . --org com.aischool --project-name ai_school_mobile

# Copy Firebase config into Android
$gs = Join-Path $root "google-services.json"
if (Test-Path $gs) {
  Copy-Item $gs (Join-Path $PWD "android\app\google-services.json") -Force
  Write-Host "Copied google-services.json to android/app/"
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  flutter pub get"
Write-Host "  flutter run          # connected phone or emulator"
Write-Host "  flutter run -d chrome  # quick UI test in browser (limited)"
