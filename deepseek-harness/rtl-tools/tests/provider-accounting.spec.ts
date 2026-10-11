import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { PassThrough } from 'node:stream'
import { afterEach, expect, it } from 'vitest'
import { ToolCallId, type Message, type StreamChunk } from '@deepseek-ai/dsh-llm'
import type { SubprocessHandle, SubprocessOutcome, SubprocessRuntime, SubprocessSpawnSpec } from '@deepseek-ai/dsh-subprocess'
import { callAction } from '../src/phase1/p09-action-call.ts'
import { type ContextInput } from '../src/phase1/p09-context.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import type { ModelRuntime } from '../src/phase1/model.ts'
import { installTestOperationScope } from './test-operation-scope.ts'
import { providerUsage } from '../src/phase1/provider-usage.ts'
import { StreamAudit } from '../src/phase1/stream-audit.ts'
import { protocolBody, withOfflineProtocolProvider } from './helpers/provider-protocol-fixture.ts'

// Each call uses an explicit logical tokenizer double, not an OS process or global mock.
const operationScope = installTestOperationScope()
const roots: string[] = [], counterHandles: SubprocessHandle[] = []
afterEach(async context => operationScope().cleanup(async () => {
  for (const handle of counterHandles.splice(0)) {
    handle.terminate(); await handle.done; await handle.waitForExit()
    handle.stdout?.destroy(); handle.stderr?.destroy()
  }
}, async () => {
  const owned = roots.splice(0)
  if (context.task.result?.errors?.length) {
    console.error(JSON.stringify({ kind: 'PROVIDER_ACCOUNTING_FAILURE_ROOTS_RETAINED', roots: owned, provider: 'explicit-offline-double' }))
    return
  }
  for (const root of owned) {
    if (dirname(root) !== resolve(tmpdir()) || !basename(root).startsWith('repair-v2-')) throw new Error('Unexpected temporary accounting root')
    await rm(root, { force: true, recursive: true })
  }
}))

function logicalCounter(runtimeRoot: string): SubprocessRuntime {
  return { spawn(spec: SubprocessSpawnSpec): SubprocessHandle {
    spec.signal?.throwIfAborted()
    if (spec.argv.length !== 3 || spec.argv[0] !== join(runtimeRoot, 'counter.exe') ||
      spec.argv[1] !== join(spec.cwd, 'input.json') || spec.argv[2] !== join(runtimeRoot, 'tokenizer.json') ||
      spec.stdio.stdin !== 'ignore' || spec.stdio.stdout !== 'pipe' || spec.stdio.stderr !== 'pipe') throw new Error('Unexpected logical tokenizer invocation')
    const stdout = new PassThrough(), stderr = new PassThrough(), result = Promise.withResolvers<SubprocessOutcome>()
    let settled = false
    const finish = (outcome: SubprocessOutcome, output?: string) => {
      if (settled) return
      settled = true; spec.signal?.removeEventListener('abort', terminate)
      stdout.end(output); stderr.end(); result.resolve(outcome)
    }
    const terminate = () => finish({ exitCode: null, signal: 'SIGTERM' })
    spec.signal?.addEventListener('abort', terminate, { once: true })
    queueMicrotask(() => finish({ exitCode: 0, signal: null }, JSON.stringify({ tokens: 1000 })))
    const handle: SubprocessHandle = { stdin: undefined, stdout, stderr, collected: {}, done: result.promise, terminate,
      async waitForExit(signal) {
        if (signal?.aborted && !settled) return false
        await result.promise; return settled
      } }
    counterHandles.push(handle)
    return operationScope().observeManaged(handle)
  } } as SubprocessRuntime
}

