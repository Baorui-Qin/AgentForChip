$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$smoke = Join-Path $root 'smoke'
function Hash([string]$path) { (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$path, $value) { if (Test-Path -LiteralPath $path) { throw "OUTPUT_EXISTS: $path" }; [IO.File]::WriteAllText($path, ($value | ConvertTo-Json -Depth 50), [Text.UTF8Encoding]::new($false)) }
$preflight = Get-Content -LiteralPath (Join-Path $root 'preflight-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
foreach ($entry in $preflight.files.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "CAMPAIGN_SOURCE_CHANGED: $($entry.Key)" } }
$calibration = Get-Content -LiteralPath (Join-Path $root 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json
if ($calibration.Count -ne 10 -or @($calibration | Where-Object { -not $_.evaluable }).Count) { throw 'SMOKE_REQUIRES_COMPLETE_PREFLIGHT' }
$files = [ordered]@{}
foreach ($entry in $preflight.files.GetEnumerator()) { $files[$entry.Key] = $entry.Value }
$preflightResult = Join-Path $root 'compat-positive-negative-results.json'; $files[$preflightResult] = Hash $preflightResult
Put (Join-Path $smoke 'freeze.json') ([ordered]@{ schema_version = 'p10-smoke-freeze-1'; created_at = [DateTime]::UtcNow.ToString('o'); files = $files; protocol = $preflight.protocol })
$env:DSH_HOME = Join-Path $root 'dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
Set-Location -LiteralPath 'D:\deepseek-harness'
& node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-model --patch (Join-Path $root 'smoke.patch.yml') repair-control Prob005_notgate
if ($LASTEXITCODE -ne 0) { throw 'P10_SMOKE_HOST_FAILED' }
$path = Join-Path $smoke 'repair-control-Prob005_notgate\result.json'
$result = Get-Content -LiteralPath $path -Raw | ConvertFrom-Json
$valid = @($result.repair_attempts | Where-Object { $_.valid -and $_.edit.source_sha_changed -and $_.verification.persisted })
if ($result.status -ne 'VERIFIED' -or $valid.Count -lt 1 -or -not $result.edit_accepted -or -not $result.reverified -or
    $result.final_exported_sha256 -ne $result.verified_source_sha256) { throw 'P10_SMOKE_REPAIR_CHAIN_FAILED' }
Put (Join-Path $root 'smoke-accepted.json') ([ordered]@{ task_id = $result.task_id; result = $path; result_sha256 = Hash $path;
    accepted_edit = $true; source_sha_changed = $true; reverified = $true; vivado_result_persisted = $true; export_matches_verified = $true; valid_attempts = $valid.Count })
Write-Output "Smoke accepted: valid_attempts=$($valid.Count) final_sha=$($result.final_exported_sha256)"

