/** Deadline facts use explicit provenance and real managed-range settlement. */
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import type { SubprocessHandle } from '@deepseek-ai/dsh-subprocess'
import { afterEach, expect, it, vi } from 'vitest'
import { DeadlineExceeded, runCommand, type LineObserver, type ProcessConfig } from '../src/process.ts'
import { installTestOperationScope } from './test-operation-scope.ts'

const roots: string[] = [], contexts: Context[] = []
const operationScope = installTestOperationScope()
const config: ProcessConfig = { timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192, maxLineChars: 200 }
const hanging = 'process.stdout.write("READY\\n"); setInterval(() => {}, 1000)'

afterEach(async () => {
  const scope = operationScope()
  try {
    await scope.cleanup(async () => {
      for (const ctx of contexts) await ctx.fiber.dispose()
    }, async () => {
      if (scope.bodyErrors().length) {
        console.error('Retained failed process deadline roots', JSON.stringify({ roots, bodyErrors: scope.bodyErrors() }))
        return
      }
      for (const root of roots) await rm(root, { recursive: true, force: true })
    })
    roots.length = 0; contexts.length = 0
  } catch (error) {
    console.error('Process deadline cleanup failed; roots retained', JSON.stringify({ roots, scope_id: scope.id, pending: scope.pendingOperations, error: String(error) }))
    throw error
  } finally { vi.restoreAllMocks() }
})

async function setup(transform?: (handle: SubprocessHandle) => SubprocessHandle) {
  const root = await mkdtemp(join(tmpdir(), 'process-deadline-')); roots.push(root)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const native = ctx.subprocess.spawn.bind(ctx.subprocess)
  const spawn = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => {
    // Audit the unchanged native handle; a negative seam fixture cannot fabricate its proof.
    const handle = operationScope().observeManaged(native(spec))
    return transform ? transform(handle) : handle
  })
  const launch = (script: string, caller = new AbortController().signal, observer: LineObserver = { accept() {} }, limits: ProcessConfig = config) => operationScope().track('runCommand', () =>
    runCommand(ctx.subprocess, limits, [process.execPath, '-e', script], root, 'native', AbortSignal.any([caller, operationScope().signal]), observer))
  return { root, spawn, launch }
}

it('reports its own command deadline independently and joins the native range', async () => {
  const s = await setup()
  const result = await s.launch(hanging, undefined, undefined, { ...config, timeoutMs: 1400 })
  expect(result).toMatchObject({ timedOut: true, aborted: false })
  expect(s.spawn.mock.calls[0]![0].signal?.reason).toMatchObject({ name: 'DeadlineExceeded', source: 'command' })
})

it.each(['stage', 'total'] as const)('recognizes the enclosing %s deadline before the command timer fires', async source => {
  const s = await setup(), controller = new AbortController(), reason = new DeadlineExceeded(source)
  const result = await s.launch(hanging, controller.signal, { accept(line) { if (line === 'READY') controller.abort(reason) } })
  expect(result).toMatchObject({ timedOut: true, aborted: true })
  expect(s.spawn.mock.calls[0]![0].signal?.reason).toBe(reason)
  expect(await readFile(result.stdoutLog, 'utf8')).toBe('READY\n')
})

it.each(['AbortError', 'TimeoutError'] as const)('keeps an untyped caller %s independent of deadline facts', async name => {
  const s = await setup(), controller = new AbortController(), reason = new DOMException('Caller stopped the command', name)
  const result = await s.launch(hanging, controller.signal, { accept(line) { if (line === 'READY') controller.abort(reason) } })
  expect(result).toMatchObject({ timedOut: false, aborted: true })
  expect(s.spawn.mock.calls[0]![0].signal?.reason).toBe(reason)
})

it.each(['command', 'stage', 'total'] as const)('preserves a pre-start %s deadline without spawning or inventing an outcome', async source => {
  const s = await setup(), reason = new DeadlineExceeded(source)
  await expect(s.launch(hanging, AbortSignal.abort(reason))).rejects.toBe(reason)
  expect(s.spawn).not.toHaveBeenCalled()
})

it('preserves normal exit facts after native range settlement', async () => {
  const s = await setup()
  const result = await s.launch('process.stdout.write("COMPLETE\\n")')
  expect(result).toMatchObject({ exitCode: 0, signal: null, timedOut: false, aborted: false })
  expect(await readFile(result.stdoutLog, 'utf8')).toBe('COMPLETE\n')
})

it('awaits the range proof separately from a successful direct outcome', async () => {
  const entered = Promise.withResolvers<boolean>(), release = Promise.withResolvers<void>()
  const s = await setup(handle => ({ ...handle, async waitForExit() {
    const proof = await handle.waitForExit(); entered.resolve(proof)
    await release.promise
    return proof
  } }))
  let settled = false
  const operation = s.launch('process.stdout.write("COMPLETE\\n")')
  void operation.then(() => { settled = true }, () => { settled = true })
  try {
    expect(await entered.promise).toBe(true)
    expect(settled).toBe(false)
    release.resolve()
    expect(await operation).toMatchObject({ exitCode: 0, timedOut: false, aborted: false })
  } finally { release.resolve(); await Promise.allSettled([operation]) }
})

it.each(['false', 'rejected'] as const)('rejects a %s range report even after direct exit zero', async mode => {
  const failure = new Error('Range owner lost its proof')
  const s = await setup(handle => ({ ...handle, async waitForExit() {
    await handle.waitForExit()
    if (mode === 'rejected') throw failure
    return false
  } }))
  const operation = s.launch('process.stdout.write("COMPLETE\\n")')
  if (mode === 'rejected') await expect(operation).rejects.toBe(failure)
  else await expect(operation).rejects.toThrow('Managed process range did not prove settlement')
})

it('retains the original capture failure when range observation also rejects', async () => {
  const primary = new Error('Original diagnostic observer failure'), secondary = new Error('Range observation failure')
  const s = await setup(handle => ({ ...handle, async waitForExit() {
    await handle.waitForExit()
    throw secondary
  } }))
  const error = await s.launch(hanging, undefined, { accept(line) { if (line === 'READY') throw primary } }).catch((error: unknown) => error)
  expect(error).toBeInstanceOf(AggregateError)
  expect(error).toMatchObject({ message: primary.message, cause: primary })
  expect((error as AggregateError).errors).toEqual([primary, secondary])
})
