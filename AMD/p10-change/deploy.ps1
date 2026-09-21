$ErrorActionPreference = 'Stop'
$repo = 'D:\deepseek-harness'
$stage = $PSScriptRoot
$files = @(
  'rtl-tools/src/phase1/verification.ts',
  'rtl-tools/src/phase1/p10-dataset.ts',
  'rtl-tools/src/phase1/p10-report.ts',
  'rtl-tools/src/phase1/p10-preflight.ts',
  'rtl-tools/tests/phase1-verification.spec.ts',
  'rtl-tools/tests/p10.spec.ts',
  'rtl-tools/phase1/profiles/rtl-p10-preflight/package.json',
  'rtl-tools/phase1/profiles/rtl-p10-preflight/cordis.yml',
  'rtl-tools/phase1/profiles/rtl-p10-preflight/cordis.patch.yml'
)
$previousFile = Join-Path $stage 'deployed.json'
$previous = if (Test-Path -LiteralPath $previousFile) { Get-Content -Raw -LiteralPath $previousFile | ConvertFrom-Json -AsHashtable } else { @{} }
foreach ($file in $files) {
  $target = Join-Path $repo $file
  $baseline = Join-Path (Join-Path $stage 'baseline') $file
  if (Test-Path -LiteralPath $target) {
    $expected = if ($previous.ContainsKey($file)) { $previous[$file] } elseif (Test-Path -LiteralPath $baseline) { (Get-FileHash -LiteralPath $baseline -Algorithm SHA256).Hash } else { throw "Unexpected existing file: $file" }
    if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $expected) { throw "Concurrent edit: $file" }
  } elseif ($previous.ContainsKey($file)) { throw "Previously deployed file missing: $file" }
}
$hashes = @{}
foreach ($file in $files) {
  $target = Join-Path $repo $file
  New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
  Copy-Item -LiteralPath (Join-Path $stage $file) -Destination $target
  $hashes[$file] = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
}
$hashes | ConvertTo-Json | Set-Content -LiteralPath $previousFile -Encoding utf8
Write-Output "Deployed $($files.Count) scoped P10 files; existing changes preserved."
