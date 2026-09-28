/** Public-interface and DUT-only checks; no reference or testbench input. @module rtl-tools/reference/checks */
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { checkInterface } from '../interface.ts'
import { runCommand, type ProcessConfig } from '../process.ts'
import { runSynthesis, vivadoArgv } from '../synthesis.ts'
import { VivadoDiagnostics } from '../vivado-parser.ts'
import type { PromptInterface } from './task.ts'

/** Trusted deployment settings, never supplied by the model. */
export interface CheckConfig extends ProcessConfig {
  xvlog: string
  vivado: string
  part: string
  threads: number
  maxReportBytes: number
  maxDiagnostics: number
  maxSourceBytes: number
}

/** Reject unsupported source constructs before invoking any compiler.
 * @param source - Complete model-supplied source, not a filename.
 * @param iface - Public prompt interface.
 * @param maxBytes - Candidate size cap.
 */
export function validateSource(source: string, iface: PromptInterface, maxBytes: number): void {
  if (!source.trim() || Buffer.byteLength(source) > maxBytes || source.includes('\0')) throw new Error('Empty, oversized or invalid source')
  // Comments can carry synthesis attributes. Reject file/string/directive constructs even inside comments.
  if (/[`"\\]/.test(source) || /\$[A-Za-z_]/.test(source) || /\b(?:include|DPI|bind|config|library)\b/i.test(source)) {
    throw new Error('File directives, strings, escaped identifiers, system tasks and foreign code are not permitted')
  }
  if (iface.ports.some(port => port.direction === 'inout')) throw new Error('Inout interface checking is not supported')
  checkInterface(source, { top: iface.module, ports: iface.ports as { name: string; direction: 'input' | 'output'; width: number }[] })
}

/** Run syntax and independent synthesis; success never means hidden functional correctness.
 * @param subprocess - Harness process owner, with scrubbed child environment.
 * @param config - Host tool paths and limits.
 * @param directory - Fresh candidate directory inside this invocation.
 * @param source - Validated candidate bytes.
 * @param iface - Public interface only.
 * @param signal - Total run cancellation.
 * @returns Bounded tool facts, without L2 or VERIFIED labels.
 */
export async function checkDut(subprocess: SubprocessRuntime, config: CheckConfig, directory: string,
  source: string, iface: PromptInterface, signal: AbortSignal): Promise<Record<string, unknown>> {
  validateSource(source, iface, config.maxSourceBytes)
  await mkdir(directory)
  const path = join(directory, 'candidate.sv')
  await writeFile(path, source, { flag: 'wx', mode: 0o600 })
  const executable = await subprocess.resolveExecutable(config.xvlog, undefined, signal)
  const cmd = process.platform === 'win32' ? await subprocess.resolveExecutable('cmd.exe', undefined, signal) : undefined
  const diagnostics = new VivadoDiagnostics(config.maxDiagnostics, config.maxLineChars)
  const syntax = await runCommand(subprocess, config, vivadoArgv(executable, ['--sv', path], process.platform, cmd), directory, 'syntax', signal, diagnostics)
  const syntaxPass = syntax.exitCode === 0 && syntax.signal === null && !syntax.aborted && !syntax.timedOut && !diagnostics.errorSeen
  if (!syntaxPass) return { syntax: false, synthesis: null, graded: false, errors: diagnostics.errors, process: syntax }
  const synthesis = await runSynthesis(subprocess, { ...config, workspaceRoot: directory, top: iface.module,
    sources: [{ path, role: 'dut', language: 'systemverilog' }], includeDirs: [], xdcFiles: [], language: 'systemverilog' }, signal, argv => argv)
  return { syntax: true, synthesis: synthesis.synthesizable, graded: false, errors: synthesis.errors,
    warnings: synthesis.warnings, resources: synthesis.resources, artifactsDir: synthesis.artifactsDir }
}
