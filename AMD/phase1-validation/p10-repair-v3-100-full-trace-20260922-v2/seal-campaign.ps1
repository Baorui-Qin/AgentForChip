param([Parameter(Mandatory)][string]$CampaignRoot)
$ErrorActionPreference = 'Stop'
$repo = 'D:\deepseek-harness'
$stage = $PSScriptRoot
$preflight = 'D:\AMD\phase1-validation\p10-calibration-100-20260922-v1\preflight-100'
function Hash([string]$path) { (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$path, $value) { [IO.File]::WriteAllText($path, (ConvertTo-Json -InputObject $value -Depth 80), [Text.UTF8Encoding]::new($false)) }
$freezePath = Join-Path $CampaignRoot 'campaign-freeze.json'
$freeze = Get-Content -LiteralPath $freezePath -Raw | ConvertFrom-Json -AsHashtable
if ($freeze.protocol.calibrated_task_count) { throw 'CAMPAIGN_ALREADY_SEALED' }
if (Test-Path -LiteralPath (Join-Path $CampaignRoot 'source-snapshot-index.json')) {
    foreach ($entry in (Get-Content -LiteralPath (Join-Path $CampaignRoot 'source-snapshot-index.json') -Raw | ConvertFrom-Json)) {
        if ((Hash $entry.snapshot) -ne $entry.sha256 -or (Hash $entry.source) -ne $entry.sha256) { throw 'PARTIAL_SNAPSHOT_CHANGED' }
    }
}
if (Test-Path -LiteralPath (Join-Path $CampaignRoot 'dispatches')) { throw 'CAMPAIGN_ALREADY_DISPATCHED' }
foreach ($entry in $freeze.files.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "FREEZE_CHANGED:$($entry.Key)" } }
foreach ($name in @('calibration-provenance.json','calibration-exclusions.json','calibration-reserve.json')) { Copy-Item -LiteralPath (Join-Path $preflight $name) -Destination (Join-Path $CampaignRoot $name) }
foreach ($name in @('analyze-campaign.mjs','analyze-failures.mjs','verify-evidence.mjs','historical-replay.json','VALIDATION.md','PROTOCOL-NOTES.zh.md','regression-remaining.log','seal-campaign.ps1')) { Copy-Item -LiteralPath (Join-Path $stage $name) -Destination (Join-Path $CampaignRoot $name) }
$added = @('rtl-tools/tests/p10-model.spec.ts','rtl-tools/tests/p10-repair-v2.spec.ts','rtl-tools/tests/repair.spec.ts','rtl-tools/phase1/p10/README.md','rtl-tools/phase1/p10/README.zh.md','.agents/notes/implemented/bug-fix/2026-09-22-p10-evidence-recovery.md','.agents/notes/implemented/bug-fix/2026-09-22-p10-evidence-recovery.zh.md')
foreach ($relative in $added) { $source=Join-Path $repo $relative; $freeze.files[$source]=Hash $source }
$snapshots = @()
foreach ($entry in @($freeze.files.GetEnumerator())) {
    if ($entry.Key.StartsWith($repo + '\', [StringComparison]::OrdinalIgnoreCase)) {
        $relative = $entry.Key.Substring($repo.Length+1)
        $dest = Join-Path $CampaignRoot "source-snapshot/$relative"
        New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
        Copy-Item -LiteralPath $entry.Key -Destination $dest
        $snapshots += [ordered]@{ source=$entry.Key; snapshot=$dest; sha256=$entry.Value }
    }
}
Put (Join-Path $CampaignRoot 'source-snapshot-index.json') $snapshots
Put (Join-Path $CampaignRoot 'authorization.json') ([ordered]@{ scope='This 100-task campaign only, after confirmed fixes and regression'; provider='https://api.deepseek.com'; user_authorized=$true; payloads=@('public questions','candidate RTL','skill prompts','tool definitions','diagnostic and waveform summaries'); credentials_saved=$false; paid_api_calls_authorized=$true; selected_evaluable_tasks=100; retained_prior_evaluable_tasks=38; new_selection_by_frozen_order=$true; reasoning_scope='Only reasoning returned by the model API; no unpublished internal reasoning'; max_campaign_dispatches=375 })
& git -C $repo diff --binary "--output=$(Join-Path $CampaignRoot 'source-changes.patch')"
if ($LASTEXITCODE -ne 0) { throw 'DIFF_CAPTURE_FAILED' }
foreach ($file in Get-ChildItem -LiteralPath $CampaignRoot -File) { if ($file.Name -ne 'campaign-freeze.json') { $freeze.files[$file.FullName]=Hash $file.FullName } }
$freeze.protocol.repair_protocol='p10-repair-v3'
$freeze.protocol.calibrated_task_count=100
$freeze.protocol.source_envelope_cap_removed=$true
$freeze.protocol.forced_history_preserves_host_result=$true
$freeze.protocol.raw_diagnostics_reparsed=$true
Put $freezePath $freeze
Write-Output "Sealed $($freeze.files.Count) inputs and $($snapshots.Count) source snapshots; no API dispatch has occurred."