function repair(): ContextInput {
  const source = 'module TopModule(input clk, d, output q); assign q = d; endmodule\n'
  return { task: { id: 'test', spec: 'Capture d on both edges.', interface: { top: 'TopModule', ports: [{ name: 'clk', direction: 'input', width: 1 }, { name: 'd', direction: 'input', width: 1 }, { name: 'q', direction: 'output', width: 1 }] }, constraints: 'Single DUT.' },
    current: { revision_id: 'r0', source, source_sha256: sha256(source) }, binding: { revision_id: 'r0', source_sha256: sha256(source), verification_key: 'sha256:' + 'a'.repeat(64) },
    sample_id: 'sample', variant_id: 'C', purpose: 'repair', tool_mode: true, pending_verification: false, ledger: [],
    repair_control: { mode: 'normal', compacted: false, best_revision_id: 'r0', best_source_sha256: sha256(source), rejected: [] },
    feedback: { schema_version: '1.4', evidence_kind: 'live_verification', eda_rerun: false, model_repair_executed: false, original_run: 'mock', result_sha256: 'b'.repeat(64), parser_version: 'mock', parser_sha256: 'c'.repeat(64), inputs: [], old_diagnostics: {},
      stages: ['compile', 'elaborate', 'simulation', 'synthesis'].map(stage => ({ stage, status: stage === 'simulation' ? 'FAIL' : stage === 'synthesis' ? 'SKIPPED' : 'PASS', complete: true, process_normal: true, process_clean: true, functional_failure: stage === 'simulation', diagnostics: [],
        verdict: { records: 1, completed: true, checks: 224, mismatches: 93, fatal: false } })) } }
}

async function actionSetup(modelRuntime?: ModelRuntime) {
  const root = await mkdtemp(join(tmpdir(), 'repair-v2-')); roots.push(root)
  await mkdir(join(root, 'models'))
  const runtimeRoot = join(root, 'runtime'); await mkdir(runtimeRoot)
  await writeFile(join(runtimeRoot, 'counter.exe'), 'mock'); await writeFile(join(runtimeRoot, 'tokenizer.json'), '{}')
  const manifest = JSON.stringify({ revision: 'a'.repeat(40), executable: 'counter.exe', tokenizer: 'tokenizer.json', compiler: 'mock', files: { 'counter.exe': sha256('mock'), 'tokenizer.json': sha256('{}') } })
  await writeFile(join(runtimeRoot, 'manifest.json'), manifest)
  const wires: unknown[] = [], directories: string[] = []
  let chunks: StreamChunk[] = []
  let source: ((signal: AbortSignal) => AsyncIterable<StreamChunk>) | undefined
  const runtime: ModelRuntime = modelRuntime ?? { async prepareCall(config) { return { config, context: { contextWindow: 131072 }, adapterDefaults: {},
    retryPolicy: { mode: 'normal', maxRetries: 0, retryableCodes: [], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 },
    async *stream(request): AsyncGenerator<StreamChunk> {
      wires.push(request)
      if (source) yield* source(request.signal!)
      else yield* chunks
    } } } }
  const p09 = { variant: 'C' as const, limits: { window: 131072, output: 16384, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 },
    tokenizer: { python: '', root, manifestSha256: '', timeoutMs: 1000 }, skillsFile: null, skillsSha256: null, maxRequests: 15 }
  const args = { root, experiment: 'sample', sequence: 1, input: repair(), history: [] as Message[], auto: { registry: 'full' as const, campaignRoot: root, bucket: 'preflight' as const, sampleId: 'sample', runtimeRoot, runtimeManifestSha256: sha256(manifest), maxToolSteps: 15 },
    p09, model: { model: 'deepseek-flash', maxTokens: 16384, maxResponseBytes: 262144, timeoutMs: 10000, temperature: 0 }, runtime, subprocess: logicalCounter(runtimeRoot),
    maxEventBytes: 1048576, signal: operationScope().signal, loadSkills: async () => [], claim: async (path: string) => { directories.push(path) }, expectedRequestHash: null, compactThreshold: 0.8 }
  return { args, wires, directories, respond(value: StreamChunk[]) { chunks = value },
    respondWith(value: (signal: AbortSignal) => AsyncIterable<StreamChunk>) { source = value } }
}

const usage: StreamChunk = { type: 'usage', usage: { inputTokens: 101, cacheReadTokens: 7, outputTokens: 53, totalTokens: 161 } }
const stop: StreamChunk = { type: 'finish', reason: { kind: 'stop' } }
const tool: StreamChunk = { type: 'tool-call-delta', index: 1, id: ToolCallId('complete'), name: 'read_current_rtl', argumentsDelta: '{}' }

