param([ValidateSet('preflight','model')][string]$Stage)
$ErrorActionPreference = 'Stop'
$processes = @()
foreach ($i in 1..4) {
    $log = Join-Path $PSScriptRoot "$Stage-group-$i.stdout.log"
    if (Test-Path -LiteralPath $log) { throw 'STAGE_ALREADY_STARTED' }
    $arguments = @('-NoProfile','-File', (Join-Path $PSScriptRoot 'worker.ps1'), '-Stage', $Stage, '-Group', $i)
    $p = Start-Process -FilePath (Join-Path $PSHOME 'pwsh.exe') -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput $log -RedirectStandardError (Join-Path $PSScriptRoot "$Stage-group-$i.stderr.log")
    $processes += $p
}
$codes = @()
foreach ($p in $processes) { $p.WaitForExit(); $p.Refresh(); $codes += $p.ExitCode }
Write-Output "Stage $Stage exit codes: $($codes -join ', ')"
if (@($codes | Where-Object { $_ -ne 0 }).Count) { throw 'WORKER_FAILED_INSPECT_LOGS_NO_AUTOMATIC_RETRY' }
