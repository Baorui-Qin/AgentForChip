$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$manifest = Get-Content -LiteralPath (Join-Path $root 'verilogeval-vivado2025.2-compat-v1-manifest.json') -Raw | ConvertFrom-Json
$rows = @()
foreach ($task in $manifest.tasks) {
    $original = [IO.File]::ReadAllBytes((Join-Path 'D:\AMD\verilog-eval' $task.original_path))
    $derived = [IO.File]::ReadAllBytes((Join-Path $root "derived\$($task.task_id)\tb.sv"))
    $mapping = Get-Content -LiteralPath (Join-Path $root "derived\$($task.task_id)\source-map.json") -Raw | ConvertFrom-Json
    $lines = [regex]::Matches([Text.Encoding]::UTF8.GetString($derived), '[^\n]*\n|[^\n]+$')
    $order = $mapping.new_to_original_line
    if ($order.Count -ne $lines.Count -or @($order | Sort-Object -Unique).Count -ne $lines.Count) { throw 'INVALID_PERMUTATION' }
    $restored = [string[]]::new($lines.Count)
    for ($i = 0; $i -lt $lines.Count; $i++) { $restored[$order[$i] - 1] = $lines[$i].Value }
    $restoredBytes = [Text.Encoding]::UTF8.GetBytes(($restored -join ''))
    if ([Convert]::ToBase64String($restoredBytes) -ne [Convert]::ToBase64String($original)) { throw "BYTE_RECONSTRUCTION_FAILED: $($task.task_id)" }
    $diff = [IO.File]::ReadAllText((Join-Path $root "derived\$($task.task_id)\change.diff"))
    if ($task.compatibility_rules.Count -gt 0) {
        $added = [regex]::Matches($diff, '(?m)^\+(?!\+)[^\n]*(?:\n|$)')
        $removed = [regex]::Matches($diff, '(?m)^-(?!-)[^\n]*(?:\n|$)')
        if ($added.Count -ne 2 -or $removed.Count -ne 2) { throw 'NOT_EXACTLY_TWO_LINES' }
        for ($i = 0; $i -lt 2; $i++) { if ($added[$i].Value.Substring(1) -cne $removed[$i].Value.Substring(1)) { throw 'MOVED_LINE_CHANGED' } }
        if ($added[0].Value -notmatch '^\+\s*wire tb_match;' -or $added[1].Value -notmatch '^\+\s*wire tb_mismatch = ~tb_match;') { throw 'UNEXPECTED_MOVED_DECLARATION' }
    } elseif ([Convert]::ToBase64String($derived) -ne [Convert]::ToBase64String($original) -or $diff -ne '') { throw 'UNMATCHED_FILE_CHANGED' }
    $rows += [ordered]@{ task_id = $task.task_id; exact_byte_reconstruction = $true; moved_complete_lines = $(if ($task.compatibility_rules.Count) { 2 } else { 0 }); original_tb_sha256 = $task.original_tb_sha256; derived_tb_sha256 = $task.effective_tb_sha256 }
}
$output = Join-Path $root 'full-byte-preservation-audit.json'
if (Test-Path -LiteralPath $output) { throw 'AUDIT_EXISTS' }
[IO.File]::WriteAllText($output, (@{ passed = $true; verified_task_count = $rows.Count; rows = $rows } | ConvertTo-Json -Depth 5), [Text.UTF8Encoding]::new($false))
Write-Output "Verified exact byte preservation for $($rows.Count) tasks."