async function run(chunks: StreamChunk[], semanticLimit = 262144) {
  const s = await actionSetup(); s.respond(chunks); s.args.model.maxResponseBytes = semanticLimit
  const result = await operationScope().track('callAction', () => callAction(s.args))
  const receipt = JSON.parse(await readFile(join(s.directories[0]!, 'model.json'), 'utf8'))
  return { result, receipt, directory: s.directories[0]! }
}

it('retains small semantic output and exact provider accounting', async () => {
  const { result } = await run([tool, usage, stop])
  expect(result).toMatchObject({ error_code: null, prompt_tokens: 108, completion_tokens: 53 })
})

it.each(['reasoning', 'tool'] as const)('keeps large %s semantics intact after verbose audit overflow', async kind => {
  const value = kind === 'tool' ? JSON.stringify({ source: 'x'.repeat(18000) }) : '理'.repeat(10000)
  const chunks: StreamChunk[] = [...value].map(text => kind === 'reasoning'
    ? { type: 'reasoning-delta', index: 0, text }
    : { type: 'tool-call-delta', index: 0, id: ToolCallId('large'), name: 'edit_dut', argumentsDelta: text })
  const { result } = await run([...chunks, usage, stop])
  expect(result.error_code).toBeNull()
  const block = result.message!.content[0]!
  expect(block.type === 'tool-call' ? block.arguments : 'text' in block ? block.text : null).toBe(value)
  expect(result.prompt_tokens).toBe(108)
})

it('retains terminal provider error after verbose audit overflow', async () => {
  const chunks: StreamChunk[] = Array.from({ length: 12000 }, () => ({ type: 'reasoning-delta', index: 0, text: 'x' }))
  const { result, directory } = await run([...chunks, usage, { type: 'finish', reason: { kind: 'error', failure: { code: 'SERVER', message: 'unsafe provider detail' } } }])
  expect(result).toMatchObject({ error_code: 'SERVER', finish_kind: 'error', prompt_tokens: 108, message: null })
  expect(await readFile(join(directory, 'stream.json'), 'utf8')).not.toContain('unsafe provider detail')
})

it('drains the real Attempt 4 truncated prefix to explicitly synthetic terminal metadata', async () => {
  // The appended terminal suffix is an offline oracle, never historical billing.
  const raw = await readFile(new URL('../../../AMD/phase2-tool-skill/p2-validation-attempt5/fix/attempt4-truncated-stream.json', import.meta.url), 'utf8')
  const prefix = JSON.parse(raw) as StreamChunk[]
  expect(Buffer.byteLength(raw)).toBeGreaterThan(524288)
  expect(prefix.some(c => c.type === 'usage' || c.type === 'finish')).toBe(false)
  const { result, directory } = await run([...prefix, tool, usage, stop])
  expect(result).toMatchObject({ error_code: null, finish_kind: 'stop', prompt_tokens: 108, completion_tokens: 53 })
  // The bounded array has a new public location; the full received archive stays intact.
  const audit = JSON.parse(await readFile(join(directory, 'stream-audit.json'), 'utf8'))
  expect(audit.metadata).toMatchObject({ truncated: true })
  expect(audit.metadata.original_bytes).toBeGreaterThan(audit.metadata.retained_bytes)
  expect(Buffer.byteLength(JSON.stringify(audit.chunks))).toBeLessThanOrEqual(524288)
  expect(audit.metadata.retained_bytes).toBe(Buffer.byteLength(JSON.stringify(audit.chunks)))
  expect(audit.chunks).toContainEqual(usage); expect(audit.chunks).toContainEqual(stop)
  expect(Buffer.byteLength(await readFile(join(directory, 'stream.json')))).toBeGreaterThan(524288)
})

it('preserves the semantic acceptance bound while collecting terminal usage', async () => {
  for (const terminal of [stop, { type: 'finish', reason: { kind: 'error', failure: { code: 'SERVER', message: 'late error' } } } as StreamChunk]) {
    const overflow: StreamChunk = { type: 'reasoning-delta', index: 0, text: 'x'.repeat(100) }
    const { result, directory } = await run([overflow, tool, usage, terminal], 50)
    expect(result).toMatchObject({ error_code: 'OUTPUT_TRUNCATED', message: null, prompt_tokens: 108, completion_tokens: 53 })
    expect(JSON.parse(await readFile(join(directory, 'stream.json'), 'utf8'))).toContainEqual(overflow)
    expect((await readFile(join(directory, 'stream.jsonl'), 'utf8')).trim().split('\n')).toHaveLength(4)
    const audit = JSON.parse(await readFile(join(directory, 'stream-audit.json'), 'utf8'))
    expect(audit.chunks).toContainEqual(usage)
    expect(result.observation.provider_usage).toMatchObject({ state: 'USAGE_RETURNED', total_tokens: 161 })
  }
})

