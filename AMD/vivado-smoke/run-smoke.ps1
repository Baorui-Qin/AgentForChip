param(
    [string]$VivadoRoot = 'D:\AMDDesignTools\2025.2\Vivado',
    [string]$DatasetRoot = 'D:\AMD\verilog-eval',
    [ValidateSet('verilog-eval', 'local')][string]$Suite = 'verilog-eval',
    [switch]$Relax,
    [ValidateRange(1, 600)][int]$TimeoutSeconds = 120
)

$ErrorActionPreference = 'Stop'
$testbench = Join-Path $DatasetRoot 'dataset_spec-to-rtl\Prob001_zero_test.sv'
$reference = Join-Path $DatasetRoot 'dataset_spec-to-rtl\Prob001_zero_ref.sv'
$protectedFiles = if ($Suite -eq 'local') { @(Join-Path $PSScriptRoot 'local_tb.sv') } else { @($testbench, $reference) }
$before = @($protectedFiles | Get-FileHash -Algorithm SHA256)
$runRoot = Join-Path $PSScriptRoot ('runs\' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [guid]::NewGuid().ToString('N').Substring(0, 8))
$null = New-Item -ItemType Directory -Path $runRoot

function Invoke-Stage {
    param([string]$Stage, [string]$Program, [string[]]$CommandArgs, [string]$Directory)
    $programPath = Join-Path $VivadoRoot "bin\$Program.bat"
    if (-not (Test-Path -LiteralPath $programPath -PathType Leaf)) { throw "Executable not found: $programPath" }
    $allArgs = @($programPath) + $CommandArgs
    foreach ($arg in $allArgs) {
        if ($arg -match '["%\r\n]') { throw 'Unsupported command argument quoting' }
    }
    $command = ($allArgs | ForEach-Object { '"' + $_ + '"' }) -join ' '
    $stdout = Join-Path $Directory "$Stage.stdout.log"
    $stderr = Join-Path $Directory "$Stage.stderr.log"
    $watch = [Diagnostics.Stopwatch]::StartNew()
    $process = Start-Process -FilePath $env:ComSpec -ArgumentList @('/d', '/s', '/c', ('"' + $command + '"')) -WorkingDirectory $Directory -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
    $timedOut = -not $process.WaitForExit($TimeoutSeconds * 1000)
    if ($timedOut) { $process.Kill($true) }
    $process.WaitForExit()
    $watch.Stop()
    $output = [IO.File]::ReadAllText($stdout) + "`n" + [IO.File]::ReadAllText($stderr)
    $errors = @($output -split '\r?\n' | Where-Object { $_ -match '^(ERROR:|FATAL:|Fatal:)' } | Select-Object -First 5)
    $outcome = [ordered]@{
        stage = $Stage
        command = $command
        exitCode = $process.ExitCode
        timedOut = $timedOut
        durationSeconds = [math]::Round($watch.Elapsed.TotalSeconds, 3)
        errors = $errors
        stdoutLog = $stdout
        stderrLog = $stderr
    }
    $process.Dispose()
    return @{ outcome = $outcome; output = $output }
}

$cases = @(
    @{ name = 'pass'; expectedStatus = 'PASS'; expectedStage = 'simulation' },
    @{ name = 'mismatch'; expectedStatus = 'FAIL'; expectedStage = 'simulation' },
    @{ name = 'syntax_error'; expectedStatus = 'FAIL'; expectedStage = 'compile' },
    @{ name = 'missing_module'; expectedStatus = 'FAIL'; expectedStage = 'elaboration' }
)
$results = @()
foreach ($case in $cases) {
    $directory = Join-Path $runRoot $case.name
    $null = New-Item -ItemType Directory -Path $directory
    $candidate = Join-Path $PSScriptRoot "candidates\$($case.name).sv"
    $compileArgs = @('-sv')
    if ($Relax) { $compileArgs += '-relax' }
    $compileArgs += @($candidate) + $protectedFiles
    $stages = @(
        @{ stage = 'compile'; program = 'xvlog'; arguments = $compileArgs },
        @{ stage = 'elaboration'; program = 'xelab'; arguments = @('work.tb', '-s', 'smoke_snapshot', '-debug', 'typical', '-timescale', '1ns/1ps') },
        @{ stage = 'simulation'; program = 'xsim'; arguments = @('smoke_snapshot', '-R') }
    )
    $runs = @()
    $status = 'UNCONFIRMED'
    $mismatches = $null
    $samples = $null
    foreach ($stage in $stages) {
        $execution = Invoke-Stage -Stage $stage.stage -Program $stage.program -CommandArgs $stage.arguments -Directory $directory
        $runs += $execution.outcome
        $failed = $execution.outcome.timedOut -or $execution.outcome.exitCode -ne 0 -or $execution.outcome.errors.Count -gt 0
        if ($failed) { $status = 'FAIL'; break }
        if ($stage.stage -eq 'simulation') {
            $matches = [regex]::Matches($execution.output, '(?m)^Mismatches: (\d+) in (\d+) samples\s*$')
            if ($execution.output -match '(?m)^TIMEOUT\s*$') {
                $status = 'FAIL'
            } elseif ($matches.Count -eq 1) {
                $mismatches = [long]$matches[0].Groups[1].Value
                $samples = [long]$matches[0].Groups[2].Value
                if ($mismatches -gt 0) { $status = 'FAIL' }
                elseif ($samples -gt 0) { $status = 'PASS' }
            }
        }
    }
    $actualStage = $runs[-1].stage
    $matched = $status -eq $case.expectedStatus -and $actualStage -eq $case.expectedStage
    $result = [ordered]@{
        case = $case.name
        status = $status
        stage = $actualStage
        mismatches = $mismatches
        samples = $samples
        expectedStatus = $case.expectedStatus
        expectedStage = $case.expectedStage
        expectationMet = $matched
        runs = $runs
    }
    $result | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $directory 'result.json') -Encoding utf8
    $results += $result
    Write-Output "$($case.name): $status at $actualStage; mismatches=$mismatches; samples=$samples; expected=$matched"
}
$after = @($protectedFiles | Get-FileHash -Algorithm SHA256)
$unchanged = @((Compare-Object ($before | ForEach-Object Hash) ($after | ForEach-Object Hash))).Count -eq 0
$report = [ordered]@{
    purpose = 'Toolchain smoke test with handwritten known fixtures, not an agent benchmark score'
    vivadoRoot = $VivadoRoot
    datasetRoot = $DatasetRoot
    suite = $Suite
    relaxedLanguageChecking = [bool]$Relax
    testbenchUnchanged = $unchanged
    protectedFiles = @($before | Select-Object Path, Hash)
    allExpectationsMet = ($unchanged -and @($results | Where-Object { -not $_.expectationMet }).Count -eq 0)
    results = $results
}
$report | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $runRoot 'summary.json') -Encoding utf8
Write-Output "Report: $(Join-Path $runRoot 'summary.json')"
if (-not $report.allExpectationsMet) { exit 1 }
