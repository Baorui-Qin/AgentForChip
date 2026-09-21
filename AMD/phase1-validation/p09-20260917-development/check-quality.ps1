$ErrorActionPreference = 'Stop'
$files = @('rtl-tools/src/phase1/p09-context.ts','rtl-tools/src/phase1/p09-proposal.ts','rtl-tools/src/phase1/p09-tokenizer.ts','rtl-tools/src/phase1/p09-tasks.ts','rtl-tools/src/phase1/p09-report.ts','rtl-tools/src/phase1/repair-workflow.ts','rtl-tools/src/phase1/repair.ts','rtl-tools/src/phase1/repair-report.ts','rtl-tools/src/phase1/model.ts','rtl-tools/src/phase1/recorder.ts','rtl-tools/src/phase1/candidates.ts','rtl-tools/src/phase1/repair-diagnostics.ts','rtl-tools/src/vivado-parser.ts','rtl-tools/src/synthesis.ts','rtl-tools/src/synthesis-output.ts','rtl-tools/tests/p09-context.spec.ts','rtl-tools/tests/p09-report.spec.ts','rtl-tools/tests/repair.spec.ts','rtl-tools/tests/repair-loader.spec.ts','rtl-tools/tests/vivado-parser.spec.ts')
$checks = @(
  @{ name='typecheck'; command='node'; arguments=@('node_modules/typescript/bin/tsc','-p','rtl-tools/tsconfig.json','--noEmit','--incremental','false') },
  @{ name='targeted-lint'; command='node'; arguments=(@('--import','tsx/esm','scripts/run-oxlint.ts') + $files) },
  @{ name='tracked-diff-whitespace'; command='git'; arguments=@('diff','--check') },
  @{ name='paired-documents'; command='node'; arguments=@('--import','tsx/esm','scripts/verify-translation-pairing.ts','rtl-tools/README.md','rtl-tools/phase1/p09/README.md','.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.md') }
)
$results=@()
foreach ($check in $checks) {
  $output=@(& $check.command @($check.arguments) 2>&1)
  $code=$LASTEXITCODE
  $results+=@{ name=$check.name; exit_code=$code; output=($output -join "`n") }
  Write-Output "$($check.name): exit=$code"
}
$results | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'quality-checks.json') -Encoding utf8
