function Check($url) {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
    Write-Host "OK $($r.StatusCode) $url"
  } catch {
    Write-Host "FAIL $url $($_.Exception.Message)"
  }
}
Check 'https://aischoolmanagement.tech/favicon.ico'
Check 'https://aischoolmanagement.tech/favicon.svg'
Check 'https://aischoolmanagement.tech/sitemap.xml'
Check 'https://aischoolmanagement.tech/robots.txt'
Check 'https://aischoolmanagement.tech/og-image.png'
Check 'https://aischoolmanagement.tech/site.webmanifest'
$r = Invoke-WebRequest -Uri 'https://aischoolmanagement.tech/' -UseBasicParsing -TimeoutSec 30
Write-Host ("favicon link in HTML: " + ($r.Content -match 'favicon'))
Write-Host ("json-ld present: " + ($r.Content -match 'application/ld\+json'))
Write-Host ("og:image present: " + ($r.Content -match 'og:image|og-image'))
