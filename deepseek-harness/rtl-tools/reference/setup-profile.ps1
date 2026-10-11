param([Parameter(Mandatory)][string]$HomeDirectory)
$ErrorActionPreference = 'Stop'
$target = Join-Path ([IO.Path]::GetFullPath($HomeDirectory)) 'profiles/rtl-reference'
if (Test-Path -LiteralPath $target) { throw "Refusing to overwrite profile: $target" }
$plugin = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../src/reference/index.ts')).Replace('\', '/')
$patch = @"
- insert:
    - id: rtl-reference
      name: '$($plugin.Replace("'", "''"))'
      config:
        backend: !!js process.env.LLM_BACKEND
        outcome: !!js process.env.RTL_MOCK_OUTCOME || 'stub'
        timeoutMs: !!js Number(process.env.RTL_TIMEOUT_MS || 30000)
"@
New-Item -ItemType Directory -Path $target -Force | Out-Null
'{"name":"rtl-reference-profile","private":true,"dependencies":{},"dsh":{"profile":{"bundles":[],"patchReload":"startup"}}}' | Set-Content -LiteralPath (Join-Path $target 'package.json') -Encoding utf8NoBOM
'[]' | Set-Content -LiteralPath (Join-Path $target 'cordis.yml') -Encoding utf8NoBOM
$patch.Replace("`r`n", "`n") | Set-Content -LiteralPath (Join-Path $target 'cordis.patch.yml') -Encoding utf8NoBOM
Write-Output "Installed explicit mock profile at $target"
