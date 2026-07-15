# Temporary FTP upload helper — credentials via env, do not commit secrets
$ErrorActionPreference = 'Stop'

$FtpHost = 'ftp.mekbrand.com'
$User = $env:BIGROCK_FTP_USER
$Pass = $env:BIGROCK_FTP_PASS
if (-not $User -or -not $Pass) {
  Write-Error 'Set BIGROCK_FTP_USER and BIGROCK_FTP_PASS env vars first.'
}

$MarketingLocal = 'e:\My Cursor Projects\AI School Management\dist\bigrock-upload'
$AdminLocal = 'e:\My Cursor Projects\AI School Management\dist\bigrock-admin-upload'

function Get-FtpRequest([string]$uri, [string]$method) {
  $req = [System.Net.FtpWebRequest]::Create($uri)
  $req.Credentials = New-Object System.Net.NetworkCredential($User, $Pass)
  $req.Method = $method
  $req.UseBinary = $true
  $req.UsePassive = $true
  $req.KeepAlive = $false
  $req.EnableSsl = $false
  return $req
}

function Ensure-FtpDir([string]$remoteDir) {
  if (-not $remoteDir -or $remoteDir -eq '/') { return }
  $parts = $remoteDir.Trim('/').Split('/') | Where-Object { $_ }
  $path = ''
  foreach ($p in $parts) {
    $path = "$path/$p"
    try {
      $uri = "ftp://${FtpHost}${path}"
      $req = Get-FtpRequest $uri ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
      $resp = $req.GetResponse()
      $resp.Close()
      Write-Host "Created $path"
    } catch { }
  }
}

function Upload-File([string]$localFile, [string]$remoteFile) {
  $uri = "ftp://${FtpHost}$remoteFile"
  $req = Get-FtpRequest $uri ([System.Net.WebRequestMethods+Ftp]::UploadFile)
  $bytes = [System.IO.File]::ReadAllBytes($localFile)
  $req.ContentLength = $bytes.Length
  $stream = $req.GetRequestStream()
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Close()
  $resp = $req.GetResponse()
  $resp.Close()
}

function Upload-Tree([string]$localRoot, [string]$remoteRoot) {
  if ($remoteRoot -and $remoteRoot -ne '/') { Ensure-FtpDir $remoteRoot }
  $files = Get-ChildItem -Path $localRoot -Recurse -File
  $i = 0
  $total = $files.Count
  foreach ($f in $files) {
    $i++
    $rel = $f.FullName.Substring($localRoot.Length).Replace('\', '/')
    if (-not $rel.StartsWith('/')) { $rel = "/$rel" }
    if ($remoteRoot -eq '/' -or -not $remoteRoot) {
      $remoteFile = $rel
    } else {
      $remoteFile = "$remoteRoot$rel".Replace('//', '/')
    }
    $lastSlash = $remoteFile.LastIndexOf('/')
    if ($lastSlash -gt 0) {
      Ensure-FtpDir $remoteFile.Substring(0, $lastSlash)
    }
    Write-Host "[$i/$total] $remoteFile"
    Upload-File $f.FullName $remoteFile
  }
}

Write-Host '=== Uploading MARKETING to FTP root (/) ==='
Upload-Tree $MarketingLocal '/'

Write-Host ''
Write-Host '=== Uploading ADMIN to /admin ==='
Upload-Tree $AdminLocal '/admin'

Write-Host ''
Write-Host 'DONE'
