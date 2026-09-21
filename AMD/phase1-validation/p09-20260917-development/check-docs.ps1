$ErrorActionPreference = 'Stop'
$checks = @(
  @{ name = 'translation-pairing'; args = @('scripts/verify-translation-pairing.ts', 'rtl-tools/README.md', 'rtl-tools/phase1/p09/README.md', '.agents/notes/implemented/feature/2026-09-13-rtl-simulation-tool.md') },
  @{ name = 'markdown-wrap'; args = @('scripts/verify-md-wrap.ts') },
  @{ name = 'markdown-links'; args = @('scripts/verify-md-links.ts') },
  @{ name = 'agent-note-format'; args = @('scripts/verify-agent-note-format.ts') },
  @{ name = 'agent-note-classification'; args = @('scripts/verify-agent-note-classification.ts') },
  @{ name = 'tsconfig-paths'; args = @('scripts/gen-tsconfig-paths.ts', '--check') }
)
$results = @()
foreach ($check in $checks) {
  $arguments = @('--import', 'tsx/esm') + $check.args
  $output = @(& node @arguments 2>&1)
  $code = $LASTEXITCODE
  $results += @{ name = $check.name; exit_code = $code; output = ($output -join "`n") }
  Write-Output "$($check.name): exit=$code"
}
$results | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'documentation-checks.json') -Encoding utf8
