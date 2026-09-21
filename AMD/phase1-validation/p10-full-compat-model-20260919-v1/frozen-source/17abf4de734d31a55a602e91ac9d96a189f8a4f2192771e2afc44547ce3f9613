$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$freeze = Get-Content -LiteralPath (Join-Path $root 'freeze.json') -Raw | ConvertFrom-Json
$claim = Join-Path $root 'campaign.claim'
$handle = [IO.File]::Open($claim, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write)
$handle.Dispose()
foreach ($task in $freeze.task_ids) {
    Write-Output "P10 START $task"
    & (Join-Path $root 'run.ps1') -Command generate -Task $task
    $generation = Get-Content -LiteralPath (Join-Path $root "generate-$task\result.json") -Raw | ConvertFrom-Json
    if ($generation.status -eq 'GENERATED_UNVERIFIED') {
        & (Join-Path $root 'run.ps1') -Command compare -Task $task
        $result = Get-Content -LiteralPath (Join-Path $root "compare-$task\result.json") -Raw | ConvertFrom-Json
        Write-Output "P10 DONE $task baseline=$($result.initial_status) agent=$($result.status) repairs=$($result.semantic_repairs)"
    } else { Write-Output "P10 DONE $task generation=$($generation.status) comparison=NOT_RUN" }
}
