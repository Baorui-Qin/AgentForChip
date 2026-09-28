param([string]$RunName = 'stage23-api-20260928-v1')
$ErrorActionPreference = 'Stop'
if ($RunName -notmatch '^stage23-api-[a-z0-9-]+$') { throw 'Invalid run name' }
$root = Join-Path $PSScriptRoot "evidence/$RunName"
if (Test-Path -LiteralPath $root) { throw "Refusing to overwrite $root" }
$runtimeHome = Join-Path $root 'home'
New-Item -ItemType Directory -Path $root | Out-Null
$source = 'D:/deepseek-harness'
& pwsh -NoProfile -File "$source/rtl-tools/reference/setup-api-profile.ps1" -HomeDirectory $runtimeHome -BaseUrl 'http://127.0.0.1:18891/v1' -Provider 'rtl-api' -Model 'deepseek-flash' -ThinkingFormat deepseek -Xvlog 'D:/AMDDesignTools/2025.2/Vivado/bin/xvlog.bat' -Vivado 'D:/AMDDesignTools/2025.2/Vivado/bin/vivado.bat' -AllowUnisolatedDevelopment
if ($LASTEXITCODE) { throw 'Profile setup failed' }
$relay = Join-Path $runtimeHome 'profiles/rtl-reference-relay'
New-Item -ItemType Directory -Path $relay -Force | Out-Null
'{"name":"rtl-reference-relay-profile","private":true,"dependencies":{},"dsh":{"profile":{"bundles":[],"patchReload":"startup"}}}' | Set-Content -LiteralPath (Join-Path $relay 'package.json') -Encoding utf8NoBOM
'[]' | Set-Content -LiteralPath (Join-Path $relay 'cordis.yml') -Encoding utf8NoBOM
$rows = @(
  @{ id = 'credentials'; name = "$source/packages/credentials/credentials-local/src/index.ts"; config = @{ path = 'C:/Users/qbr/.dsh/.credentials.yaml'; watch = $false } },
  @{ id = 'relay'; name = "$source/rtl-tools/src/reference/relay.ts"; config = @{
    baseURL = 'https://api.deepseek.com/v1'; model = 'deepseek-flash'; apiKeyEnv = 'DEEPSEEK_API_KEY'; port = 18891;
    directory = (Join-Path $root 'relay').Replace('\', '/'); maxCalls = 15; durationMs = 1800000; requestTimeoutMs = 300000;
    maxRequestBytes = 32768; maxTokens = 8192; maxCny = 10; reserveCnyPerCall = 0.5
  } }
)
ConvertTo-Json -InputObject @(@{ insert = $rows }) -Depth 20 | Set-Content -LiteralPath (Join-Path $relay 'cordis.patch.yml') -Encoding utf8NoBOM
$reference = Join-Path $PSScriptRoot 'reference/c544450c0a41141a/rtlagent2026-master/tasks'
$tasks = @()
foreach ($name in @('ex01_popcount8', 'ex02_detect_1101', 'ex03_lfsr8')) {
  $target = Join-Path $root "inputs/$name"
  New-Item -ItemType Directory -Path $target -Force | Out-Null
  Copy-Item -LiteralPath (Join-Path $reference "$name/prompt.txt") -Destination (Join-Path $target 'prompt.txt')
  $tasks += @{ name = $name; prompt_sha256 = (Get-FileHash -LiteralPath (Join-Path $target 'prompt.txt')).Hash.ToLowerInvariant() }
}
$freeze = @{
  status = 'frozen_before_inference'; authorized = 'User approved existing DeepSeek API, <=15 generations, <=30 minutes, <=CNY 10';
  model = 'deepseek-flash'; provider = 'rtl-api'; upstream = 'https://api.deepseek.com/v1'; endpoint = 'http://127.0.0.1:18891/v1';
  max_calls = 15; agent_calls_per_task = 4; baseline_calls_per_task = 1; total_ms = 1800000; max_tokens_per_call = 8192;
  max_request_bytes = 32768; reserve_cny_per_call = 0.5; max_cny = 10; automatic_retries = 0;
  cost_basis = 'Conservative reservation, not an invoice: <=131072 input tokens at CNY 3/M plus <=8192 output at CNY 12/M is <=0.49152; 32KiB text-only request cap. No claim of exact tokenizer calibration.';
  price_source = 'https://api-docs.deepseek.com/quick_start/pricing/'; isolation = 'capability_only';
  baseline_sha256 = (Get-FileHash -LiteralPath (Join-Path $PSScriptRoot 'rtl-alignment-agent/baseline.py')).Hash.ToLowerInvariant(); tasks = $tasks
}
$freeze | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath (Join-Path $root 'freeze.json') -Encoding utf8NoBOM
Write-Output $root
