param(
  [Parameter(Mandatory)][string]$HomeDirectory,
  [Parameter(Mandatory)][string]$BaseUrl,
  [Parameter(Mandatory)][string]$Model,
  [Parameter(Mandatory)][string]$Provider,
  [Parameter(Mandatory)][string]$Xvlog,
  [Parameter(Mandatory)][string]$Vivado,
  [string]$ApiKeyEnv = 'RTL_LOCAL_RELAY_KEY',
  [ValidateSet('none', 'deepseek')][string]$ThinkingFormat = 'none',
  [switch]$AllowUnisolatedDevelopment
)
$ErrorActionPreference = 'Stop'
if (!$AllowUnisolatedDevelopment) { throw 'This profile requires explicit -AllowUnisolatedDevelopment; it does not provide OS read isolation.' }
if ($Provider -notmatch '^[a-z][a-z0-9-]*$') { throw 'Provider must be a lowercase route identifier' }
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..')).Replace('\', '/')
$target = Join-Path ([IO.Path]::GetFullPath($HomeDirectory)) 'profiles/rtl-reference-api'
if (Test-Path -LiteralPath $target) { throw "Refusing to overwrite profile: $target" }
$services = [ordered]@{
  llm = 'llm/llm'; session = 'core/session'; projections = 'session/session-projection';
  prompt = 'core/system-prompt'; tools = 'core/tools'; agents = 'core/agent';
  loop = 'core/agent-loop'; subprocess = 'subprocess/subprocess-local'
}
$rows = @()
foreach ($entry in $services.GetEnumerator()) {
  $row = @{ id = $entry.Key; name = "$root/packages/$($entry.Value)/src/index.ts" }
  if ($entry.Key -eq 'loop') { $row.config = @{ agents = @(); maxParallelToolCalls = 1 } }
  if ($entry.Key -eq 'prompt') { $row.config = @{ personaPrefix = ''; includeHarnessIdentity = $false; includeRuntimeContext = $false } }
  $rows += $row
}
$compat = @{ supportsStore = $false; supportsDeveloperRole = $false; supportsReasoningEffort = $false; maxTokensField = 'max_tokens' }
if ($ThinkingFormat -ne 'none') { $compat.thinkingFormat = $ThinkingFormat; $compat.requiresReasoningContentOnAssistantMessages = $true }
$route = @{ api = 'openai-completions'; baseURL = $BaseUrl; compat = $compat; apiKeyEnv = $ApiKeyEnv;
  timeoutMs = 300000; streamIdleTimeoutMs = 300000; retryPolicy = @{ mode = 'normal'; maxRetries = 0 };
  models = @(@{ id = $Model; name = $Model; contextWindow = 32768; maxTokens = 8192; reasoningEfforts = $false; input = @('text') }) }
$rows += @{ id = 'api-provider'; name = "$root/packages/llm/llm-pi-ai/src/index.ts"; config = @{ providers = @{ $Provider = $route } } }
$rows += @{ id = 'rtl-api'; name = "$root/rtl-tools/src/reference/api.ts"; config = @{
  provider = $Provider; model = $Model; maxCalls = 4; maxTokens = 8192; maxRequestBytes = 32768;
  maxResponseBytes = 2097152; temperature = 0; timeoutMs = 480000; allowUnisolatedDevelopment = $true;
  checks = @{ xvlog = $Xvlog; vivado = $Vivado; part = 'xczu3eg-sbva484-1-e'; threads = 2;
    timeoutMs = 120000; graceMs = 1000; maxLogBytes = 1048576; maxLineChars = 400;
    maxReportBytes = 1048576; maxDiagnostics = 5; maxSourceBytes = 65536 }
} }
New-Item -ItemType Directory -Path $target -Force | Out-Null
'{"name":"rtl-reference-api-profile","private":true,"dependencies":{},"dsh":{"profile":{"bundles":[],"patchReload":"startup"}}}' | Set-Content -LiteralPath (Join-Path $target 'package.json') -Encoding utf8NoBOM
'[]' | Set-Content -LiteralPath (Join-Path $target 'cordis.yml') -Encoding utf8NoBOM
ConvertTo-Json -InputObject @(@{ insert = $rows }) -Depth 30 | Set-Content -LiteralPath (Join-Path $target 'cordis.patch.yml') -Encoding utf8NoBOM
Write-Output "Installed API development profile at $target"
