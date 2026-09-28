$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
function Json([string]$path) { Get-Content -LiteralPath $path -Raw | ConvertFrom-Json -AsHashtable }
function Hash([string]$path) { (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$path, $value) { if (Test-Path -LiteralPath $path) { throw "OUTPUT_EXISTS:$path" }; [IO.File]::WriteAllText($path, (ConvertTo-Json -InputObject $value -Depth 80), [Text.UTF8Encoding]::new($false)) }
$freeze = Json (Join-Path $root 'preflight-freeze.json')
foreach ($entry in $freeze.files.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "CALIBRATION_INPUT_CHANGED:$($entry.Key)" } }
$resume = Json (Join-Path $root 'resume-freeze.json')
foreach ($entry in $resume.files.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "CALIBRATION_RESUME_INPUT_CHANGED:$($entry.Key)" } }
$plan = Json (Join-Path $root 'selection-plan.json')
$old = @(Json (Join-Path $root 'reused-calibration.json'))
$new = @()
foreach ($i in 1..2) { $new += @(Json (Join-Path $root "group-$i/compat-positive-negative-results.json")) }
if ($new.Count -ne 80 -or @($new | ForEach-Object task_id | Sort-Object -Unique).Count -ne 80) { throw 'INCOMPLETE_CALIBRATION' }
$expected = @($plan.ranked_remaining[0..79] | ForEach-Object task_id)
if (($new.task_id -join ',') -ne ($expected -join ',')) { throw 'CALIBRATION_ORDER_CHANGED' }
$ready = @($new | Where-Object evaluable)
if ($ready.Count -lt 62) { throw "NEXT_FROZEN_CALIBRATION_BATCH_REQUIRED:$($ready.Count)" }
$selected = @($old | Where-Object evaluable) + @($ready[0..61])
if ($selected.Count -ne 100 -or ($selected[0..37].task_id -join ',') -ne ($plan.retained -join ',')) { throw 'SELECTION_INVALID' }
$preflight = Join-Path $root 'preflight-100'
New-Item -ItemType Directory -Path $preflight | Out-Null
foreach ($name in @('catalog.json','evaluator-policy.json')) { Copy-Item -LiteralPath (Join-Path $root "group-1/$name") -Destination (Join-Path $preflight $name) }
foreach ($name in @('auto.json','p09.json')) { Copy-Item -LiteralPath (Join-Path 'D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1' $name) -Destination (Join-Path $preflight $name) }
New-Item -ItemType Junction -Path (Join-Path $preflight 'derived') -Target 'D:\AMD\phase1-validation\p10-full-compat-v1-r2\derived' | Out-Null
Put (Join-Path $preflight 'selection-order.json') @($selected | ForEach-Object task_id)
Put (Join-Path $preflight 'compat-positive-negative-results.json') $selected
Put (Join-Path $preflight 'manifest-100.json') ([ordered]@{ created_at = [DateTime]::UtcNow.ToString('o'); task_ids = @($selected | ForEach-Object task_id); selection_plan_sha256 = Hash (Join-Path $root 'selection-plan.json'); retained_calibrated_tasks = 38; newly_calibrated_tasks = 62; calibration_exclusions_outside_denominator = $true; fresh_generation_for_all = $true; selection_uses_model_outcomes = $false })
$excluded = @(@($old) + @($new) | Where-Object { -not $_.evaluable })
Put (Join-Path $preflight 'calibration-exclusions.json') $excluded
Put (Join-Path $preflight 'calibration-reserve.json') @($ready | Where-Object { $_.task_id -notin $selected.task_id } | ForEach-Object task_id)
$evidence = [ordered]@{}
foreach ($entry in $freeze.files.GetEnumerator()) { $evidence[$entry.Key] = $entry.Value }
foreach ($entry in $resume.files.GetEnumerator()) { $evidence[$entry.Key] = $entry.Value }
foreach ($row in @($old) + @($new)) {
    foreach ($kind in @('positive','negative')) {
        if ($row[$kind]) {
            foreach ($file in Get-ChildItem -LiteralPath $row[$kind].run -Recurse -File) { $evidence[$file.FullName] = Hash $file.FullName }
        }
    }
}
foreach ($i in 1..2) { foreach ($file in Get-ChildItem -LiteralPath (Join-Path $root "group-$i") -File) { $evidence[$file.FullName] = Hash $file.FullName } }
foreach ($name in @('preflight-freeze.json','resume-freeze.json','selection-plan.json','finalize.ps1','reused-calibration.json','group-1.stdout.log','group-1.stderr.log','group-2.stdout.log','group-2.stderr.log','group-2-resume.stdout.log','group-2-resume.stderr.log')) { $path=Join-Path $root $name; $evidence[$path]=Hash $path }
Put (Join-Path $preflight 'calibration-provenance.json') ([ordered]@{ created_at = [DateTime]::UtcNow.ToString('o'); calibration_root = $root; selected = 100; previous_calibrated_retained = 38; new_tasks_calibrated = 80; new_tasks_evaluable = $ready.Count; newly_selected = 62; excluded = $excluded.Count; reserve_evaluable = $ready.Count-62; selection_plan = $plan; evidence_files = $evidence })
Write-Output "Ready: $preflight"
Write-Output "Manifest SHA256: $(Hash (Join-Path $preflight 'manifest-100.json'))"
Write-Output "Selected 100; excluded $($excluded.Count); calibrated reserve $($ready.Count-62); evidence files $($evidence.Count)."
