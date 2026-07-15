$ErrorActionPreference = 'Continue'
function Check($url) {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    Write-Host "OK $($r.StatusCode) $url ($($r.Content.Length) bytes)"
    return $r.Content
  } catch {
    Write-Host "FAIL $url :: $($_.Exception.Message)"
    return $null
  }
}

$home = Check 'https://aischoolmanagement.tech/'
$login = Check 'https://aischoolmanagement.tech/login/'
$admin = Check 'https://aischoolmanagement.tech/admin/'
$dash = Check 'https://aischoolmanagement.tech/admin/dashboard/'
$portal = Check 'https://aischoolmanagement.tech/admin/portal/'
$auth = Check 'https://aischoolmanagement.tech/admin/auth/complete/'

Write-Host ''
if ($home -and $home.Contains('aischoolmanagement.tech/admin')) {
  Write-Host 'Home links include /admin URL: YES'
} elseif ($home) {
  Write-Host 'Home HTML may use relative login (check JS bundles for admin URL)'
}

if ($admin -and $admin.Contains('/admin/_next/')) {
  Write-Host 'Admin assets under /admin/_next/: YES'
}
