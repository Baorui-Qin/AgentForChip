$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$run = Join-Path $root ('evidence/shell-' + [Guid]::NewGuid().ToString('N'))
$reference = Join-Path $root 'reference/c544450c0a41141a/rtlagent2026-master'
$bash = 'C:\Program Files\Git\bin\bash.exe'
if (!(Test-Path -LiteralPath $bash)) { throw 'This check requires the installed Windows Git Bash; it is not Linux acceptance' }
$env:DSH_HARNESS_ROOT = 'D:/deepseek-harness'
$env:DSH_HOME = (Join-Path $root 'runtime-home').Replace('\', '/')
$env:LLM_BACKEND = 'mock'
$env:RTL_MOCK_OUTCOME = 'stub'
$env:RTL_TIMEOUT_MS = '30000'
$entry = (Join-Path $root 'rtl-alignment-agent/run.sh').Replace('\', '/')
New-Item -ItemType Directory -Path $run -Force | Out-Null
$records = @()
foreach ($id in @('ex01_popcount8', 'ex02_detect_1101', 'ex03_lfsr8')) {
    $task = Join-Path $run "input with spaces/$id"
    $out = Join-Path $run "output with spaces/$id"
    New-Item -ItemType Directory -Path $task -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $reference "tasks/$id/prompt.txt") -Destination (Join-Path $task 'prompt.txt')
    & $bash $entry $task.Replace('\', '/') $out.Replace('\', '/') 2>&1 | Set-Content -LiteralPath (Join-Path $run "$id.log") -Encoding utf8NoBOM
    if ($LASTEXITCODE -ne 0) { throw "Shell entry failed: $id" }
    $events = @(Get-Content -LiteralPath (Join-Path $out 'trace.jsonl') | ForEach-Object { $_ | ConvertFrom-Json })
    if ($events[-1].status -ne 'mock_candidate' -or $events[-1].real_model_calls -ne 0) { throw "Shell output mismatch: $id" }
    $records += [ordered]@{ task = $id; status = $events[-1].status; exit_code = 0; work_dir = $events[0].work_dir }
    Write-Output "PASS run.sh $id"
}
& $bash '-n' $entry
if ($LASTEXITCODE -ne 0) { throw 'Package shell syntax check failed' }
& $bash '-n' 'D:/deepseek-harness/rtl-tools/reference/run.sh'
if ($LASTEXITCODE -ne 0) { throw 'Harness shell syntax check failed' }
[ordered]@{ evidence = 'explicit_mock_protocol_only'; platform = 'Windows Git Bash'; linux_verified = $false; real_model_calls = 0; cases = $records } | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $run 'summary.json') -Encoding utf8NoBOM
Write-Output "Evidence: $run"
