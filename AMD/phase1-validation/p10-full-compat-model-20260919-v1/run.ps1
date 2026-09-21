param([ValidateSet('generate','compare')][string]$Command, [string]$Task)
$ErrorActionPreference = 'Stop'
$env:DSH_HOME = Join-Path $PSScriptRoot 'dsh-home'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
Set-Location -LiteralPath 'D:\deepseek-harness'
& node --import tsx/esm apps/cli/src/bin.ts --profile rtl-p10-model --patch (Join-Path $PSScriptRoot 'model.patch.yml') $Command $Task
if ($LASTEXITCODE -ne 0) { throw 'P10 entry failed; preserve evidence and do not automatically retry.' }
