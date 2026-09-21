param([ValidateSet('web','headless')][string]$Mode = 'web', [string]$Task, [ValidateRange(1,65535)][int]$Port = 3080)
$ErrorActionPreference = 'Stop'
$env:DSH_HOME = Join-Path $PSScriptRoot 'dsh-home'
if (-not $env:LOCAL_LLM_API_KEY) { $env:LOCAL_LLM_API_KEY = 'local-only' }
Set-Location -LiteralPath 'D:\AMD'
$entry = 'D:\deepseek-harness\apps\cli\src\bin.ts'
$hook = 'file:///D:/deepseek-harness/node_modules/tsx/dist/esm/index.mjs'
$env:TSX_TSCONFIG_PATH = 'D:\deepseek-harness\tsconfig.json'
if ($Mode -eq 'web') {
    if (-not (Test-Path -LiteralPath 'D:\deepseek-harness\packages\api\gateway\lib\client.js')) {
        throw 'Web client bundles are missing. Run pnpm run build in D:\deepseek-harness first.'
    }
    & node --import $hook $entry web --port $Port
} else {
    if (-not $Task) { throw 'Headless mode requires -Task.' }
    & node --import $hook $entry --profile headless $Task
}
exit $LASTEXITCODE
