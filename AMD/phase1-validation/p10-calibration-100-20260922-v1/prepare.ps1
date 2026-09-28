$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$suite = 'D:\AMD\phase1-validation\p10-full-compat-v1-r2'
$historical = 'D:\AMD\phase1-validation\p10-40-20260919-v1'
function Json([string]$p) { Get-Content -LiteralPath $p -Raw | ConvertFrom-Json -AsHashtable }
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$p, $value) { if (Test-Path -LiteralPath $p) { throw "OUTPUT_EXISTS:$p" }; [IO.File]::WriteAllText($p, (ConvertTo-Json -InputObject $value -Depth 80), [Text.UTF8Encoding]::new($false)) }
$files = [ordered]@{}
$old = @(); $oldOrder = @()
foreach ($i in 1..4) {
    $group = Join-Path $historical "group-$i"
    $seal = Json (Join-Path $group 'freeze.json')
    foreach ($name in @('catalog.json','selection-order.json','compat-positive-negative-results.json','evaluator-policy.json')) {
        $path = Join-Path $group $name
        if (-not $seal.files.Contains($path) -or (Hash $path) -ne $seal.files[$path]) { throw "HISTORICAL_CALIBRATION_CHANGED:$path" }
        $files[$path] = Hash $path
    }
    $old += @(Json (Join-Path $group 'compat-positive-negative-results.json'))
    $oldOrder += @(Json (Join-Path $group 'selection-order.json'))
}
if ($old.Count -ne 40 -or @($old | Where-Object evaluable).Count -ne 38) { throw 'HISTORICAL_SELECTION_INVALID' }
$manifest = Join-Path $historical 'manifest-40.json'
if ((Hash $manifest) -ne '78f895dfebde67ce39905ca19a7454db5f904fb469966648a9d5fa273f865106' -or ($oldOrder -join ',') -ne ((Json $manifest).task_ids -join ',')) { throw 'HISTORICAL_MANIFEST_CHANGED' }
$files[$manifest] = Hash $manifest
$catalog = Json (Join-Path $suite 'catalog.json')
$seed = 'p10-verilogeval-100-v1:20260922:'
$ranked = @($catalog | Where-Object { $_.task_id -notin $oldOrder } | ForEach-Object {
    $digest = [Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($seed + $_.task_id))
    [ordered]@{ task_id = $_.task_id; rank_sha256 = [Convert]::ToHexString($digest).ToLowerInvariant() }
} | Sort-Object { $_.rank_sha256 })
Put (Join-Path $root 'selection-plan.json') ([ordered]@{ created_at = [DateTime]::UtcNow.ToString('o'); requested_evaluable = 100; retained = @($old | Where-Object evaluable | ForEach-Object task_id); prior_excluded = @($old | Where-Object { -not $_.evaluable } | Select-Object task_id,reason,category); seed = $seed; ranked_remaining = $ranked; initial_calibration_count = 80; selection_rule = 'Retain the original 38 evaluable tasks, then take the first 62 evaluable tasks in precommitted SHA order. No model outcomes are used. If fewer than 62 pass in the first 80, calibrate the next remaining tasks in a separate frozen batch.' })
Put (Join-Path $root 'reused-calibration.json') $old
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $repo 'rtl-tools/src/phase1') -File -Filter '*.ts') { $files[$file.FullName] = Hash $file.FullName }
foreach ($relative in @('rtl-tools/src/process.ts','rtl-tools/src/diagnostics.ts','rtl-tools/src/vivado-parser.ts','rtl-tools/phase1/configs/dev.yaml')) { $path = Join-Path $repo $relative; $files[$path] = Hash $path }
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $suite 'derived') -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
foreach ($task in $catalog) { foreach ($asset in $task.assets.GetEnumerator()) { $path = Join-Path 'D:\AMD\verilog-eval' $asset.Key; if ((Hash $path) -ne $asset.Value) { throw "DATASET_CHANGED:$path" }; $files[$path] = $asset.Value } }
foreach ($i in 0..1) {
    $worker = Join-Path $root "group-$($i+1)"
    New-Item -ItemType Directory -Path $worker | Out-Null
    New-Item -ItemType Junction -Path (Join-Path $worker 'derived') -Target (Join-Path $suite 'derived') | Out-Null
    foreach ($name in @('catalog.json','evaluator-policy.json')) { Copy-Item -LiteralPath (Join-Path $suite $name) -Destination (Join-Path $worker $name) }
    $order = @($ranked[($i*40)..($i*40+39)] | ForEach-Object task_id)
    Put (Join-Path $worker 'selection-order.json') $order
    $controls = [ordered]@{}
    foreach ($id in $order) {
        $task = $catalog | Where-Object task_id -EQ $id
        if ($task.interface -and -not $task.interface_error) {
            $ports = @($task.interface.ports | ForEach-Object { "$($_.direction) wire $(if ($_.signed) { 'signed ' })[$($_.width-1):0] $($_.name)" }) -join ', '
            $outputs = @($task.interface.ports | Where-Object direction -EQ output | ForEach-Object { "assign $($_.name) = '0;" }) -join "`n"
            $controls[$id] = "module TopModule($ports);`n$outputs`nendmodule`n"
        }
    }
    Put (Join-Path $worker 'negative-controls.json') $controls
    $profile = Join-Path $worker 'dsh-home/profiles/rtl-p10-preflight'
    New-Item -ItemType Directory -Force -Path $profile | Out-Null
    foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $repo "rtl-tools/phase1/profiles/rtl-p10-preflight/$name") -Destination (Join-Path $profile $name) }
    $patch = [IO.File]::ReadAllText((Join-Path $suite 'preflight.patch.yml')).Replace($suite.Replace('\','/'), $worker.Replace('\','/')).Replace('D:/deepseek-harness/rtl-tools/src/phase1/p10-suite-preflight.ts', (Join-Path $root 'preflight.mjs').Replace('\','/')).Replace("$($worker.Replace('\','/'))/freeze.json", "$($root.Replace('\','/'))/preflight-freeze.json")
    [IO.File]::WriteAllText((Join-Path $worker 'preflight.patch.yml'), $patch, [Text.UTF8Encoding]::new($false))
    foreach ($file in Get-ChildItem -LiteralPath $worker -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
}
foreach ($name in @('preflight.mjs','prepare.ps1','run.ps1','selection-plan.json','reused-calibration.json')) { $path = Join-Path $root $name; $files[$path] = Hash $path }
Put (Join-Path $root 'preflight-freeze.json') ([ordered]@{ created_at = [DateTime]::UtcNow.ToString('o'); files = $files; model_free = $true; workers = 2; historical_calibration_reused = 38; newly_calibrated_pool = 80 })
Write-Output "Prepared 80 new calibration tasks in 2 fixed groups; $($files.Count) inputs frozen; 38 previous evaluable tasks retained."
