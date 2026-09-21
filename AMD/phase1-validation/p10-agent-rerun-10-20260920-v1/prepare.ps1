$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$suite = 'D:\AMD\phase1-validation\p10-full-compat-v1-r2'
$sourceManifest = 'D:\AMD\phase1-validation\p10-20260918-v8\pilot-10\manifest\p10-manifest-10.json'
$prior = 'D:\AMD\phase1-validation\p10-40-20260919-v1'
function Hash([string]$path) { (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$path, $value) {
    if (Test-Path -LiteralPath $path) { throw "OUTPUT_EXISTS: $path" }
    [IO.File]::WriteAllText($path, ($value | ConvertTo-Json -Depth 50), [Text.UTF8Encoding]::new($false))
}
if (Test-Path -LiteralPath (Join-Path $root 'prepared.json')) { throw 'CAMPAIGN_ALREADY_PREPARED' }
if ((Hash $sourceManifest) -ne '02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742') { throw 'P10_FIXED_MANIFEST_CHANGED' }
if ((Hash (Join-Path $suite 'derived\verilogeval-vivado2025.2-compat-v1-manifest.json')) -ne '880f2dabca449f800238edf3458739ca8e37e811bfc5750d8474298af2b80353') { throw 'P10_COMPAT_MANIFEST_CHANGED' }

Copy-Item -LiteralPath $sourceManifest -Destination (Join-Path $root 'p10-manifest-10.json')
$manifest = Get-Content -LiteralPath $sourceManifest -Raw | ConvertFrom-Json -AsHashtable
Put (Join-Path $root 'selection-order.json') @($manifest.task_ids)
Copy-Item -LiteralPath (Join-Path $prior 'group-1\catalog.json') -Destination (Join-Path $root 'catalog.json')
Copy-Item -LiteralPath (Join-Path $prior 'group-1\evaluator-policy.json') -Destination (Join-Path $root 'evaluator-policy.json')
Copy-Item -LiteralPath (Join-Path $prior 'group-1\negative-controls.json') -Destination (Join-Path $root 'negative-controls.json')
Copy-Item -LiteralPath (Join-Path $prior 'preflight.mjs') -Destination (Join-Path $root 'preflight.mjs')
New-Item -ItemType Junction -Path (Join-Path $root 'derived') -Target (Join-Path $suite 'derived') | Out-Null

foreach ($profileName in @('rtl-p10-model', 'rtl-p10-preflight')) {
    $profile = Join-Path $root "dsh-home\profiles\$profileName"
    New-Item -ItemType Directory -Path $profile -Force | Out-Null
    foreach ($name in @('package.json', 'cordis.yml', 'cordis.patch.yml')) {
        Copy-Item -LiteralPath (Join-Path $repo "rtl-tools\phase1\profiles\$profileName\$name") -Destination (Join-Path $profile $name)
    }
}

$p09 = Get-Content -LiteralPath (Join-Path $prior 'group-1\p09.json') -Raw | ConvertFrom-Json -AsHashtable
Put (Join-Path $root 'p09.json') $p09
$runtimeHash = Hash 'D:\AMD\p09-runtime\manifest.json'
$auto = [ordered]@{ registry = 'full'; campaignRoot = $root.Replace('\', '/'); bucket = 'preflight'; sampleId = 'p10-shared-initial';
    runtimeRoot = 'D:/AMD/p09-runtime'; runtimeManifestSha256 = $runtimeHash; maxToolSteps = 15; maxDispatches = 200 }
Put (Join-Path $root 'auto.json') $auto

$preflightPatch = @"
- id: policy
  config:
    mode: danger-full-access
    workspaceRoot: $($root.Replace('\','/'))
- id: preflight
  disabled: true
- insert:
    - id: suite
      name: '$($root.Replace('\','/'))/preflight.mjs'
      config:
        datasetRoot: D:/AMD/verilog-eval
        campaignRoot: $($root.Replace('\','/'))
        settingsFile: D:/deepseek-harness/rtl-tools/phase1/configs/dev.yaml
        freezeFile: $($root.Replace('\','/'))/preflight-freeze.json
        allowUnisolatedPreflight: true
        compileMs: 60000
        elaborateMs: 60000
        simulationMs: 30000
        totalMs: 300000
        maxArtifactBytes: 268435456
        artifactPollMs: 100
        maxEventBytes: 1048576
"@
[IO.File]::WriteAllText((Join-Path $root 'preflight.patch.yml'), $preflightPatch, [Text.UTF8Encoding]::new($false))

function ModelPatch([string]$campaignRoot, [string]$autoFile, [string]$freezeFile) {
@"
- id: policy
  config:
    mode: danger-full-access
    workspaceRoot: $($campaignRoot.Replace('\','/'))
- id: p10-model
  config:
    campaignRoot: $($campaignRoot.Replace('\','/'))
    preflightRoot: $($root.Replace('\','/'))
    datasetRoot: D:/AMD/verilog-eval
    settingsFile: D:/deepseek-harness/rtl-tools/phase1/configs/dev.yaml
    p09File: $($root.Replace('\','/'))/p09.json
    autoFile: $($autoFile.Replace('\','/'))
    freezeFile: $($freezeFile.Replace('\','/'))
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
    compileMs: 60000
    elaborateMs: 60000
    simulationMs: 30000
    totalMs: 300000
    maxArtifactBytes: 268435456
    artifactPollMs: 100
    maxEventBytes: 1048576
"@
}
[IO.File]::WriteAllText((Join-Path $root 'model.patch.yml'), (ModelPatch $root (Join-Path $root 'auto.json') (Join-Path $root 'campaign-freeze.json')), [Text.UTF8Encoding]::new($false))
New-Item -ItemType Directory -Path (Join-Path $root 'smoke') | Out-Null
$smokeAuto = [ordered]@{}
foreach ($entry in $auto.GetEnumerator()) { $smokeAuto[$entry.Key] = $entry.Value }
$smokeAuto.campaignRoot = (Join-Path $root 'smoke').Replace('\', '/')
Put (Join-Path $root 'smoke\auto.json') $smokeAuto
[IO.File]::WriteAllText((Join-Path $root 'smoke.patch.yml'), (ModelPatch (Join-Path $root 'smoke') (Join-Path $root 'smoke\auto.json') (Join-Path $root 'smoke\freeze.json')), [Text.UTF8Encoding]::new($false))

$files = [ordered]@{}
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $repo 'rtl-tools\src\phase1') -File -Filter '*.ts') { $files[$file.FullName] = Hash $file.FullName }
foreach ($file in @(
    (Join-Path $repo 'rtl-tools\src\diagnostics.ts'), (Join-Path $repo 'rtl-tools\src\process.ts'), (Join-Path $repo 'rtl-tools\src\vivado-parser.ts'),
    (Join-Path $repo 'rtl-tools\phase1\configs\dev.yaml'), (Join-Path $repo 'rtl-tools\phase1\p10\audit-p10-campaign.mjs'),
    (Join-Path $repo 'rtl-tools\phase1\p10\run_p10_10.ps1'), (Join-Path $root 'p10-manifest-10.json'), (Join-Path $root 'selection-order.json'),
    (Join-Path $root 'catalog.json'), (Join-Path $root 'evaluator-policy.json'), (Join-Path $root 'negative-controls.json'), (Join-Path $root 'preflight.mjs'),
    (Join-Path $root 'p09.json'), (Join-Path $root 'auto.json'), (Join-Path $root 'preflight.patch.yml'), (Join-Path $root 'model.patch.yml'),
    (Join-Path $root 'smoke\auto.json'), (Join-Path $root 'smoke.patch.yml'), (Join-Path $root 'prepare.ps1'), (Join-Path $root 'run-stage.ps1'),
    (Join-Path $root 'smoke.ps1'), (Join-Path $root 'seal.ps1'), $p09.skillsFile, 'D:\AMD\p09-runtime\manifest.json',
    (Join-Path $suite 'derived\suite-freeze.json'), (Join-Path $suite 'derived\verilogeval-vivado2025.2-compat-v1-manifest.json')
)) { $files[$file] = Hash $file }
foreach ($profile in Get-ChildItem -LiteralPath (Join-Path $root 'dsh-home') -Recurse -File) { $files[$profile.FullName] = Hash $profile.FullName }
foreach ($task in $manifest.tasks) {
    foreach ($entry in $task.assets.GetEnumerator()) {
        $path = Join-Path 'D:\AMD\verilog-eval' $entry.Key
        if ((Hash $path) -ne $entry.Value) { throw "DATASET_ASSET_CHANGED: $path" }
        $files[$path] = $entry.Value
    }
    $derivedTask = Join-Path $suite "derived\$($task.task_id)"
    foreach ($file in Get-ChildItem -LiteralPath $derivedTask -File) { $files[$file.FullName] = Hash $file.FullName }
}
$protocol = [ordered]@{ p10_agent_implementation = 'p10-model.ts'; legacy_comparison_route = $false; shared_initial = $true; logical_initial_samples = 1;
    max_semantic_repairs = 3; max_transport_retries = 2; transport_backoff_ms = @(1000, 2000); max_output_recovery_attempts = 1;
    model = 'deepseek-flash'; temperature = 0; reasoning = 'high'; output_tokens = 8192; context_tokens = 131072; request_timeout_ms = 120000;
    active_timeout_ms = 1200000; p09_variant = 'C'; skill_sha256 = $p09.skillsSha256; full_os_isolation_verified = $false;
    compatibility_manifest_sha256 = '880f2dabca449f800238edf3458739ca8e37e811bfc5750d8474298af2b80353';
    fixed_manifest_sha256 = '02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742'; counterexample_feedback = 'NOT_IMPLEMENTED' }
Put (Join-Path $root 'preflight-freeze.json') ([ordered]@{ schema_version = 'p10-preflight-freeze-2'; created_at = [DateTime]::UtcNow.ToString('o'); files = $files; protocol = $protocol })
Put (Join-Path $root 'prepared.json') ([ordered]@{ created_at = [DateTime]::UtcNow.ToString('o'); task_ids = $manifest.task_ids; files_frozen = $files.Count })
Write-Output "Prepared fixed 10 campaign with $($files.Count) frozen inputs."
