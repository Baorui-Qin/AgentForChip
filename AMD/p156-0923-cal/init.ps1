$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$profile = Join-Path $root 'dsh-home/profiles/rtl-p10-preflight'
New-Item -ItemType Directory -Force -Path $profile | Out-Null
foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $repo "rtl-tools/phase1/profiles/rtl-p10-preflight/$name") -Destination (Join-Path $profile $name) }
$unix = $root.Replace('\','/')
$patch = @"
- id: policy
  config:
    mode: danger-full-access
    workspaceRoot: $unix
- id: preflight
  disabled: true
- insert:
    - id: catalog
      name: '$unix/catalog.mjs'
      config:
        datasetRoot: D:/AMD/verilog-eval
        campaignRoot: $unix
        settingsFile: D:/deepseek-harness/rtl-tools/phase1/configs/dev.yaml
        freezeFile: $unix/preflight-freeze.json
        allowUnisolatedPreflight: true
        compileMs: 60000
        elaborateMs: 60000
        simulationMs: 30000
        totalMs: 900000
        maxArtifactBytes: 268435456
        artifactPollMs: 100
        maxEventBytes: 1048576
"@
if (Test-Path -LiteralPath (Join-Path $root 'catalog.patch.yml')) { throw 'NEW_CATALOG_REQUIRED' }
[IO.File]::WriteAllText((Join-Path $root 'catalog.patch.yml'), $patch, [Text.UTF8Encoding]::new($false))
$env:DSH_HOME = Join-Path $root 'dsh-home'
Push-Location $repo
try { node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-preflight --patch (Join-Path $root 'catalog.patch.yml') catalog; if ($LASTEXITCODE -ne 0) { throw 'CATALOG_FAILED' } }
finally { Pop-Location }
