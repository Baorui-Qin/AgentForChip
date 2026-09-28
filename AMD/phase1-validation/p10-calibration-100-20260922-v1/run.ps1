$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$workers = @()
foreach ($i in 1..2) {
    $group = Join-Path $root "group-$i"
    $env:DSH_HOME = Join-Path $group 'dsh-home'
    $env:NODE_OPTIONS = '--max-old-space-size=4096'
    $process = Start-Process -FilePath (Get-Command node).Source -ArgumentList @('--import','tsx/esm','apps/cli/src/bin.ts','--profile','rtl-p10-preflight','--patch',(Join-Path $group 'preflight.patch.yml'),'preflight') -WorkingDirectory 'D:\deepseek-harness' -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root "group-$i.stdout.log") -RedirectStandardError (Join-Path $root "group-$i.stderr.log") -PassThru
    $workers += [ordered]@{ group = $i; process = $process }
}
foreach ($worker in $workers) { $worker.process.WaitForExit(); $worker.process.Refresh(); Write-Output "Group $($worker.group) exit $($worker.process.ExitCode)" }
if (@($workers | Where-Object { $_.process.ExitCode -ne 0 }).Count) { throw 'CALIBRATION_WORKER_FAILED' }
Write-Output 'CALIBRATION_FINISHED'