it('separates absent, interrupted and invalid provider usage without substituting zero', () => {
  expect(providerUsage(undefined, true)).toMatchObject({ state: 'USAGE_MISSING_PROVIDER', code: 'PROVIDER_USAGE_NOT_RETURNED', total_tokens: null })
  expect(providerUsage(undefined, false)).toMatchObject({ state: 'USAGE_LOST_HOST', total_tokens: null })
  expect(providerUsage({ inputTokens: 1, outputTokens: 2, totalTokens: 4 }, true)).toMatchObject({ state: 'USAGE_UNPARSEABLE', total_tokens: null })
  expect(providerUsage({ inputTokens: 1, outputTokens: 2, totalTokens: 3 }, false)).toMatchObject({ state: 'USAGE_RETURNED', total_tokens: 3 })
})

it('bounds one oversized multibyte chunk and preserves critical metadata at the exact serialized budget', () => {
  const audit = new StreamAudit(8192)
  audit.append({ type: 'reasoning-delta', index: 0, text: '理'.repeat(10000) })
  audit.append(usage); audit.append(stop)
  const metadata = audit.finish()
  expect(metadata.retained_bytes).toBe(Buffer.byteLength(JSON.stringify(audit.chunks)))
  expect(metadata).toMatchObject({ truncated: true, original_chunks: 3, retained_chunks: 2, omitted_chunks: 1 })
  expect(audit.chunks).toEqual([usage, stop])
})

it('records returned, missing and malformed usage independently from semantic acceptance', async () => {
  const returned = await run([tool, usage, stop])
  expect(returned.receipt.observation.provider_usage).toMatchObject({ state: 'USAGE_RETURNED', total_tokens: 161 })
  const missing = await run([tool, stop])
  expect(missing.receipt.observation.provider_usage).toMatchObject({ state: 'USAGE_MISSING_PROVIDER', total_tokens: null })
  const invalid = await run([tool, { type: 'usage', usage: { inputTokens: 1, outputTokens: 2, totalTokens: 9 } }, stop])
  expect(invalid.receipt.observation.provider_usage).toMatchObject({ state: 'USAGE_UNPARSEABLE', total_tokens: null })
  expect(invalid.result).toMatchObject({ prompt_tokens: null, completion_tokens: null })
})

function waitForAbort(signal: AbortSignal, readStarted: () => void): Promise<never> {
  return new Promise((_resolve, reject) => {
    const abort = () => { signal.removeEventListener('abort', abort); reject(signal.reason) }
    if (signal.aborted) { abort(); return }
    signal.addEventListener('abort', abort, { once: true }); readStarted()
  })
}

it('settles a pending terminal read at the original deadline without restarting its timer', async () => {
  const s = await actionSetup(), began = performance.now()
  let pending = false, settled = false
  s.args.model.maxResponseBytes = 50
  s.respondWith(async function* (signal) {
    try {
      await new Promise(resolve => setTimeout(resolve, 7000))
      yield { type: 'text-delta', index: 0, text: 'x'.repeat(100) }
      await waitForAbort(signal, () => { pending = true })
    } finally { settled = true }
  })
  const result = await operationScope().track('callAction', () => callAction(s.args))
  expect(pending && settled).toBe(true)
  expect(performance.now() - began).toBeLessThan(12000)
  expect(result).toMatchObject({ error_code: 'OUTPUT_TRUNCATED', message: null, prompt_tokens: null, completion_tokens: null,
    observation: { deadline_expired: true, terminal_read_error_code: 'TIMEOUT', provider_usage: { state: 'USAGE_LOST_HOST', total_tokens: null } } })
  expect(s.wires).toHaveLength(1)
})

