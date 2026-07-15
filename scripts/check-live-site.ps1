$ErrorActionPreference = 'Continue'
$out = 'e:\My Cursor Projects\AI School Management\dist'

function Get-Page($url, $file) {
  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45
    Set-Content -Path (Join-Path $out $file) -Value $resp.Content -Encoding UTF8
    Write-Host "$url -> $($resp.StatusCode) ($($resp.Content.Length) bytes)"
    return $resp.Content
  } catch {
    Write-Host "$url -> ERROR: $($_.Exception.Message)"
    return $null
  }
}

New-Item -ItemType Directory -Force -Path $out | Out-Null

$homeContent = Get-Page 'https://aischoolmanagement.tech/' 'live-home.html'
$loginContent = Get-Page 'https://aischoolmanagement.tech/login/' 'live-login.html'
$adminContent = Get-Page 'https://admin.aischoolmanagement.tech/' 'live-admin.html'
$dashContent = Get-Page 'https://admin.aischoolmanagement.tech/dashboard/' 'live-dashboard.html'

$checks = @(
  'Full website live now',
  'Platform update',
  'iOS & Android apps coming soon',
  'Full website is',
  'live & working',
  'Web platform',
  'Under development',
  'Start 7-day trial',
  'Calculate your plan',
  'Sign in',
  'OTP-only secure login',
  'Explore the platform',
  'aischoolmanagement.tech'
)

Write-Host ''
Write-Host '=== Marketing home matches (local copy markers) ==='
if ($homeContent) {
  foreach ($c in $checks) {
    $ok = $homeContent.Contains($c)
    Write-Host ("{0}: {1}" -f $c, $(if ($ok) { 'YES' } else { 'NO' }))
  }
}

Write-Host ''
Write-Host '=== Login page ==='
if ($loginContent) {
  foreach ($c in @('Sign in to AI School Management', 'Demo test numbers', '123456', 'Send verification code')) {
    Write-Host ("{0}: {1}" -f $c, $(if ($loginContent.Contains($c)) { 'YES' } else { 'NO' }))
  }
}

# Compare JS chunk hashes from local build vs live
Write-Host ''
Write-Host '=== JS chunk fingerprint check ==='
$localIndex = 'e:\My Cursor Projects\AI School Management\dist\bigrock-upload\index.html'
if (Test-Path $localIndex) {
  $local = Get-Content $localIndex -Raw
  $localChunks = [regex]::Matches($local, '/_next/static/chunks/[^"]+\.js') | ForEach-Object { $_.Value } | Select-Object -Unique
  Write-Host "Local chunks: $($localChunks.Count)"
  if ($homeContent) {
    $liveChunks = [regex]::Matches($homeContent, '/_next/static/chunks/[^"]+\.js') | ForEach-Object { $_.Value } | Select-Object -Unique
    Write-Host "Live chunks: $($liveChunks.Count)"
    $same = (@($localChunks | Sort-Object) -join '|') -eq (@($liveChunks | Sort-Object) -join '|')
    Write-Host "Chunk list match: $same"
    $onlyLocal = $localChunks | Where-Object { $_ -notin $liveChunks }
    $onlyLive = $liveChunks | Where-Object { $_ -notin $localChunks }
    if ($onlyLocal) { Write-Host "Only in local build:"; $onlyLocal | ForEach-Object { Write-Host "  $_" } }
    if ($onlyLive) { Write-Host "Only on live site:"; $onlyLive | ForEach-Object { Write-Host "  $_" } }
    if (-not $onlyLocal -and -not $onlyLive) { Write-Host 'Live site JS fingerprints match the built folder from 13-Jul-2026.' }
  }
}
