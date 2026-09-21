/** Keyless development preflight; not an Agent or competition-readiness verdict. @module rtl-tools/phase1/doctor */
import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative } from 'node:path'
import { arch, platform, release } from 'node:os'
import z from '@deepseek-ai/schemastery'
import { load, JSON_SCHEMA } from 'js-yaml'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { runCommand, type CommandResult } from '../process.ts'
import { resolveSynthesisConfig, runSynthesis, tclWord, vivadoArgv, type SynthesisResult } from '../synthesis.ts'
import { atomicJson } from './recorder.ts'

/** Trusted development configuration; model invocation belongs to a separate adapter. */
export const DoctorConfig = z.object({
  schema_version: z.const('1.0').required(),
  repositoryRoot: z.string().required(), outputRoot: z.string().required(),
  expectedVivadoVersion: z.const('2025.2').required(), part: z.const('xczu3eg-sbva484-1-e').required(), clockPeriodNs: z.const(5).required(),
  tools: z.object({ vivado: z.string().required(), xvlog: z.string().required(), xelab: z.string().required(), xsim: z.string().required() }).required(),
  limits: z.object({ timeoutMs: z.natural().min(1).max(2_147_483_647).required(), graceMs: z.natural().min(1).required(),
    maxLogBytes: z.natural().min(1).required(), maxLineChars: z.natural().min(1).required(),
    maxReportBytes: z.natural().min(1).required(), maxDiagnostics: z.natural().min(1).required(), threads: z.natural().min(1).required() }).required(),
  model: z.const(null),
})
/** Fully parsed doctor settings, with no deployment defaults hidden inside runDoctor. */
export type DoctorSettings = ReturnType<typeof DoctorConfig>
/** Independent probe facts; a version string alone cannot establish license readiness. */
export interface Probe {
  executable: string | null
  argv: readonly string[]
  process: CommandResult | null
  error: string | null
}
/** Preflight evidence deliberately has no G0/G1/G2 success flag. */
export interface DoctorResult {
  schema_version: '1.0'
  status: 'EDA_NOT_READY' | 'MODEL_NOT_READY'
  eda_ready: boolean
  model: { status: 'MODEL_NOT_READY'; reason: string }
  directory: string
  versions: Record<string, { actual: string | null; matches: boolean; probe: Probe }>
  part_query: { status: 'PASS' | 'FAIL' | 'SKIPPED'; part: string; probe: Probe | null }
  synthesis: SynthesisResult | null
  started_at: string
  duration_ms: number
}

/**
 * Read trusted YAML as data only; executable YAML tags are not enabled.
 * @param path - explicit configuration path from the profile.
 * @returns validated settings and the exact input SHA-256.
 */
export async function readDoctorConfig(path: string): Promise<{ config: DoctorSettings; sha256: string }> {
  const text = await readFile(path, 'utf8')
  const input = load(text, { schema: JSON_SCHEMA }) as Parameters<typeof DoctorConfig>[0]
  if (!input || typeof input !== 'object' || !Object.hasOwn(input, 'model') || input.model !== null) throw new Error('Doctor requires explicit model: null until the local adapter is configured')
  const config = DoctorConfig(input)
  const allowed = [
    [config, ['schema_version', 'repositoryRoot', 'outputRoot', 'expectedVivadoVersion', 'part', 'clockPeriodNs', 'tools', 'limits', 'model']],
    [config.tools, ['vivado', 'xvlog', 'xelab', 'xsim']],
    [config.limits, ['timeoutMs', 'graceMs', 'maxLogBytes', 'maxLineChars', 'maxReportBytes', 'maxDiagnostics', 'threads']],
  ] as const
  for (const [object, keys] of allowed) if (Object.keys(object).some(key => !(keys as readonly string[]).includes(key))) throw new Error('Unknown doctor configuration field')
  for (const value of [config.repositoryRoot, config.outputRoot, ...Object.values(config.tools)]) {
    if (!isAbsolute(value) || /[\0\r\n]/.test(value)) throw new Error('Doctor paths must be absolute')
  }
  return { config, sha256: digest(text) }
}

function digest(value: string | Buffer): string { return createHash('sha256').update(value).digest('hex') }
function clean(probe: Probe): boolean {
  const result = probe.process
  return result !== null && !probe.error && !result.timedOut && !result.aborted && !result.signal && !result.logTruncated
}

