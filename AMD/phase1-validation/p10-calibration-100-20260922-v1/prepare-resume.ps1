$ErrorActionPreference='Stop'
$root=$PSScriptRoot
$group=Join-Path $root 'group-2'
function Hash([string]$path) { (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant() }
$freeze=Get-Content -LiteralPath (Join-Path $root 'preflight-freeze.json') -Raw | ConvertFrom-Json -AsHashtable
foreach($entry in $freeze.files.GetEnumerator()){ if((Hash $entry.Key) -ne $entry.Value){throw "FROZEN_INPUT_CHANGED:$($entry.Key)"} }
$patch=[IO.File]::ReadAllText((Join-Path $group 'preflight.patch.yml')).Replace('/preflight.mjs','/preflight-resume.mjs').Replace('/preflight-freeze.json','/resume-freeze.json')
$patchPath=Join-Path $group 'resume.patch.yml'
if(Test-Path -LiteralPath $patchPath){throw 'RESUME_ALREADY_PREPARED'}
[IO.File]::WriteAllText($patchPath,$patch,[Text.UTF8Encoding]::new($false))
foreach($file in Get-ChildItem -LiteralPath $group -Recurse -File){$freeze.files[$file.FullName]=Hash $file.FullName}
foreach($name in @('preflight-resume.mjs','prepare-resume.ps1','preflight-freeze.json','group-2.stderr.log','group-2.stdout.log')){$path=Join-Path $root $name;$freeze.files[$path]=Hash $path}
$freeze.resume_reason='Pinned metadata marks Prob156 NEEDS_MANUAL_COMPAT_REVIEW. Existing complete calibration pairs are reused; unreviewed evaluators are excluded, never accepted.'
$freeze.created_at=[DateTime]::UtcNow.ToString('o')
[IO.File]::WriteAllText((Join-Path $root 'resume-freeze.json'),(ConvertTo-Json -InputObject $freeze -Depth 80),[Text.UTF8Encoding]::new($false))
Write-Output "Frozen calibration resume with $($freeze.files.Count) inputs; no model calls."
