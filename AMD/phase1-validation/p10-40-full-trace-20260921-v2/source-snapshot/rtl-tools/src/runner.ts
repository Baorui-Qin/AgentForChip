/** Local Icarus execution over Harness-managed processes. @module rtl-tools/runner */
import { mkdtemp, realpath, stat, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve } from 'node:path'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { Diagnostics } from './diagnostics.ts'
import { runCommand } from './process.ts'
import type { Diagnostic, DiagnosticConfig } from './diagnostics.ts'

/** Fully resolved deployment choices, never model-controlled executable or source arguments. */
export interface SimulationConfig extends DiagnosticConfig {
  workspaceRoot: string
  top: string
  sources: string[]
  includeDirs: string[]
  iverilog: string
  vvp: string
  timeoutMs: number
  graceMs: number
  maxLogBytes: number
}

/** One command's independently reported termination and output facts. */
export interface StageResult {
  stage: 'compile' | 'simulation'
  exitCode: number | null
  signal: string | null
  timedOut: boolean
  aborted: boolean
  durationMs: number
  errors: Diagnostic[]
  warnings: Diagnostic[]
  omittedDiagnostics: number
  lineTruncated: boolean
  passSeen: boolean
  failSeen: boolean
  stdoutLog: string
  stderrLog: string
  logTruncated: boolean
  outputTail: string
}

/** Canonical tool result. PASS means observed testbench evidence, not formal verification. */
export interface SimulationResult {
  status: 'PASS' | 'FAIL' | 'UNCONFIRMED'
  stage: 'compile' | 'simulation'
  backend: 'icarus'
  summary: string
  errors: Diagnostic[]
  warnings: Diagnostic[]
  runs: StageResult[]
  artifactsDir: string
}

/**
 * Resolve and validate configuration before any process starts.
 * @param config - parsed Cordis configuration with defaults applied.
 * @returns an independent, validated configuration.
 */
export function resolveConfig(config: SimulationConfig): SimulationConfig {
  if (!isAbsolute(config.workspaceRoot)) throw new Error('workspaceRoot must be absolute')
  if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(config.top)) throw new Error('top must be a simple Verilog module identifier')
  if (config.sources.length === 0) throw new Error('sources must include RTL and the trusted testbench')
  for (const [field, value] of Object.entries({
    timeoutMs: config.timeoutMs, graceMs: config.graceMs, maxLogBytes: config.maxLogBytes,
    maxDiagnostics: config.maxDiagnostics, maxLineChars: config.maxLineChars,
  })) {
    if (!Number.isSafeInteger(value) || value <= 0 || value > 2_147_483_647) {
      throw new Error(`${field} must be a positive integer no greater than 2147483647`)
    }
  }
  for (const text of [...config.sources, ...config.includeDirs, config.iverilog, config.vvp]) {
    if (!text.trim() || text.includes('\0')) throw new Error('paths and executables must be nonempty and contain no NUL')
  }
  for (const marker of [config.passMarker, config.failMarker]) {
    if (!marker || marker.trim() !== marker || /[\r\n\0]/.test(marker) || marker.length > config.maxLineChars) {
      throw new Error('testbench markers must be nonempty, distinct whole lines within maxLineChars')
    }
  }
  if (config.passMarker === config.failMarker) throw new Error('passMarker and failMarker must differ')
  return { ...config, workspaceRoot: resolve(config.workspaceRoot), sources: [...config.sources], includeDirs: [...config.includeDirs] }
}

/**
 * Check a canonical path against a canonical directory (also rejects cross-volume paths).
 * @param root - allowed directory.
 * @param path - candidate path.
 * @returns whether the path is within the directory.
 */
