$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
$previous = 'D:\AMD\phase1-validation\p10-compat-model-v4'
$preflight = 'D:\AMD\phase1-validation\p10-full-compat-v1-r2'
function ReadJson([string]$Path) { return Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json -AsHashtable }
function Hash([string]$Path) { return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash.ToLowerInvariant() }
function Put([string]$Name, $Value) {
    $path = Join-Path $root $Name
    if (Test-Path -LiteralPath $path) { throw "OUTPUT_EXISTS: $Name" }
    [IO.File]::WriteAllText($path, ($Value | ConvertTo-Json -Depth 40), [Text.UTF8Encoding]::new($false))
}
$routing = ReadJson (Join-Path $preflight 'p10-evaluator-routing.json')
if ((Hash $routing.evaluatorManifest) -ne '880f2dabca449f800238edf3458739ca8e37e811bfc5750d8474298af2b80353') { throw 'EVALUATOR_MANIFEST_CHANGED' }
foreach ($inventory in @('frozen-suite-files.json','agent-unchanged.json')) {
    $items = ReadJson (Join-Path $preflight $inventory)
    foreach ($entry in $items.GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "FROZEN_INPUT_CHANGED: $($entry.Key)" } }
}
$preflightFreeze = ReadJson (Join-Path $preflight 'freeze.json')
foreach ($group in @('files','protected')) {
    foreach ($entry in $preflightFreeze[$group].GetEnumerator()) { if ((Hash $entry.Key) -ne $entry.Value) { throw "PREFLIGHT_INPUT_CHANGED: $($entry.Key)" } }
}
$ready = ReadJson (Join-Path $preflight 'p10-compat-preflight-10.json')
$order = ReadJson (Join-Path $preflight 'selection-order.json')
if ($ready.Count -ne 10 -or @($ready | Where-Object { -not $_.evaluable }).Count -ne 0 -or ($ready.task_id -join ',') -ne ($order[0..9] -join ',')) { throw 'FIXED_TEN_NOT_READY' }
$catalog = ReadJson (Join-Path $preflight 'catalog.json')
foreach ($task in $catalog) { foreach ($entry in $task.assets.GetEnumerator()) { if ((Hash (Join-Path 'D:\AMD\verilog-eval' $entry.Key)) -ne $entry.Value) { throw 'UPSTREAM_CHANGED' } } }
$priorFreeze = ReadJson (Join-Path $previous 'freeze.json')
$oldProfile = Join-Path $previous 'dsh-home\profiles\rtl-p10-model'
foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) {
    $path = Join-Path $repo "rtl-tools\phase1\profiles\rtl-p10-model\$name"
    if ((Hash $path) -ne (Hash (Join-Path $oldProfile $name))) { throw "MODEL_PROFILE_CHANGED: $name" }
}
$profile = Join-Path $root 'dsh-home\profiles\rtl-p10-model'
New-Item -ItemType Directory -Path $profile | Out-Null
foreach ($name in @('package.json','cordis.yml','cordis.patch.yml')) { Copy-Item -LiteralPath (Join-Path $oldProfile $name) -Destination (Join-Path $profile $name) }
Copy-Item -LiteralPath (Join-Path $previous 'p09.json') -Destination (Join-Path $root 'p09.json')
$auto = ReadJson (Join-Path $previous 'auto.json')
$auto.campaignRoot = $root.Replace('\','/')
Put 'auto.json' $auto
$patch = [IO.File]::ReadAllText((Join-Path $previous 'model.patch.yml')).Replace('D:/AMD/phase1-validation/p10-compat-model-v4', $root.Replace('\','/')).Replace('D:/AMD/phase1-validation/p10-compat-v3', $preflight.Replace('\','/'))
[IO.File]::WriteAllText((Join-Path $root 'model.patch.yml'), $patch, [Text.UTF8Encoding]::new($false))
$copy = Join-Path $root 'frozen-source'
New-Item -ItemType Directory -Path $copy | Out-Null
$files = [ordered]@{}
function Pin([string]$Path) {
    $full = [IO.Path]::GetFullPath($Path)
    $digest = Hash $full
    $files[$full] = $digest
    $target = Join-Path $copy $digest
    if (-not (Test-Path -LiteralPath $target)) { Copy-Item -LiteralPath $full -Destination $target }
}
foreach ($folder in @("$repo\rtl-tools\src", "$repo\packages\subprocess\subprocess-local\src", "$repo\packages\subprocess\subprocess\src", $profile, (Join-Path $preflight 'derived'))) {
    foreach ($file in Get-ChildItem -LiteralPath $folder -Recurse -File) { Pin $file.FullName }
}
foreach ($name in @('catalog.json','selection-order.json','compat-positive-negative-results.json','evaluator-policy.json','p10-compat-preflight-10.json','readonly-proof.json','representative-calibration.json','p10-evaluator-routing.json')) { Pin (Join-Path $preflight $name) }
foreach ($name in @('p09.json','auto.json','model.patch.yml','prepare.ps1','run.ps1','run-pilot.ps1')) { Pin (Join-Path $root $name) }
foreach ($path in @("$repo\rtl-tools\phase1\configs\dev.yaml", "$repo\pnpm-lock.yaml", (Join-Path $auto.runtimeRoot 'manifest.json'))) { Pin $path }
$p09 = ReadJson (Join-Path $root 'p09.json')
Pin $p09.skillsFile
$skills = ReadJson $p09.skillsFile
foreach ($skill in $skills) { foreach ($evidence in $skill.validation_records) { Pin (Join-Path (Split-Path $p09.skillsFile -Parent) $evidence.path) } }
$historical = [ordered]@{}
foreach ($folder in @($previous, $preflight, 'D:\AMD\phase1-validation\p10-20260918-v8')) { foreach ($file in Get-ChildItem -LiteralPath $folder -Recurse -File) { $historical[$file.FullName] = Hash $file.FullName } }
$protocol = $priorFreeze.protocol
$protocol['evaluator_protocol'] = 'VerilogEval V2 tasks evaluated with Vivado 2025.2 compatibility evaluator v1'
$protocol['compatibility_manifest_sha256'] = $routing.manifest_sha256
$protocol['fresh_model_generation'] = $true
$protocol['reuse_previous_candidates'] = $false
Put 'freeze.json' ([ordered]@{ schema_version = 'p10-model-full-suite-freeze-1'; created_at = [DateTime]::UtcNow.ToString('o'); predecessor = $previous; preflight_root = $preflight; files = $files; historical = $historical; task_ids = $order[0..9]; protocol = $protocol })
Write-Output "Pinned $($files.Count) inputs, $($historical.Count) historical files; fixed 10 tasks READY; fresh generation with unchanged model settings."
