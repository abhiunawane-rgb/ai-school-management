# Clean Next.js caches and restart dev servers
$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "Stopping Node processes on ports 3001, 3002..." -ForegroundColor Yellow
foreach ($port in 3001, 3002) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
}

$paths = @(
  "$root\apps\marketing\.next",
  "$root\apps\admin\.next",
  "$root\apps\marketing\out",
  "$root\.turbo"
)

foreach ($p in $paths) {
  if (Test-Path $p) {
    Remove-Item -Recurse -Force $p
    Write-Host "Removed $p" -ForegroundColor Green
  }
}

Write-Host ""
Write-Host "Done. From project root run:" -ForegroundColor Cyan
Write-Host "  cd `"$root`""
Write-Host "  npx pnpm dev:web"
Write-Host "  (or npx pnpm dev for all packages including Firebase)"
Write-Host ""
Write-Host "Then open:" -ForegroundColor Cyan
Write-Host "  Marketing: http://localhost:3002"
Write-Host "  Admin:     http://localhost:3001"
