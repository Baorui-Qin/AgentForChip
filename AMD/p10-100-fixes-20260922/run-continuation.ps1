$ErrorActionPreference = 'Stop'
$root = 'D:\AMD\p100-0922-c2'
$env:XILINX_LOCAL_USER_DATA = 'no'
$env:NODE_OPTIONS = '--max-old-space-size=4096'
node (Join-Path $root 'continue-comparison.mjs') $root 'D:\deepseek-harness' compare
exit $LASTEXITCODE
