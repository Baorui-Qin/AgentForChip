/** Loader-local capture admission; TestOperationScope remains the resource owner. */
import { lstat } from 'node:fs/promises'
import type { TestOperationScope } from '../test-operation-scope.ts'
import { TargetWitness } from './g1-target-witness.ts'

/** Only the scope's settled removal callback may inspect the registered Loader roots. */
export class LoaderReceiptCapture {
  private admitted = false

  constructor(private readonly scope: TestOperationScope, private readonly witness: TargetWitness,
    private readonly roots: readonly string[]) {}

  /**
   * Reject early capture without reading owned files; capture failure retains the roots and primary error.
   * @returns whether the caller must retain its roots after an admitted capture.
   */
  async capture(): Promise<boolean> {
    if (!this.admitted || this.scope.pending.length > 0) throw new Error('Loader capture requires settled scope removal admission')
    try {
      for (const root of this.roots) {
        const info = await lstat(root)
        if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('Linked or non-directory Loader root refused')
      }
      return await this.witness.capture(this.scope, this.roots)
    } catch (error) {
      this.witness.record('loader_capture_error', { error: String(error) })
      console.error('Loader capture failed; primary error preserved and roots retained', JSON.stringify({
        roots: this.roots, scope_id: this.scope.id, primary_errors: this.scope.bodyErrors(), capture_error: String(error),
      }))
      return true
    }
  }

  /**
   * Delegate cancellation, writer settlement and range proof to the existing scope before capture or deletion.
   * @param close - existing Loader and fixture disposal.
   * @param remove - deletion of only the registered, settled, successful Loader roots.
   * @returns the scope's unchanged cleanup promise and hook budget.
   */
  cleanup(close: () => Promise<void>, remove: () => Promise<void>): Promise<void> {
    return this.scope.cleanup(close, async () => {
      this.admitted = true
      try {
        if (await this.capture()) return
        await remove()
      } finally { this.admitted = false }
    })
  }
}
