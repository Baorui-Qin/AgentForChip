/** Completion facts shared by live verification and diagnostic replay. @module rtl-tools/phase1/simulation-evidence */
export class SimulationEvidence {
  constructor(private readonly dataset = false) {}
  records = 0
  checks: number | null = null
  mismatches: number | null = null
  fatal = false
  /** Observe bounded output without inventing locations. @param line - untrusted output. */
  accept(line: string): void {
    this.fatal ||= /^\s*(?:Fatal:|FATAL:|TIMEOUT\b)/.test(line)
    const match = this.dataset ? /^Mismatches: (\d+) in (\d+) samples\s*$/.exec(line) : /^PHASE1_COMPLETE checks=(\d+) mismatches=(\d+)\s*$/.exec(line)
    if (!match) return
    this.records++
    const checks = Number(match[this.dataset ? 2 : 1]), mismatches = Number(match[this.dataset ? 1 : 2])
    this.checks = Number.isSafeInteger(checks) ? checks : null
    this.mismatches = Number.isSafeInteger(mismatches) ? mismatches : null
  }
  /** One nonfatal completion record with consistent positive counts. */
  get completed(): boolean { return !this.fatal && this.records === 1 && Number.isSafeInteger(this.checks) && this.checks! > 0 && Number.isSafeInteger(this.mismatches) && this.mismatches! <= this.checks! }
  /** A complete record containing no mismatches. */
  get passed(): boolean { return this.completed && this.mismatches === 0 }
}
