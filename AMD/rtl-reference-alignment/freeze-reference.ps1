param([switch]$Verify)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$zip = Join-Path (Split-Path $root) 'doc/rtlagent2026-master.zip'
$expected = 'c544450c0a41141a9e39b2d1cd7faf3054e3acc27f2588f4f90cc755dbd98c3b'
$reference = Join-Path $root 'reference/c544450c0a41141a/rtlagent2026-master'
$package = Join-Path $root 'rtl-alignment-agent'
$manifest = Join-Path $root 'reference-lock.json'
if ((Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected) { throw 'Reference ZIP hash mismatch' }
$files = @(Get-ChildItem -LiteralPath $reference -File -Recurse -Force | Sort-Object FullName | ForEach-Object {
    [ordered]@{ path = [IO.Path]::GetRelativePath($reference, $_.FullName).Replace('\', '/'); sha256 = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant(); bytes = $_.Length }
})
if ($Verify) {
    $lock = Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json
    if ($lock.zip_sha256 -ne $expected -or $lock.files.Count -ne $files.Count) { throw 'Reference inventory mismatch' }
    foreach ($file in $files) {
        $record = @($lock.files | Where-Object path -CEQ $file.path)
        if ($record.Count -ne 1 -or $record[0].sha256 -ne $file.sha256 -or $record[0].bytes -ne $file.bytes) { throw "Reference changed: $($file.path)" }
    }
} else {
    if (Test-Path -LiteralPath $manifest) { throw 'Lock already exists; use -Verify' }
    New-Item -ItemType Directory -Path $package -Force | Out-Null
    foreach ($name in @('baseline.py', 'run_baseline.sh')) {
        $target = Join-Path $package $name
        if (Test-Path -LiteralPath $target) { throw "Refusing to overwrite $target" }
        Copy-Item -LiteralPath (Join-Path $reference "example/$name") -Destination $target
    }
    [ordered]@{ schema_version = 1; frozen_on = '2026-09-28'; zip = '../doc/rtlagent2026-master.zip'; zip_sha256 = $expected; upstream_commit = $null; reference = 'reference/c544450c0a41141a/rtlagent2026-master'; files = $files } | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $manifest -Encoding utf8NoBOM
}
foreach ($name in @('baseline.py', 'run_baseline.sh')) {
    if ((Get-FileHash -LiteralPath (Join-Path $reference "example/$name")).Hash -ne (Get-FileHash -LiteralPath (Join-Path $package $name)).Hash) { throw "Baseline changed: $name" }
}
Write-Output "Verified ZIP, $($files.Count) reference files and 2 byte-identical baseline files. No model or judge invoked."
