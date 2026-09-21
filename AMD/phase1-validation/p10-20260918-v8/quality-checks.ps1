$ErrorActionPreference = 'Stop'
$root = 'D:\AMD\phase1-validation\p10-20260918-v8'
New-Item -ItemType Directory -Force -Path (Join-Path $root 'quality') | Out-Null
Set-Location -LiteralPath 'D:\deepseek-harness'
$checks = @(
  @{ name = 'typecheck'; exe = 'node'; argv = @('node_modules/typescript/bin/tsc','--project','rtl-tools/tsconfig.json','--noEmit') },
  @{ name = 'targeted-lint'; exe = 'node'; argv = @('--import','tsx/esm','scripts/run-oxlint.ts','rtl-tools/src/phase1/p10-dataset.ts','rtl-tools/src/phase1/p10-preflight.ts','rtl-tools/src/phase1/p10-report.ts','rtl-tools/src/phase1/verification.ts','rtl-tools/tests/p10.spec.ts','rtl-tools/tests/phase1-verification.spec.ts') },
  @{ name = 'git-diff-check'; exe = 'git'; argv = @('diff','--check') }
)
$results = @()
foreach ($check in $checks) {
  $log = Join-Path $root ('quality/' + $check.name + '.log')
  $arguments = $check.argv
  & $check.exe @arguments *> $log
  $code = $LASTEXITCODE
  $results += [ordered]@{ name = $check.name; exit_code = $code; executable = $check.exe; args = $arguments; log = $log }
}
$results | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $root 'quality/commands.json') -Encoding utf8
if (@($results | Where-Object { $_.exit_code -ne 0 }).Count -ne 0) { throw 'A quality command failed.' }
