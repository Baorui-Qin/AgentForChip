$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$env:DSH_HOME = Join-Path $root 'dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
$files = @('probe-v2.mts','configs/probe-v2.patch.yml','run-probe-v2.ps1')
$freeze = @{}
foreach($file in $files) { $freeze[$file]=(Get-FileHash -LiteralPath (Join-Path $root $file) -Algorithm SHA256).Hash }
$claim = [System.IO.File]::Open((Join-Path $root 'probe-v2.claim'), [System.IO.FileMode]::CreateNew)
$claim.Dispose()
[pscustomobject]@{files=$freeze;reason='Diagnostic driver lacked models parent directory and used wrong app exit accessor; original probe had zero model dispatches. No calibration or model result is replaced.'} | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $root 'probe-v2-freeze.json') -Encoding utf8
Set-Location -LiteralPath 'D:\deepseek-harness'
& node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p09 --patch (Join-Path $root 'configs/probe-v2.patch.yml') probe 2>&1 | Tee-Object -FilePath (Join-Path $root 'launch-probe-v2.log')
if ($LASTEXITCODE -ne 0) { throw 'Native probe did not complete. Retain all evidence.' }
