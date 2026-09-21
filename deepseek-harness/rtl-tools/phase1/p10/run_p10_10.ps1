param(
    [string]$CampaignRoot = 'D:\AMD\phase1-validation\p10-agent-rerun-10-20260920-v1',
    [ValidateSet('prepare','preflight','seal','smoke','model','audit','all')][string]$Stage = 'all'
)
$ErrorActionPreference = 'Stop'
$manifest = 'D:\AMD\phase1-validation\p10-20260918-v8\pilot-10\manifest\p10-manifest-10.json'
$expected = '02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742'
if ((Get-FileHash -LiteralPath $manifest -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) { throw 'P10_FIXED_MANIFEST_CHANGED' }
$entry = Join-Path $CampaignRoot 'run-stage.ps1'
if (-not (Test-Path -LiteralPath $entry)) { throw "P10_CAMPAIGN_ENTRY_NOT_FOUND: $entry" }
Write-Output 'P10_AGENT_IMPLEMENTATION=p10-model.ts'
Write-Output 'LEGACY_COMPARISON_ROUTE=false'
Write-Output "MANIFEST_SHA256=$expected"
Write-Output 'MODEL=deepseek-flash TEMPERATURE=0 REASONING=high OUTPUT_TOKENS=8192 CONTEXT=131072'
Write-Output 'TRANSPORT_RETRY=2 BACKOFF_MS=1000,2000 OUTPUT_RECOVERY=1 REQUEST_TIMEOUT_MS=120000 ACTIVE_MS=1200000 MAX_SEMANTIC_REPAIRS=3'
& $entry -Stage $Stage
