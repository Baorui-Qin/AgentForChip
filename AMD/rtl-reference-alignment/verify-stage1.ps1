param([string]$HarnessRoot = 'D:\deepseek-harness')
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$run = Join-Path $root ('evidence/smoke-' + [Guid]::NewGuid().ToString('N'))
$reference = Join-Path $root 'reference/c544450c0a41141a/rtlagent2026-master'
$env:DSH_HARNESS_ROOT = $HarnessRoot
$env:DSH_HOME = Join-Path $run 'home'
$env:LLM_BACKEND = 'mock'
$env:RTL_TIMEOUT_MS = '30000'
$entry = Join-Path $root 'rtl-alignment-agent/run.ps1'
New-Item -ItemType Directory -Path $run -Force | Out-Null
& pwsh -NoProfile -File (Join-Path $HarnessRoot 'rtl-tools/reference/setup-profile.ps1') -HomeDirectory $env:DSH_HOME
if ($LASTEXITCODE -ne 0) { throw 'Profile setup failed' }
$records = [Collections.Generic.List[object]]::new()
function Invoke-Case([string]$Name, [string[]]$Arguments, [string]$Outcome, [int]$ExpectedExit, [string]$ExpectedStatus) {
    $env:RTL_MOCK_OUTCOME = $Outcome
    $start = [Diagnostics.Stopwatch]::StartNew()
    $lines = & pwsh -NoProfile -File $entry @Arguments 2>&1
    $code = $LASTEXITCODE
    $lines | Set-Content -LiteralPath (Join-Path $run "$Name.log") -Encoding utf8NoBOM
    if ($code -ne $ExpectedExit) { throw "$Name exit $code != $ExpectedExit; see log" }
    $terminal = $null
    if ($ExpectedStatus) {
        $out = $Arguments[1]
        $events = @(Get-Content -LiteralPath (Join-Path $out 'trace.jsonl') | ForEach-Object { $_ | ConvertFrom-Json })
        $terminal = $events[-1]
        if ($terminal.status -ne $ExpectedStatus -or $terminal.graded -ne $false -or $terminal.real_model_calls -ne 0) { throw "$Name terminal mismatch" }
        $solution = Get-Content -LiteralPath (Join-Path $out 'solution.v') -Raw
        if ($ExpectedStatus -eq 'mock_candidate') {
            if (!$solution.Contains('EXPLICIT MOCK')) { throw "$Name missing mock marker" }
        } elseif ($solution) { throw "$Name should have an empty solution" }
        $work = $events[0].work_dir
        foreach ($file in @('solution.v', 'trace.jsonl')) {
            if ((Get-FileHash -LiteralPath (Join-Path $out $file)).Hash -ne (Get-FileHash -LiteralPath (Join-Path $work $file)).Hash) { throw "$Name evidence copy differs" }
        }
    }
    $records.Add([ordered]@{ case = $Name; exit_code = $code; status = $terminal.status; process_elapsed_s = $start.Elapsed.TotalSeconds; arguments = $Arguments; real_model_calls = 0 })
    Write-Output "PASS $Name"
}
Push-Location $run
try {
    $tasks = @('ex01_popcount8', 'ex02_detect_1101', 'ex03_lfsr8')
    foreach ($id in $tasks) {
        $task = Join-Path $run "input with spaces/$id"
        New-Item -ItemType Directory -Path $task -Force | Out-Null
        Copy-Item -LiteralPath (Join-Path $reference "tasks/$id/prompt.txt") -Destination (Join-Path $task 'prompt.txt')
        if ($id -eq 'ex01_popcount8') { [IO.File]::WriteAllText((Join-Path $task 'interface.txt'), '') }
        Invoke-Case $id @("./input with spaces/$id", "./output with spaces/$id") 'stub' 0 'mock_candidate'
    }
    $task = './input with spaces/ex01_popcount8'
    Invoke-Case 'repeat-task' @($task, './repeat output') 'stub' 0 'mock_candidate'
    Invoke-Case 'empty' @($task, './empty output') 'empty' 0 'empty_answer'
    Invoke-Case 'internal-error' @($task, './error output') 'error' 1 'internal_error'
    $env:RTL_TIMEOUT_MS = '100'
    Invoke-Case 'timeout' @($task, './timeout output') 'timeout' 124 'timeout'
    $env:RTL_TIMEOUT_MS = '30000'
    Invoke-Case 'missing-argument' @($task) 'stub' 2 ''
    Invoke-Case 'extra-argument' @($task, './never output', 'unexpected') 'stub' 2 ''
    $old = (Get-FileHash -LiteralPath './repeat output/trace.jsonl').Hash
    Invoke-Case 'output-reuse' @($task, './repeat output') 'stub' 2 ''
    if ((Get-FileHash -LiteralPath './repeat output/trace.jsonl').Hash -ne $old) { throw 'Existing evidence changed' }
    $env:LLM_BACKEND = 'openai'
    Invoke-Case 'real-backend-refused' @($task, './not real output') 'stub' 2 ''
    $env:LLM_BACKEND = 'mock'
    [ordered]@{ evidence = 'explicit_mock_protocol_only'; harness_commit = (& git -C $HarnessRoot rev-parse HEAD); real_model_calls = 0; eda_calls = 0; cases = $records; linux_verified = $false } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $run 'summary.json') -Encoding utf8NoBOM
} finally { Pop-Location }
Write-Output "Evidence: $run"
