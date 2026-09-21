$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
function Hash([string]$Path) { return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant() }
function ReadJson([string]$Path) { return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json -AsHashtable }
function Publish([string]$Name, $Value) {
    $path = Join-Path $root $Name
    if (Test-Path -LiteralPath $path) { throw "AUDIT_OUTPUT_EXISTS: $Name" }
    [IO.File]::WriteAllText($path, ($Value | ConvertTo-Json -Depth 40), [Text.UTF8Encoding]::new($false))
}
$freeze = ReadJson (Join-Path $root 'freeze.json')
$counts = [ordered]@{}
foreach ($group in @('files','protected','historical')) {
    foreach ($entry in $freeze[$group].GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "CHANGED_${group}: $($entry.Key)" } }
    $counts[$group] = $freeze[$group].Count
}
$suite = Join-Path $root 'derived'
$sealed = ReadJson (Join-Path $root 'frozen-suite-files.json')
foreach ($entry in $sealed.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "MASTER_SUITE_CHANGED: $($entry.Key)" } }
$counts['sealed_files'] = $sealed.Count
$catalog = ReadJson (Join-Path $root 'catalog.json')
$assetCount = 0
foreach ($task in $catalog) {
    foreach ($entry in $task.assets.GetEnumerator()) {
        if ((Hash (Join-Path 'D:\AMD\verilog-eval' $entry.Key)) -ne $entry.Value) { throw "UPSTREAM_CHANGED: $($entry.Key)" }
        $assetCount++
    }
}
$counts['upstream_assets'] = $assetCount
$prior = ReadJson 'D:\AMD\phase1-validation\p10-compat-model-v4\freeze.json'
$unchangedAgent = [ordered]@{}
foreach ($entry in $prior.files.GetEnumerator()) {
    if ($entry.Key -match '(p09[^\\/]*\.(ts|json|ya?ml)$|[\\/]p10-model\.ts$|[\\/]model\.ts$|[\\/]skills[\\/])') {
        if ((Hash $entry.Key) -ne $entry.Value) { throw "AGENT_SOURCE_CHANGED: $($entry.Key)" }
        $unchangedAgent[$entry.Key] = $entry.Value
    }
}
Publish 'agent-unchanged.json' $unchangedAgent
$counts['prior_frozen_agent_files'] = $unchangedAgent.Count
$manifestPath = Join-Path $suite 'verilogeval-vivado2025.2-compat-v1-manifest.json'
$manifest = ReadJson $manifestPath
$manifestHash = Hash $manifestPath
$seal = ReadJson (Join-Path $suite 'suite-freeze.json')
$validation = ReadJson (Join-Path $root 'compatibility-validation.json')
$preflight = ReadJson (Join-Path $root 'p10-compat-preflight-10.json')
if ($preflight.Count -ne 10 -or @($preflight | Where-Object { -not $_.evaluable }).Count -ne 0) { throw 'P10_NOT_READY' }
$rows = @()
foreach ($file in Get-ChildItem -LiteralPath $root -File | Where-Object Name -Match '^(calibrate|preflight)-\d\d\.json$' | Sort-Object Name) { $rows += ReadJson $file.FullName }
if ($rows.Count -ne 26) { throw 'REAL_RUN_COUNT_CHANGED' }
$paths = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$index = @()
foreach ($row in $rows) {
    if (-not $paths.Add($row.run)) { throw 'SHARED_RUN_DIRECTORY' }
    if ($row.run -like '*eda-preflight*' -and [DateTimeOffset]::Parse($row.started_at) -le [DateTimeOffset]::Parse($seal.frozen_at)) { throw 'WORKER_STARTED_BEFORE_FREEZE' }
    $snapshots = @(Get-ChildItem -LiteralPath $row.run -Directory -Filter 'snapshot-*')
    if ($snapshots.Count -ne 1) { throw 'AMBIGUOUS_SNAPSHOT' }
    $snapshot = ReadJson (Join-Path $snapshots[0].FullName 'manifest.json')
    $task = $manifest.tasks | Where-Object task_id -EQ $row.task_id
    foreach ($entry in $snapshot.files.GetEnumerator()) { if ((Hash (Join-Path $snapshots[0].FullName $entry.Key)) -ne $entry.Value) { throw 'SNAPSHOT_CHANGED' } }
    if ($snapshot.files['trusted/tb.sv'] -ne $task.effective_tb_sha256 -or $snapshot.evaluation.compatibility.manifest_sha256 -ne $manifestHash -or
        $snapshot.evaluation.compatibility.compatibility_version -ne 'vivado2025.2-compat-v1' -or $snapshot.evaluation.compatibility.vivado_version -ne '2025.2') { throw 'SNAPSHOT_IDENTITY_CHANGED' }
    $result = ReadJson (Join-Path $row.run 'result.json')
    if ($result.verification_key -notmatch '^sha256:[0-9a-f]{64}$') { throw 'VERIFICATION_KEY_MISSING' }
    foreach ($stage in $row.stages) {
        foreach ($invoke in $stage.invocations) {
            $p = $invoke.process
            if ($p.timed_out -or $p.cancelled -or $p.signal -or $p.log_truncated) { throw 'INCOMPLETE_PROCESS_EVIDENCE' }
            if ($invoke.args -contains '-override_timeunit' -or $invoke.args -contains '-override_timeprecision') { throw 'TIMESCALE_OVERRIDE' }
            $version = $invoke.args.Count -eq 1 -and $invoke.args[0] -eq '-version'
            if ($version) {
                if ($invoke.version_matches -ne $true -or $p.exit_code -notin @(0,1)) { throw 'TOOL_VERSION_NOT_VERIFIED' }
            } elseif ($row.kind -ne 'declaration-only' -and $p.exit_code -ne 0) { throw 'EDA_PROCESS_FAILED' }
            if ($invoke.label -eq 'compile' -and $invoke.systemverilog_mode -ne $true) { throw 'SV_MODE_NOT_ENABLED' }
            if ($invoke.label -eq 'elaborate' -and $row.default_timescale -eq '1ps/1ps') {
                if (($invoke.args -join ' ') -notmatch '-timescale 1ps/1ps') { throw 'HOST_TIMESCALE_MISSING' }
            }
        }
    }
    $index += [ordered]@{ task_id = $row.task_id; kind = $row.kind; run = $row.run; started_at = $row.started_at; snapshot = $snapshots[0].FullName; verification_key = $result.verification_key; evaluator_sha256 = $task.effective_tb_sha256; compatibility_version = $manifest.compatibility_version; manifest_sha256 = $manifestHash; simulation_evidence = $row.stages[2].evidence }
}
$keys = @($index.verification_key | Sort-Object -Unique)
if ($keys.Count -ne $index.Count) { throw 'REUSED_VERIFICATION_KEY' }
$toolProcesses = @(Get-Process -ErrorAction SilentlyContinue | Where-Object ProcessName -Match '^(vivado|xvlog|xelab|xsim|xsimk)$')
if ($toolProcesses.Count -ne 0) { throw 'EDA_PROCESS_REMAINS' }
Publish 'evidence-index.json' $index
$audit = [ordered]@{ passed = $true; checked_at = [DateTime]::UtcNow.ToString('o'); checked_files = $counts; manifest_sha256 = $manifestHash; real_runs = $rows.Count; unique_run_directories = $paths.Count; unique_verification_keys = $keys.Count; master_suite_unchanged = $true; upstream_unchanged = $true; history_unchanged = $true; agent_unchanged = $true; worker_started_after_freeze = $true; workspace_conflicts = 0; remaining_eda_processes = 0; fixed_ten_ready = 10; unrun_task_count = 145; icarus_crosscheck = 'NOT_RUN_NOT_ON_PATH'; model_requests = 0; model_comparison = 'NOT_RUN'; main_40 = 'NOT_RUN'; ready_to_restart_p10_ten = $true; full_os_isolation_verified = $false }
Publish 'acceptance-audit.json' $audit
Publish 'p10-evaluator-routing.json' ([ordered]@{ preflightRoot = $root; datasetRoot = 'D:\AMD\verilog-eval'; evaluatorManifest = $manifestPath; manifest_sha256 = $manifestHash; compatibility_version = 'vivado2025.2-compat-v1'; model_configuration_changes = $false; agent_code_changes = $false; requires_new_campaign_source_freeze = $true; model_run_status = 'NOT_RUN' })
$artifacts = [ordered]@{}
foreach ($file in Get-ChildItem -LiteralPath $root -Recurse -File) { $artifacts[$file.FullName.Substring($root.Length + 1).Replace('\','/')] = [ordered]@{ sha256 = Hash $file.FullName; bytes = $file.Length } }
Publish 'campaign-artifact-manifest.json' $artifacts
$audit | ConvertTo-Json -Depth 5
