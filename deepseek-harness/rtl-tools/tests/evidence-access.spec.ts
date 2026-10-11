import { mkdtemp, readFile, writeFile, rm, mkdir, symlink, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { EvidenceAccess, scanArtifactBytes } from '../src/phase1/evidence-access.ts'
import { atomicJson } from '../src/phase1/recorder.ts'

const boundary = vi.hoisted(() => ({ kind: '', target: '', entered: () => {}, release: Promise.resolve(), error: undefined as unknown, after: false }))
vi.mock('node:fs/promises', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs/promises')>()
  const pause = async () => { boundary.entered(); await boundary.release; if (boundary.error) throw boundary.error }
  return { ...actual,
    async lstat(path: Parameters<typeof actual.lstat>[0], ...args: unknown[]) {
      if (boundary.kind === 'scan' && path === boundary.target) await pause()
      return Reflect.apply(actual.lstat, actual, [path, ...args])
    },
    async rename(source: Parameters<typeof actual.rename>[0], target: Parameters<typeof actual.rename>[1]) {
      if (boundary.kind === 'rename' && target === boundary.target && !boundary.after) await pause()
      await actual.rename(source, target)
      if (boundary.kind === 'rename' && target === boundary.target && boundary.after) await pause()
    },
    async open(path: Parameters<typeof actual.open>[0], ...args: unknown[]) {
      const handle = await Reflect.apply(actual.open, actual, [path, ...args]) as Awaited<ReturnType<typeof actual.open>>
      if (boundary.kind === 'write' && String(path).startsWith(boundary.target)) {
        const original = handle.writeFile.bind(handle)
        handle.writeFile = async (...values: Parameters<typeof handle.writeFile>) => { await original(...values); await pause() }
      }
      if (boundary.kind === 'close' && String(path).startsWith(boundary.target)) {
        const original = handle.close.bind(handle)
        handle.close = async () => { await original(); await pause() }
      }
      return handle
    },
  }
})

let root: string
const owners: EvidenceAccess[] = [], pending: Promise<unknown>[] = []
let unblock = () => {}
function deferred() { let resolve!: () => void; const promise = new Promise<void>(yes => { resolve = yes }); return { promise, resolve } }
function hold(kind: string, target: string, after = false) {
  const entered = deferred(), released = deferred(); unblock = released.resolve
  Object.assign(boundary, { kind, target, after, entered: entered.resolve, release: released.promise, error: undefined })
  return { entered: entered.promise, release: released.resolve }
}
function own<T>(promise: Promise<T>): Promise<T> {
  pending.push(promise); void promise.catch(() => { /* The assertion reads the original failure; observe rejection immediately. */ })
  return promise
}
function access(path = root) { const value = new EvidenceAccess(path); owners.push(value); return value }
beforeEach(async () => { root = await mkdtemp(join(tmpdir(), 'evidence-access-')); boundary.kind = ''; boundary.error = undefined })
afterEach(async () => {
  unblock(); await Promise.all(owners.splice(0).map(a => a.close())); await Promise.allSettled(pending.splice(0))
  boundary.kind = ''; boundary.error = undefined
  if (!root.startsWith(join(tmpdir(), 'evidence-access-')) || await realpath(root) !== root) throw Error('Unexpected test cleanup root')
  await rm(root, { recursive: true, force: true })
})

