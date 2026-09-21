param([ValidateSet('prepare','preflight','seal','smoke','model','audit','all')][string]$Stage)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
function Invoke-Dsh([string[]]$arguments) {
    $env:DSH_HOME = Join-Path $root 'dsh-home'
    $env:NODE_OPTIONS = '--max-old-space-size=4096'
    Set-Location -LiteralPath $repo
    & node --import tsx/esm apps/cli/src/bin.ts @arguments
    if ($LASTEXITCODE -ne 0) { throw 'DSH_HOST_FAILED_NO_AUTOMATIC_RETRY' }
}
function Assert-Freeze {
    $freeze = Get-Content -LiteralPath (Join-Path $root 'campaign-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
    foreach ($entry in $freeze.files.GetEnumerator()) {
        $actual = (Get-FileHash -LiteralPath $entry.Key -Algorithm SHA256).Hash.ToLowerInvariant()
        if ($actual -ne $entry.Value) { throw "CAMPAIGN_SOURCE_CHANGED: $($entry.Key)" }
    }
}
function Run-One([string]$name) {
    switch ($name) {
        'prepare' { & (Join-Path $root 'prepare.ps1') }
        'preflight' {
            if (Test-Path -LiteralPath (Join-Path $root 'compat-positive-negative-results.json')) { throw 'PREFLIGHT_ALREADY_RUN' }
            Invoke-Dsh @('--profile', 'rtl-p10-preflight', '--patch', (Join-Path $root 'preflight.patch.yml'), 'preflight')
        }
        'smoke' { & (Join-Path $root 'smoke.ps1') }
        'seal' { & (Join-Path $root 'seal.ps1') }
        'model' {
            Assert-Freeze
            $rows = Get-Content -LiteralPath (Join-Path $root 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json
            foreach ($row in $rows) {
                Assert-Freeze
                if (-not $row.evaluable) { Write-Output "BLOCKED $($row.task_id): $($row.category) $($row.reason)"; continue }
                $task = $row.task_id
                Write-Output "START $task"
                Invoke-Dsh @('--profile', 'rtl-p10-model', '--patch', (Join-Path $root 'model.patch.yml'), 'generate', $task)
                $generation = Get-Content -LiteralPath (Join-Path $root "generate-$task\result.json") -Raw | ConvertFrom-Json
                if ($generation.status -eq 'GENERATED_UNVERIFIED') {
                    Invoke-Dsh @('--profile', 'rtl-p10-model', '--patch', (Join-Path $root 'model.patch.yml'), 'compare', $task)
                    $result = Get-Content -LiteralPath (Join-Path $root "compare-$task\result.json") -Raw | ConvertFrom-Json
                    Write-Output "DONE $task baseline=$($result.initial_status) agent=$($result.status) valid_attempts=$($result.valid_repair_attempts)"
                } else { Write-Output "DONE $task generation=$($generation.status)" }
                Assert-Freeze
            }
        }
        'audit' {
            Set-Location -LiteralPath $repo
            & node rtl-tools/phase1/p10/audit-p10-campaign.mjs $root
            if ($LASTEXITCODE -ne 0) { throw 'P10_COMPARISON_INVALID' }
        }
    }
}
Write-Output 'P10_AGENT_IMPLEMENTATION=p10-model.ts'
Write-Output 'LEGACY_COMPARISON_ROUTE=false'
Write-Output 'MANIFEST_SHA256=02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742'
if ($Stage -eq 'all') { foreach ($name in @('prepare', 'preflight', 'smoke', 'seal', 'model', 'audit')) { Run-One $name } } else { Run-One $Stage }

