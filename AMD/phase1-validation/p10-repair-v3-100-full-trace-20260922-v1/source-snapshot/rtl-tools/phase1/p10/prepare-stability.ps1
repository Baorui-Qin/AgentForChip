param(
    [Parameter(Mandatory)][string]$CampaignRoot,
    [string]$Repo = 'D:\deepseek-harness',
    [string]$PreflightRoot = 'D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1',
    [switch]$Forty,
    [switch]$Hundred,
    [string]$HundredManifestSha256,
    [string]$HistoricalFortyRoot = 'D:\AMD\phase1-validation\p10-40-20260919-v1'
)
$ErrorActionPreference = 'Stop'
if ($Hundred -and ($Forty -or $HundredManifestSha256 -notmatch '^[a-f0-9]{64}$')) { throw 'EXPLICIT_HUNDRED_MANIFEST_REQUIRED' }
if (Test-Path -LiteralPath $CampaignRoot) { throw 'NEW_CAMPAIGN_DIRECTORY_REQUIRED' }
New-Item -ItemType Directory -Path $CampaignRoot | Out-Null
$root = (Resolve-Path -LiteralPath $CampaignRoot).Path
function Hash([string]$Path) { (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$Name, $Value) { [IO.File]::WriteAllText((Join-Path $root $Name), ($Value | ConvertTo-Json -Depth 80), [Text.UTF8Encoding]::new($false)) }
$settingsRoot = $PreflightRoot
$selected = 10
$manifestName = 'p10-manifest-10.json'
$manifestHash = '02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742'
$historyFiles = [ordered]@{}
if ($Hundred) { $selected = 100; $manifestName = 'manifest-100.json'; $manifestHash = $HundredManifestSha256 }
if ($Forty) {
    $selected = 40
    $manifestName = 'manifest-40.json'
    $manifestHash = '78f895dfebde67ce39905ca19a7454db5f904fb469966648a9d5fa273f865106'
    $manifestPath = Join-Path $HistoricalFortyRoot $manifestName
    if ((Hash $manifestPath) -ne $manifestHash) { throw 'FIXED_MANIFEST_CHANGED' }
    $fixed = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    $PreflightRoot = Join-Path $root 'preflight'
    New-Item -ItemType Directory -Path $PreflightRoot | Out-Null
    $calibrations = @()
    $order = @()
    foreach ($group in 1..4) {
        $prior = Join-Path $HistoricalFortyRoot "group-$group"
        $seal = Get-Content -LiteralPath (Join-Path $prior 'freeze.json') -Raw | ConvertFrom-Json -AsHashtable
        foreach ($name in @('catalog.json','selection-order.json','compat-positive-negative-results.json','evaluator-policy.json')) {
            $path = Join-Path $prior $name
            if (-not $seal.files.Contains($path) -or (Hash $path) -ne $seal.files[$path]) { throw "CALIBRATION_CHANGED:$path" }
            $historyFiles[$path] = Hash $path
        }
        $order += @(Get-Content -LiteralPath (Join-Path $prior 'selection-order.json') -Raw | ConvertFrom-Json)
        $calibrations += @(Get-Content -LiteralPath (Join-Path $prior 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json)
    }
    if (($order -join ',') -ne ($fixed.task_ids -join ',') -or @($order | Sort-Object -Unique).Count -ne 40) { throw 'FIXED_ORDER_CHANGED' }
    foreach ($name in @('catalog.json','evaluator-policy.json')) { Copy-Item -LiteralPath (Join-Path $HistoricalFortyRoot "group-1/$name") -Destination (Join-Path $PreflightRoot $name) }
    Put 'preflight/selection-order.json' $order
    Put 'preflight/compat-positive-negative-results.json' $calibrations
    Copy-Item -LiteralPath $manifestPath -Destination (Join-Path $PreflightRoot $manifestName)
    New-Item -ItemType Junction -Path (Join-Path $PreflightRoot 'derived') -Target 'D:\AMD\phase1-validation\p10-full-compat-v1-r2\derived' | Out-Null
}
$manifestPath = Join-Path $PreflightRoot $manifestName
if ((Hash $manifestPath) -ne $manifestHash) { throw 'FIXED_MANIFEST_CHANGED' }
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json -AsHashtable
if ($manifest.task_ids.Count -ne $selected -or @($manifest.task_ids | Sort-Object -Unique).Count -ne $selected) { throw 'FIXED_MANIFEST_COUNT_INVALID' }
$frozenOrder = @(Get-Content -LiteralPath (Join-Path $PreflightRoot 'selection-order.json') -Raw | ConvertFrom-Json)
if (($frozenOrder[0..($selected-1)] -join ',') -ne ($manifest.task_ids -join ',')) { throw 'FIXED_ORDER_CHANGED' }
$calibration = Get-Content -LiteralPath (Join-Path $PreflightRoot 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json
$excluded = @()
foreach ($task in $manifest.task_ids) {
    $record = @($calibration | Where-Object task_id -EQ $task)
    if ($record.Count -ne 1) { throw "CALIBRATION_RECORD_MISSING_OR_DUPLICATE:$task" }
    if (-not $record[0].evaluable) {
        if (-not $Forty) { throw "EVALUATOR_NOT_CALIBRATED:$task" }
        $excluded += [ordered]@{ task_id = $task; reason = $record[0].reason; category = $record[0].category }
    }
}
Copy-Item -LiteralPath $manifestPath -Destination (Join-Path $root $manifestName)
Copy-Item -LiteralPath (Join-Path $settingsRoot 'p09.json') -Destination (Join-Path $root 'p09.json')
$auto = Get-Content -LiteralPath (Join-Path $settingsRoot 'auto.json') -Raw | ConvertFrom-Json -AsHashtable
$auto.campaignRoot = $root.Replace('\', '/')
$auto.maxDispatches = if ($Hundred) { 1000 } elseif ($Forty) { 375 } else { 100 }
Put 'auto.json' $auto
Put 'stability.json' ([ordered]@{ cooldownMs = 15000; maxGenerationResumes = 1; circuitThreshold = 'first_exhausted_task'; selected = $selected;
    manifestFile = $manifestName; manifestSha256 = $manifestHash; comparisonWorkers = $(if ($Forty -or $Hundred) { 2 } else { 1 }); continueAfterModelFailure = [bool]($Forty -or $Hundred); calibrationExcluded = $excluded })
$profile = Join-Path $root 'dsh-home/profiles/rtl-p10-model'
New-Item -ItemType Directory -Path $profile -Force | Out-Null
foreach ($name in @('package.json', 'cordis.yml', 'cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $Repo "rtl-tools/phase1/profiles/rtl-p10-model/$name") -Destination (Join-Path $profile $name) }
$unix = $root.Replace('\', '/')
$patch = @"
- id: policy
  config:
    mode: danger-full-access
    workspaceRoot: $unix
- id: p10-model
  config:
    campaignRoot: $unix
    preflightRoot: $($PreflightRoot.Replace('\', '/'))
    datasetRoot: D:/AMD/verilog-eval
    settingsFile: $($Repo.Replace('\', '/'))/rtl-tools/phase1/configs/dev.yaml
    p09File: $unix/p09.json
    autoFile: $unix/auto.json
    freezeFile: $unix/campaign-freeze.json
    allowUnisolatedAutomatic: true
    model: deepseek-flash
    maxTokens: 8192
    repairMaxTokens: 16384
    forcedActionMaxTokens: 4096
    repairMaxResponseBytes: 262144
    compactThreshold: 0.8
    maxRepairRounds: 3
    temperature: 0
    timeoutMs: 120000
    activeMs: 1200000
    maxResponseBytes: 65536
    maxTransportRetries: 2
    transportBackoffMs: [1000, 2000]
    maxOutputRecoveryAttempts: 1
    maxGenerationResumes: 1
    selectedTaskCount: $selected
    compileMs: 60000
    elaborateMs: 60000
    simulationMs: 30000
    totalMs: 300000
    maxArtifactBytes: 268435456
    artifactPollMs: 100
    maxEventBytes: 1048576
"@
[IO.File]::WriteAllText((Join-Path $root 'model.patch.yml'), $patch, [Text.UTF8Encoding]::new($false))
$files = [ordered]@{}
foreach ($entry in $historyFiles.GetEnumerator()) { $files[$entry.Key] = $entry.Value }
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $Repo 'rtl-tools/src/phase1') -File -Filter '*.ts') { $files[$file.FullName] = Hash $file.FullName }
foreach ($path in @('rtl-tools/src/process.ts','rtl-tools/src/diagnostics.ts','rtl-tools/src/vivado-parser.ts','rtl-tools/phase1/configs/dev.yaml','rtl-tools/phase1/p10/generation-stability.mjs','rtl-tools/phase1/p10/prepare-stability.ps1')) {
    $file = Join-Path $Repo $path; $files[$file] = Hash $file
}
foreach ($file in Get-ChildItem -LiteralPath $root -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
foreach ($name in @('catalog.json','selection-order.json','compat-positive-negative-results.json','evaluator-policy.json')) {
    $file = Join-Path $PreflightRoot $name; $files[$file] = Hash $file
}
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $PreflightRoot 'derived') -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
$catalog = Get-Content -LiteralPath (Join-Path $PreflightRoot 'catalog.json') -Raw | ConvertFrom-Json -AsHashtable
foreach ($task in ($catalog | Where-Object { $_.task_id -in $manifest.task_ids })) { foreach ($asset in $task.assets.GetEnumerator()) {
    $path = Join-Path 'D:/AMD/verilog-eval' $asset.Key
    if ((Hash $path) -ne $asset.Value) { throw "DATASET_ASSET_CHANGED:$path" }
    $files[$path] = $asset.Value
} }
$p09 = Get-Content -LiteralPath (Join-Path $root 'p09.json') -Raw | ConvertFrom-Json
foreach ($path in @($p09.skillsFile, 'D:/AMD/p09-runtime/manifest.json')) { $files[$path] = Hash $path }
Put 'campaign-freeze.json' ([ordered]@{ schema_version = 'p10-transport-freeze-1'; created_at = [DateTime]::UtcNow.ToString('o');
    git_commit = (git -C $Repo rev-parse HEAD); files = $files; preflight_root = $PreflightRoot; calibration_reused = $true;
    protocol = @{ model = 'deepseek-flash'; reasoning = 'high'; temperature = 0; output_tokens = 8192; context_tokens = 131072;
        max_transport_retries = 2; transport_backoff_ms = @(1000, 2000); max_generation_resumes = 1; cooldown_ms = 15000;
        repair_output_tokens = 16384; forced_action_output_tokens = 4096; forced_action_reasoning = 'off'; compact_threshold = 0.8; max_repair_rounds = 3;
        first_complete_candidate_only = $true; full_os_isolation_verified = $false; generation_prompt_and_skill_unchanged = $true; repair_protocol = 'p10-repair-v3' } })
Write-Output "Frozen new stability campaign: $root ($($files.Count) files). Historical calibration is reused, not rerun or modified."
