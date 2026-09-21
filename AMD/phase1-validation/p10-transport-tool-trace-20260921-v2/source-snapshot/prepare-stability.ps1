param(
    [Parameter(Mandatory)][string]$CampaignRoot,
    [string]$Repo = 'D:\deepseek-harness',
    [string]$PreflightRoot = 'D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1'
)
$ErrorActionPreference = 'Stop'
if (Test-Path -LiteralPath $CampaignRoot) { throw 'NEW_CAMPAIGN_DIRECTORY_REQUIRED' }
New-Item -ItemType Directory -Path $CampaignRoot | Out-Null
$root = (Resolve-Path -LiteralPath $CampaignRoot).Path
function Hash([string]$Path) { (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$Name, $Value) { [IO.File]::WriteAllText((Join-Path $root $Name), ($Value | ConvertTo-Json -Depth 80), [Text.UTF8Encoding]::new($false)) }
$manifestPath = Join-Path $PreflightRoot 'p10-manifest-10.json'
if ((Hash $manifestPath) -ne '02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742') { throw 'FIXED_MANIFEST_CHANGED' }
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json -AsHashtable
$calibration = Get-Content -LiteralPath (Join-Path $PreflightRoot 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json
foreach ($task in $manifest.task_ids) { if (-not ($calibration | Where-Object task_id -EQ $task).evaluable) { throw "EVALUATOR_NOT_CALIBRATED:$task" } }
foreach ($name in @('p10-manifest-10.json', 'p09.json')) { Copy-Item -LiteralPath (Join-Path $PreflightRoot $name) -Destination (Join-Path $root $name) }
$auto = Get-Content -LiteralPath (Join-Path $PreflightRoot 'auto.json') -Raw | ConvertFrom-Json -AsHashtable
$auto.campaignRoot = $root.Replace('\', '/')
$auto.maxDispatches = 100
Put 'auto.json' $auto
Put 'stability.json' ([ordered]@{ cooldownMs = 15000; maxGenerationResumes = 1; circuitThreshold = 'first_exhausted_task'; selected = 10 })
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
    temperature: 0
    timeoutMs: 120000
    activeMs: 1200000
    maxResponseBytes: 65536
    maxTransportRetries: 2
    transportBackoffMs: [1000, 2000]
    maxOutputRecoveryAttempts: 1
    maxGenerationResumes: 1
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
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $Repo 'rtl-tools/src/phase1') -File -Filter '*.ts') { $files[$file.FullName] = Hash $file.FullName }
foreach ($path in @('rtl-tools/src/process.ts','rtl-tools/src/diagnostics.ts','rtl-tools/src/vivado-parser.ts','rtl-tools/phase1/configs/dev.yaml','rtl-tools/phase1/p10/generation-stability.mjs','rtl-tools/phase1/p10/prepare-stability.ps1')) {
    $file = Join-Path $Repo $path; $files[$file] = Hash $file
}
foreach ($file in Get-ChildItem -LiteralPath $root -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
foreach ($name in @('catalog.json','selection-order.json','compat-positive-negative-results.json','evaluator-policy.json')) {
    $file = Join-Path $PreflightRoot $name; $files[$file] = Hash $file
}
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $PreflightRoot 'derived') -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
foreach ($task in $manifest.tasks) { foreach ($asset in $task.assets.GetEnumerator()) {
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
        first_complete_candidate_only = $true; full_os_isolation_verified = $false; prompt_and_skill_unchanged = $true } })
Write-Output "Frozen new stability campaign: $root ($($files.Count) files). Historical calibration is reused, not rerun or modified."
