/** Vivado synthesis and report execution, without RTL repair or functional verdicts. @module rtl-tools/synthesis */
import { mkdtemp, open, realpath, stat, writeFile } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { resolveHDLSources, type HDLLanguage, type HDLSource } from './hdl.ts'
import { runCommand, type CommandResult, type ProcessConfig } from './process.ts'
import { parseTiming, parseUtilization, VivadoDiagnostics, type Resources, type Timing, type VivadoDiagnostic } from './vivado-parser.ts'

/** Trusted, fully defaulted synthesis deployment options. XDC is executable trusted configuration. */
export interface SynthesisOptions {
  top: string
  sources: (string | HDLSource)[]
  language?: HDLLanguage | undefined
  includeDirs: string[]
  xdcFiles: string[]
  vivado: string
  part: string
  timeoutMs: number
  threads: number
  maxReportBytes: number
}

/** Resolved same-host configuration, sharing only limits and workspace with simulation. */
export interface SynthesisConfig extends SynthesisOptions, ProcessConfig {
  workspaceRoot: string
  maxDiagnostics: number
}

/** One batch invocation, independently classified from synthesis evidence. */
export interface SynthesisRun extends CommandResult {
  executable: string
  args: string[]
  argv: string[]
  stage: 'synthesis' | 'report'
  errors: VivadoDiagnostic[]
  warnings: VivadoDiagnostic[]
  omittedDiagnostics: number
  lineTruncated: boolean
}

/** Canonical synthesis result; unknown and report failures never masquerade as RTL failures. */
export interface SynthesisResult {
  success: boolean
  synthesizable: boolean | null
  stage: 'synthesis' | 'report'
  backend: 'vivado'
  resources: Resources
  timing: Timing
  errors: VivadoDiagnostic[]
  warnings: VivadoDiagnostic[]
  summary: string
  artifactsDir: string
  runs: SynthesisRun[]
  omittedDiagnostics: number
}

/**
 * Validate trusted synthesis configuration before a tool is registered.
 * @param config - parsed configuration with deployment defaults already applied.
 * @returns an independent validated configuration.
 */
export function resolveSynthesisConfig(config: SynthesisConfig): SynthesisConfig {
  if (!isAbsolute(config.workspaceRoot)) throw new Error('synthesis workspaceRoot must be absolute')
  if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(config.top)) throw new Error('synthesis top must be a simple module identifier')
  if (!/^[A-Za-z0-9_-]+$/.test(config.part)) throw new Error('synthesis part must be a device identifier')
  if (config.sources.length === 0) throw new Error('synthesis sources must contain RTL, not the testbench')
  for (const [name, value] of Object.entries({ timeoutMs: config.timeoutMs, graceMs: config.graceMs,
    maxLogBytes: config.maxLogBytes, maxReportBytes: config.maxReportBytes, maxLineChars: config.maxLineChars,
    maxDiagnostics: config.maxDiagnostics, threads: config.threads })) {
    if (!Number.isSafeInteger(value) || value <= 0 || value > 2_147_483_647) throw new Error(`synthesis ${name} must be a positive bounded integer`)
  }
  const sources = resolveHDLSources(config.sources, config.language)
  if (sources.some(source => source.role !== 'dut')) throw new Error('synthesis sources must contain only DUT files')
  for (const path of [config.vivado, ...sources.map(source => source.path), ...config.includeDirs, ...config.xdcFiles]) {
    if (!path.trim() || /[\0\r\n]/.test(path)) throw new Error('synthesis paths must be nonempty and contain no NUL or newline')
  }
  return { ...config, workspaceRoot: resolve(config.workspaceRoot), sources: structuredClone(config.sources),
    includeDirs: [...config.includeDirs], xdcFiles: [...config.xdcFiles] }
}

/**
 * Encode a single Tcl word with substitution disabled, including braces and backslashes.
 * @param value - trusted configuration value or canonical filesystem path.
 * @returns one double-quoted Tcl word; never executable Tcl supplied by the model.
 */
