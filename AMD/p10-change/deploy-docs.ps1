$ErrorActionPreference = 'Stop'
$source = 'D:\AMD\p10-change'
$target = 'D:\deepseek-harness'
$paths = @(
  'rtl-tools\phase1\p10\README.md',
  'rtl-tools\phase1\p10\README.zh.md',
  '.agents\notes\implemented\feature\2026-09-18-p10-evaluator-preflight.md',
  '.agents\notes\implemented\feature\2026-09-18-p10-evaluator-preflight.zh.md'
)
foreach ($path in $paths) {
  $from = Join-Path $source $path
  $to = Join-Path $target $path
  if (Test-Path -LiteralPath $to) { throw "Refusing to overwrite existing documentation: $to" }
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $to) | Out-Null
  Copy-Item -LiteralPath $from -Destination $to
}
Write-Output 'Deployed four new P10 documentation files.'
