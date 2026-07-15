$r = Invoke-WebRequest -Uri 'https://aischoolmanagement.tech/admin/auth/complete/' -UseBasicParsing -TimeoutSec 30
Write-Host "Status: $($r.StatusCode)"
Write-Host ("New auth chunk: " + ($r.Content.Contains('0c2faa32b416dcca')))
Write-Host ("Has Opening text: " + ($r.Content.Contains('Opening your account')))
