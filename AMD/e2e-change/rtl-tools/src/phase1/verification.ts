/** Ordered Vivado development verification with bounded evidence. @module rtl-tools/phase1/verification */
import { mkdir, readFile, readdir, lstat, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { runCommand, type CommandResult } from '../process.ts'
import { VivadoDiagnostics, type VivadoDiagnostic } from '../vivado-parser.ts'
import { resolveSynthesisConfig, runSynthesis, vivadoArgv } from '../synthesis.ts'
import { versionFact, type DoctorSettings } from './doctor.ts'
import { stages, type PhaseId, type StageDiagnostic, type RunIdentity } from './contracts.ts'
import { parseRecord, type ProcessFact, type RunRecord, type StageRecord } from './records.ts'
import { EventRecorder, atomicJson } from './recorder.ts'
import { checkSnapshot, createSnapshot, createReviewedCounterSnapshot, sha256, type Snapshot } from './snapshots.ts'
import type { FixtureId } from './fixtures.ts'

/** Explicit deployment budgets for the ordered verification operation. */
export interface VerificationLimits { compileMs: number; elaborateMs: number; simulationMs: number; totalMs: number; maxArtifactBytes: number; artifactPollMs: number; maxEventBytes: number }
/** Compact tool output; detailed timing/resources stay in the synthesis report artifact. */
export interface VerificationResult { schema_version: '1.1'; snapshot_id: PhaseId; status: string; stages: StageRecord[]; artifacts: string; full_isolation_verified: false }

function fact(value: CommandResult): ProcessFact { return { exit_code: value.exitCode, signal: value.signal, timed_out: value.timedOut, cancelled: value.aborted, log_truncated: value.logTruncated, duration_ms: value.durationMs } }
function diagnostic(value: VivadoDiagnostic): StageDiagnostic { return { category: value.type, message_id: value.code ?? null, file: value.file ?? null, line: value.line ?? null, message: `${value.severity}: ${value.message}` } }
function issue(message: string): StageDiagnostic { return { category: 'verification', message_id: null, file: null, line: null, message } }

async function sizeOf(path: string, index?: { path: string; bytes: number }[], root = path): Promise<number> {
  let size = 0
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const target = join(path, entry.name)
    const info = await lstat(target).catch(error => {
      // Vivado and atomicJson rename transient files while this live audit walks.
      if (error.code === 'ENOENT') return null
      throw error
    })
    if (!info) continue
    if (info.isSymbolicLink()) throw new Error('Artifact symlink refused')
    size += info.isDirectory() ? await sizeOf(target, index, root) : info.size
    if (info.isFile()) index?.push({ path: relative(root, target).replace(/\\/g, '/'), bytes: info.size })
  }
  return size
}

/** Only this parser's fixed completion record counts; ordinary PASS text has no effect. */
export class SimulationEvidence {
  records = 0
  checks: number | null = null
  mismatches: number | null = null
  fatal = false
  /** Observe one bounded simulator line. @param line - untrusted output. */
  accept(line: string): void {
    this.fatal ||= /^\s*(?:Fatal:|FATAL:)/.test(line)
    const match = /^PHASE1_COMPLETE checks=(\d+) mismatches=(\d+)\s*$/.exec(line)
    if (!match) return
    this.records++
    this.checks = Number.isSafeInteger(Number(match[1])) ? Number(match[1]) : null
    this.mismatches = Number.isSafeInteger(Number(match[2])) ? Number(match[2]) : null
  }
  /** True only for one complete, nonempty zero-mismatch development verdict. */
  get passed(): boolean { return !this.fatal && this.records === 1 && Number.isSafeInteger(this.checks) && this.checks! > 0 && this.mismatches === 0 }
}

/** Registry cannot import snapshots from caller-provided paths or trust flags. */
export class VerificationRunner {
  private readonly snapshots = new Map<string, { snapshot: Snapshot; recorder: EventRecorder; identity: RunIdentity; used: boolean }>()
  constructor(private readonly subprocess: SubprocessRuntime, private readonly config: DoctorSettings, private readonly limits: VerificationLimits) {}

  /** Register fixed host-selected bytes. @param fixture - trusted catalog id. @param identity - sample accounting. @returns opaque snapshot id. */
  async registerFixture(fixture: FixtureId, identity: RunIdentity): Promise<PhaseId> {
    const recorder = await EventRecorder.create(this.config.outputRoot, identity, this.limits.maxEventBytes, '1.1')
    try {
      const snapshot = await createSnapshot(recorder.directory, fixture)
      this.snapshots.set(snapshot.id, { snapshot, recorder, identity, used: false })
      return snapshot.id
    } catch (error) { await recorder.close(); throw error }
  }

