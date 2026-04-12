#Requires -Version 5.1
<#
  Completes GitHub push: sets origin from deploy.local.json or GITHUB_REMOTE_URL.
  1. Create an empty repo on GitHub (same name as this folder is fine).
  2. Copy deploy.local.example.json -> deploy.local.json and set remoteUrl (gitignored).
     OR: $env:GITHUB_REMOTE_URL = "https://github.com/org/repo.git"
  3. Optional: set "pushRemoteBranch" in deploy.local.json if your deploy branch is not the same as the local branch name (e.g. push local main -> origin/frase-annual-review).
  4. Run: npm run github:push
#>
param(
  [string] $RemoteUrl = $env:GITHUB_REMOTE_URL
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

$cfgPath = Join-Path $root "deploy.local.json"
$example = Join-Path $root "deploy.local.example.json"
$cfg = $null

if ([string]::IsNullOrWhiteSpace($RemoteUrl)) {
  if (Test-Path $cfgPath) {
    try {
      $cfg = Get-Content $cfgPath -Raw | ConvertFrom-Json
      $RemoteUrl = $cfg.remoteUrl
    } catch {
      Write-Error "Invalid JSON in deploy.local.json: $_"
      exit 1
    }
  }
}

$placeholder = $RemoteUrl -match "YOUR_ORG_OR_USER|YOUR_REPO_NAME"
if ([string]::IsNullOrWhiteSpace($RemoteUrl) -or $placeholder) {
  if (-not (Test-Path $cfgPath) -and (Test-Path $example)) {
    Copy-Item $example $cfgPath
    Write-Host ""
    Write-Host "Created deploy.local.json from the example." -ForegroundColor Cyan
    Write-Host "Edit remoteUrl to your real GitHub repo HTTPS URL, then run: npm run github:push" -ForegroundColor Cyan
    Write-Host ""
  } else {
    Write-Host "Set your GitHub repo URL in deploy.local.json (remoteUrl) or run:" -ForegroundColor Yellow
    Write-Host '  `$env:GITHUB_REMOTE_URL = "https://github.com/ORG/REPO.git"; npm run github:push' -ForegroundColor Gray
  }
  exit 2
}

if (-not ($RemoteUrl -match '^https://github\.com/[^/]+/[^/]+\.git/?$')) {
  Write-Warning "URL should look like: https://github.com/org/repo.git (trailing slash optional)"
}

$RemoteUrl = $RemoteUrl.TrimEnd('/')
if (-not $RemoteUrl.EndsWith('.git')) {
  $RemoteUrl = "$RemoteUrl.git"
}

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
  $existing = $null
}

if ($existing) {
  if ($existing -ne $RemoteUrl) {
    Write-Host "Updating origin: $existing -> $RemoteUrl"
    git remote set-url origin $RemoteUrl
  } else {
    Write-Host "origin already: $RemoteUrl"
  }
} else {
  Write-Host "Adding origin: $RemoteUrl"
  git remote add origin $RemoteUrl
}

$pushRemoteBranch = "main"
if (Test-Path $cfgPath) {
  try {
    $cfgPush = Get-Content $cfgPath -Raw | ConvertFrom-Json
    if ($cfgPush.pushRemoteBranch) { $pushRemoteBranch = [string]$cfgPush.pushRemoteBranch }
  } catch { }
}

$current = (git rev-parse --abbrev-ref HEAD).Trim()
if ($pushRemoteBranch -eq $current) {
  Write-Host "Pushing $current ..."
  git push -u origin $current
} else {
  Write-Host "Pushing ${current} -> origin/${pushRemoteBranch} ..."
  git push -u origin "${current}:${pushRemoteBranch}"
}
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "If you see 'repository not found', create the repo on GitHub first (empty, no README)." -ForegroundColor Yellow
  Write-Host "If you see auth errors, sign in: Git Credential Manager or https://github.com/settings/tokens" -ForegroundColor Yellow
  exit $LASTEXITCODE
}

Write-Host "Done. Next: add AZURE_STATIC_WEB_APPS_API_TOKEN in GitHub repo Secrets (see DEPLOY.md)." -ForegroundColor Green
