$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$suite = 'D:\AMD\phase1-validation\p10-full-compat-v1-r2'
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$p, $v) { if (Test-Path -LiteralPath $p) { throw "OUTPUT_EXISTS:$p" }; [IO.File]::WriteAllText($p, (ConvertTo-Json -InputObject $v -Depth 80), [Text.UTF8Encoding]::new($false)) }
$catalog = Get-Content -LiteralPath (Join-Path $root 'catalog.json') -Raw | ConvertFrom-Json -AsHashtable
$order = @(Get-Content -LiteralPath (Join-Path $root 'selection-order.json') -Raw | ConvertFrom-Json)
if ($catalog.Count -ne 156 -or $order.Count -ne 156 -or @($order | Sort-Object -Unique).Count -ne 156) { throw 'ALL_TASKS_REQUIRED' }
Copy-Item -LiteralPath (Join-Path $suite 'evaluator-policy.json') -Destination (Join-Path $root 'evaluator-policy.json')
foreach ($name in @('p09.json','auto.json')) { Copy-Item -LiteralPath (Join-Path 'D:\AMD\p100-0922-c3' $name) -Destination (Join-Path $root $name) }
New-Item -ItemType Junction -Path (Join-Path $root 'derived') -Target (Join-Path $suite 'derived') | Out-Null
foreach ($i in 0..1) {
    $worker = Join-Path $root "g$($i+1)"
    New-Item -ItemType Directory -Path $worker | Out-Null
    New-Item -ItemType Junction -Path (Join-Path $worker 'derived') -Target (Join-Path $suite 'derived') | Out-Null
    foreach ($name in @('catalog.json','evaluator-policy.json')) { Copy-Item -LiteralPath (Join-Path $root $name) -Destination (Join-Path $worker $name) }
    $tasks = @($order[($i*78)..($i*78+77)])
    Put (Join-Path $worker 'selection-order.json') $tasks
    $controls = [ordered]@{}
    foreach ($id in $tasks) {
        $task = $catalog | Where-Object task_id -EQ $id
        if ($task.interface -and -not $task.interface_error) {
            $ports = @($task.interface.ports | ForEach-Object { "$($_.direction) wire $(if ($_.signed) { 'signed ' })[$($_.width-1):0] $($_.name)" }) -join ', '
            $literal = if ($id -eq 'Prob002_m2014_q4i') { "'1" } else { "'0" }
            $outputs = @($task.interface.ports | Where-Object direction -EQ output | ForEach-Object { "assign $($_.name) = $literal;" }) -join "`n"
            $controls[$id] = "module TopModule($ports);`n$outputs`nendmodule`n"
        }
    }
    Put (Join-Path $worker 'negative-controls.json') $controls
    $profile = Join-Path $worker 'dsh-home/profiles/rtl-p10-preflight'
    New-Item -ItemType Directory -Force -Path $profile | Out-Null
    foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $repo "rtl-tools/phase1/profiles/rtl-p10-preflight/$name") -Destination (Join-Path $profile $name) }
    $patch = [IO.File]::ReadAllText((Join-Path $root 'catalog.patch.yml')).Replace("$($root.Replace('\','/'))/catalog.mjs", "$($root.Replace('\','/'))/preflight.mjs").Replace('id: catalog','id: full-preflight').Replace("campaignRoot: $($root.Replace('\','/'))", "campaignRoot: $($worker.Replace('\','/'))").Replace('D:/deepseek-harness/rtl-tools/phase1/configs/dev.yaml', "$($root.Replace('\','/'))/eda-settings.yaml")
    [IO.File]::WriteAllText((Join-Path $worker 'preflight.patch.yml'), $patch, [Text.UTF8Encoding]::new($false))
}
$files = [ordered]@{}
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $repo 'rtl-tools/src/phase1') -File -Filter '*.ts') { $files[$file.FullName] = Hash $file.FullName }
foreach ($relative in @('rtl-tools/src/process.ts','rtl-tools/src/diagnostics.ts','rtl-tools/src/vivado-parser.ts')) { $p = Join-Path $repo $relative; $files[$p] = Hash $p }
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $suite 'derived') -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
foreach ($task in $catalog) { foreach ($asset in $task.assets.GetEnumerator()) { $p = Join-Path 'D:\AMD\verilog-eval' $asset.Key; if ((Hash $p) -ne $asset.Value) { throw "DATASET_CHANGED:$p" }; $files[$p] = $asset.Value } }
foreach ($file in Get-ChildItem -LiteralPath $root -File) { $files[$file.FullName] = Hash $file.FullName }
foreach ($i in 1..2) { foreach ($file in Get-ChildItem -LiteralPath (Join-Path $root "g$i") -Recurse -File) { $files[$file.FullName] = Hash $file.FullName } }
Put (Join-Path $root 'preflight-freeze.json') ([ordered]@{ created_at = [DateTime]::UtcNow.ToString('o'); files = $files; model_free = $true; workers = 2; selected = 156; negative_control_rule = 'constant-zero, except Prob002_m2014_q4i uses constant-one from public specification'; reused_calibration_count = 0; evaluator_suite_reused = $true })
Write-Output "Frozen fresh all-task calibration: $($files.Count) inputs."
