$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$suite = [IO.Path]::GetFullPath((Join-Path $root 'derived'))
if ($suite -ne 'D:\AMD\phase1-validation\p10-full-compat-v1\derived') { throw 'UNEXPECTED_FREEZE_TARGET' }
$calibrationPath = Join-Path $root 'representative-calibration.json'
$calibration = Get-Content -LiteralPath $calibrationPath -Raw | ConvertFrom-Json
if ($calibration.passed -ne $true) { throw 'CALIBRATION_NOT_PASSED' }
$sealPath = Join-Path $suite 'suite-freeze.json'
if (Test-Path -LiteralPath $sealPath) { throw 'SUITE_ALREADY_FROZEN' }
$manifest = Join-Path $suite 'verilogeval-vivado2025.2-compat-v1-manifest.json'
$seal = [ordered]@{ frozen_at = [DateTime]::UtcNow.ToString('o'); manifest_sha256 = (Get-FileHash -LiteralPath $manifest -Algorithm SHA256).Hash.ToLowerInvariant(); representative_calibration_sha256 = (Get-FileHash -LiteralPath $calibrationPath -Algorithm SHA256).Hash.ToLowerInvariant(); representative_calibration_passed = $true; defaultTimescale = $calibration.defaultTimescale }
[IO.File]::WriteAllText($sealPath, ($seal | ConvertTo-Json), [Text.UTF8Encoding]::new($false))
$probe = Join-Path $suite 'readonly-delete-probe'
[IO.File]::WriteAllText($probe, 'Permission probe: this file must remain present.')
$sid = [Security.Principal.WindowsIdentity]::GetCurrent().User
$acl = Get-Acl -LiteralPath $suite
$rights = [Security.AccessControl.FileSystemRights]'Write,Delete,DeleteSubdirectoriesAndFiles'
$deny = [Security.AccessControl.FileSystemAccessRule]::new($sid, $rights, [Security.AccessControl.InheritanceFlags]'ContainerInherit,ObjectInherit', [Security.AccessControl.PropagationFlags]::None, [Security.AccessControl.AccessControlType]::Deny)
$acl.AddAccessRule($deny)
Set-Acl -LiteralPath $suite -AclObject $acl
$modifyDenied = $false
$createDenied = $false
$deleteDenied = $false
try { $handle = [IO.File]::Open((Join-Path $suite 'Prob005_notgate\tb.sv'), [IO.FileMode]::Open, [IO.FileAccess]::Write); $handle.Dispose() } catch [UnauthorizedAccessException] { $modifyDenied = $true }
try { $handle = [IO.File]::Open((Join-Path $suite 'readonly-create-probe'), [IO.FileMode]::CreateNew, [IO.FileAccess]::Write); $handle.Dispose() } catch [UnauthorizedAccessException] { $createDenied = $true }
try { [IO.File]::Delete($probe) } catch [UnauthorizedAccessException] { $deleteDenied = $true }
$proof = [ordered]@{ checked_at = [DateTime]::UtcNow.ToString('o'); root = $suite; sid = $sid.Value; modify_denied = $modifyDenied; create_denied = $createDenied; delete_denied = $deleteDenied; acl = (Get-Acl -LiteralPath $suite).Sddl; limitation = 'Verified current worker identity; not an adversarial administrator isolation claim.' }
[IO.File]::WriteAllText((Join-Path $root 'readonly-proof.json'), ($proof | ConvertTo-Json), [Text.UTF8Encoding]::new($false))
if (-not ($modifyDenied -and $createDenied -and $deleteDenied)) { throw 'READONLY_VERIFICATION_FAILED' }
$inventory = [ordered]@{}
foreach ($file in Get-ChildItem -LiteralPath $suite -Recurse -File) { $inventory[$file.FullName] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
[IO.File]::WriteAllText((Join-Path $root 'frozen-suite-files.json'), ($inventory | ConvertTo-Json), [Text.UTF8Encoding]::new($false))
$proof | ConvertTo-Json
