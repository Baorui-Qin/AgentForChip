param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Commands)
$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
Push-Location -LiteralPath $repo
try {
    & node --import tsx/esm apps/cli/src/bin.ts --profile rtl-repair @Commands
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
