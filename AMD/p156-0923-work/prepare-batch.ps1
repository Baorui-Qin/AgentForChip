$ErrorActionPreference = 'Stop'
$cal = 'D:\AMD\p156-0923-cal'
$preflight = Join-Path $cal 'preflight-156'
$root = 'D:\AMD\p156-0923-v1'
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$p, $v) { [IO.File]::WriteAllText($p, (ConvertTo-Json -InputObject $v -Depth 80), [Text.UTF8Encoding]::new($false)) }
$rows = @(Get-Content -LiteralPath (Join-Path $cal 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json -AsHashtable)
$replacement = @(Get-Content -LiteralPath (Join-Path $cal 'g3/compat-positive-negative-results.json') -Raw | ConvertFrom-Json -AsHashtable)
if ($rows.Count -ne 156 -or $replacement.Count -ne 1 -or $replacement[0].task_id -ne 'Prob001_zero' -or -not $replacement[0].evaluable) { throw 'CORRECTED_CALIBRATION_REQUIRED' }
New-Item -ItemType Directory -Path $preflight | Out-Null
$prior = $rows[0]
if ($prior.task_id -ne 'Prob001_zero') { throw 'FIXED_ORDER_CHANGED' }
$rows[0] = $replacement[0]
foreach ($name in @('catalog.json','evaluator-policy.json','manifest-156.json','selection-order.json','p09.json','auto.json')) { Copy-Item -LiteralPath (Join-Path $cal $name) -Destination (Join-Path $preflight $name) }
New-Item -ItemType Junction -Path (Join-Path $preflight 'derived') -Target 'D:\AMD\phase1-validation\p10-full-compat-v1-r2\derived' | Out-Null
Put (Join-Path $preflight 'compat-positive-negative-results.json') $rows
Put (Join-Path $preflight 'calibration-provenance.json') ([ordered]@{
    selected = 156; fresh_full_calibration = Join-Path $cal 'compat-positive-negative-results.json'; full_calibration_sha256 = Hash (Join-Path $cal 'compat-positive-negative-results.json');
    corrected_control_calibration = Join-Path $cal 'g3/compat-positive-negative-results.json'; corrected_calibration_sha256 = Hash (Join-Path $cal 'g3/compat-positive-negative-results.json');
    prior_row_preserved = $prior; replacement_rule = 'Only Prob001 negative control corrected from constant-zero to constant-one using unchanged public LOW requirement; no model outcome used.';
    ready = @($rows | Where-Object evaluable).Count; excluded = @($rows | Where-Object { -not $_.evaluable } | Select-Object task_id,reason,category)
})
& 'D:\deepseek-harness\rtl-tools\phase1\p10\prepare-stability.ps1' -AllTasks -PreflightRoot $preflight -FullManifestSha256 (Hash (Join-Path $preflight 'manifest-156.json')) -MaxDispatches 20124 -SettingsFile (Join-Path $cal 'eda-settings.yaml') -CampaignRoot $root
foreach ($name in @('analyze.mjs','run-power.ps1','research.zh.md','verification.json','budget-boundary-test.log','archive-inputs.ps1','prepare-batch.ps1','verify-config.mjs')) { Copy-Item -LiteralPath (Join-Path $PSScriptRoot $name) -Destination (Join-Path $root $name) }
Put (Join-Path $root 'authorization.json') ([ordered]@{ task_scope = 'All 156 tasks in the pinned local dataset; original task text and evaluator verdicts unchanged';
    user_authorized_physical_calls = 20124; authorization_text = '预先授权全部 156 题预算，最高 20124 次物理调用';
    api_endpoint = 'https://api.deepseek.com'; user_authorized_api_cost = $true; temporary_system_required = $true; permanent_power_plan_changes = $false;
    rtl_modifications_per_task = 15; repair_request_attempts_per_task = 120; tool_actions_per_task = 60; candidate_corrections = 2;
    synthesis_timeout_ms = 600000; raw_provider_reasoning_only = $true; credentials_archived = $false; auto_generation_resumes = 0;
    unchanged_problem_policy = 'Uncalibrated tasks are separately reported, not model errors. Ambiguous interfaces are not inferred from references.' })
$freezePath = Join-Path $root 'campaign-freeze.json'
$freeze = Get-Content -LiteralPath $freezePath -Raw | ConvertFrom-Json -AsHashtable
$freeze.calibration_reused = $false
$freeze.calibration_provenance = Join-Path $preflight 'calibration-provenance.json'
$freeze.protocol.synthesis_timeout_ms = 600000
$freeze.protocol.verification_total_ms = 900000
$freeze.protocol.temporary_power_guard = 'SystemRequired; released on wrapper exit'
$freeze.protocol.environment_override = @{ XILINX_LOCAL_USER_DATA = 'no' }
foreach ($path in @((Join-Path $preflight 'calibration-provenance.json'), (Join-Path $cal 'source-snapshot.json'), (Join-Path $cal 'preflight-freeze.json'), (Join-Path $cal 'g3/freeze.json'))) { $freeze.files[$path] = Hash $path }
foreach ($file in Get-ChildItem -LiteralPath $root -File) { if ($file.FullName -ne $freezePath) { $freeze.files[$file.FullName] = Hash $file.FullName } }
Put $freezePath $freeze
Write-Output "Prepared full batch with $(@($rows | Where-Object evaluable).Count) calibrated tasks; original full calibration and correction retained. No API calls yet."
