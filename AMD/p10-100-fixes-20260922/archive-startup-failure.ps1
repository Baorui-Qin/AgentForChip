$ErrorActionPreference='Stop'
$root='D:\AMD\phase1-validation\p10-repair-v3-100-full-trace-20260922-v1'
$dirs=@(Get-ChildItem -LiteralPath $root -Directory -Filter 'generate-*')
$rows=@()
foreach($dir in $dirs){
    $result=Get-Content -LiteralPath (Join-Path $dir.FullName 'result.json') -Raw | ConvertFrom-Json
    if($result.physical_dispatches -ne 0){throw 'NONZERO_DISPATCH_REQUIRES_REVIEW'}
    foreach($run in $result.model_runs){
        $transport=Get-Content -LiteralPath (Join-Path $run 'transport.json') -Raw | ConvertFrom-Json
        if($transport.provider_stream_invoked -or $transport.http_response_observed -or $transport.model_output_observed){throw 'PROVIDER_ACTIVITY_REQUIRES_REVIEW'}
    }
    $rows += [ordered]@{task_id=$result.task_id; status=$result.status; physical_dispatches=0; result=(Join-Path $dir.FullName 'result.json')}
}
if(Test-Path -LiteralPath (Join-Path $root 'dispatches')){throw 'DISPATCH_DIRECTORY_REQUIRES_REVIEW'}
$report=[ordered]@{status='ABORTED_LOCAL_PREPARATION_FAILURE'; created_at=[DateTime]::UtcNow.ToString('o'); model_score=$false; physical_dispatches=0; model_candidates=0; reason='Prepared maxDispatches=1000 exceeds the existing reserveDispatch global bound of 375. Every recorded call failed before dispatch reservation. The orchestrator was stopped and the attempt is not a model evaluation.'; frozen_task_manifest_unchanged=$true; successor='D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2'; rows=$rows}
[IO.File]::WriteAllText((Join-Path $root 'startup-failure.json'),(ConvertTo-Json -InputObject $report -Depth 20),[Text.UTF8Encoding]::new($false))
$files=@(Get-ChildItem -LiteralPath $root -Recurse -File | ForEach-Object {[ordered]@{path=$_.FullName;bytes=$_.Length;sha256=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLowerInvariant()}})
[IO.File]::WriteAllText((Join-Path $root 'startup-evidence-files.json'),(ConvertTo-Json -InputObject $files -Depth 10),[Text.UTF8Encoding]::new($false))
Copy-Item -LiteralPath (Join-Path $root 'startup-failure.json') -Destination 'D:\AMD\phase1-validation\p10-repair-v3-100-full-trace-20260922-v2\prior-startup-failure.json'
Write-Output "Preserved $($rows.Count) local failures, zero dispatches, $($files.Count) files."