/**
 * Accept a vendor version banner only when execution finished and evidence was retained.
 * @param probe - original bounded command facts.
 * @param output - retained vendor output, not a filename or configured expectation.
 * @param expected - pinned major/minor release.
 * @returns observed version and comparison; Vivado's informational exit 1 is allowed here only.
 */
export function versionFact(probe: Probe, output: string, expected: string): { actual: string | null; matches: boolean; probe: Probe } {
  const actual = output.match(/\bVivado(?:\s+Simulator)?\s+v?(\d{4}\.\d+)\b/i)?.[1] ?? null
  return { actual, matches: clean(probe) && [0, 1].includes(probe.process!.exitCode ?? -1) && actual === expected, probe }
}

async function sourceHashes(root: string): Promise<Record<string, string>> {
  const hashes: Record<string, string> = {}
  async function visit(directory: string): Promise<void> {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      if (item.name.startsWith('.') || item.name === 'node_modules') continue
      const path = join(directory, item.name)
      if (item.isDirectory()) await visit(path)
      else if (item.isFile() && /\.(?:ts|mjs|json|ya?ml|sv|xdc)$/.test(item.name)) hashes[relative(root, path).replace(/\\/g, '/')] = digest(await readFile(path))
    }
  }
  await visit(join(root, 'rtl-tools'))
  return hashes
}

/**
 * Run only host-owned probes and handwritten RTL, preserving original command and process facts.
 * @param subprocess - Harness-managed same-host process provider.
 * @param config - validated pinned deployment configuration.
 * @param configSha256 - digest of the loaded development YAML.
 * @param signal - lifecycle cancellation; no child outlives this call.
 * @param confine - explicit host policy; denial never falls back to unconfined execution.
 * @returns EDA readiness or fail-closed facts, never model readiness.
 */
