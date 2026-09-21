$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$freeze = Get-Content -Raw -LiteralPath (Join-Path $root 'freeze.json') | ConvertFrom-Json -AsHashtable
foreach ($path in $freeze.files.Keys) {
  if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() -ne $freeze.files[$path]) { throw "Frozen file changed: $path" }
}
$claim = [System.IO.File]::Open((Join-Path $root 'launch.claim'), [System.IO.FileMode]::CreateNew)
$claim.Dispose()
$env:DSH_HOME = Join-Path $root 'dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
Set-Location -LiteralPath 'D:\deepseek-harness'
& node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-preflight --patch (Join-Path $root 'preflight.patch.yml') preflight 2>&1 | Tee-Object -FilePath (Join-Path $root 'launch.log')
$code = $LASTEXITCODE
[pscustomobject]@{exit_code=$code;completed_at=[DateTime]::UtcNow.ToString('o');automatic_retry=$false} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $root 'launch-result.json') -Encoding utf8
if ($code -ne 0) { throw 'P10 preflight failed; retain evidence and inspect without automatic replay.' }
