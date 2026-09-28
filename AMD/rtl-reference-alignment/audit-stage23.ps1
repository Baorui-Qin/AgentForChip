param([string]$RunName = 'stage23-api-20260928-v1')
$ErrorActionPreference = 'Stop'
if ($RunName -notmatch '^stage23-api-[a-z0-9-]+$') { throw 'Invalid run name' }
$root = Join-Path $PSScriptRoot "evidence/$RunName"
$target = Join-Path $root 'api-audit.json'
if (Test-Path -LiteralPath $target) { throw 'Audit already exists; do not overwrite frozen evidence' }
$baselinePath = Join-Path $PSScriptRoot 'rtl-alignment-agent/baseline.py'
$expectedBaseline = '537783e39db22079c33c19af475dbdb760a29ff1656a48c481d434131f84fb51'
if ((Get-FileHash -LiteralPath $baselinePath).Hash.ToLowerInvariant() -ne $expectedBaseline) { throw 'Original baseline changed' }
$calls = @()
foreach ($folder in @('relay','relay-v2')) {
  $directory = Join-Path $root $folder
  $ledger = @(Get-Content -LiteralPath (Join-Path $directory 'ledger.jsonl') | ForEach-Object { $_ | ConvertFrom-Json })
  foreach ($entry in @($ledger | Where-Object kind -eq request)) {
    $requestPath = Join-Path $directory "request-$($entry.call).json"
    $request = Get-Content -LiteralPath $requestPath -Raw | ConvertFrom-Json
    $responsePath = Join-Path $directory "response-$($entry.call).txt"
    $usage = $null
    if (Test-Path -LiteralPath $responsePath) {
      if ($request.stream) {
        foreach ($line in Get-Content -LiteralPath $responsePath -Encoding UTF8) {
          if ($line.StartsWith('data: ') -and $line -ne 'data: [DONE]') {
            $item = $line.Substring(6) | ConvertFrom-Json
            if ($item.usage) { $usage = $item.usage }
          }
        }
      } else { $usage = (Get-Content -LiteralPath $responsePath -Raw -Encoding UTF8 | ConvertFrom-Json).usage }
    }
    $isAgent = [bool]$request.tools
    if ($isAgent) {
      if ($request.tools.Count -ne 1 -or $request.tools[0].function.name -ne 'check_rtl') { throw 'Unexpected Agent tool' }
    } else {
      if ($request.messages.Count -ne 2 -or $request.temperature -ne 0 -or $request.top_p -ne 1 -or $request.max_tokens -ne 8192) { throw 'Baseline request mismatch' }
    }
    if ($usage -and ($usage.prompt_tokens -gt 131072 -or $usage.completion_tokens -gt 8192)) { throw 'Usage exceeds frozen reservation envelope' }
    $calls += [ordered]@{ ledger=$folder; call=$entry.call; at=$entry.at; mode=$(if ($isAgent) {'agent'} else {'baseline'});
      model=$request.model; request_sha256=(Get-FileHash -LiteralPath $requestPath).Hash.ToLowerInvariant();
      status=($ledger | Where-Object { $_.kind -eq 'response' -and $_.call -eq $entry.call }).status; usage=$usage }
  }
}
if ($calls.Count -gt 15) { throw 'Generation budget exceeded' }
$tasks = foreach ($task in @('ex01_popcount8','ex02_detect_1101','ex03_lfsr8')) {
  $agentDirectory = Join-Path $root "agent-v3/$task"
  $baselineDirectory = Join-Path $root "baseline-v2/$task"
  $trace = @(Get-Content -LiteralPath (Join-Path $agentDirectory 'trace.jsonl') | ForEach-Object { $_ | ConvertFrom-Json })
  $baseline = @(Get-Content -LiteralPath (Join-Path $baselineDirectory 'trace.jsonl') | ForEach-Object { $_ | ConvertFrom-Json })
  $result = $trace | Where-Object tool -eq result
  $checks = @($trace | Where-Object tool -eq dut_check)
  if ($result.status -ne 'candidate_ungraded' -or $result.graded -ne $false -or $checks.Count -lt 1) { throw "Agent result incomplete: $task" }
  if ($baseline.Count -ne 2 -or $baseline[0].script_sha256 -ne $expectedBaseline -or $baseline[0].served_model -ne 'deepseek-flash' -or $baseline[-1].finish -ne 'stop' -or $baseline[-1].empty_content) { throw "Baseline result incomplete: $task" }
  [ordered]@{ task=$task; agent_status=$result.status; agent_seconds=$result.elapsed_s; agent_model_attempts=$result.model_call_attempts;
    checks=@($checks | Select-Object syntax,synthesis,graded); baseline_seconds=$baseline[-1].sec;
    agent_solution_sha256=(Get-FileHash -LiteralPath (Join-Path $agentDirectory 'solution.v')).Hash.ToLowerInvariant();
    baseline_solution_sha256=(Get-FileHash -LiteralPath (Join-Path $baselineDirectory 'solution.v')).Hash.ToLowerInvariant() }
}
$inputTokens = ($calls | Where-Object usage | ForEach-Object { $_.usage.prompt_tokens } | Measure-Object -Sum).Sum
$outputTokens = ($calls | Where-Object usage | ForEach-Object { $_.usage.completion_tokens } | Measure-Object -Sum).Sum
$audit = [ordered]@{ status='api_development_smoke_complete_not_contest_acceptance'; model='deepseek-flash';
  baseline_sha256=$expectedBaseline; physical_dispatch_attempts=$calls.Count; successful_dispatches=@($calls | Where-Object status -eq 200).Count;
  unknown_usage_dispatches=@($calls | Where-Object { !$_.usage }).Count; prompt_tokens=$inputTokens; completion_tokens=$outputTokens;
  reserved_cny=$calls.Count*0.5; conservative_known_usage_cny=($inputTokens*3+$outputTokens*12)/1000000;
  cost_is_invoice=$false; first_dispatch=$calls[0].at; last_dispatch=$calls[-1].at; calls=$calls; tasks=@($tasks);
  bootstrap_failures=@('agent: local adapter had no placeholder key, no upstream dispatch', 'agent-v2: one upstream fetch failure, charged to budget', 'baseline: localhost proxy failure, never reached relay');
  isolation='capability_only'; local_qwen_verified=$false; gpu_peak_vram_gb=$null; external_judge_run=$false; score_claim=$false }
