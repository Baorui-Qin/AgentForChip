param([ValidateSet('preflight','model')][string]$Stage, [ValidateRange(1,4)][int]$Group)
$ErrorActionPreference = 'Stop'
$worker = Join-Path $PSScriptRoot "group-$Group"
$env:DSH_HOME = Join-Path $worker 'dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
Set-Location -LiteralPath 'D:\deepseek-harness'
if ($Stage -eq 'preflight') {
    & node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-preflight --patch (Join-Path $worker 'preflight.patch.yml') preflight
    if ($LASTEXITCODE -ne 0) { throw 'PREFLIGHT_WORKER_FAILED' }
} else {
    $claim = [IO.File]::Open((Join-Path $worker 'model.claim'), [IO.FileMode]::CreateNew, [IO.FileAccess]::Write); $claim.Dispose()
    $rows = Get-Content -LiteralPath (Join-Path $worker 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json
    foreach ($row in $rows) {
        if (-not $row.evaluable) { Write-Output "BLOCKED $($row.task_id): $($row.category) $($row.reason)"; continue }
        $task = $row.task_id
        Write-Output "START $task"
        & node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-model --patch (Join-Path $worker 'model.patch.yml') generate $task
        if ($LASTEXITCODE -ne 0) { throw 'MODEL_GENERATION_HOST_FAILED' }
        $generation = Get-Content -LiteralPath (Join-Path $worker "generate-$task\result.json") -Raw | ConvertFrom-Json
        if ($generation.status -eq 'GENERATED_UNVERIFIED') {
            & node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-model --patch (Join-Path $worker 'model.patch.yml') compare $task
            if ($LASTEXITCODE -ne 0) { throw 'MODEL_COMPARISON_HOST_FAILED' }
            $result = Get-Content -LiteralPath (Join-Path $worker "compare-$task\result.json") -Raw | ConvertFrom-Json
            Write-Output "DONE $task baseline=$($result.initial_status) agent=$($result.status) repairs=$($result.semantic_repairs)"
        } else { Write-Output "DONE $task generation=$($generation.status)" }
    }
}
