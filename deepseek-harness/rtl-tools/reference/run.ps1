param([string]$TaskDirectory, [string]$OutDirectory)
$ErrorActionPreference = 'Stop'
if (!$TaskDirectory -or !$OutDirectory -or $args.Count) { [Console]::Error.WriteLine('Usage: run.ps1 <task_dir> <out_dir>'); exit 2 }
if (!$env:DSH_HOME -or $env:LLM_BACKEND -cnotin @('mock', 'api')) { [Console]::Error.WriteLine('Set DSH_HOME and explicit LLM_BACKEND=mock or api'); exit 2 }
$profile = if ($env:LLM_BACKEND -ceq 'mock') { 'rtl-reference' } else { 'rtl-reference-api' }
$task = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($TaskDirectory)
$out = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutDirectory)
Push-Location (Join-Path $PSScriptRoot '../..')
try { & pnpm dsh --profile $profile $task $out; $code = $LASTEXITCODE } finally { Pop-Location }
exit $code
