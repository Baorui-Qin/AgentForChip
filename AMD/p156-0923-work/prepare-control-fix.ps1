$ErrorActionPreference = 'Stop'
$parent = 'D:\AMD\p156-0923-cal'
$root = Join-Path $parent 'g3'
New-Item -ItemType Directory -Path $root | Out-Null
foreach ($name in @('catalog.json','evaluator-policy.json')) { Copy-Item -LiteralPath (Join-Path $parent $name) -Destination (Join-Path $root $name) }
New-Item -ItemType Junction -Path (Join-Path $root 'derived') -Target (Join-Path $parent 'derived') | Out-Null
function Put([string]$name, $value) { [IO.File]::WriteAllText((Join-Path $root $name), (ConvertTo-Json -InputObject $value -Depth 80), [Text.UTF8Encoding]::new($false)) }
Put 'selection-order.json' @('Prob001_zero')
Put 'negative-controls.json' @{ Prob001_zero = "module TopModule(output wire zero);`nassign zero = 1'b1;`nendmodule`n" }
$profile = Join-Path $root 'dsh-home/profiles/rtl-p10-preflight'
New-Item -ItemType Directory -Path $profile -Force | Out-Null
foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $parent "g1/dsh-home/profiles/rtl-p10-preflight/$name") -Destination (Join-Path $profile $name) }
$patch = [IO.File]::ReadAllText((Join-Path $parent 'g1/preflight.patch.yml')).Replace('p156-0923-cal/g1','p156-0923-cal/g3').Replace('p156-0923-cal/preflight-freeze.json','p156-0923-cal/g3/freeze.json')
[IO.File]::WriteAllText((Join-Path $root 'preflight.patch.yml'), $patch, [Text.UTF8Encoding]::new($false))
$old = Get-Content -LiteralPath (Join-Path $parent 'preflight-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
$files = [ordered]@{}
foreach ($path in $old.files.Keys) { $files[$path] = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() }
foreach ($file in Get-ChildItem -LiteralPath $root -Recurse -File) { $files[$file.FullName] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
$files[$PSCommandPath] = (Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash.ToLowerInvariant()
Put 'freeze.json' ([ordered]@{ files = $files; selected = 1; model_free = $true; reason = 'Prob001 public specification requires constant LOW; prior constant-zero negative was not faulty. Fresh positive plus constant-one negative, unchanged evaluator.' })
Write-Output 'Prepared independent Prob001 negative-control correction; prior records unchanged.'
