$ErrorActionPreference = 'Stop'
$stage = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$baseline = Get-Content -Raw -LiteralPath (Join-Path $stage 'baseline.json') | ConvertFrom-Json -AsHashtable
$files = @($baseline.Keys | Where-Object { $_ -notlike '*.i18n.yaml' }) + @('rtl-tools/tests/p09-skills.spec.ts')
foreach ($file in $files) {
    $target = Join-Path $repo $file
    if ($baseline.ContainsKey($file)) {
        if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $baseline[$file]) { throw "Concurrent change: $file" }
    } elseif (Test-Path -LiteralPath $target) { throw "Unexpected existing file: $file" }
}
$deployed = @{}
foreach ($file in $files) {
    Copy-Item -LiteralPath (Join-Path $stage $file) -Destination (Join-Path $repo $file)
    $deployed[$file] = (Get-FileHash -LiteralPath (Join-Path $repo $file) -Algorithm SHA256).Hash
}
$deployed | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $stage 'deployed.json') -Encoding utf8
Write-Output "Deployed $($files.Count) scoped files; unrelated files untouched."