$audit | ConvertTo-Json -Depth 25 | Set-Content -LiteralPath $target -Encoding utf8NoBOM
$source = 'D:/deepseek-harness'
$snapshot = Join-Path $root 'source-api-success'
$files = @('rtl-tools/src/interface.ts','rtl-tools/src/phase1/candidates.ts')
$files += @(Get-ChildItem -LiteralPath "$source/rtl-tools/src/reference" -File | ForEach-Object { "rtl-tools/src/reference/$($_.Name)" })
$hashes = foreach ($file in $files) {
  $to = Join-Path $snapshot $file
  New-Item -ItemType Directory -Path (Split-Path $to) -Force | Out-Null
  Copy-Item -LiteralPath (Join-Path $source $file) -Destination $to
  @{ path=$file; sha256=(Get-FileHash -LiteralPath $to).Hash.ToLowerInvariant() }
}
ConvertTo-Json -InputObject @($hashes) -Depth 6 | Set-Content -LiteralPath (Join-Path $root 'source-api-success-hashes.json') -Encoding utf8NoBOM
[pscustomobject]$audit | Select-Object status,physical_dispatch_attempts,successful_dispatches,unknown_usage_dispatches,prompt_tokens,completion_tokens,reserved_cny,conservative_known_usage_cny | ConvertTo-Json
