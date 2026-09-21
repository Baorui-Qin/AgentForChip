param([ValidateSet('calibrate','preflight')][string]$Command)
$ErrorActionPreference = 'Stop'
$env:DSH_HOME = Join-Path $PSScriptRoot 'dsh-home'
Set-Location -LiteralPath 'D:\deepseek-harness'
& node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-suite --patch (Join-Path $PSScriptRoot 'preflight.patch.yml') $Command
exit $LASTEXITCODE
