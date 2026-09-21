$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$profile = Join-Path $root 'dsh-home\profiles\rtl-p10-suite'
New-Item -ItemType Directory -Path $profile | Out-Null
foreach ($name in @('package.json', 'cordis.yml', 'cordis.patch.yml')) {
    Copy-Item -LiteralPath (Join-Path $repo "rtl-tools\phase1\profiles\rtl-p10-preflight\$name") -Destination (Join-Path $profile $name)
}
$copy = Join-Path $root 'frozen-source'
New-Item -ItemType Directory -Path $copy | Out-Null
$files = [ordered]@{}
foreach ($folder in @("$repo\rtl-tools\src", "$repo\packages\subprocess\subprocess-local\src", "$repo\packages\subprocess\subprocess\src", $profile)) {
    foreach ($file in Get-ChildItem -LiteralPath $folder -Recurse -File) {
        $hash = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        $files[$file.FullName] = $hash
        if (-not (Test-Path -LiteralPath (Join-Path $copy $hash))) { Copy-Item -LiteralPath $file.FullName -Destination (Join-Path $copy $hash) }
    }
}
$fixed = 'D:\AMD\phase1-validation\p10-20260918-v8\pilot-10\manifest\p10-manifest-10.json'
foreach ($path in @("$repo\pnpm-lock.yaml", "$repo\rtl-tools\phase1\configs\dev.yaml", "$root\prepare.ps1", "$root\preflight.patch.yml", "$root\freeze-suite.ps1", $fixed)) {
    $files[$path] = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
}
$protected = [ordered]@{}
foreach ($folder in @("$repo\rtl-tools\phase1\profiles\rtl-p10-model", "$repo\rtl-tools\phase1\p09", "$repo\rtl-tools\phase1\configs", "$repo\rtl-tools\skills")) {
    if (Test-Path -LiteralPath $folder) {
        foreach ($file in Get-ChildItem -LiteralPath $folder -Recurse -File) { $protected[$file.FullName] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
    }
}
$history = [ordered]@{}
foreach ($folder in @('D:\AMD\phase1-validation\p10-20260918-v8', 'D:\AMD\phase1-validation\p10-compat-model-v4')) {
    foreach ($file in Get-ChildItem -LiteralPath $folder -Recurse -File) { $history[$file.FullName] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
}
$freeze = [ordered]@{ schema_version = 'p10-full-suite-freeze-1'; build_epoch = [DateTime]::UtcNow.ToString('yyyy-MM-ddTHH:mm:ss.fffZ'); fixed_manifest = $fixed; files = $files; protected = $protected; historical = $history }
$out = Join-Path $root 'freeze.json'
if (Test-Path -LiteralPath $out) { throw 'FREEZE_EXISTS' }
[IO.File]::WriteAllText($out, ($freeze | ConvertTo-Json -Depth 10), [Text.UTF8Encoding]::new($false))
Write-Output "Frozen source files: $($files.Count); protected config files: $($protected.Count); historical files: $($history.Count)"
