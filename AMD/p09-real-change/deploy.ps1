$ErrorActionPreference = 'Stop'
$source = 'D:\AMD\p09-real-change\rtl-tools'
$target = 'D:\deepseek-harness\rtl-tools'
$baseline = 'D:\AMD\phase1-validation\p09-real-loop-20260917\source-before'
$manifest = Join-Path $PSScriptRoot 'deployed.json'
$previous = if (Test-Path -LiteralPath $manifest) { Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json -AsHashtable } else { @{} }
$files = @('src/phase1/p09-auto-policy.ts','src/phase1/p09-claims.ts','src/phase1/artifact-manifest.ts','src/phase1/p09-action-call.ts','src/phase1/p09-auto-report.ts','src/phase1/p09-context.ts','src/phase1/recorder.ts','src/phase1/verification.ts','src/phase1/p09-proposal.ts','src/phase1/repair-workflow.ts','src/phase1/repair.ts','tests/p09-auto.spec.ts','tests/verification-transient.spec.ts','phase1/p09/README.md','phase1/p09/README.zh.md')
foreach ($file in $files) {
    $from = Join-Path $source $file
    if (!(Test-Path -LiteralPath $from)) { continue }
    $to = Join-Path $target $file
    if (Test-Path -LiteralPath $to) {
        $actual = (Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash
        $expected = if ($previous.ContainsKey($file)) { $previous[$file] } elseif (Test-Path -LiteralPath (Join-Path $baseline $file)) { (Get-FileHash -LiteralPath (Join-Path $baseline $file) -Algorithm SHA256).Hash } else { $null }
        if ($actual -ne $expected) { throw "Concurrent edit detected: $file" }
    }
    Copy-Item -LiteralPath $from -Destination $to
    $previous[$file] = (Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash
}
foreach ($language in @('md','zh.md')) {
    $file = '.agents/notes/implemented/feature/2026-09-17-p09-autonomous-repair.' + $language
    $to = Join-Path 'D:\deepseek-harness' $file
    if (Test-Path -LiteralPath $to) {
        if (!$previous.ContainsKey($file) -or (Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash -ne $previous[$file]) { throw "Concurrent edit detected: $file" }
    }
    Copy-Item -LiteralPath (Join-Path $PSScriptRoot $file) -Destination $to
    $previous[$file] = (Get-FileHash -LiteralPath $to -Algorithm SHA256).Hash
}
$previous | ConvertTo-Json | Set-Content -LiteralPath $manifest -Encoding utf8
Write-Output "Deployed $($previous.Count) scoped files; unrelated files unchanged."
