$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$frozen = Get-Content -LiteralPath (Join-Path $root 'preflight-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
foreach ($entry in $frozen.files.GetEnumerator()) { if ((Get-FileHash -LiteralPath $entry.Key -Algorithm SHA256).Hash.ToLowerInvariant() -ne $entry.Value) { throw "SOURCE_CHANGED: $($entry.Key)" } }
$all = @()
foreach ($i in 1..4) {
    $worker = Join-Path $root "group-$i"
    $rows = Get-Content -LiteralPath (Join-Path $worker 'compat-positive-negative-results.json') -Raw | ConvertFrom-Json
    if ($rows.Count -ne 10) { throw 'PREFLIGHT_INCOMPLETE' }
    $all += $rows
    $files = [ordered]@{}
    foreach ($entry in $frozen.files.GetEnumerator()) { $files[$entry.Key] = $entry.Value }
    $evidence = Join-Path $worker 'compat-positive-negative-results.json'
    $files[$evidence] = (Get-FileHash -LiteralPath $evidence -Algorithm SHA256).Hash.ToLowerInvariant()
    $protocol = $frozen.protocol
    $protocol.authorized_model_dispatch_cap = 150
    $protocol.automatic_40 = $false
    $protocol['parent_campaign_selected_count'] = 40
    $protocol['group_index'] = $i
    $target = Join-Path $worker 'freeze.json'
    if (Test-Path -LiteralPath $target) { throw 'MODEL_ALREADY_SEALED' }
    [IO.File]::WriteAllText($target, (@{ files = $files; protocol = $protocol; created_at = [DateTime]::UtcNow.ToString('o') } | ConvertTo-Json -Depth 40), [Text.UTF8Encoding]::new($false))
}
[IO.File]::WriteAllText((Join-Path $root 'preflight-40.json'), ($all | ConvertTo-Json -Depth 40), [Text.UTF8Encoding]::new($false))
Write-Output "Selected 40; ready $(@($all | Where-Object evaluable).Count); blocked $(@($all | Where-Object { -not $_.evaluable }).Count)."
