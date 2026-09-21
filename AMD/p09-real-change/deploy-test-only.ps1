$ErrorActionPreference = 'Stop'
$file = 'tests/verification-transient.spec.ts'
$target = Join-Path 'D:\deepseek-harness\rtl-tools' $file
if (Test-Path -LiteralPath $target) { throw 'Test file already exists; inspect rather than overwrite.' }
Copy-Item -LiteralPath (Join-Path 'D:\AMD\p09-real-change\rtl-tools' $file) -Destination $target
$manifest = 'D:\AMD\p09-real-change\deployed.json'
$previous = Get-Content -LiteralPath $manifest -Raw | ConvertFrom-Json -AsHashtable
$previous[$file] = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
$previous | ConvertTo-Json | Set-Content -LiteralPath $manifest -Encoding utf8
Write-Output 'Deployed reproduction test only; frozen production source unchanged.'
