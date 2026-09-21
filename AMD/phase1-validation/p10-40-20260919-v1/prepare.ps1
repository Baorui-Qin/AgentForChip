$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$suite = 'D:\AMD\phase1-validation\p10-full-compat-v1-r2'
$prior = 'D:\AMD\phase1-validation\p10-full-compat-model-20260919-v1'
function ReadJson([string]$p) { Get-Content -LiteralPath $p -Raw | ConvertFrom-Json -AsHashtable }
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$p, $v) { if (Test-Path -LiteralPath $p) { throw "OUTPUT_EXISTS: $p" }; [IO.File]::WriteAllText($p, ($v | ConvertTo-Json -Depth 40), [Text.UTF8Encoding]::new($false)) }
$previous = ReadJson (Join-Path $prior 'freeze.json')
foreach ($entry in $previous.files.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "FROZEN_INPUT_CHANGED: $($entry.Key)" } }
$order = ReadJson (Join-Path $suite 'selection-order.json')
if ($order.Count -ne 40 -or @($order | Sort-Object -Unique).Count -ne 40) { throw 'FIXED_ORDER_INVALID' }
$catalog = ReadJson (Join-Path $suite 'catalog.json')
$files = [ordered]@{}
foreach ($entry in $previous.files.GetEnumerator()) { $files[$entry.Key] = $entry.Value }
foreach ($task in $catalog) { foreach ($entry in $task.assets.GetEnumerator()) { $p = Join-Path 'D:\AMD\verilog-eval' $entry.Key; if ((Hash $p) -ne $entry.Value) { throw 'UPSTREAM_CHANGED' }; $files[$p] = $entry.Value } }
Put (Join-Path $root 'manifest-40.json') ([ordered]@{ created_at = [DateTime]::UtcNow.ToString('o'); task_ids = $order; compatibility_manifest_sha256 = $previous.protocol.compatibility_manifest_sha256; workers = 4; grouping = 'Four contiguous fixed groups, no reselection'; shared_initial = $true; fresh_generation_for_all_evaluable_tasks = $true; max_total_dispatches = 600; automatic_expansion_beyond_40 = $false })
foreach ($i in 0..3) {
    $worker = Join-Path $root "group-$($i+1)"
    New-Item -ItemType Directory -Path $worker | Out-Null
    New-Item -ItemType Junction -Path (Join-Path $worker 'derived') -Target (Join-Path $suite 'derived') | Out-Null
    Copy-Item -LiteralPath (Join-Path $suite 'catalog.json') -Destination (Join-Path $worker 'catalog.json')
    Copy-Item -LiteralPath (Join-Path $suite 'evaluator-policy.json') -Destination (Join-Path $worker 'evaluator-policy.json')
    Put (Join-Path $worker 'selection-order.json') @($order[($i*10)..($i*10+9)])
    $controls = [ordered]@{}
    foreach ($id in $order[($i*10)..($i*10+9)]) {
        $task = $catalog | Where-Object task_id -EQ $id
        if ($task.interface -and -not $task.interface_error) {
            $ports = @($task.interface.ports | ForEach-Object { "$($_.direction) wire [$($_.width-1):0] $($_.name)" }) -join ', '
            $outputs = @($task.interface.ports | Where-Object direction -EQ output | ForEach-Object { "assign $($_.name) = '0;" }) -join "`n"
            $controls[$id] = "module TopModule($ports);`n$outputs`nendmodule`n"
        }
    }
    Put (Join-Path $worker 'negative-controls.json') $controls
    foreach ($profileName in @('rtl-p10-model','rtl-p10-preflight')) {
        $profile = Join-Path $worker "dsh-home\profiles\$profileName"
        New-Item -ItemType Directory -Path $profile -Force | Out-Null
        foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $repo "rtl-tools\phase1\profiles\$profileName\$name") -Destination (Join-Path $profile $name) }
    }
    $patch = [IO.File]::ReadAllText((Join-Path $suite 'preflight.patch.yml')).Replace($suite.Replace('\','/'), $worker.Replace('\','/')).Replace('D:/deepseek-harness/rtl-tools/src/phase1/p10-suite-preflight.ts', (Join-Path $root 'preflight.mjs').Replace('\','/')).Replace("$($worker.Replace('\','/'))/freeze.json", "$($root.Replace('\','/'))/preflight-freeze.json")
    [IO.File]::WriteAllText((Join-Path $worker 'preflight.patch.yml'), $patch, [Text.UTF8Encoding]::new($false))
    Copy-Item -LiteralPath (Join-Path $prior 'p09.json') -Destination (Join-Path $worker 'p09.json')
    $auto = ReadJson (Join-Path $prior 'auto.json'); $auto.campaignRoot = $worker.Replace('\','/')
    Put (Join-Path $worker 'auto.json') $auto
    $modelPatch = [IO.File]::ReadAllText((Join-Path $prior 'model.patch.yml')).Replace($prior.Replace('\','/'), $worker.Replace('\','/')).Replace($suite.Replace('\','/'), $worker.Replace('\','/'))
    [IO.File]::WriteAllText((Join-Path $worker 'model.patch.yml'), $modelPatch, [Text.UTF8Encoding]::new($false))
    foreach ($file in Get-ChildItem -LiteralPath $worker -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
}
foreach ($name in @('preflight.mjs','prepare.ps1','worker.ps1','run-stage.ps1','seal-model.ps1','manifest-40.json')) { $p = Join-Path $root $name; $files[$p] = Hash $p }
$history = [ordered]@{}
foreach ($folder in @($suite, $prior)) { foreach ($file in Get-ChildItem -LiteralPath $folder -Recurse -File) { $history[$file.FullName] = Hash $file.FullName } }
Put (Join-Path $root 'preflight-freeze.json') ([ordered]@{ files = $files; historical = $history; protocol = $previous.protocol })
Write-Output "Prepared 4 fixed groups; pinned $($files.Count) inputs; model and Agent source unchanged."
