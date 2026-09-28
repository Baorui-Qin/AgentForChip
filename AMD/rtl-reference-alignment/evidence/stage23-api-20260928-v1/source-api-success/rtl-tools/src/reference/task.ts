/** Prompt-only directory adapter. Mock artifacts are never grading evidence. @module rtl-tools/reference/task */
import { appendFile, copyFile, mkdir, mkdtemp, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { basename, join, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

/** Interface encoded by the reference prompt's bullet-list grammar, not an HDL parser. */
export interface PromptInterface {
  module: string
  ports: { name: string; direction: 'input' | 'output' | 'inout'; width: number }[]
}

/** Explicit protocol-only behavior and a development wall-clock limit. */
export interface MockOptions {
  outcome: 'stub' | 'empty' | 'error' | 'timeout'
  timeoutMs: number
}

/** Persisted outcomes do not assert compilation, simulation, synthesis or correctness. */
export type TaskStatus = 'mock_candidate' | 'candidate_ungraded' | 'empty_answer' | 'invalid_input' | 'internal_error' | 'timeout' | 'cancelled'

/** One fresh solve receives only the public prompt and its private artifact directory. */
export interface TaskSolver {
  backend: string
  solve(input: { prompt: string; iface: PromptInterface; workDir: string; signal: AbortSignal;
    log: (tool: string, fields: Record<string, unknown>) => Promise<void> }): Promise<string>
}

class InputError extends Error {}

/** Parse the supplied module name and port bullets; partial declarations fail closed.
 * @param prompt - Public task specification.
 * @returns Complete interface for the supported reference grammar.
 */
export function interfaceFromPrompt(prompt: string): PromptInterface {
  const module = /\bmodule\s+named\s+([A-Za-z_][A-Za-z0-9_$]*)\b/.exec(prompt)?.[1]
  if (!module) throw new InputError('Prompt must declare a module named <identifier>')
  const ports: PromptInterface['ports'] = []
  for (const line of prompt.split(/\r?\n/)) {
    if (!/^\s*-\s*(?:input|output|inout)\b/.test(line)) continue
    const match = /^\s*-\s*(input|output|inout)\s+([A-Za-z_][A-Za-z0-9_$]*)(?:\s*\(\s*(\d+)\s+bits?\s*\))?\s*$/.exec(line)
    if (!match) throw new InputError('Unsupported port declaration: ' + line.trim())
    const width = Number(match[3] ?? '1')
    if (!Number.isSafeInteger(width) || width < 1) throw new InputError('Invalid port width')
    if (ports.some(port => port.name === match[2])) throw new InputError('Duplicate port: ' + match[2])
    ports.push({ direction: match[1] as 'input' | 'output' | 'inout', name: match[2]!, width })
  }
  if (!ports.length) throw new InputError('Prompt contains no supported port declarations')
  return { module, ports }
}

function mockStub(iface: PromptInterface): string {
  const ports = iface.ports.map(port => `  ${port.direction} wire ${port.width === 1 ? '' : `[${port.width - 1}:0] `}${port.name}`)
  const outputs = iface.ports.filter(port => port.direction === 'output').map(port => `assign ${port.name} = ${port.width}'d0;`)
  return ['// EXPLICIT MOCK: interface fixture only; not a model-generated solution.', `module ${iface.module} (`, ports.join(',\n'), ');', ...outputs, 'endmodule', ''].join('\n')
}

/** Produce independent invocation evidence and the two reference output files.
 * @param args - Exactly task_dir and out_dir, relative to the caller's working directory.
 * @param options - Validated explicit mock deployment configuration.
 * @param parent - Profile lifecycle cancellation.
 * @param solver - Optional real provider-backed solver; absent means explicit mock only.
 * @returns Terminal status, process exit code and private work directory.
 */
export async function runTask(args: readonly string[], options: MockOptions, parent: AbortSignal, solver?: TaskSolver): Promise<{ status: TaskStatus; exitCode: number; workDir: string }> {
  if (args.length !== 2 || args.some(arg => !arg.trim() || arg.startsWith('--'))) throw new InputError('Usage: run.sh <task_dir> <out_dir>')
  const taskDir = resolve(args[0]!), outDir = resolve(args[1]!)
  if (taskDir === outDir) throw new InputError('Input and output directories must differ')
  await mkdir(outDir, { recursive: true })
  const entries = await readdir(outDir)
  if (entries.some(entry => ['solution.v', 'trace.jsonl'].includes(entry.toLowerCase()))) throw new InputError('Output files already exist; use a fresh output directory')
  // A persistent exclusive claim prevents concurrent writers and accidental reuse after a crash.
  await mkdir(join(outDir, '.rtl-invocation'), { mode: 0o700 })
  const workDir = await mkdtemp(join(outDir, '.rtl-invocation', 'run-'))
  const tracePath = join(workDir, 'trace.jsonl')
  await writeFile(join(outDir, 'solution.v'), '', { flag: 'wx' })
  await writeFile(join(outDir, 'trace.jsonl'), '', { flag: 'wx' })
  const started = Date.now()
  const deadline = new AbortController()
  const timer = setTimeout(() => deadline.abort(), options.timeoutMs)
  const signal = AbortSignal.any([parent, deadline.signal])
  let modelCalls = 0
  const log = async (tool: string, fields: Record<string, unknown>) => {
    if (tool === 'llm_request') modelCalls++
    const line = JSON.stringify({ ts: Date.now() / 1000, tool, evidence: solver ? 'api_development_ungraded' : 'explicit_mock_protocol_only', ...fields }) + '\n'
    await appendFile(tracePath, line)
    await appendFile(join(outDir, 'trace.jsonl'), line)
  }
  let status: TaskStatus = 'internal_error', exitCode = 1, solution = ''
  try {
    await log('invocation', { task_id: basename(taskDir), work_dir: workDir, backend: solver?.backend ?? 'mock', ...solver ? { isolation: 'capability_only' } : { mock_outcome: options.outcome }, timeout_ms: options.timeoutMs, real_model_calls: 0 })
    signal.throwIfAborted()
    let prompt: string
    try {
      if (await realpath(taskDir) === await realpath(outDir)) throw new InputError('Input and output directories must differ')
      prompt = await readFile(join(taskDir, 'prompt.txt'), { encoding: 'utf8', signal })
    } catch (error) {
      signal.throwIfAborted()
      throw new InputError(error instanceof Error ? error.message : 'Cannot read prompt.txt')
    }
    if (!prompt.trim()) throw new InputError('prompt.txt is empty')
    await writeFile(join(workDir, 'prompt.txt'), prompt, { flag: 'wx' })
    const iface = interfaceFromPrompt(prompt)
    await log('read_prompt', { sha256: createHash('sha256').update(prompt).digest('hex'), interface: iface })
    if (solver) {
      solution = await solver.solve({ prompt, iface, workDir, signal, log })
    } else {
      await log('mock_generate', { phase: 'start', real_model_calls: 0 })
      if (options.outcome === 'timeout') await delay(options.timeoutMs + 1000, undefined, { signal })
      if (options.outcome === 'error') throw new Error('Explicit mock internal failure')
      solution = options.outcome === 'empty' ? '' : mockStub(iface)
    }
    signal.throwIfAborted()
    status = solution ? (solver ? 'candidate_ungraded' : 'mock_candidate') : 'empty_answer'
    exitCode = 0
  } catch (error) {
    solution = ''
    status = signal.aborted ? (parent.aborted ? 'cancelled' : 'timeout') : error instanceof InputError ? 'invalid_input' : 'internal_error'
    exitCode = status === 'timeout' ? 124 : status === 'cancelled' ? 130 : status === 'invalid_input' ? 2 : 1
    await log('failure', { status, rc: exitCode, excerpt: (error instanceof Error ? error.message : String(error)).slice(0, 2048) })
  } finally {
    clearTimeout(timer)
  }
  await writeFile(join(workDir, 'solution.v'), solution, { flag: 'wx' })
  await copyFile(join(workDir, 'solution.v'), join(outDir, 'solution.v'))
  await log('result', { status, rc: exitCode, elapsed_s: (Date.now() - started) / 1000, solution_sha256: createHash('sha256').update(solution).digest('hex'), solution_bytes: Buffer.byteLength(solution), model_call_attempts: modelCalls, ...solver ? {} : { real_model_calls: 0 }, graded: false })
  return { status, exitCode, workDir }
}
