$ErrorActionPreference = 'Stop'
$harness = 'D:\deepseek-harness'
$root = $PSScriptRoot
$receipt = Join-Path $root 'evidence/implementation-receipt.json'
if (Test-Path -LiteralPath $receipt) { throw 'Receipt exists; do not overwrite a frozen record' }
& git -C $harness diff --quiet
if ($LASTEXITCODE -ne 0) { throw 'Existing tracked source files changed' }
& git -C $harness diff --cached --quiet
if ($LASTEXITCODE -ne 0) { throw 'Unexpected staged changes' }
$files = @(Get-ChildItem -LiteralPath (Join-Path $harness 'rtl-tools/reference'),(Join-Path $harness 'rtl-tools/src/reference') -File -Recurse) + @(Get-Item -LiteralPath (Join-Path $harness 'rtl-tools/tests/reference-task.spec.ts')) + @(Get-ChildItem -LiteralPath (Join-Path $harness '.agents/notes/implemented/feature') -Filter '2026-09-28-rtl-reference-directory-mock.*' -File)
$source = @($files | Sort-Object FullName | ForEach-Object {
    $check = & git -C $harness diff --no-index --check -- NUL $_.FullName 2>&1
    if ($check) { throw ($check -join "`n") }
    [ordered]@{ path = [IO.Path]::GetRelativePath($harness, $_.FullName).Replace('\', '/'); sha256 = (Get-FileHash -LiteralPath $_.FullName).Hash.ToLowerInvariant(); bytes = $_.Length }
})
$package = @(Get-ChildItem -LiteralPath (Join-Path $root 'rtl-alignment-agent') -File | Sort-Object Name | ForEach-Object { [ordered]@{ path = $_.Name; sha256 = (Get-FileHash -LiteralPath $_.FullName).Hash.ToLowerInvariant(); bytes = $_.Length } })
$logs = @(Get-ChildItem -LiteralPath (Join-Path $root 'evidence') -File -Filter '*.log' | Sort-Object Name | ForEach-Object { [ordered]@{ path = $_.Name; sha256 = (Get-FileHash -LiteralPath $_.FullName).Hash.ToLowerInvariant() } })
[ordered]@{
    schema_version = 1
    frozen_on = '2026-09-28'
    harness_commit = (& git -C $harness rev-parse HEAD)
    tracked_source_diff_empty = $true
    changes_uncommitted = $true
    source_files = $source
    package_files = $package
    evidence_logs = $logs
    powershell_smoke = 'smoke-08e0d523a8e249d480de3e5b7ffe1db7/summary.json'
    shell_smoke = 'shell-cf2c7136ad6b4a4fb416f87b2f579c77/summary.json'
    unit_tests_passed = 27
    regression_tests_passed = 175
    typecheck = 'passed'
    focused_lint = 'passed'
    doc_quick = '16 passed'
    doc_sync = '33 passed; 1 failed: Windows file symlink EPERM in unchanged project-doc-site.spec.ts:160'
    real_model_calls = 0
    real_eda_calls = 0
    linux_verified = $false
} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $receipt -Encoding utf8NoBOM
Write-Output "Recorded $($source.Count) source files, $($package.Count) package files and $($logs.Count) logs: $receipt"
