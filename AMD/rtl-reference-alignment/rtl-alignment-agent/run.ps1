$ErrorActionPreference = 'Stop'
if (!$env:DSH_HARNESS_ROOT) { [Console]::Error.WriteLine('Set DSH_HARNESS_ROOT to the source harness checkout'); exit 2 }
& (Join-Path $env:DSH_HARNESS_ROOT 'rtl-tools/reference/run.ps1') @args
exit $LASTEXITCODE