  /** Register one externally reviewed counter, without exposing this authority as a model tool. @param source - reviewed DUT bytes. @param reviewedSha256 - host-pinned approval digest. @param identity - operation accounting. @returns opaque snapshot id. */
  async registerReviewedCounter(source: string, reviewedSha256: string, identity: RunIdentity): Promise<PhaseId> {
    const recorder = await EventRecorder.create(this.config.outputRoot, identity, this.limits.maxEventBytes, '1.1')
    try {
      const snapshot = await createReviewedCounterSnapshot(recorder.directory, source, reviewedSha256)
      this.snapshots.set(snapshot.id, { snapshot, recorder, identity, used: false })
      return snapshot.id
    } catch (error) { await recorder.close(); throw error }
  }

  /** Release unexecuted registrations; active calls are joined by the plugin before disposal. */
  async close(): Promise<void> {
    for (const entry of this.snapshots.values()) if (!entry.used) { entry.used = true; await entry.recorder.close() }
  }

  /**
   * Verify one host registration, never arbitrary JSON manifests. Unknown/reused ids reject before spawn.
   * @param id - registered snapshot id.
   * @param caller - combined tool and lifecycle cancellation.
   * @param confine - policy wrapper, called for every managed command; no fallback.
   * @returns bounded stage evidence and a durable terminal result.
   */
  async verify(id: string, caller: AbortSignal, confine: (argv: readonly string[]) => readonly string[]): Promise<VerificationResult> {
    const entry = this.snapshots.get(id)
    if (!entry || entry.used) throw new Error('Unknown or consumed snapshot_id')
    entry.used = true
    const { snapshot, recorder, identity } = entry
    const root = recorder.directory
    const build = join(root, 'build')
    const deadline = new AbortController()
    const quota = new AbortController()
    let totalExpired = false
    let quotaError: string | null = null
    const timer = setTimeout(() => { totalExpired = true; deadline.abort() }, this.limits.totalMs)
    const signal = AbortSignal.any([caller, deadline.signal, quota.signal])
    let poll: Promise<void> = Promise.resolve()
    let polling = false
    const watcher = setInterval(() => {
      if (polling) return
      polling = true
      poll = (async () => {
        try { if (await sizeOf(root) > this.limits.maxArtifactBytes) { quotaError = 'Artifact byte budget exceeded'; quota.abort() } }
        catch (error) { quotaError = error instanceof Error ? error.message : 'Artifact audit failed'; quota.abort() }
        finally { polling = false }
      })()
    }, this.limits.artifactPollMs)
    const verificationKey = 'sha256:' + sha256(JSON.stringify({ manifest: snapshot.manifest, config: this.config, limits: this.limits }))
    const results: StageRecord[] = []
    const commands: Record<string, readonly string[]> = {}
    const rel = (path: string) => relative(root, path).replace(/\\/g, '/')
    let stopped = false
    try {
      await mkdir(build)
      for (const stage of stages) {
        const link = { revision_id: snapshot.id, call_id: `${snapshot.id}-${stage}` as PhaseId }
        const record: StageRecord = { schema_version: '1.1', snapshot_id: snapshot.id, verification_key: verificationKey, stage,
          status: 'SKIPPED', failure_domain: null, exit_code: null, duration_ms: 0, errors: [],
          evidence: { test_completed: null, checks_executed: null, mismatch_count: null, evaluator_id: null }, raw_log_path: null,
          diagnostic_excerpt_truncated: false, trust: snapshot.trust, processes: [], warnings: [], diagnostics_omitted: 0, report_path: null, synthesis: null }
        await recorder.append({ type: 'stage_started', link, value: { stage } })
        const stageStart = performance.now()
        if (!stopped) {
          const stageControl = new AbortController()
          const stageBudget = stage === 'compile' ? this.limits.compileMs : stage === 'elaborate' ? this.limits.elaborateMs : stage === 'simulation' ? this.limits.simulationMs : this.config.limits.timeoutMs
          const stageTimer = setTimeout(() => stageControl.abort(), stageBudget)
          const stageSignal = AbortSignal.any([signal, stageControl.signal])
          try {
            stageSignal.throwIfAborted()
            await checkSnapshot(snapshot)
            if (stage === 'compile') {
              for (const [tool, executable] of Object.entries(this.config.tools)) {
                const version = await this.command(executable, ['-version'], build, `${tool}-version`, stageBudget, stageSignal, confine, new VivadoDiagnostics(this.config.limits.maxDiagnostics, this.config.limits.maxLineChars), commands)
                const text = await readFile(version.stdoutLog, 'utf8') + await readFile(version.stderrLog, 'utf8')
                if (!versionFact({ executable, argv: [], process: version, error: null }, text, '2025.2').matches) throw new Error('Environment: tool version probe failed: ' + tool)
              }
            }
            if (stage === 'synthesis') {
              const synthesis = await runSynthesis(this.subprocess, resolveSynthesisConfig({ ...this.config.limits, stopOnLogLimit: true,
                workspaceRoot: build, top: 'counter', sources: [join(snapshot.directory, 'rtl/solution.sv')], includeDirs: [],
                xdcFiles: [join(snapshot.directory, 'trusted/clock.xdc')], vivado: this.config.tools.vivado, part: this.config.part }),
              stageSignal, confine)
              record.processes = synthesis.runs.map(fact)
              record.synthesis = { synthesizable: synthesis.synthesizable, resources: synthesis.resources, timing: synthesis.timing }
              record.exit_code = synthesis.runs.at(-1)?.exitCode ?? null
              record.errors = synthesis.errors.map(diagnostic); record.warnings = synthesis.warnings.map(diagnostic)
              record.diagnostics_omitted = synthesis.omittedDiagnostics
              record.diagnostic_excerpt_truncated = synthesis.runs.some(run => run.lineTruncated || run.logTruncated)
              record.status = synthesis.success && !record.diagnostic_excerpt_truncated ? 'PASS' : synthesis.synthesizable === false ? 'FAIL' : 'INCONCLUSIVE'
              record.failure_domain = record.status === 'PASS' ? null : synthesis.synthesizable === false ? 'design' : 'unknown'
              record.report_path = rel(join(synthesis.artifactsDir, 'result.json'))
              record.raw_log_path = synthesis.runs[0] ? rel(synthesis.runs[0].stdoutLog) : null
            } else {
              const diagnostics = new VivadoDiagnostics(this.config.limits.maxDiagnostics, this.config.limits.maxLineChars)
              const evidence = new SimulationEvidence()
              const script = join(build, 'simulate.tcl')
              if (stage === 'simulation') await writeFile(script, 'run all\nquit\n', { flag: 'wx', mode: 0o600 })
              const args = stage === 'compile' ? ['-sv', join(snapshot.directory, 'rtl/solution.sv'), join(snapshot.directory, 'trusted/tb.sv')]
                : stage === 'elaborate' ? ['phase1_tb', '-s', 'phase1_sim', '-timescale', '1ns/1ps', '-mt', String(this.config.limits.threads)]
                  : ['phase1_sim', '-tclbatch', script.replace(/\\/g, '/')]
              const executable = stage === 'compile' ? this.config.tools.xvlog : stage === 'elaborate' ? this.config.tools.xelab : this.config.tools.xsim
              const limit = stage === 'compile' ? this.limits.compileMs : stage === 'elaborate' ? this.limits.elaborateMs : this.limits.simulationMs
              const outcome = await this.command(executable, args, build, stage, limit, stageSignal, confine, { accept(line, truncated) { diagnostics.accept(line, truncated); evidence.accept(line) } }, commands)
              record.processes = [fact(outcome)]; record.exit_code = outcome.exitCode; record.raw_log_path = rel(outcome.stdoutLog)
              record.errors = diagnostics.errors.map(diagnostic); record.warnings = diagnostics.warnings.map(diagnostic)
              record.diagnostics_omitted = diagnostics.omitted
              record.diagnostic_excerpt_truncated = diagnostics.lineTruncated || outcome.logTruncated
              record.status = outcome.timedOut ? 'TIMEOUT' : outcome.logTruncated ? 'TOOL_ERROR' : outcome.aborted || outcome.signal ? 'INCONCLUSIVE'
                : outcome.exitCode === 0 && !diagnostics.errorSeen && !diagnostics.lineTruncated ? 'PASS' : diagnostics.errorSeen ? 'FAIL' : 'INCONCLUSIVE'
              record.failure_domain = record.status === 'PASS' ? null : outcome.timedOut || outcome.logTruncated ? 'resource' : diagnostics.environmentFailure ? 'environment' : diagnostics.errorSeen ? 'design' : 'unknown'
              if (stage === 'simulation') {
                record.evidence = { test_completed: evidence.records === 1, checks_executed: evidence.checks, mismatch_count: evidence.mismatches, evaluator_id: 'handwritten-counter-v1' }
                if (record.status === 'PASS' && !evidence.passed) {
                  record.status = evidence.mismatches !== null && evidence.mismatches > 0 ? 'FAIL' : 'INCONCLUSIVE'
                  record.failure_domain = record.status === 'FAIL' ? 'design' : 'unknown'
                  record.errors.push(issue('Missing, conflicting, incomplete or failing development testbench verdict.'))
                }
              }
            }
            await checkSnapshot(snapshot)
            if (await sizeOf(root) > this.limits.maxArtifactBytes) { quotaError = 'Artifact byte budget exceeded'; quota.abort() }
            if (record.processes.some(process => process.log_truncated)) { record.status = 'TOOL_ERROR'; record.failure_domain = 'resource' }
          } catch (error) {
            const message = error instanceof Error ? error.message.slice(0, this.config.limits.maxLineChars) : 'Verification failed'
            record.status = 'TOOL_ERROR'; record.failure_domain = /snapshot|asset|sandbox|policy|confine|linked/i.test(message) ? 'policy' : 'environment'
            record.errors = [issue(message)]
          } finally { clearTimeout(stageTimer) }
          if (stageControl.signal.aborted) { record.status = 'TIMEOUT'; record.failure_domain = 'resource'; record.errors.push(issue('Stage wall-clock budget exceeded')) }
          if (signal.aborted) {
            record.status = totalExpired ? 'TIMEOUT' : quotaError ? 'TOOL_ERROR' : 'INCONCLUSIVE'
            record.failure_domain = totalExpired || quotaError ? 'resource' : 'unknown'
            record.errors.push(issue(quotaError ?? (totalExpired ? 'Total wall-clock budget exceeded' : 'Caller cancelled')))
          }
          stopped = record.status !== 'PASS'
        }
        record.duration_ms = Math.round(performance.now() - stageStart)
        parseRecord('StageResult', record)
        results.push(record)
        await recorder.append({ type: 'stage_finished', link, value: record })
      }
      clearInterval(watcher)
      await poll
      await atomicJson(root, 'commands.json', commands)
      const artifactIndex: { path: string; bytes: number }[] = []
      if (await sizeOf(root, artifactIndex) > this.limits.maxArtifactBytes || Buffer.byteLength(JSON.stringify(artifactIndex)) > this.limits.maxEventBytes) {
        quotaError = 'Artifact byte or index budget exceeded'; quota.abort()
      }
      await atomicJson(root, 'artifacts.json', { schema_version: '1.1', files: artifactIndex, quota_error: quotaError })
      const firstFailure = results.find(result => result.status !== 'PASS')
      const final: RunRecord = { schema_version: '1.1', ...identity, final_status: caller.aborted ? 'ABORTED' : totalExpired ? 'TIMEOUT' : quotaError ? 'TOOL_ERROR' : firstFailure?.status ?? 'PASS',
        final_revision_id: snapshot.id, final_source_sha256: snapshot.sourceHash, verification_key: verificationKey,
        final_verified: !firstFailure && !signal.aborted, stages: Object.fromEntries(results.map(result => [result.stage, result])) as RunRecord['stages'],
        semantic_repairs: 0, model_requests_total: 0, transport_retries: 0,
        stop_reason: caller.aborted ? 'Caller cancelled' : totalExpired ? 'Total wall-clock budget exceeded' : quotaError ?? (firstFailure ? `${firstFailure.stage}: ${firstFailure.status}` : `${snapshot.trust} completed all stages; not an adversarial evaluator.`),
        artifact_manifest: ['events.jsonl', 'commands.json', 'artifacts.json', rel(join(snapshot.directory, 'manifest.json'))] }
      await recorder.finish(final)
      return { schema_version: '1.1', snapshot_id: snapshot.id, status: final.final_status, stages: results, artifacts: root, full_isolation_verified: false }
    } finally {
      clearTimeout(timer); clearInterval(watcher); await poll; await recorder.close()
    }
  }

  private async command(executable: string, args: string[], cwd: string, label: string, timeoutMs: number, signal: AbortSignal,
    confine: (argv: readonly string[]) => readonly string[], observer: { accept(line: string, truncated?: boolean): void }, commands: Record<string, readonly string[]>): Promise<CommandResult> {
    const path = await this.subprocess.resolveExecutable(executable, undefined, signal)
    const cmd = process.platform === 'win32' && /\.(bat|cmd)$/i.test(path) ? await this.subprocess.resolveExecutable('cmd.exe', undefined, signal) : undefined
    const argv = vivadoArgv(path, args, process.platform, cmd)
    commands[label] = argv
    await atomicJson(cwd, 'commands.json', commands)
    return runCommand(this.subprocess, { ...this.config.limits, timeoutMs: Math.max(1, Math.floor(timeoutMs)), stopOnLogLimit: true }, confine(argv), cwd, label, signal, observer)
  }
}
