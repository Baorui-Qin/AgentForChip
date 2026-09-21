param([ValidateSet('preflight','skills','ablation')][string]$Stage)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$env:DSH_HOME = 'D:\AMD\phase1-validation\p09-20260917-development\dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
Set-Location -LiteralPath 'D:\deepseek-harness'
function States {
    @(Get-ChildItem -LiteralPath (Join-Path $root 'experiments') -Directory | ForEach-Object {
        $path = Join-Path $_.FullName 'state.json'
        if (Test-Path -LiteralPath $path) { Get-Content -LiteralPath $path -Raw | ConvertFrom-Json }
    })
}
function Run([string]$config, [string]$task) {
    if ($Stage -eq 'ablation') {
        $freeze = Get-Content -LiteralPath (Join-Path $root 'ablation-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
        foreach ($path in $freeze.files.Keys) {
            if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() -ne $freeze.files[$path]) { throw "Frozen file changed: $path" }
        }
    }
    $log = Join-Path $root ('launch-' + $config + '-' + $task + '-' + [guid]::NewGuid().ToString() + '.log')
    & node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p09 --patch (Join-Path $root ('configs\' + $config + '.patch.yml')) start $task 2>&1 | Tee-Object -FilePath $log
    $exitCode = $LASTEXITCODE
    Write-Output "Experiment $config/$task exit=$exitCode"
    $states = States
    if ($states | Where-Object { $_.phase -ne 'TERMINAL' }) { throw 'Incomplete experiment requires inspection; no automatic continuation.' }
    $states | Sort-Object { $_.seq } -Descending | Out-Null
}
if (-not ((States) | Where-Object { $_.fixture -eq 'rising_edge' -and $_.outcome -eq 'VERIFIED' -and $_.auto })) { throw 'Real minimal A loop has not passed.' }
if ($Stage -eq 'preflight') {
    Run 'synthesis' 'synthesis-only'
    Run 'multi' 'controlled_multi_round'
    if (-not ((States) | Where-Object { $_.fixture -eq 'controlled_multi_round' -and $_.outcome -eq 'VERIFIED' -and $_.attempts -ge 2 })) { Run 'multi' 'controlled_multi_round_reset' }
    Run 'b-pilot' 'functional'
} elseif ($Stage -eq 'skills') {
    Run 'skill-syntax' 'syntax'
    Run 'skill-sequential' 'functional'
    Run 'skill-dependency' 'synthesis-only'
} else {
    $skills = Get-Content -LiteralPath (Join-Path $root 'skills\skills.validated.json') -Raw | ConvertFrom-Json
    if (@($skills | Where-Object status -eq 'validated').Count -ne 3) { throw 'Three validated frozen skills required.' }
    if (!(Test-Path -LiteralPath (Join-Path $root 'ablation-freeze.json'))) { throw 'Frozen schedule required.' }
    $schedule = (Get-Content -LiteralPath (Join-Path $root 'ablation-freeze.json') -Raw | ConvertFrom-Json).schedule
    foreach ($cell in $schedule) { Run ('ablation-' + $cell.variant) $cell.task }
}
