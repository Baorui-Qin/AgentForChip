$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
function Hash([string]$path) { (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() }
function HashText([string]$text) { $sha = [Security.Cryptography.SHA256]::Create(); try { ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($text)))).Replace('-', '').ToLowerInvariant() } finally { $sha.Dispose() } }
if (Test-Path -LiteralPath (Join-Path $root 'campaign-freeze.json')) { throw 'CAMPAIGN_ALREADY_SEALED' }
$preflight = Get-Content -LiteralPath (Join-Path $root 'preflight-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
foreach ($entry in $preflight.files.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "CAMPAIGN_SOURCE_CHANGED: $($entry.Key)" } }
$rows = Get-Content -LiteralPath (Join-Path $root 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json
if ($rows.Count -ne 10) { throw 'PREFLIGHT_INCOMPLETE' }
if (-not (Test-Path -LiteralPath (Join-Path $root 'smoke-accepted.json'))) { throw 'SMOKE_NOT_ACCEPTED' }
$version = & 'D:\AMDDesignTools\2025.2\Vivado\bin\vivado.bat' -version 2>&1 | Out-String
if ($LASTEXITCODE -notin @(0, 1) -or $version -notmatch 'Vivado v2025\.2') { throw 'VIVADO_VERSION_MISMATCH' }
$files = [ordered]@{}
foreach ($entry in $preflight.files.GetEnumerator()) { $files[$entry.Key] = $entry.Value }
foreach ($file in @((Join-Path $root 'compat-positive-negative-results.json'), (Join-Path $root 'smoke-accepted.json'))) { $files[$file] = Hash $file }
foreach ($file in Get-ChildItem -LiteralPath (Join-Path $root 'smoke') -Recurse -File) { $files[$file.FullName] = Hash $file.FullName }
$status = git -C $repo status --porcelain=v1 --untracked-files=all | Out-String
$diff = git -C $repo diff --binary HEAD | Out-String
$commit = (git -C $repo rev-parse HEAD).Trim()
$p09 = Get-Content -LiteralPath (Join-Path $root 'p09.json') -Raw | ConvertFrom-Json
$protocol = $preflight.protocol
$freeze = [ordered]@{ schema_version = 'p10-campaign-freeze-2'; created_at = [DateTime]::UtcNow.ToString('o'); git_commit = $commit;
    git_status_sha256 = HashText $status; dirty_diff_sha256 = HashText $diff; dirty_status = @($status.Trim() -split "`r?`n" | Where-Object { $_ });
    files = $files; source_hashes = [ordered]@{ p10_model = Hash (Join-Path $repo 'rtl-tools\src\phase1\p10-model.ts');
      repair_policy = Hash (Join-Path $repo 'rtl-tools\src\phase1\repair-policy.ts'); pending_tool_policy = Hash (Join-Path $repo 'rtl-tools\src\phase1\p09-auto-policy.ts') };
    prompt_hashes = [ordered]@{ p09_context = Hash (Join-Path $repo 'rtl-tools\src\phase1\p09-context.ts'); action_call = Hash (Join-Path $repo 'rtl-tools\src\phase1\p09-action-call.ts') };
    config_hashes = [ordered]@{ model_patch = Hash (Join-Path $root 'model.patch.yml'); p09 = Hash (Join-Path $root 'p09.json'); auto = Hash (Join-Path $root 'auto.json') };
    skill = [ordered]@{ file = $p09.skillsFile; sha256 = $p09.skillsSha256 }; manifest_sha256 = $protocol.fixed_manifest_sha256;
    evaluator = [ordered]@{ vivado = 'v2025.2'; compatibility_manifest_sha256 = $protocol.compatibility_manifest_sha256; preflight_result_sha256 = Hash (Join-Path $root 'compat-positive-negative-results.json') };
    runtime = [ordered]@{ counter_manifest_sha256 = Hash 'D:\AMD\p09-runtime\manifest.json'; node = (node --version) };
    model_observable = [ordered]@{ model = 'deepseek-flash'; reasoning = 'high'; temperature = 0; output_tokens = 8192; context_tokens = 131072 };
    protocol = $protocol; legacy_comparison_route = 'NOT_USED_FOR_SCORE'; full_os_isolation_verified = $false; counterexample_feedback = 'NOT_IMPLEMENTED' }
[IO.File]::WriteAllText((Join-Path $root 'campaign-freeze.json'), ($freeze | ConvertTo-Json -Depth 50), [Text.UTF8Encoding]::new($false))
Write-Output "Campaign sealed at commit $commit with dirty diff SHA $($freeze.dirty_diff_sha256)."

