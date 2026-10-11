import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi, type TestContext, type WorkerGlobalState } from 'vitest'
import { TestOperationScope } from './test-operation-scope.ts'
import { TargetWitness } from './helpers/g1-target-witness.ts'
import { LoaderReceiptCapture } from './helpers/loader-receipt-capture.ts'

const directories: string[] = []
afterEach(async () => {
  // These unit directories have no OS processes; each test settles its in-process writer in finally.
  for (const directory of directories.splice(0)) await rm(directory, { recursive: true, force: true })
  vi.restoreAllMocks()
})
async function directory(prefix: string): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), prefix)); directories.push(root); return root
}
function owner(context: TestContext, bodyErrors: () => unknown[] = () => [], signal = context.signal): TestOperationScope {
  const worker = (globalThis as typeof globalThis & { __vitest_worker__?: WorkerGlobalState }).__vitest_worker__
  if (!worker) throw new Error('Vitest worker config unavailable')
  return new TestOperationScope(signal, worker.config.hookTimeout, bodyErrors)
}

it('refuses Loader capture before scope settlement without reading or copying the registered root', async context => {
  const root = await directory('loader-capture-root-'), audit = await directory('loader-capture-audit-')
  await writeFile(join(root, 'events.jsonl'), '{"type":"original"}\n')
  const scope = owner(context), capture = new LoaderReceiptCapture(scope, new TargetWitness('Loader-contract', audit), [root])
  const remove = vi.fn(() => rm(root, { recursive: true, force: true }))
  await expect(capture.capture()).rejects.toThrow('settled scope removal admission')
  expect(await readdir(audit)).toEqual([])
  expect(await readFile(join(root, 'events.jsonl'), 'utf8')).toBe('{"type":"original"}\n')
  await capture.cleanup(async () => {}, remove)
  expect(remove).toHaveBeenCalledOnce()
  const observation = JSON.parse(await readFile(join(audit, (await readdir(audit))[0]!, 'observation.json'), 'utf8'))
  expect(observation).toMatchObject({ scope_id: scope.id, pending_at_capture: [], registered_writers_settled: true })
  expect(observation.files).toHaveLength(1)
  expect(existsSync(root)).toBe(false)
  scope.assertReleased()
})

it('settles the cancelled Loader finally writer before capture and retains the original failure root', async context => {
  const root = await directory('loader-capture-root-'), audit = await directory('loader-capture-audit-')
  const primary = new Error('original Loader deadline'), caller = new AbortController()
  const scope = owner(context, () => [primary], AbortSignal.any([context.signal, caller.signal]))
  const capture = new LoaderReceiptCapture(scope, new TargetWitness('Loader-contract', audit), [root])
  const writer = Promise.withResolvers<void>(), entered = Promise.withResolvers<void>()
  const close = vi.fn(async () => {}), remove = vi.fn(() => rm(root, { recursive: true, force: true }))
  const operation = scope.track('Loader verification finally writer', async () => {
    try {
      await new Promise<void>((_resolve, reject) => {
        scope.signal.addEventListener('abort', () => reject(scope.signal.reason), { once: true })
      })
    } finally {
      entered.resolve(); await writer.promise
      await writeFile(join(root, 'events.jsonl'), '{"type":"writer-settled"}\n')
    }
  })
  caller.abort(primary); await entered.promise
  const cleanup = capture.cleanup(close, remove)
  try {
    await expect(capture.capture()).rejects.toThrow('settled scope removal admission')
    expect(await readdir(audit)).toEqual([])
    expect(close).not.toHaveBeenCalled(); expect(remove).not.toHaveBeenCalled()
    writer.resolve()
    await expect(operation).rejects.toBe(primary)
    await cleanup
    expect(close).toHaveBeenCalledOnce(); expect(remove).not.toHaveBeenCalled()
    expect(scope.errors).toEqual([{ operation: 'Loader verification finally writer', error: primary }])
    expect(scope.bodyErrors()).toEqual([primary])
    expect(await readFile(join(audit, (await readdir(audit))[0]!, 'root-1', 'events.jsonl'), 'utf8')).toBe('{"type":"writer-settled"}\n')
    expect(existsSync(root)).toBe(true)
    scope.assertReleased()
  } finally { writer.resolve(); await Promise.allSettled([operation, cleanup]) }
})

for (const mode of ['false', 'rejected'] as const) it(`refuses Loader capture and deletion after a ${mode} managed range report`, async context => {
  const root = await directory('loader-capture-root-'), audit = await directory('loader-capture-audit-')
  await writeFile(join(root, 'events.jsonl'), '{"type":"retained"}\n')
  const primary = new Error('original Loader assertion'), range = new Error('controlled range rejection')
  const scope = owner(context, () => [primary]), capture = new LoaderReceiptCapture(scope, new TargetWitness('Loader-contract', audit), [root])
  const remove = vi.fn(() => rm(root, { recursive: true, force: true }))
  // A controlled logical handle exercises admission; it makes no Native or Windows Job claim.
  scope.observeManaged({ stdin: undefined, stdout: undefined, stderr: undefined, collected: {},
    done: Promise.resolve({ exitCode: 0, signal: null }), terminate() {},
    waitForExit: () => mode === 'false' ? Promise.resolve(false) : Promise.reject(range) })
  const cleanup = capture.cleanup(async () => {}, remove)
  if (mode === 'rejected') await expect(cleanup).rejects.toBe(range)
  else await expect(cleanup).rejects.toThrow('Managed ranges lack proof')
  await expect(capture.capture()).rejects.toThrow('settled scope removal admission')
  expect(scope.bodyErrors()).toEqual([primary])
  expect(remove).not.toHaveBeenCalled(); expect(await readdir(audit)).toEqual([])
  expect(await readFile(join(root, 'events.jsonl'), 'utf8')).toBe('{"type":"retained"}\n')
  expect(() => scope.assertReleased()).toThrow('Previous test scope did not quiesce')
})

it('retains the Loader root and primary error when public receipt capture fails after settlement', async context => {
  const root = await directory('loader-capture-root-'), audit = await directory('loader-capture-audit-')
  await writeFile(join(root, 'events.jsonl'), '{"type":"original"}\n')
  const primary = new Error('original Loader timeout'), scope = owner(context, () => [primary])
  const capture = new LoaderReceiptCapture(scope, new TargetWitness('Loader-contract', join(audit, 'missing')), [root])
  const remove = vi.fn(() => rm(root, { recursive: true, force: true }))
  await capture.cleanup(async () => {}, remove)
  expect(scope.bodyErrors()).toEqual([primary]); expect(scope.pending).toEqual([])
  expect(remove).not.toHaveBeenCalled(); expect(await readdir(audit)).toEqual([])
  expect(await readFile(join(root, 'events.jsonl'), 'utf8')).toBe('{"type":"original"}\n')
  scope.assertReleased()
})