it.each([false, true])('settles caller cancellation of pending metadata with prior usage=%s', async received => {
  const s = await actionSetup(), caller = new AbortController(), pending = Promise.withResolvers<void>()
  let settled = false
  s.args.signal = AbortSignal.any([s.args.signal, caller.signal]); s.args.model.maxResponseBytes = 50
  s.respondWith(async function* (signal) {
    try {
      yield { type: 'text-delta', index: 0, text: 'x'.repeat(100) }
      if (received) yield usage
      await waitForAbort(signal, () => pending.resolve())
    } finally { settled = true }
  })
  const action = operationScope().track('callAction', () => callAction(s.args))
  await pending.promise; caller.abort(); const result = await action
  expect(settled).toBe(true); expect(s.wires).toHaveLength(1)
  expect(result).toMatchObject({ error_code: 'OUTPUT_TRUNCATED', message: null, prompt_tokens: received ? 108 : null,
    observation: { caller_cancelled: true, deadline_expired: false, terminal_read_error_code: 'CANCELLED',
      provider_usage: { state: received ? 'USAGE_RETURNED' : 'USAGE_LOST_HOST', total_tokens: received ? 161 : null } } })
})

it('observes trailing usage after content finish before treating the protocol as complete', async () => {
  const { result } = await run([tool, stop, usage])
  expect(result).toMatchObject({ error_code: null, prompt_tokens: 108,
    observation: { provider_stream_exhausted: true, provider_usage: { state: 'USAGE_RETURNED' } } })
})

it('retains first semantic rejection and valid usage after a later thrown transport failure', async () => {
  const s = await actionSetup(); s.args.model.maxResponseBytes = 50
  s.respondWith(async function* () {
    yield { type: 'text-delta', index: 0, text: 'x'.repeat(100) }; yield usage
    throw new Error('TRANSPORT')
  })
  const result = await operationScope().track('callAction', () => callAction(s.args))
  expect(result).toMatchObject({ error_code: 'OUTPUT_TRUNCATED', message: null, prompt_tokens: 108,
    observation: { terminal_read_error_code: 'TRANSPORT', provider_usage: { state: 'USAGE_RETURNED' } } })
  expect(s.wires).toHaveLength(1)
})

it('records critical audit overflow separately from malformed usage and semantic acceptance', async () => {
  const s = await actionSetup(); s.args.maxEventBytes = 16384
  const malformed = { type: 'usage', usage: { inputTokens: '1'.repeat(9000), outputTokens: 2, totalTokens: 3 } } as unknown as StreamChunk
  s.respond([tool, malformed, stop])
  const result = await operationScope().track('callAction', () => callAction(s.args))
  const audit = JSON.parse(await readFile(join(s.directories[0]!, 'stream-audit.json'), 'utf8'))
  expect(result).toMatchObject({ error_code: null, prompt_tokens: null, observation: { provider_usage: { state: 'USAGE_UNPARSEABLE' } } })
  expect(audit.metadata).toMatchObject({ audit_error: 'AUDIT_METADATA_LIMIT', terminal_metadata_preserved: false, truncated: true })
  expect(audit.chunks).not.toContainEqual(malformed); expect(audit.chunks).toContainEqual(stop)
  expect(audit.metadata.retained_bytes).toBe(Buffer.byteLength(JSON.stringify(audit.chunks)))
  expect(Buffer.byteLength(JSON.stringify(audit.chunks))).toBeLessThanOrEqual(8192)
})

it('preserves semantic failure evidence when managed model persistence rejects publication', async () => {
  const s = await actionSetup(); s.args.model.maxResponseBytes = 50
  const claim = s.args.claim
  s.args.claim = async directory => { await claim(directory); await writeFile(join(directory, 'model.json'), 'held-publication-target', { flag: 'wx' }) }
  s.respond([{ type: 'text-delta', index: 0, text: 'x'.repeat(100) }, usage, stop])
  await expect(operationScope().track('callAction', () => callAction(s.args))).rejects.toThrow()
  const directory = s.directories[0]!
  expect(await readFile(join(directory, 'model.json'), 'utf8')).toBe('held-publication-target')
  expect(JSON.parse(await readFile(join(directory, 'transcript.json'), 'utf8'))).toMatchObject({ error: 'OUTPUT_TRUNCATED', chunk_count: 3 })
  expect(JSON.parse(await readFile(join(directory, 'stream-audit.json'), 'utf8')).chunks).toContainEqual(usage)
  expect(s.wires).toHaveLength(1)
})

