param([string]$HomeDirectory = $(if ($env:DSH_HOME) { $env:DSH_HOME } else { 'D:\AMD\p05-home' }))
$ErrorActionPreference = 'Stop'
foreach ($profile in @('rtl-baseline', 'rtl-agent')) {
  $source = Join-Path $PSScriptRoot "profiles/$profile"
  $target = Join-Path $HomeDirectory "profiles/$profile"
  New-Item -ItemType Directory -Force -Path $target | Out-Null
  foreach ($name in @('package.json', 'cordis.yml', 'cordis.patch.yml')) {
    $from = Join-Path $source $name
    $to = Join-Path $target $name
    if (Test-Path -LiteralPath $to) {
      if ((Get-FileHash -LiteralPath $from).Hash -ne (Get-FileHash -LiteralPath $to).Hash) { throw "Existing profile differs: $to. Review it; it was not overwritten." }
    } else { Copy-Item -LiteralPath $from -Destination $to }
  }
}
Write-Output "Profiles available under $HomeDirectory. Review paths and explicit full-access settings before running."
