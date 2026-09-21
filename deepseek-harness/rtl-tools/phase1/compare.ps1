param([ValidateSet('Generate', 'Evaluate', 'Report')][string]$Action = 'Generate', [string]$ExperimentId)
$ErrorActionPreference = 'Stop'
if (-not $env:DSH_HOME) { $env:DSH_HOME = 'D:\AMD\p05-home' }
Push-Location (Join-Path $PSScriptRoot '../..')
try {
  if ($Action -eq 'Generate') {
    $result = & pnpm dsh --profile rtl-baseline init
    if ($LASTEXITCODE -ne 0) { throw 'Experiment initialization failed' }
    $receipt = $result | Where-Object { $_.StartsWith('{') } | Select-Object -Last 1 | ConvertFrom-Json
    $ExperimentId = $receipt.experiment_id
    & pnpm dsh --profile rtl-baseline generate $ExperimentId
    & pnpm dsh --profile rtl-agent generate $ExperimentId agent_base
    & pnpm dsh --profile rtl-agent generate $ExperimentId agent_domain
  } elseif ($Action -eq 'Evaluate') {
    if (-not $ExperimentId) { throw 'ExperimentId is required' }
    foreach ($variant in @('baseline', 'agent_base', 'agent_domain')) {
      & pnpm dsh --profile rtl-agent verify $ExperimentId $variant
    }
  }
  if (-not $ExperimentId) { throw 'ExperimentId is required' }
  & pnpm dsh --profile rtl-agent report $ExperimentId
  if ($LASTEXITCODE -ne 0) { throw 'Comparison report failed' }
  Write-Output "Experiment: $ExperimentId. Inspect comparison.json for per-route failures; no calls were retried."
} finally { Pop-Location }
