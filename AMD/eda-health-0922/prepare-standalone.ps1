$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot 'standalone'
if (Test-Path -LiteralPath $root) { throw 'HEALTH_ALREADY_PREPARED' }
New-Item -ItemType Directory -Path $root | Out-Null
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'base\plan.json') -Destination (Join-Path $root 'plan.json')
foreach ($name in @('health.patch.yml', 'settings.yaml')) {
    $text = Get-Content -LiteralPath (Join-Path $PSScriptRoot "base\$name") -Raw
    $text = $text.Replace('eda-health-0922/base', 'eda-health-0922/standalone').Replace('eda-health-0922/health.mjs', 'eda-health-0922/health-standalone.mjs')
    $text | Set-Content -LiteralPath (Join-Path $root $name) -Encoding utf8NoBOM
}
$prior = Get-Content -LiteralPath 'D:\AMD\phase1-validation\p10-repair-v3-100-full-trace-20260922-v2\campaign-freeze.json' -Raw | ConvertFrom-Json -AsHashtable
$files = [ordered]@{}
foreach ($path in $prior.files.Keys) {
    if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() -ne $prior.files[$path]) { throw "FROZEN_INPUT_CHANGED: $path" }
    $files[$path] = $prior.files[$path]
}
foreach ($path in @((Join-Path $PSScriptRoot 'health-standalone.mjs'), (Join-Path $root 'settings.yaml'), (Join-Path $root 'health.patch.yml'), (Join-Path $root 'plan.json'))) {
    $files[$path] = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
}
[ordered]@{ purpose='model-free standalone reference controls; top-module name mechanically normalized'; diagnostic_synthesis_ms=600000; workers=1; environment_override=$null; files=$files } | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $root 'freeze.json') -Encoding utf8NoBOM
