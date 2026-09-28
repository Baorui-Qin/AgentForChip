$ErrorActionPreference = 'Stop'
$root = Join-Path $PSScriptRoot 'base'
$source = 'D:\AMD\phase1-validation\p10-repair-v3-100-full-trace-20260922-v2\campaign-freeze.json'
$prior = Get-Content -LiteralPath $source -Raw | ConvertFrom-Json -AsHashtable
$files = [ordered]@{}
foreach ($path in $prior.files.Keys) {
    if ((Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() -ne $prior.files[$path]) { throw "FROZEN_INPUT_CHANGED: $path" }
    $files[$path] = $prior.files[$path]
}
foreach ($path in @((Join-Path $PSScriptRoot 'health.mjs'), (Join-Path $root 'settings.yaml'), (Join-Path $root 'health.patch.yml'), (Join-Path $root 'plan.json'))) {
    $files[$path] = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
}
$freeze = [ordered]@{ purpose='model-free reference controls, full four-stage environment health'; original_synthesis_ms=120000; diagnostic_synthesis_ms=600000; workers=1; environment_override=$null; files=$files }
if (Test-Path -LiteralPath (Join-Path $root 'freeze.json')) { throw 'HEALTH_ALREADY_PREPARED' }
$freeze | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $root 'freeze.json') -Encoding utf8NoBOM
Write-Output "Health inputs sealed: $($files.Count)"
