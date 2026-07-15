$r = Invoke-WebRequest -Uri 'https://aischoolmanagement.tech/admin/portal/bus-tracking/' -UseBasicParsing -TimeoutSec 30
Write-Host "Status: $($r.StatusCode)"
Write-Host "Old Google placeholder: $($r.Content.Contains('enable Google Maps'))"
Write-Host "OpenStreetMap ref: $($r.Content.Contains('openstreetmap'))"
Write-Host "New bus chunk: $($r.Content.Contains('0f2ee20a6ce5fa5e'))"
Write-Host "Update button text: $($r.Content.Contains('Update my location'))"