export async function runDoctor(subprocess: SubprocessRuntime, config: DoctorSettings, configSha256: string, signal: AbortSignal,
  confine: (argv: readonly string[]) => readonly string[]): Promise<DoctorResult> {
  const startedAt = new Date().toISOString()
  const started = performance.now()
  const root = await realpath(config.repositoryRoot)
  await mkdir(config.outputRoot, { recursive: true })
  const directory = await mkdtemp(join(await realpath(config.outputRoot), 'doctor-'))
  await atomicJson(directory, 'started.json', { schema_version: '1.0', state: 'RUNNING', started_at: startedAt })
  const commands: Record<string, Probe> = {}
  async function probe(label: string, executable: string, args: readonly string[]): Promise<Probe> {
    const result: Probe = { executable: null, argv: [], process: null, error: null }
    commands[label] = result
    try {
      result.executable = await subprocess.resolveExecutable(executable, undefined, signal)
      const cmd = process.platform === 'win32' && /\.(bat|cmd)$/i.test(result.executable)
        ? await subprocess.resolveExecutable('cmd.exe', undefined, signal) : undefined
      result.argv = vivadoArgv(result.executable, args, process.platform, cmd)
      await atomicJson(directory, 'commands.json', commands)
      result.process = await runCommand(subprocess, config.limits, confine(result.argv), directory, label, signal, { accept() {} })
    } catch (error) { result.error = error instanceof Error ? error.message.slice(0, config.limits.maxLineChars) : 'Probe failed' }
    await atomicJson(directory, 'commands.json', commands)
    return result
  }
  async function output(probe: Probe): Promise<string> {
    if (!probe.process) return ''
    return await readFile(probe.process.stdoutLog, 'utf8') + '\n' + await readFile(probe.process.stderrLog, 'utf8')
  }
  const gitHead = await probe('git-head', 'git', ['-C', root, 'rev-parse', 'HEAD'])
  const gitStatus = await probe('git-status', 'git', ['-C', root, 'status', '--porcelain', '--untracked-files=normal'])
  const versions: DoctorResult['versions'] = {}
  for (const [tool, path] of Object.entries(config.tools)) {
    const observation = await probe(`${tool}-version`, path, ['-version'])
    versions[tool] = versionFact(observation, await output(observation), config.expectedVivadoVersion)
  }
  let hardware: { status: string; data: unknown; probe: Probe | null } = { status: 'NOT_OBSERVED', data: null, probe: null }
  if (process.platform === 'win32') {
    const observation = await probe('gpu', 'powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      'Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion | ConvertTo-Json -Compress'])
    hardware = { status: 'NOT_OBSERVED', data: null, probe: observation }
    if (clean(observation) && observation.process?.exitCode === 0) {
      try { hardware.data = JSON.parse(await readFile(observation.process.stdoutLog, 'utf8')); hardware.status = 'OBSERVED' }
      catch { /* Invalid hardware JSON remains explicitly unobserved. */ }
    }
  }
  const partQuery: DoctorResult['part_query'] = { status: 'SKIPPED', part: config.part, probe: null }
  let synthesis: SynthesisResult | null = null
  let synthesisError: string | null = null
  if (Object.values(versions).every(value => value.matches) && !signal.aborted) {
    const script = join(directory, 'part.tcl')
    await writeFile(script, [
      'if {[catch {', `set p [get_parts -quiet ${tclWord(config.part)}]`,
      'if {[llength $p] != 1} {error "Expected exactly one target part"}',
      'set f [open part.txt w]', 'puts $f [get_property NAME $p]', 'close $f',
      '} message]} {puts stderr $message; exit 1}', 'exit 0', '',
    ].join('\n'), { flag: 'wx', mode: 0o600 })
    partQuery.probe = await probe('part', config.tools.vivado, ['-mode', 'batch', '-nojournal', '-nolog', '-source', script])
    partQuery.status = 'FAIL'
    if (clean(partQuery.probe) && partQuery.probe.process?.exitCode === 0) {
      try { if ((await readFile(join(directory, 'part.txt'), 'utf8')).trim() === config.part) partQuery.status = 'PASS' }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
    }
    if (partQuery.status === 'PASS' && !signal.aborted) {
      await writeFile(join(directory, 'counter.sv'), 'module counter(input wire clk, input wire rst, output reg [3:0] count);\nalways @(posedge clk) if (rst) count <= 0; else count <= count + 1;\nendmodule\n', { flag: 'wx', mode: 0o600 })
      await writeFile(join(directory, 'clock.xdc'), `create_clock -name clk -period ${config.clockPeriodNs} [get_ports clk]\n`, { flag: 'wx', mode: 0o600 })
      try {
        synthesis = await runSynthesis(subprocess, resolveSynthesisConfig({ ...config.limits, workspaceRoot: directory,
          top: 'counter', sources: ['counter.sv'], includeDirs: [], xdcFiles: ['clock.xdc'], vivado: config.tools.vivado, part: config.part }), signal, confine)
      } catch (error) { synthesisError = error instanceof Error ? error.message.slice(0, config.limits.maxLineChars) : 'Synthesis preflight failed' }
    }
  }
  const edaReady = partQuery.status === 'PASS' && synthesis?.success === true && synthesis.synthesizable === true
    && synthesis.runs.every(run => !run.logTruncated && !run.lineTruncated)
  const result: DoctorResult = { schema_version: '1.0', status: edaReady ? 'MODEL_NOT_READY' : 'EDA_NOT_READY', eda_ready: edaReady,
    model: { status: 'MODEL_NOT_READY', reason: 'No local model adapter configured; no model request was made.' }, directory,
    versions, part_query: partQuery, synthesis, started_at: startedAt, duration_ms: Math.round(performance.now() - started) }
  await atomicJson(directory, 'environment.lock.json', { schema_version: '1.0', captured_at: new Date().toISOString(),
    repository: { root, commit: clean(gitHead) && gitHead.process?.exitCode === 0 ? (await output(gitHead)).trim() : null,
      status: clean(gitStatus) && gitStatus.process?.exitCode === 0 ? (await output(gitStatus)).trim() : null,
      pnpm_lock_sha256: digest(await readFile(join(root, 'pnpm-lock.yaml'))), extension_sha256: await sourceHashes(root) },
    configuration: { sha256: configSha256, resolved: config },
    host: { platform: platform(), release: release(), arch: arch(), node: process.version, gpu: hardware,
      rocm: { version: null, status: 'NOT_VERIFIED' }, inference_backend: { version: null, status: 'MODEL_NOT_READY' } },
    eda: { versions, part_query: partQuery, synthesis_error: synthesisError },
    gates: { G0: 'NOT_ACCEPTED', G1: 'NOT_ACCEPTED', G2: 'NOT_ACCEPTED', official: 'PENDING_OFFICIAL_IMAGE' } })
  await atomicJson(directory, 'doctor.json', result)
  return result
}