it('waits for the actual metadata scan before replacing its target', async () => {
  const a = access(), target = join(root, 'commands.json'); await atomicJson(root, 'commands.json', { version: 0 }, a)
  const gate = hold('scan', target), scan = own(scanArtifactBytes(a)); await gate.entered
  const write = own(atomicJson(root, 'commands.json', { version: 1 }, a))
  expect(JSON.parse(await readFile(target, 'utf8'))).toEqual({ version: 0 })
  gate.release(); await scan; await write; expect(JSON.parse(await readFile(target, 'utf8'))).toEqual({ version: 1 })
})
it('keeps scans outside the actual rename boundary and publishes a complete version', async () => {
  const a = access(), target = join(root, 'commands.json'); await atomicJson(root, 'commands.json', { version: 0 }, a)
  const gate = hold('rename', target), write = own(atomicJson(root, 'commands.json', { version: 1, data: 'x'.repeat(8192) }, a)); await gate.entered
  let scanned = false; const scan = own(scanArtifactBytes(a).then(bytes => { scanned = true; return bytes }))
  expect(scanned).toBe(false); expect(JSON.parse(await readFile(target, 'utf8')).version).toBe(0)
  gate.release(); await write; expect(await scan).toBeGreaterThan(8192); expect(JSON.parse(await readFile(target, 'utf8')).version).toBe(1)
})
it('serializes same-run publishers in invocation order without blocking a different run', async () => {
  const a = access(), target = join(root, 'commands.json'), other = join(root, 'other'); await mkdir(other); const b = access(other)
  const gate = hold('rename', target), first = own(atomicJson(root, 'commands.json', { version: 1 }, a)); await gate.entered
  const second = own(atomicJson(root, 'commands.json', { version: 2 }, a)), third = own(atomicJson(root, 'commands.json', { version: 3 }, a))
  await atomicJson(other, 'commands.json', { independent: true }, b); expect(JSON.parse(await readFile(join(other, 'commands.json'), 'utf8'))).toEqual({ independent: true })
  gate.release(); await Promise.all([first, second, third]); expect(JSON.parse(await readFile(target, 'utf8'))).toEqual({ version: 3 })
})
it('removes a cancelled waiting publisher without a late write or a poisoned queue', async () => {
  const a = access(), entered = deferred(), released = deferred(); unblock = released.resolve
  const holder = own(a.run('held_scan', async () => { entered.resolve(); await released.promise })); await entered.promise
  const controller = new AbortController(), waiting = own(atomicJson(root, 'late.json', { bad: true }, a, controller.signal))
  controller.abort(); await expect(waiting).rejects.toBe(controller.signal.reason)
  released.resolve(); await holder; await expect(readFile(join(root, 'late.json'))).rejects.toMatchObject({ code: 'ENOENT' })
  await atomicJson(root, 'next.json', { good: true }, a)
})
it.each(['write', 'close'])('settles in-flight %s and refuses a cancelled pre-commit publication', async kind => {
  const a = access(), target = join(root, 'commands.json'); await atomicJson(root, 'commands.json', { version: 0 }, a)
  const gate = hold(kind, join(root, '.')), controller = new AbortController()
  const write = own(atomicJson(root, 'commands.json', { version: 1 }, a, controller.signal)); await gate.entered; controller.abort()
  gate.release(); await expect(write).rejects.toBe(controller.signal.reason); expect(JSON.parse(await readFile(target, 'utf8'))).toEqual({ version: 0 })
})
it('joins an already committed rename when cancellation arrives before its return', async () => {
  const a = access(), target = join(root, 'commands.json'), gate = hold('rename', target, true), controller = new AbortController()
  const write = own(atomicJson(root, 'commands.json', { complete: true }, a, controller.signal)); await gate.entered; controller.abort()
  gate.release(); await expect(write).rejects.toBe(controller.signal.reason); expect(JSON.parse(await readFile(target, 'utf8'))).toEqual({ complete: true })
})
it('cancels a scan between metadata operations and retains the original deadline reason', async () => {
  const a = access(), target = join(root, 'a'); await writeFile(target, 'bytes'); const gate = hold('scan', target), controller = new AbortController()
  const scan = own(scanArtifactBytes(a, undefined, controller.signal)); await gate.entered; const reason = new Error('original stage deadline'); controller.abort(reason)
  gate.release(); await expect(scan).rejects.toBe(reason); await atomicJson(root, 'next.json', { ready: true }, a)
})
it.each(['rename', 'scan'])('propagates a real %s error and permits subsequent legitimate work', async kind => {
  const a = access(), target = join(root, 'commands.json'); await atomicJson(root, 'commands.json', { version: 0 }, a)
  const gate = hold(kind, target), failure = Object.assign(new Error('native access refused'), { code: 'EPERM', syscall: kind === 'rename' ? 'rename' : 'lstat', path: target })
  boundary.error = failure; gate.release()
  await expect(kind === 'rename' ? atomicJson(root, 'commands.json', { version: 1 }, a) : scanArtifactBytes(a)).rejects.toBe(failure)
  expect(a.failure).toMatchObject({ code: 'EPERM', syscall: failure.syscall, run_root: root, message: failure.message })
  boundary.kind = ''; await atomicJson(root, 'commands.json', { version: 2 }, a); expect(JSON.parse(await readFile(target, 'utf8')).version).toBe(2)
})
it('joins an active filesystem operation before cleanup and rejects queued and future work', async () => {
  const a = access(), target = join(root, 'commands.json'), gate = hold('rename', target), write = own(atomicJson(root, 'commands.json', { value: 1 }, a)); await gate.entered
  const waiting = own(atomicJson(root, 'late.json', {}, a)); let closed = false
  const close = own(a.close().then(() => { closed = true })); await expect(waiting).rejects.toThrow('closed'); expect(closed).toBe(false)
  gate.release(); await expect(write).rejects.toThrow('closed'); await close
  await expect(atomicJson(root, 'future.json', {}, a)).rejects.toThrow('closed'); await expect(readFile(join(root, 'late.json'))).rejects.toMatchObject({ code: 'ENOENT' })
})
it('counts all files and temporary bytes and rejects missing roots, links and escaped writes', async () => {
  const a = access(); await writeFile(join(root, '.unfinished.tmp'), '123'); await mkdir(join(root, 'build')); await writeFile(join(root, 'build/log'), '12345')
  const index: { path: string; bytes: number }[] = []; expect(await scanArtifactBytes(a, index)).toBe(8); expect(index.map(i => i.path).sort()).toEqual(['.unfinished.tmp', 'build/log'])
  await expect(atomicJson(root, '../escaped.json', {}, a)).rejects.toThrow('escaped')
  await symlink(join(root, 'build'), join(root, 'redirect'), process.platform === 'win32' ? 'junction' : 'dir')
  await expect(scanArtifactBytes(a)).rejects.toThrow('symlink')
  const missing = access(join(root, 'missing')); await expect(scanArtifactBytes(missing)).rejects.toMatchObject({ code: 'ENOENT' })
})