export function within(root: string, path: string): boolean {
  const rel = relative(root, path)
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`))
}

async function runStage(
  subprocess: SubprocessRuntime,
  config: SimulationConfig,
  argv: readonly string[],
  cwd: string,
  stage: StageResult['stage'],
  signal: AbortSignal,
): Promise<StageResult> {
  const diagnostics = new Diagnostics(config)
  const outcome = await runCommand(subprocess, config, argv, cwd, stage, signal, diagnostics)
  return {
    stage, ...outcome, errors: diagnostics.errors, warnings: diagnostics.warnings,
    omittedDiagnostics: diagnostics.omitted, lineTruncated: diagnostics.lineTruncated,
    passSeen: diagnostics.passSeen, failSeen: diagnostics.failSeen,
  }
}

function failed(run: StageResult): boolean {
  return run.exitCode !== 0 || run.signal !== null || run.timedOut || run.aborted || run.errors.length > 0 || run.failSeen
}

/**
 * Compile, then simulate only a clean build. No source or testbench is rewritten.
 * @param subprocess - same-host managed process provider (not a remote execution world).
 * @param config - trusted, resolved deployment configuration.
 * @param signal - caller cancellation, combined with per-stage deadlines.
 * @param confine - enforces current Harness file policy on exact argv; must fail closed.
 * @returns bounded facts and paths to capped logs plus a result.json record.
 */
export async function runSimulation(
  subprocess: SubprocessRuntime,
  config: SimulationConfig,
  signal: AbortSignal,
  confine: (argv: readonly string[]) => readonly string[],
): Promise<SimulationResult> {
  signal.throwIfAborted()
  const root = await realpath(config.workspaceRoot)
  const sources = await Promise.all(config.sources.map(async (path) => {
    const absolute = await realpath(resolve(root, path))
    if (!(await stat(absolute)).isFile()) throw new Error(`source is not a file: ${path}`)
    return absolute
  }))
  const includes = await Promise.all(config.includeDirs.map(async (path) => {
    const absolute = await realpath(resolve(root, path))
    if (!(await stat(absolute)).isDirectory()) throw new Error(`include path is not a directory: ${path}`)
    return absolute
  }))
  const compiler = await subprocess.resolveExecutable(config.iverilog)
  const simulator = await subprocess.resolveExecutable(config.vvp)
  signal.throwIfAborted()
  const artifactsDir = await mkdtemp(join(root, '.rtl-sim-'))
  const binary = join(artifactsDir, 'sim.out')
  const commands = {
    compile: [compiler, '-g2012', '-Wall', '-s', config.top, '-o', binary, ...includes.flatMap(path => ['-I', path]), ...sources],
    simulation: [simulator, '-N', binary],
  }
  await writeFile(join(artifactsDir, 'commands.json'), JSON.stringify(commands, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
  const runs = [await runStage(subprocess, config, confine(commands.compile), artifactsDir, 'compile', signal)]
  if (!failed(runs[0]!) && !signal.aborted) {
    runs.push(await runStage(subprocess, config, confine(commands.simulation), artifactsDir, 'simulation', signal))
  }
  const last = runs.at(-1)!
  const failure = failed(last) || signal.aborted
  const status = failure ? 'FAIL' : last.stage === 'simulation' && last.passSeen && !runs.some(run => run.lineTruncated) ? 'PASS' : 'UNCONFIRMED'
  const summary = failure
    ? `${last.stage} failed${last.timedOut ? ' (timeout)' : ''}${signal.aborted ? ' (cancelled)' : ''}; ${last.errors.length} retained error(s).`
    : status === 'PASS'
      ? 'Icarus completed with explicit testbench PASS evidence; this is not Vivado or synthesis verification.'
      : 'Process completed, but functional success is unconfirmed (missing PASS evidence or incomplete diagnostic lines).'
  const result: SimulationResult = {
    backend: 'icarus', status, stage: last.stage, summary,
    errors: runs.flatMap(run => run.errors), warnings: runs.flatMap(run => run.warnings), runs, artifactsDir,
  }
  await writeFile(join(artifactsDir, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
  return result
}
