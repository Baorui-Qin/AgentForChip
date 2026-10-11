/** Run-owned file access; subprocess execution remains outside coordination. @module rtl-tools/phase1/evidence-access */
import { readdir, lstat } from 'node:fs/promises'
import { join, relative, resolve, isAbsolute } from 'node:path'

/** Original failure facts; null means the filesystem did not provide that field. */
export interface EvidenceFailure {
  operation: string; run_root: string; path: string | null; target: string | null
  code: string | number | null; syscall: string | null; message: string; cancelled: boolean
}
interface Waiter { signal: AbortSignal; enter: () => void; reject: (error: unknown) => void; abort: () => void }

/** One in-process run, not a cross-process lock or protection against external readers. */
export class EvidenceAccess {
  private active = false
  private closing = false
  private readonly controller = new AbortController()
  private readonly waiters: Waiter[] = []
  private idle: Promise<void> = Promise.resolve()
  private settleIdle: (() => void) | undefined
  private lastFailure: EvidenceFailure | undefined
  private failureWasCancellation = false

  /** @param root - physical Host-owned run directory; callers retain their existing link checks. */
  constructor(readonly root: string) {}

  /** Last access failure for terminal evidence; successful work does not erase it. */
  get failure(): EvidenceFailure | undefined { return this.lastFailure }

  /** Enforce lexical scope without following links or granting access to another run. @param path - caller-owned target. */
  assertPath(path: string): void {
    const local = relative(resolve(this.root), resolve(path))
    if (local === '..' || local.startsWith('..' + (process.platform === 'win32' ? '\\' : '/')) || isAbsolute(local)) throw new Error('Evidence path escaped run')
  }

  /**
   * FIFO access; aborted waiters never invoke their callback and failures release ownership.
   * @param operation - bounded operation label for failure evidence.
   * @param work - short file operation; await started I/O and check the supplied signal between calls.
   * @param caller - unchanged caller/deadline signal; waiting consumes its budget.
   * @returns the original result or rejection after owned I/O settles.
   */
  async run<T>(operation: string, work: (signal: AbortSignal) => Promise<T>, caller?: AbortSignal): Promise<T> {
    const signal = caller ? AbortSignal.any([caller, this.controller.signal]) : this.controller.signal
    let entered = false
    try {
      if (this.closing) throw new Error('Evidence access closed')
      signal.throwIfAborted()
      await this.acquire(signal); entered = true
      signal.throwIfAborted()
      return await work(signal)
    } catch (error) {
      const native = error as NodeJS.ErrnoException & { dest?: string }
      if (!this.lastFailure || (this.failureWasCancellation && error !== signal.reason)) {
        this.failureWasCancellation = signal.aborted && error === signal.reason
        this.lastFailure = { operation, run_root: this.root, path: native?.path ?? null, target: native?.dest ?? null,
          code: native?.code ?? null, syscall: native?.syscall ?? null, message: error instanceof Error ? error.message : String(error), cancelled: signal.aborted }
      }
      throw error
    } finally { if (entered) this.release() }
  }

  private acquire(signal: AbortSignal): Promise<void> {
    if (!this.active) {
      this.active = true
      this.idle = new Promise(resolve => { this.settleIdle = resolve })
      return Promise.resolve()
    }
    return new Promise((enter, reject) => {
      const waiter: Waiter = { signal, enter, reject, abort: () => {
        const index = this.waiters.indexOf(waiter)
        if (index >= 0) this.waiters.splice(index, 1)
        signal.removeEventListener('abort', waiter.abort)
        reject(signal.reason)
      } }
      this.waiters.push(waiter); signal.addEventListener('abort', waiter.abort, { once: true })
      if (signal.aborted) waiter.abort()
    })
  }

  private release(): void {
    const next = this.waiters.shift()
    if (next) { next.signal.removeEventListener('abort', next.abort); next.enter() }
    else { this.active = false; this.settleIdle?.(); this.settleIdle = undefined }
  }

  /** Reject new/waiting work, signal active I/O and await its settlement before cleanup. */
  async close(): Promise<void> {
    this.closing = true; this.controller.abort(new Error('Evidence access closed'))
    await this.idle
  }
}

/**
 * Scan the original complete artifact range while coordinated publications cannot replace its entries.
 * @param access - same run instance used by atomicJson.
 * @param index - optional original path/byte index, complete only on successful return.
 * @param signal - active budget/cancellation; terminal owner settlement may omit it.
 * @returns observed byte total; missing root, links and real errors reject, never QUOTA_PASS.
 */
export async function scanArtifactBytes(access: EvidenceAccess, index?: { path: string; bytes: number }[], signal?: AbortSignal): Promise<number> {
  return access.run('artifact_scan', async current => {
    async function visit(path: string): Promise<number> {
      current.throwIfAborted()
      const entries = await readdir(path, { withFileTypes: true }).catch(error => {
        // Vivado can remove an already listed child directory; the run root must exist.
        if (error.code === 'ENOENT' && path !== access.root) return []
        throw error
      })
      let bytes = 0
      for (const entry of entries) {
        current.throwIfAborted()
        const target = join(path, entry.name)
        const info = await lstat(target).catch(error => {
          // External EDA can remove transient entries; all other errors remain failures.
          if (error.code === 'ENOENT') return null
          throw error
        })
        current.throwIfAborted()
        if (!info) continue
        if (info.isSymbolicLink()) throw new Error('Artifact symlink refused')
        bytes += info.isDirectory() ? await visit(target) : info.size
        if (info.isFile()) index?.push({ path: relative(access.root, target).replace(/\\/g, '/'), bytes: info.size })
      }
      return bytes
    }
    return visit(access.root)
  }, signal)
}