it.each([false, true])('closes an authentication finish immediately with prior overflow=%s', async overflow => {
  const s = await actionSetup(); if (overflow) s.args.model.maxResponseBytes = 50
  let settled = false, advancedAfterAuth = false
  s.respondWith(async function* () {
    try {
      yield { type: 'text-delta', index: 0, text: 'x'.repeat(100) }
      yield { type: 'finish', reason: { kind: 'error', failure: { code: 'AUTH', message: 'authentication failed' } } }
      advancedAfterAuth = true; throw new Error('NEXT_AFTER_AUTH')
    } finally { settled = true }
  })
  const result = await operationScope().track('callAction', () => callAction(s.args))
  expect(settled).toBe(true); expect(advancedAfterAuth).toBe(false)
  expect(result).toMatchObject({ error_code: overflow ? 'OUTPUT_TRUNCATED' : 'AUTH', message: null,
    observation: { code: 'AUTH', provider_stream_exhausted: false, provider_usage: { state: 'USAGE_LOST_HOST' } } })
  expect(s.wires).toHaveLength(1)
})

it.each([false, true])('rejects semantic success when cancellation settles pending next as EOF with prior overflow=%s', async overflow => {
  const s = await actionSetup(), caller = new AbortController(), pending = Promise.withResolvers<void>()
  s.args.signal = AbortSignal.any([s.args.signal, caller.signal]); if (overflow) s.args.model.maxResponseBytes = 50
  let settled = false
  s.respondWith(async function* (signal) {
    try {
      yield { type: 'text-delta', index: 0, text: 'x'.repeat(100) }; yield stop
      await new Promise<void>(resolve => { signal.addEventListener('abort', () => resolve(), { once: true }); pending.resolve() })
    } finally { settled = true }
  })
  const action = operationScope().track('callAction', () => callAction(s.args))
  await pending.promise; caller.abort(); const result = await action
  expect(settled).toBe(true)
  expect(result).toMatchObject({ error_code: overflow ? 'OUTPUT_TRUNCATED' : 'CANCELLED', message: null,
    observation: { caller_cancelled: true, terminal_read_error_code: 'CANCELLED', model_response_complete: false,
      provider_usage: { state: 'USAGE_LOST_HOST', total_tokens: null } } })
})


it.each(['empty DONE', 'resource DONE', 'safety DONE', 'no body'] as const)('publishes %s accounting through the actual adapter, Runtime and model.json', async variant => {
  const body = variant === 'no body' ? null : protocolBody(variant === 'empty DONE' ? {} : {
    choices: [{ delta: {}, finish_reason: variant === 'resource DONE' ? 'insufficient_system_resource' : 'content_filter' }],
  }, '[DONE]')
  await withOfflineProtocolProvider(body, async runtime => {
    const s = await actionSetup(runtime)
    const result = await operationScope().track('callAction', () => callAction(s.args))
    const receipt = JSON.parse(await readFile(join(s.directories[0]!, 'model.json'), 'utf8'))
    const transport = JSON.parse(await readFile(join(s.directories[0]!, 'transport.json'), 'utf8'))
    const complete = variant !== 'no body'
    expect(result.error_code).toBe(variant === 'resource DONE' ? 'INSUFFICIENT_SYSTEM_RESOURCE' : variant === 'safety DONE' ? 'CONTENT_FILTER' : 'EMPTY_RESPONSE')
    expect(receipt).toMatchObject({ dispatched: true, message: null, prompt_tokens: null, completion_tokens: null,
      observation: { provider_protocol_complete: complete, provider_protocol_completion_source: complete ? 'normalized-provider-stream-marker' : null,
        provider_stream_exhausted: variant !== 'safety DONE', model_response_complete: false,
        provider_usage: { state: complete ? 'USAGE_MISSING_PROVIDER' : 'USAGE_LOST_HOST', total_tokens: null } } })
    expect(transport).toEqual(receipt.observation)
    const stream = JSON.parse(await readFile(join(s.directories[0]!, 'stream.json'), 'utf8'))
    if (complete) expect(stream.at(-1)).toMatchObject({ providerProtocolComplete: true })
    else expect(stream.at(-1)).not.toHaveProperty('providerProtocolComplete')
  })
})
