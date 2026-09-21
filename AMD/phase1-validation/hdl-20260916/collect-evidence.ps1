$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$tests = Get-Content -LiteralPath (Join-Path $root 'tests-final.json') -Raw | ConvertFrom-Json
$presentation = Get-Content -LiteralPath (Join-Path $root 'tests-presentation.json') -Raw | ConvertFrom-Json
$runs = @()
foreach ($directory in Get-ChildItem -LiteralPath $root -Directory) {
  $resultPath = Join-Path $directory.FullName 'result.json'
  if (-not (Test-Path -LiteralPath $resultPath)) {
    $runs += [ordered]@{ directory=$directory.Name; state='INCOMPLETE'; reason='Initial version-probe exit-1 reader defect; no PASS claimed' }
    continue
  }
  $result = Get-Content -LiteralPath $resultPath -Raw | ConvertFrom-Json
  if ($result.model_requests_total -ne 0) { throw 'Unexpected API request accounting' }
  $snapshot = Get-ChildItem -LiteralPath $directory.FullName -Directory -Filter 'snapshot-*' | Select-Object -First 1
  $manifest = Get-Content -LiteralPath (Join-Path $snapshot.FullName 'manifest.json') -Raw | ConvertFrom-Json
  foreach ($file in $manifest.files.PSObject.Properties) {
    $actual = (Get-FileHash -LiteralPath (Join-Path $snapshot.FullName $file.Name) -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actual -ne $file.Value) { throw "Asset changed: $($directory.Name)/$($file.Name)" }
  }
  $runs += [ordered]@{
    directory=$directory.Name; task=$result.task_id; sample=$result.sample_id; status=$result.final_status
    verified=$result.final_verified; source_sha256=$result.final_source_sha256; verification_key=$result.verification_key
    assets_rechecked=$true; assets=$manifest.files; sources=$manifest.sources
    stages=$result.stages; api_requests=$result.model_requests_total
  }
}
$before = Get-Content -LiteralPath 'D:/AMD/phase1-validation/run-iiip1k/build/commands.json' -Raw | ConvertFrom-Json
$after = Get-Content -LiteralPath (Join-Path $root 'run-N7m6L4/build/commands.json') -Raw | ConvertFrom-Json
$evidence = [ordered]@{
  schema_version='1.3'; evidence='development-acceptance'; collected_at=[DateTime]::UtcNow.ToString('o')
  tests=[ordered]@{ total=$tests.numTotalTests; passed=$tests.numPassedTests; failed=$tests.numFailedTests; skipped=$tests.numPendingTests; report='tests-final.json' }
  presentation_regression=[ordered]@{ passed=$presentation.numPassedTests; failed=$presentation.numFailedTests; report='tests-presentation.json' }
  checks=[ordered]@{ typescript='PASS'; scoped_lint='PASS'; doc_quick_passed=16; bilingual_pairs=5; named_markdown_links=8; dataset_worktree='clean' }
  acceptance=[ordered]@{ AC1='PASS'; AC2='PASS'; AC3='PASS'; AC4='PASS'; AC5='BLOCKED_TESTBENCH_COMPATIBILITY'; AC6='PASS'; AC7='PASS'; AC8='PASS' }
  before_compile=$before.compile; after_compile=$after.compile
  model_api_requests=0; full_isolation_verified=$false; automatic_repair_verified=$false
  runs=$runs
}
$path = Join-Path $root 'acceptance-final.json'
$stream = [IO.File]::Open($path, [IO.FileMode]::CreateNew, [IO.FileAccess]::Write)
try {
  $bytes = [Text.Encoding]::UTF8.GetBytes(($evidence | ConvertTo-Json -Depth 45) + "`n")
  $stream.Write($bytes, 0, $bytes.Length)
} finally { $stream.Dispose() }
Write-Output $path
