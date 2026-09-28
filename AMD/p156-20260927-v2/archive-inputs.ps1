param([Parameter(Mandatory)][string]$Root, [Parameter(Mandatory)][string]$FreezeFile)
$ErrorActionPreference = 'Stop'
function Hash([string]$p) { (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash.ToLowerInvariant() }
$freeze = Get-Content -LiteralPath $FreezeFile -Raw | ConvertFrom-Json -AsHashtable
$snapshot = Join-Path $Root 'source-snapshot'
if (Test-Path -LiteralPath $snapshot) { throw 'NEW_SOURCE_SNAPSHOT_REQUIRED' }
New-Item -ItemType Directory -Path $snapshot | Out-Null
$entries = @()
foreach ($path in $freeze.files.Keys) {
    if ((Hash $path) -ne $freeze.files[$path]) { throw "FROZEN_INPUT_CHANGED:$path" }
    $relative = $null
    foreach ($prefix in @('D:\deepseek-harness\','D:/deepseek-harness/')) {
        if ($path.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase)) { $relative = $path.Substring($prefix.Length); break }
    }
    if ($relative) {
        $destination = Join-Path $snapshot $relative
        New-Item -ItemType Directory -Force -Path (Split-Path -Parent $destination) | Out-Null
        Copy-Item -LiteralPath $path -Destination $destination
        if ((Hash $destination) -ne $freeze.files[$path]) { throw 'SNAPSHOT_COPY_CHANGED' }
        $entries += [ordered]@{ original_path = $path; snapshot_path = $destination; sha256 = $freeze.files[$path] }
    }
}
$value = [ordered]@{ at = [DateTime]::UtcNow.ToString('o'); freeze_path = $FreezeFile; freeze_sha256 = Hash $FreezeFile; all_original_inputs_verified_before_copy = $true; verified_input_count = $freeze.files.Count; source_files = $entries }
[IO.File]::WriteAllText((Join-Path $Root 'source-snapshot.json'), ($value | ConvertTo-Json -Depth 20), [Text.UTF8Encoding]::new($false))
Write-Output "Verified $($freeze.files.Count) frozen inputs; archived $($entries.Count) source/configuration files."
