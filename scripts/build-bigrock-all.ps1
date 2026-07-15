# Build marketing + admin static sites for BigRock upload
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Building shared package..." -ForegroundColor Cyan
npx pnpm --filter @ai-school/shared build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`nBuilding marketing site (aischoolmanagement.tech)..." -ForegroundColor Cyan
npx pnpm --filter @ai-school/marketing build:bigrock
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`nBuilding admin + portal (admin.aischoolmanagement.tech)..." -ForegroundColor Cyan
npx pnpm --filter @ai-school/admin build:bigrock
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$htaccess = Join-Path $PSScriptRoot "bigrock.htaccess"
$marketingOut = Join-Path $root "dist\bigrock-upload"
$adminOut = Join-Path $root "dist\bigrock-admin-upload"

foreach ($dir in @($marketingOut, $adminOut)) {
  if (Test-Path $htaccess) {
    Copy-Item $htaccess (Join-Path $dir ".htaccess") -Force
  }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " BigRock upload folders ready" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Marketing -> upload to public_html/"
Write-Host "  $marketingOut"
Write-Host ""
Write-Host "Admin     -> upload to admin subdomain folder"
Write-Host "  $adminOut"
Write-Host ""
Write-Host "See docs/DEPLOY-AISCHOOLMANAGEMENT-TECH.md for cPanel steps."
Write-Host "Demo login: any registered phone + OTP 123456" -ForegroundColor Yellow
