$ErrorActionPreference = 'Stop'
$root = 'D:\AMD\p100-0922-c3'
$sleepRoot = 'D:\AMD\p100-0922-c2'
$priorRoot = 'D:\AMD\phase1-validation\p10-repair-v3-100-full-trace-20260922-v2'
$stage = $PSScriptRoot
$health = 'D:\AMD\eda-health-0922\regression'
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$p, $data) { $data | ConvertTo-Json -Depth 80 | Set-Content -LiteralPath $p -Encoding utf8NoBOM }
foreach ($i in 1..2) {
    $rows = @(Get-Content -LiteralPath (Join-Path $health "group-$i\results.json") -Raw | ConvertFrom-Json)
    if ($rows.Count -ne 3 -or @($rows | Where-Object status -ne 'PASS').Count) { throw 'FULL_EDA_HEALTH_NOT_PASSED' }
}
if (Test-Path -LiteralPath $root) { throw 'NEW_CONTINUATION_ROOT_REQUIRED' }
$freeze = Get-Content -LiteralPath (Join-Path $priorRoot 'campaign-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
foreach ($path in $freeze.files.Keys) { if ((Hash $path) -ne $freeze.files[$path]) { throw "ORIGINAL_FREEZE_CHANGED: $path" } }
New-Item -ItemType Directory -Path $root | Out-Null
foreach ($name in @('manifest-100.json','p09.json','auto.json','stability.json','model.patch.yml','authorization.json','calibration-provenance.json','calibration-exclusions.json','calibration-reserve.json','historical-replay.json','VALIDATION.md','PROTOCOL-NOTES.zh.md','regression-remaining.log','source-changes.patch','analyze-failures.mjs')) {
    Copy-Item -LiteralPath (Join-Path $priorRoot $name) -Destination (Join-Path $root $name)
}
foreach ($name in @('analyze-continuation.mjs','verify-continuation.mjs','continue-comparison.mjs','prepare-power-resume.ps1','run-power-resume.ps1','CONTINUATION.zh.md')) {
    Copy-Item -LiteralPath (Join-Path $stage $name) -Destination (Join-Path $root $name)
}
Copy-Item -LiteralPath (Join-Path $health 'group-1\settings.yaml') -Destination (Join-Path $root 'eda-settings.yaml')
$eda = Get-Content -LiteralPath (Join-Path $root 'eda-settings.yaml') -Raw
$eda.Replace('D:/AMD/eda-health-0922/regression/group-1', 'D:/AMD/p100-0922-c3') | Set-Content -LiteralPath (Join-Path $root 'eda-settings.yaml') -Encoding utf8NoBOM
$auto = Get-Content -LiteralPath (Join-Path $root 'auto.json') -Raw | ConvertFrom-Json -AsHashtable
$auto.campaignRoot = $root.Replace('\','/')
Put (Join-Path $root 'auto.json') $auto
$patch = Get-Content -LiteralPath (Join-Path $root 'model.patch.yml') -Raw
$patch = $patch.Replace($priorRoot.Replace('\','/'), $root.Replace('\','/')).Replace('settingsFile: D:/deepseek-harness/rtl-tools/phase1/configs/dev.yaml', 'settingsFile: D:/AMD/p100-0922-c3/eda-settings.yaml').Replace('totalMs: 300000','totalMs: 900000')
$patch | Set-Content -LiteralPath (Join-Path $root 'model.patch.yml') -Encoding utf8NoBOM
$profile = Join-Path $root 'dsh-home\profiles\rtl-p10-model'
New-Item -ItemType Directory -Path $profile -Force | Out-Null
foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $priorRoot "dsh-home\profiles\rtl-p10-model\$name") -Destination (Join-Path $profile $name) }
$manifest = Get-Content -LiteralPath (Join-Path $root 'manifest-100.json') -Raw | ConvertFrom-Json
$inherited = [ordered]@{}
$generationTasks = @()
foreach ($task in $manifest.task_ids) {
    $dir = Join-Path $priorRoot "generate-$task"
    $result = Get-Content -LiteralPath (Join-Path $dir 'result.json') -Raw | ConvertFrom-Json
    if ($result.task_id -ne $task) { throw 'GENERATION_BINDING_INVALID' }
    if ($result.status -eq 'GENERATED_UNVERIFIED' -and (Hash (Join-Path $dir 'initial.sv')) -ne $result.source_sha256) { throw 'CANDIDATE_CHANGED' }
    foreach ($file in Get-ChildItem -LiteralPath $dir -Recurse -File) { $inherited[$file.FullName] = Hash $file.FullName }
    $generationTasks += [ordered]@{ task_id=$task; status=$result.status; directory=$dir; source_sha256=$result.source_sha256; physical_dispatches=$result.physical_dispatches }
    New-Item -ItemType Junction -Path (Join-Path $root "generate-$task") -Target $dir | Out-Null
}
$dispatches = Join-Path $root 'dispatches'
New-Item -ItemType Directory -Path $dispatches | Out-Null
$tickets = @(Get-ChildItem -LiteralPath (Join-Path $priorRoot 'dispatches') -File -Filter '*.json')
if ($tickets.Count -ne 111) { throw 'GENERATION_DISPATCH_COUNT_CHANGED' }
foreach ($file in $tickets) { Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $dispatches $file.Name); $inherited[$file.FullName] = Hash $file.FullName }
Put (Join-Path $root 'generation-provenance.json') ([ordered]@{ source_campaign=$priorRoot; model_generation_repeated=$false; junctions_read_only_by_protocol=$true; dispatched_requests=111; copied_budget_tickets=111; tasks=$generationTasks; files=$inherited })
foreach ($entry in $inherited.GetEnumerator()) { $freeze.files[$entry.Key]=$entry.Value }
foreach ($path in @((Join-Path $priorRoot 'campaign-freeze.json'), (Join-Path $priorRoot 'interruption.json'))) { $freeze.files[$path]=Hash $path }
$healthEvidence=[ordered]@{}
foreach ($file in Get-ChildItem -LiteralPath $health -Recurse -File) { $healthEvidence[$file.FullName]=Hash $file.FullName }
Put (Join-Path $root 'eda-health-provenance.json') ([ordered]@{ root=$health; reference_runs=6; passed=6; model_calls=0; files=$healthEvidence })
foreach ($i in 1..2) { foreach ($name in @('freeze.json','results.json','settings.yaml','health.patch.yml','plan.json')) { $p=Join-Path $health "group-$i\$name"; $freeze.files[$p]=Hash $p } }
$snapshots=@()
foreach ($entry in (Get-Content -LiteralPath (Join-Path $priorRoot 'source-snapshot-index.json') -Raw | ConvertFrom-Json)) {
    $relative=$entry.snapshot.Substring((Join-Path $priorRoot 'source-snapshot').Length+1)
    $dest=Join-Path $root "source-snapshot\$relative"
    New-Item -ItemType Directory -Path (Split-Path $dest) -Force | Out-Null
    Copy-Item -LiteralPath $entry.snapshot -Destination $dest
    $snapshots += [ordered]@{source=$entry.source; snapshot=$dest; sha256=$entry.sha256}
}
Put (Join-Path $root 'source-snapshot-index.json') $snapshots
New-Item -ItemType Directory -Path (Join-Path $root 'report') | Out-Null
Copy-Item -LiteralPath (Join-Path $priorRoot 'report\calibration-findings.zh.md') -Destination (Join-Path $root 'report\calibration-findings.zh.md')
$retained = @('Prob005_notgate','Prob035_count1to10','Prob074_ece241_2014_q4','Prob045_edgedetect2','Prob033_ece241_2014_q1c','Prob015_vector1')
$comparisonFiles = [ordered]@{}
foreach ($task in $retained) {
    $dir=Join-Path $sleepRoot "compare-$task"
    $r=Get-Content -LiteralPath (Join-Path $dir 'result.json') -Raw | ConvertFrom-Json
    if ($r.task_id -ne $task -or $r.status -ne 'VERIFIED' -or $r.initial_status -ne 'PASS' -or $r.physical_dispatches -ne 0) { throw 'RETAINED_COMPARISON_INVALID' }
    foreach ($file in Get-ChildItem -LiteralPath $dir -Recurse -File) { $comparisonFiles[$file.FullName] = Hash $file.FullName }
    New-Item -ItemType Junction -Path (Join-Path $root "compare-$task") -Target $dir | Out-Null
    foreach ($file in Get-ChildItem -LiteralPath $dir -File) { $freeze.files[$file.FullName]=Hash $file.FullName }
}
foreach ($task in @('Prob004_vector2','Prob020_mt2015_eq2')) {
    $p=Join-Path $sleepRoot "compare-$task\result.json"
    $r=Get-Content -LiteralPath $p -Raw|ConvertFrom-Json
    if ($r.initial_status -ne 'ABORTED' -or $r.physical_dispatches -ne 0) { throw 'SLEEP_RETRY_SCOPE_INVALID' }
    $freeze.files[$p]=Hash $p
}
Copy-Item -LiteralPath 'D:\AMD\eda-health-0922\power-events.json' -Destination (Join-Path $root 'power-events.json')
Put (Join-Path $root 'comparison-provenance.json') ([ordered]@{source_campaign=$sleepRoot; retained_tasks=$retained; infrastructure_retries=@('Prob004_vector2','Prob020_mt2015_eq2'); user_authorized=$true; policy='retain six complete comparisons; rerun only two sleep-aborted comparisons, then original unstarted order'; files=$comparisonFiles})
$note=Get-Content -LiteralPath (Join-Path $root 'CONTINUATION.zh.md') -Raw
$note=$note.Replace('本批次目录为 `D:/AMD/p100-0922-c2`','本批次目录为 `D:/AMD/p100-0922-c3`')
$note += "`n## 电池睡眠后的恢复`n`n第二比较目录 D:/AMD/p100-0922-c2 的 6 项完整通过结果只读继承，不重复执行。Prob004、Prob020 在 Windows 明确记录的电池睡眠区间中断，旧 ABORTED 结果保留，仅这两项按基础设施恢复重跑。之后继续原顺序尚未启动的 82 项。Windows 电源事件见 power-events.json，完整继承哈希见 comparison-provenance.json。`n`n用户确认已接电源，并授权本轮运行期间临时防自动睡眠。run-power-resume.ps1 使用 PowerCreateRequest / PowerSetRequest(SystemRequired)，开始前检查交流供电，结束时在 finally 中清除并关闭句柄，不修改永久电源计划，不阻止手动合盖/睡眠或低电量保护。官方 API 说明：https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-powersetrequest 。`n"
$note | Set-Content -LiteralPath (Join-Path $root 'CONTINUATION.zh.md') -Encoding utf8NoBOM
foreach ($file in Get-ChildItem -LiteralPath $root -Recurse -File) { $freeze.files[$file.FullName]=Hash $file.FullName }
$freeze.created_at=[DateTime]::UtcNow.ToString('o')
$freeze.protocol.continuation_of=$priorRoot
$freeze.protocol.initial_generation_reused=$true
$freeze.protocol.synthesis_timeout_ms=600000
$freeze.protocol.verification_total_ms=900000
$freeze.protocol.environment=@{XILINX_LOCAL_USER_DATA='no'}
$freeze.protocol.comparison_workers=2
$freeze.protocol.sleep_interruption_recovery=@{prior=$sleepRoot; retained_comparisons=6; infrastructure_retry_tasks=@('Prob004_vector2','Prob020_mt2015_eq2'); temporary_power_request='SystemRequired'; stable_ac_power_confirmed_by_user=$true}
$freeze.protocol.eda_circuit='stop new work after first execution/evidence block or Common 17-1257; await active worker'
Put (Join-Path $root 'campaign-freeze.json') $freeze
Write-Output "Continuation prepared: $root; $($freeze.files.Count) frozen inputs; 100 inherited results; 111 inherited dispatch tickets; no generation/API calls during preparation."
