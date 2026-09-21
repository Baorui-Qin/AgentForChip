$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$env:DSH_HOME = 'D:\AMD\phase1-validation\p09-20260917-development\dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
Set-Location -LiteralPath 'D:\deepseek-harness'
$freeze = Get-Content -Raw -LiteralPath (Join-Path $root 'experiment-freeze.json') | ConvertFrom-Json
New-Item -ItemType Directory -Path (Join-Path $root 'launch-claims') -ErrorAction Stop | Out-Null
$index = @()
foreach ($cell in $freeze.schedule) {
    & node (Join-Path $root 'check-freeze.mjs')
    if ($LASTEXITCODE -ne 0) { throw 'Frozen input audit failed.' }
    $key = "$($cell.pair)-$($cell.budget)"
    $claim = [System.IO.File]::Open((Join-Path $root "launch-claims\$key.claim"), [System.IO.FileMode]::CreateNew)
    $claim.Dispose()
    $before = @(Get-ChildItem -LiteralPath (Join-Path $root 'experiments') -Directory | ForEach-Object { $_.Name })
    $log = Join-Path $root "launch-$key.log"
    $started = [DateTime]::UtcNow.ToString('o')
    & node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p09 --patch (Join-Path $root "configs\$($cell.config)") start $cell.task 2>&1 | Tee-Object -FilePath $log
    $code = $LASTEXITCODE
    $new = @(Get-ChildItem -LiteralPath (Join-Path $root 'experiments') -Directory | Where-Object { $_.Name -notin $before })
    if ($new.Count -ne 1) { throw 'Expected exactly one new experiment; inspect without automatic retry.' }
    $state = Get-Content -Raw -LiteralPath (Join-Path $new[0].FullName 'state.json') | ConvertFrom-Json
    $index += [pscustomobject]@{ pair=$cell.pair; task=$cell.task; variant=$cell.variant; budget=$cell.budget; directory=$new[0].FullName; exit=$code; started=$started; ended=[DateTime]::UtcNow.ToString('o'); outcome=$state.outcome; phase=$state.phase }
    $index | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $root 'execution-index.json') -Encoding utf8
    Write-Output "CELL $key $($cell.task)/$($cell.variant) outcome=$($state.outcome) exit=$code"
    if ($state.phase -ne 'TERMINAL' -or $code -ne 0) { throw 'Uncertain or failed launch; retained without retry.' }
    $tickets = @(Get-ChildItem -LiteralPath (Join-Path $root 'dispatches') -Filter '*.json')
    if ($tickets.Count -gt 120) { throw 'New campaign budget exceeded.' }
}
& node (Join-Path $root 'check-freeze.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Final frozen input audit failed.' }
Write-Output 'All eight scheduled experiments are terminal. No failed cell was resampled.'
