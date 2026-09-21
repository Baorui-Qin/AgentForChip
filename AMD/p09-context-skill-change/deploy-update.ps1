param([string[]]$Files = @('rtl-tools/src/phase1/p09-proposal.ts'))
$ErrorActionPreference = 'Stop'
$deployedPath = Join-Path $PSScriptRoot 'deployed.json'
$deployed = Get-Content -Raw -LiteralPath $deployedPath | ConvertFrom-Json -AsHashtable
foreach ($file in $Files) {
    if (!$deployed.ContainsKey($file)) { throw 'File is outside the deployed scope.' }
    $target = Join-Path 'D:\deepseek-harness' $file
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $deployed[$file]) { throw "Concurrent change: $file" }
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot $file) -Destination $target
    $deployed[$file] = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
}
$deployed | ConvertTo-Json | Set-Content -LiteralPath $deployedPath -Encoding utf8
