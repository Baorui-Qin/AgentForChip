$ErrorActionPreference = 'Stop'
$out = Join-Path $PSScriptRoot 'regression'
$env:XILINX_LOCAL_USER_DATA = 'no'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
$workers = @()
foreach ($i in 1..2) {
    $env:DSH_HOME = "D:\AMD\phase1-validation\p10-calibration-100-20260922-v1\group-$i\dsh-home"
    $args = @('--import','tsx/esm','apps/cli/src/bin.ts','--profile','rtl-p10-preflight','--patch',(Join-Path $out "group-$i\health.patch.yml"),'preflight')
    $p = Start-Process -FilePath (Get-Command node).Source -ArgumentList $args -WorkingDirectory 'D:\deepseek-harness' -WindowStyle Hidden -RedirectStandardOutput (Join-Path $out "group-$i.stdout.log") -RedirectStandardError (Join-Path $out "group-$i.stderr.log") -PassThru
    $workers += $p
}
$failed = $false
foreach ($p in $workers) { $p.WaitForExit(); $p.Refresh(); Write-Output "Health worker $($p.Id) exit $($p.ExitCode)"; if ($p.ExitCode -ne 0) { $failed=$true } }
if ($failed) { throw 'HEALTH_WORKER_FAILED' }
foreach ($i in 1..2) {
    $rows = Get-Content -LiteralPath (Join-Path $out "group-$i\results.json") -Raw | ConvertFrom-Json
    if (@($rows).Count -ne 3 -or @($rows | Where-Object status -ne 'PASS').Count) { throw "FULL_EDA_HEALTH_FAILED: group-$i" }
}
Write-Output 'FULL_EDA_HEALTH_PASS: 6/6 reference control runs; two workers; zero model calls'
