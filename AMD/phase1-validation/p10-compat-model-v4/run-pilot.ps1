$ErrorActionPreference='Stop'
$root=$PSScriptRoot
$order=Get-Content -Raw 'D:\AMD\phase1-validation\p10-compat-v3\selection-order.json' | ConvertFrom-Json
foreach($task in $order[0..9]) {
  & (Join-Path $root 'run.ps1') -Command generate -Task $task
  $generation=Get-Content -Raw (Join-Path $root "generate-$task\result.json") | ConvertFrom-Json
  if($generation.status -eq 'GENERATED_UNVERIFIED') {
    & (Join-Path $root 'run.ps1') -Command compare -Task $task
  }
}
