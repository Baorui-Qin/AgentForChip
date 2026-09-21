$ErrorActionPreference = 'Stop'
$root = 'D:\AMD\phase1-validation\p10-20260918-v8'
$processes = @(Get-CimInstance Win32_Process)
$eda = @($processes | Where-Object { $_.Name -match '^(vivado|xvlog|xelab|xsim)\.exe$' })
$campaign = @($processes | Where-Object { $_.Name -match '^(node|cmd)\.exe$' -and $_.CommandLine -match 'p10-20260918-v8' })
$result = [ordered]@{
  observed_at = (Get-Date).ToUniversalTime().ToString('o')
  eda_process_count = $eda.Count
  campaign_node_or_cmd_count = $campaign.Count
  eda_processes = @($eda | Select-Object ProcessId,Name)
  campaign_processes = @($campaign | Select-Object ProcessId,Name)
  environment_values_collected = $false
}
$result | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $root 'process-audit.json') -Encoding utf8
if ($eda.Count -ne 0 -or $campaign.Count -ne 0) { throw 'Unresolved process ownership; inspect before sealing.' }
