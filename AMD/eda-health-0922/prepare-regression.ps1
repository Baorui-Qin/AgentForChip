$ErrorActionPreference = 'Stop'
$base = Join-Path $PSScriptRoot 'standalone'
$out = Join-Path $PSScriptRoot 'regression'
if (Test-Path -LiteralPath $out) { throw 'HEALTH_ALREADY_PREPARED' }
New-Item -ItemType Directory -Path $out | Out-Null
foreach ($i in 1..2) {
    $root = Join-Path $out "group-$i"
    New-Item -ItemType Directory -Path $root | Out-Null
    Copy-Item -LiteralPath (Join-Path $base 'plan.json') -Destination (Join-Path $root 'plan.json')
    foreach ($name in @('settings.yaml','health.patch.yml')) {
        $text = Get-Content -LiteralPath (Join-Path $base $name) -Raw
        $text.Replace('eda-health-0922/standalone', "eda-health-0922/regression/group-$i") | Set-Content -LiteralPath (Join-Path $root $name) -Encoding utf8NoBOM
    }
    $prior = Get-Content -LiteralPath 'D:\AMD\phase1-validation\p10-repair-v3-100-full-trace-20260922-v2\campaign-freeze.json' -Raw | ConvertFrom-Json -AsHashtable
    $files = [ordered]@{}
    foreach ($path in $prior.files.Keys) {
        if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() -ne $prior.files[$path]) { throw "FROZEN_INPUT_CHANGED: $path" }
        $files[$path] = $prior.files[$path]
    }
    foreach ($path in @((Join-Path $PSScriptRoot 'health-standalone.mjs'), (Join-Path $root 'settings.yaml'), (Join-Path $root 'health.patch.yml'), (Join-Path $root 'plan.json'), (Join-Path $PSScriptRoot 'run-regression.ps1'))) {
        $files[$path] = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
    }
    [ordered]@{ purpose='model-free repeated full EDA health under two concurrent workers'; diagnostic_synthesis_ms=600000; workers=2; environment_override=@{XILINX_LOCAL_USER_DATA='no'}; files=$files } | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $root 'freeze.json') -Encoding utf8NoBOM
}
