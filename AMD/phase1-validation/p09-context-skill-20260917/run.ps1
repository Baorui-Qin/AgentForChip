$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$env:DSH_HOME = Join-Path $root 'dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
Set-Location -LiteralPath 'D:\deepseek-harness'
$freeze = Get-Content -Raw -LiteralPath (Join-Path $root 'freeze.json') | ConvertFrom-Json -AsHashtable
foreach ($path in $freeze.files.Keys) {
    if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() -ne $freeze.files[$path]) { throw "Frozen file changed: $path" }
}
$claim = [System.IO.File]::Open((Join-Path $root 'launch.claim'), [System.IO.FileMode]::CreateNew)
$claim.Dispose()
& node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p09 --patch (Join-Path $root 'configs\repair.patch.yml') start rising_edge 2>&1 | Tee-Object -FilePath (Join-Path $root 'launch-calibration.log')
$repairExit = $LASTEXITCODE
Write-Output "Calibration smoke exit=$repairExit; retained without retry."
& node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p09 --patch (Join-Path $root 'configs\probe.patch.yml') probe 2>&1 | Tee-Object -FilePath (Join-Path $root 'launch-probe.log')
$probeExit = $LASTEXITCODE
[pscustomobject]@{repair_exit=$repairExit;probe_exit=$probeExit} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $root 'launch-results.json') -Encoding utf8
if ($repairExit -ne 0 -or $probeExit -ne 0) { throw 'Inspect retained non-success; no automatic resampling.' }
