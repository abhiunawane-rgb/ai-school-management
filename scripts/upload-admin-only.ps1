$ErrorActionPreference = 'Stop'
$FtpHost = 'ftp.mekbrand.com'
$User = $env:BIGROCK_FTP_USER
$Pass = $env:BIGROCK_FTP_PASS
if (-not $User -or -not $Pass) { Write-Error 'Set BIGROCK_FTP_USER and BIGROCK_FTP_PASS' }

$AdminLocal = 'e:\My Cursor Projects\AI School Management\dist\bigrock-admin-upload'

function Get-FtpRequest([string]$uri, [string]$method) {
  $req = [System.Net.FtpWebRequest]::Create($uri)
  $req.Credentials = New-Object System.Net.NetworkCredential($User, $Pass)
  $req.Method = $method
  $req.UseBinary = $true
  $req.UsePassive = $true
  $req.KeepAlive = $false
  return $req
}

function Ensure-FtpDir([string]$remoteDir) {
  if (-not $remoteDir -or $remoteDir -eq '/') { return }
  $parts = $remoteDir.Trim('/').Split('/') | Where-Object { $_ }
  $path = ''
  foreach ($p in $parts) {
    $path = "$path/$p"
    try {
      $req = Get-FtpRequest "ftp://${FtpHost}${path}" ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
      $resp = $req.GetResponse(); $resp.Close()
    } catch {}
  }
}

function Upload-File([string]$localFile, [string]$remoteFile) {
  $req = Get-FtpRequest "ftp://${FtpHost}$remoteFile" ([System.Net.WebRequestMethods+Ftp]::UploadFile)
  $bytes = [System.IO.File]::ReadAllBytes($localFile)
  $req.ContentLength = $bytes.Length
  $stream = $req.GetRequestStream()
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Close()
  $resp = $req.GetResponse(); $resp.Close()
}

$files = Get-ChildItem -Path $AdminLocal -Recurse -File
$i = 0
foreach ($f in $files) {
  $i++
  $rel = $f.FullName.Substring($AdminLocal.Length).Replace('\', '/')
  if (-not $rel.StartsWith('/')) { $rel = "/$rel" }
  $remoteFile = "/admin$rel".Replace('//', '/')
  $dir = $remoteFile.Substring(0, $remoteFile.LastIndexOf('/'))
  if ($dir) { Ensure-FtpDir $dir }
  Write-Host "[$i/$($files.Count)] $remoteFile"
  Upload-File $f.FullName $remoteFile
}
Write-Host 'DONE'
