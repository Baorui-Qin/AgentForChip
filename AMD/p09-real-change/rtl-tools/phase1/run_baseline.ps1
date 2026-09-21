param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)
$ErrorActionPreference = 'Stop'
if (-not $env:DSH_HOME) { $env:DSH_HOME = 'D:\AMD\p05-home' }
Push-Location (Join-Path $PSScriptRoot '../..')
try { & pnpm dsh --profile rtl-baseline @Arguments; $code = $LASTEXITCODE } finally { Pop-Location }
exit $code