export function tclWord(value: string): string {
  return '"' + value.replace(/\\/g, '\\\\').replace(/[{}$\[\]"]/g, '\\$&').replace(/\r/g, '\\r').replace(/\n/g, '\\n') + '"'
}

function tclPath(path: string): string {
  return tclWord(process.platform === 'win32' ? path.replace(/\\/g, '/') : path)
}

/**
 * Adapt the vendor batch launcher without permitting cmd expansion or metacharacter injection.
 * @param executable - resolved Vivado launcher.
 * @param args - fixed flags and trusted paths.
 * @param platform - host OS.
 * @param commandProcessor - resolved system cmd.exe on Windows.
 * @returns exact managed argv; unsupported batch arguments fail before spawning.
 */
export function vivadoArgv(executable: string, args: readonly string[], platform: NodeJS.Platform, commandProcessor?: string): readonly string[] {
  if (platform !== 'win32' || !/\.(?:bat|cmd)$/i.test(executable)) return [executable, ...args]
  if (!commandProcessor) throw new Error('Windows batch launch requires a resolved cmd.exe')
  for (const value of [executable, ...args]) {
    if (/["%!^&|<>()\r\n\0]/.test(value)) throw new Error('Unsupported metacharacter in Vivado batch argument')
  }
  // The process provider owns Win32 argv quoting. A prequoted /c string would be escaped twice.
  return [commandProcessor, '/d', '/v:off', '/c', 'call', executable, ...args]
}

async function resolvePaths(root: string, paths: string[], directory = false): Promise<string[]> {
  return Promise.all(paths.map(async path => {
    const absolute = await realpath(resolve(root, path))
    const info = await stat(absolute)
    if (directory ? !info.isDirectory() : !info.isFile()) throw new Error(`Invalid synthesis ${directory ? 'directory' : 'file'}: ${path}`)
    return absolute
  }))
}

async function existsNonempty(path: string): Promise<boolean> {
  try { const info = await stat(path); return info.isFile() && info.size > 0 } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false
    throw error
  }
}

async function boundedRead(path: string, limit: number): Promise<string | null> {
  let file
  try { file = await open(path, 'r') } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
  try {
    if ((await file.stat()).size > limit) return null
    const buffer = Buffer.alloc(limit + 1)
    let offset = 0
    while (offset < buffer.length) {
      const { bytesRead } = await file.read(buffer, offset, buffer.length - offset, null)
      if (!bytesRead) break
      offset += bytesRead
    }
    return offset > limit ? null : buffer.subarray(0, offset).toString('utf8')
  } finally { await file.close() }
}

function count(text: string | null): number | null {
  const value = text?.trim() ?? ''
  return /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null
}

/**
 * Synthesize candidate RTL and report from its checkpoint in separate managed batch sessions.
 * @param subprocess - same-host process service.
 * @param config - trusted resolved configuration.
 * @param signal - tool and plugin cancellation.
 * @param confine - applies the caller's sandbox to exact argv, or throws.
 * @param onRun - host observer retains completed process facts even if later setup fails.
 * @returns bounded facts with independent synthesis and reporting outcomes; setup/provider failures throw.
 */
export async function runSynthesis(
  subprocess: SubprocessRuntime, config: SynthesisConfig, signal: AbortSignal,
  confine: (argv: readonly string[]) => readonly string[],
  onRun?: (run: SynthesisRun) => void,
): Promise<SynthesisResult> {
  signal.throwIfAborted()
  const root = await realpath(config.workspaceRoot)
  const sourceTypes = resolveHDLSources(config.sources, config.language)
  if (sourceTypes.some(source => source.role !== 'dut')) throw new Error('synthesis sources must contain only DUT files')
  const sources = await resolvePaths(root, sourceTypes.map(source => source.path))
  const includes = await resolvePaths(root, config.includeDirs, true)
  const constraints = await resolvePaths(root, config.xdcFiles)
  const executable = await subprocess.resolveExecutable(config.vivado, undefined, signal)
  const cmd = process.platform === 'win32' && /\.(bat|cmd)$/i.test(executable)
    ? await subprocess.resolveExecutable('cmd.exe', undefined, signal) : undefined
  const artifactsDir = await mkdtemp(join(root, '.rtl-synth-'))
  const checkpoint = join(artifactsDir, 'design.dcp')
  const netlist = join(artifactsDir, 'netlist.v')
  const scripts = {
    synthesis: [
      `set_param general.maxThreads ${config.threads}`,
      'create_project -in_memory -part ' + tclWord(config.part),
      `set_property include_dirs [list ${includes.map(tclPath).join(' ')}] [current_fileset]`,
      ...sources.map((path, index) => `read_verilog${sourceTypes[index]!.language === 'systemverilog' ? ' -sv' : ''} [list ${tclPath(path)}]`),
      ...constraints.map(path => `read_xdc [list ${tclPath(path)}]`),
      `synth_design -top ${tclWord(config.top)} -part ${tclWord(config.part)}`,
      `write_verilog -force -mode funcsim ${tclPath(netlist)}`,
      `write_checkpoint -force ${tclPath(checkpoint)}`,
    ],
    report: [
      `set_param general.maxThreads ${config.threads}`,
      `open_checkpoint ${tclPath(checkpoint)}`,
      'report_utilization -file utilization.rpt',
      'report_timing_summary -delay_type min_max -report_unconstrained -file timing.rpt',
      'set f [open clocks.count w]', 'puts $f [llength [get_clocks -quiet *]]', 'close $f',
      'set f [open paths.count w]', 'puts $f [llength [get_timing_paths -quiet -delay_type max -max_paths 1]]', 'close $f',
    ],
  }
  const commands: Record<string, readonly string[]> = {}
  const argumentsByStage: Record<string, string[]> = {}
  for (const stage of ['synthesis', 'report'] as const) {
    const script = join(artifactsDir, `${stage}.tcl`)
    // Tcl catch makes command failures fatal even when the vendor batch launcher exits normally.
    await writeFile(script, `if {[catch {\n${scripts[stage].join('\n')}\n} message]} {\n  puts stderr "ERROR: $message"\n  exit 1\n}\nexit 0\n`, { flag: 'wx', mode: 0o600 })
    argumentsByStage[stage] = ['-mode', 'batch', '-nojournal', '-nolog', '-source', script]
    commands[stage] = vivadoArgv(executable, argumentsByStage[stage]!, process.platform, cmd)
  }
  await writeFile(join(artifactsDir, 'commands.json'), JSON.stringify(commands, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
  const aggregate = new VivadoDiagnostics(config.maxDiagnostics, config.maxLineChars)
  const runs: SynthesisRun[] = []
  const execute = async (stage: SynthesisRun['stage']) => {
    const diagnostics = new VivadoDiagnostics(config.maxDiagnostics, config.maxLineChars)
    const outcome = await runCommand(subprocess, config, confine(commands[stage]!), artifactsDir, stage, signal, diagnostics)
    const run: SynthesisRun = { ...outcome, stage, executable, args: argumentsByStage[stage]!, argv: [...commands[stage]!], errors: diagnostics.errors, warnings: diagnostics.warnings,
      omittedDiagnostics: diagnostics.omitted, lineTruncated: diagnostics.lineTruncated }
    runs.push(run)
    onRun?.(run)
    for (const diagnostic of [...diagnostics.errors, ...diagnostics.warnings]) aggregate.add(diagnostic)
    aggregate.omitted += diagnostics.omitted
    return { run, diagnostics, clean: outcome.exitCode === 0 && outcome.signal === null && !outcome.timedOut
      && !outcome.aborted && !diagnostics.errorSeen && !diagnostics.lineTruncated }
  }
  const synth = await execute('synthesis')
  const produced = await existsNonempty(netlist) && await existsNonempty(checkpoint)
  let synthesizable: boolean | null = synth.clean && produced ? true : null
  if (!synth.run.timedOut && !synth.run.aborted && synth.run.signal === null && !synth.diagnostics.environmentFailure
    && synth.diagnostics.errorSeen) synthesizable = false
  if (synth.clean && !produced) aggregate.add({ severity: 'ERROR', type: 'missing_artifact', message: 'Vivado exited successfully but did not produce both the netlist and checkpoint.' })
  let success = false
  let resources: Resources = { lut: null, ff: null, bram: null, dsp: null }
  let timing = parseTiming(null, null, null)
  if (synthesizable === true && !signal.aborted) {
    const report = await execute('report')
    if (report.clean) {
      const utilization = await boundedRead(join(artifactsDir, 'utilization.rpt'), config.maxReportBytes)
      const timingReport = await boundedRead(join(artifactsDir, 'timing.rpt'), config.maxReportBytes)
      resources = parseUtilization(utilization ?? '')
      timing = parseTiming(timingReport, count(await boundedRead(join(artifactsDir, 'clocks.count'), 128)),
        count(await boundedRead(join(artifactsDir, 'paths.count'), 128)))
      success = Object.values(resources).every(value => value !== null)
        && timing.reason !== 'report_unavailable' && timing.reason !== 'report_parse_error'
      if (!success) aggregate.add({ severity: 'ERROR', type: 'report_parse_error', message: 'Required report fields are missing, oversized or invalid; unknown metrics remain null.' })
      if (timing.reason === 'no_clocks' || timing.reason === 'no_timing_paths' || timing.reason === 'non_finite_wns') {
        aggregate.add({ severity: 'WARNING', type: timing.reason, message: `WNS is unavailable: ${timing.reason}. This is not timing-closure evidence.` })
      }
      if (timingReport?.includes('Timing constraints are not met.')) {
        aggregate.add({ severity: 'WARNING', type: 'timing_constraints_not_met', message: 'Vivado timing summary states: Timing constraints are not met. WNS alone does not cover all timing checks.' })
      }
    }
  }
  success &&= !signal.aborted
  const stage = runs.at(-1)!.stage
  const summary = success ? 'Synthesis and reports completed; functional correctness and post-route timing are not verified.'
    : synthesizable === true ? 'Synthesis produced a netlist; reporting did not complete successfully.'
      : synthesizable === false ? 'Vivado reported a synthesis error; inspect the observed diagnostics.'
        : 'Synthesis is unconfirmed; inspect termination, environment and artifact evidence.'
  const result: SynthesisResult = { success, synthesizable, stage, backend: 'vivado', resources, timing,
    errors: aggregate.errors, warnings: aggregate.warnings, summary, artifactsDir, runs, omittedDiagnostics: aggregate.omitted }
  await writeFile(join(artifactsDir, 'result.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
  return result
}
