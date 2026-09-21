/** Ordered Vivado development verification with bounded evidence. @module rtl-tools/phase1/verification */
import { mkdir, readFile, readdir, lstat, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { runCommand, type CommandResult } from '../process.ts'
import { VivadoDiagnostics } from '../vivado-parser.ts'
import { groupHDLSources, assertCompileMode, type ResolvedHDLSource } from '../hdl.ts'
import { resolveSynthesisConfig, runSynthesis, vivadoArgv } from '../synthesis.ts'
import { versionFact, type DoctorSettings } from './doctor.ts'
import { stages, type PhaseId, type RunIdentity } from './contracts.ts'
import { parseRecord, type ProcessFact, type RunRecord, type StageRecord, type Invocation } from './records.ts'
import { attributeDiagnostics, hostIssue as issue, type AttributedDiagnostic } from './attribution.ts'
import { EventRecorder, atomicJson } from './recorder.ts'
import { checkSnapshot, createSnapshot, createReviewedCounterSnapshot, createDatasetSnapshot, sha256, type Snapshot, type Evaluation } from './snapshots.ts'
import type { FixtureId } from './fixtures.ts'
import { SimulationEvidence } from './simulation-evidence.ts'
import { finalArtifactManifest } from './artifact-manifest.ts'
export { SimulationEvidence } from './simulation-evidence.ts'

/** Explicit deployment budgets for the ordered verification operation. */
export interface VerificationLimits { compileMs: number; elaborateMs: number; simulationMs: number; totalMs: number; maxArtifactBytes: number; artifactPollMs: number; maxEventBytes: number }
/** Compact tool output; detailed timing/resources stay in the synthesis report artifact. */
export interface VerificationResult { schema_version: '1.3'; snapshot_id: PhaseId; status: string; stages: StageRecord[]; artifacts: string; full_isolation_verified: false }

function fact(value: CommandResult): ProcessFact { return { exit_code: value.exitCode, signal: value.signal, timed_out: value.timedOut, cancelled: value.aborted, log_truncated: value.logTruncated, duration_ms: value.durationMs } }

async function sizeOf(path: string, index?: { path: string; bytes: number }[], root = path): Promise<number> {
  let size = 0
  // Vivado removes transient child directories during the live quota scan.
  const entries = await readdir(path, { withFileTypes: true }).catch(error => {
    if (error.code === 'ENOENT' && path !== root) return []
    throw error
  })
  for (const entry of entries) {
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

/** Registry cannot import snapshots from caller-provided paths or trust flags. */
export class VerificationRunner {
  private readonly snapshots = new Map<string, { snapshot: Snapshot; recorder: EventRecorder; identity: RunIdentity; used: boolean }>()
  constructor(private readonly subprocess: SubprocessRuntime, private readonly config: DoctorSettings, private readonly limits: VerificationLimits) {}

  /** Register fixed host-selected bytes. @param fixture - trusted catalog id. @param identity - sample accounting. @returns opaque snapshot id. */
  async registerFixture(fixture: FixtureId, identity: RunIdentity): Promise<PhaseId> {
    const recorder = await EventRecorder.create(this.config.outputRoot, identity, this.limits.maxEventBytes, '1.3')
    try {
      const snapshot = await createSnapshot(recorder.directory, fixture)
      this.snapshots.set(snapshot.id, { snapshot, recorder, identity, used: false })
      return snapshot.id
    } catch (error) { await recorder.close(); throw error }
  }

  /** Register one externally reviewed counter, without exposing this authority as a model tool. @param source - reviewed DUT bytes. @param reviewedSha256 - host-pinned approval digest. @param identity - operation accounting. @returns opaque snapshot id. */
  async registerReviewedCounter(source: string, reviewedSha256: string, identity: RunIdentity): Promise<PhaseId> {
    const recorder = await EventRecorder.create(this.config.outputRoot, identity, this.limits.maxEventBytes, '1.3')
    try {
      const snapshot = await createReviewedCounterSnapshot(recorder.directory, source, reviewedSha256)
      this.snapshots.set(snapshot.id, { snapshot, recorder, identity, used: false })
      return snapshot.id
    } catch (error) { await recorder.close(); throw error }
  }

  /** Register pinned evaluator assets after host review. @param assets - trusted bytes including reviewed source. @param evaluation - trusted profile. @param identity - accounting. @returns opaque id. */
  async registerDataset(assets: Record<string, string>, evaluation: Evaluation, identity: RunIdentity): Promise<PhaseId> {
    const recorder = await EventRecorder.create(this.config.outputRoot, identity, this.limits.maxEventBytes, '1.3')
    try {
      const snapshot = await createDatasetSnapshot(recorder.directory, assets, evaluation)
      this.snapshots.set(snapshot.id, { snapshot, recorder, identity, used: false }); return snapshot.id
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
    return this.execute(id, caller, confine, false)
  }

  /** Host-only evaluator health check; skips synthesis and never verifies a candidate. @param id - registered dataset snapshot. @param caller - lifecycle cancellation. @param confine - policy for every managed command. @returns stage evidence, with EVALUATOR_READY only for complete simulation. */
  async preflightDataset(id: string, caller: AbortSignal, confine: (argv: readonly string[]) => readonly string[]): Promise<VerificationResult> {
    if (!this.snapshots.get(id)?.snapshot.evaluation) throw new Error('Preflight requires a registered dataset')
    return this.execute(id, caller, confine, true)
  }

  private async execute(id: string, caller: AbortSignal, confine: (argv: readonly string[]) => readonly string[], preflight: boolean): Promise<VerificationResult> {
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
    const verificationKey = 'sha256:' + sha256(JSON.stringify({ manifest: snapshot.manifest, config: this.config, limits: this.limits, ...(preflight ? { purpose: 'evaluator_preflight' } : {}) }))
    const results: StageRecord[] = []
    const commands: Record<string, readonly string[]> = {}
    const rel = (path: string) => relative(root, path).replace(/\\/g, '/')
    const sources = snapshot.sources.map(source => ({ ...source, path: join(snapshot.directory, source.path) }))
    let stopped = false
    try {
      if (preflight) await atomicJson(root, 'preflight-mode.json', { purpose: 'evaluator_preflight', candidate_verification: false, synthesis_requested: false })
      await mkdir(build)
      for (const stage of stages) {
        if (preflight && stage === 'synthesis') stopped = true
        const link = { revision_id: snapshot.id, call_id: `${snapshot.id}-${stage}` as PhaseId }
        const invocations: Invocation[] = []
        const record: StageRecord = { schema_version: '1.3', snapshot_id: snapshot.id, verification_key: verificationKey, stage, invocations,
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
                const version = await this.command(executable, ['-version'], build, `${tool}-version`, stageBudget, stageSignal, confine, new VivadoDiagnostics(this.config.limits.maxDiagnostics, this.config.limits.maxLineChars), commands, invocations, root)
                const text = await readFile(version.stdoutLog, 'utf8') + await readFile(version.stderrLog, 'utf8')
                const matches = versionFact({ executable, argv: [], process: version, error: null }, text, '2025.2').matches
                invocations.at(-1)!.version_matches = matches
                if (!matches) throw new Error('Environment: tool version probe failed: ' + tool)
              }
            }
            if (stage === 'synthesis') {
              const launchEvidence: (readonly string[])[] = []
              const synthesis = await runSynthesis(this.subprocess, resolveSynthesisConfig({ ...this.config.limits, stopOnLogLimit: true,
                workspaceRoot: build, top: snapshot.evaluation?.top ?? 'counter', sources: sources.filter(source => source.role === 'dut'), includeDirs: [],
                xdcFiles: [join(snapshot.directory, 'trusted/clock.xdc')], vivado: this.config.tools.vivado, part: this.config.part }),
              stageSignal, argv => { const launch = confine(argv); launchEvidence.push(launch); return launch },
              run => invocations.push({ label: run.stage, executable: run.executable, args: run.args, argv: run.argv, launch_argv: launchEvidence.at(-1)!, version_matches: null,
                systemverilog_mode: null, sources: run.stage === 'synthesis' ? sources.filter(source => source.role === 'dut') : [], process: fact(run), stdout_log: rel(run.stdoutLog), stderr_log: rel(run.stderrLog) }))
              record.synthesis = { synthesizable: synthesis.synthesizable, resources: synthesis.resources, timing: synthesis.timing }
              record.exit_code = synthesis.runs.at(-1)?.exitCode ?? null
              record.diagnostics_omitted = synthesis.omittedDiagnostics
              record.diagnostic_excerpt_truncated = synthesis.runs.some(run => run.lineTruncated || run.logTruncated)
              const complete = !record.diagnostic_excerpt_truncated && !record.diagnostics_omitted && synthesis.runs.every(run => !run.aborted && !run.timedOut && !run.signal)
              record.errors = attributeDiagnostics(synthesis.errors, sources, synthesis.artifactsDir, synthesis.stage, complete, synthesis.synthesizable === null)
              record.warnings = attributeDiagnostics(synthesis.warnings, sources, synthesis.artifactsDir, synthesis.stage, complete, false)
              record.status = synthesis.success && !record.diagnostic_excerpt_truncated ? 'PASS' : synthesis.synthesizable === false ? 'FAIL' : 'INCONCLUSIVE'
              record.failure_domain = record.status === 'PASS' ? null : record.errors.length && (record.errors as AttributedDiagnostic[]).every(error => error.origin === 'dut') ? 'design' : 'unknown'
              record.report_path = rel(join(synthesis.artifactsDir, 'result.json'))
              record.raw_log_path = synthesis.runs[0] ? rel(synthesis.runs[0].stdoutLog) : null
            } else {
              const diagnostics = new VivadoDiagnostics(this.config.limits.maxDiagnostics, this.config.limits.maxLineChars)
              const evidence = new SimulationEvidence(!!snapshot.evaluation)
              const script = join(build, 'simulate.tcl')
              if (stage === 'simulation') await writeFile(script, 'run all\nquit\n', { flag: 'wx', mode: 0o600 })
              const args = stage === 'elaborate' ? [snapshot.evaluation?.tbTop ?? 'phase1_tb', '-s', 'phase1_sim', ...(snapshot.evaluation ? snapshot.evaluation.defaultTimescale ? ['-timescale', snapshot.evaluation.defaultTimescale] : [] : ['-timescale', '1ns/1ps']), '-mt', String(this.config.limits.threads)]
                  : ['phase1_sim', '-tclbatch', script.replace(/\\/g, '/'), ...(snapshot.evaluation ? ['-sv_seed', String(snapshot.evaluation.seed)] : [])]
              const executable = stage === 'compile' ? this.config.tools.xvlog : stage === 'elaborate' ? this.config.tools.xelab : this.config.tools.xsim
              const limit = stage === 'compile' ? this.limits.compileMs : stage === 'elaborate' ? this.limits.elaborateMs : this.limits.simulationMs
              const groups = stage === 'compile' ? groupHDLSources(sources) : []
              let outcome!: CommandResult
              for (let index = 0; index < Math.max(1, groups.length); index++) {
                stageSignal.throwIfAborted()
                const group = groups[index]
                const commandArgs = group ? [...(group.language === 'systemverilog' ? ['-sv'] : []), ...group.sources.map(source => source.path)] : args
                if (group) assertCompileMode(group, commandArgs)
                outcome = await this.command(executable, commandArgs, build, groups.length > 1 ? `${stage}-${index + 1}` : stage,
                  Math.max(1, limit - (performance.now() - stageStart)), stageSignal, confine, { accept(line, truncated) { diagnostics.accept(line, truncated); evidence.accept(line) } }, commands, invocations, root, group?.sources)
                if (outcome.exitCode !== 0 || outcome.signal || outcome.aborted || outcome.timedOut || outcome.logTruncated || diagnostics.errorSeen || diagnostics.lineTruncated) break
              }
              record.exit_code = outcome.exitCode; record.raw_log_path = rel(outcome.stdoutLog)
              record.diagnostics_omitted = diagnostics.omitted
              record.diagnostic_excerpt_truncated = diagnostics.lineTruncated || outcome.logTruncated
              const complete = !record.diagnostic_excerpt_truncated && !record.diagnostics_omitted && !outcome.aborted && !outcome.timedOut && !outcome.signal
              record.errors = attributeDiagnostics(diagnostics.errors, sources, build, stage, complete, diagnostics.environmentFailure)
              record.warnings = attributeDiagnostics(diagnostics.warnings, sources, build, stage, complete, diagnostics.environmentFailure)
              record.status = outcome.timedOut ? 'TIMEOUT' : outcome.logTruncated ? 'TOOL_ERROR' : outcome.aborted || outcome.signal ? 'INCONCLUSIVE'
                : outcome.exitCode === 0 && !diagnostics.errorSeen && !diagnostics.lineTruncated ? 'PASS' : diagnostics.errorSeen ? 'FAIL' : 'INCONCLUSIVE'
              record.failure_domain = record.status === 'PASS' ? null : outcome.timedOut || outcome.logTruncated ? 'resource' : diagnostics.environmentFailure ? 'environment'
                : record.errors.length && (record.errors as AttributedDiagnostic[]).every(error => error.origin === 'dut') ? 'design' : 'unknown'
              if (stage === 'simulation') {
                record.evidence = { test_completed: evidence.completed, checks_executed: evidence.checks, mismatch_count: evidence.mismatches, evaluator_id: snapshot.evaluation?.evaluatorId ?? 'handwritten-counter-v1' }
                if (record.status === 'PASS' && !evidence.passed) {
                  record.status = evidence.completed && evidence.mismatches! > 0 ? 'FAIL' : 'INCONCLUSIVE'
                  record.failure_domain = record.status === 'FAIL' ? 'design' : 'unknown'
                  record.errors.push({ ...issue(record.status === 'FAIL'
                    ? `Functional mismatch: ${evidence.mismatches} of ${evidence.checks} checks failed; simulator exited normally. Inspect the DUT against the specification; no failing signal or cycle was reported.`
                    : `Simulation verdict unavailable: records=${evidence.records}, checks=${evidence.checks}, mismatches=${evidence.mismatches}, fatal=${evidence.fatal}. Require one nonfatal completion record with consistent positive check counts.`),
                    category: record.status === 'FAIL' ? 'functional_mismatch' : 'simulation_evidence', origin: 'unknown', attribution: 'UNKNOWN' })
                }
              }
            }
            if ((record.errors as AttributedDiagnostic[]).some(error => error.origin === 'tool' || (['compile', 'elaborate'].includes(stage) && ['testbench', 'reference'].includes(error.origin)))) { record.status = 'TOOL_ERROR'; record.failure_domain = 'environment' }
            await checkSnapshot(snapshot)
            if (await sizeOf(root) > this.limits.maxArtifactBytes) { quotaError = 'Artifact byte budget exceeded'; quota.abort() }
            if (invocations.some(invocation => invocation.process.log_truncated)) { record.status = 'TOOL_ERROR'; record.failure_domain = 'resource' }
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
          if (stageSignal.aborted || quotaError) for (const error of record.errors as AttributedDiagnostic[]) error.repairable_by_model = false
          stopped = record.status !== 'PASS'
        }
        record.processes = invocations.map(invocation => invocation.process)
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
      const firstFailure = (preflight ? results.slice(0, 3) : results).find(result => result.status !== 'PASS')
      const evaluatorReady = preflight && !firstFailure && !signal.aborted
      const final: RunRecord = { schema_version: '1.3', ...identity, final_status: caller.aborted ? 'ABORTED' : totalExpired ? 'TIMEOUT' : quotaError ? 'TOOL_ERROR' : firstFailure?.status ?? (preflight ? 'INCONCLUSIVE' : 'PASS'),
        final_revision_id: snapshot.id, final_source_sha256: snapshot.sourceHash, verification_key: verificationKey,
        final_verified: !preflight && !firstFailure && !signal.aborted, stages: Object.fromEntries(results.map(result => [result.stage, result])) as RunRecord['stages'],
        semantic_repairs: 0, model_requests_total: 0, transport_retries: 0,
        stop_reason: caller.aborted ? 'Caller cancelled' : totalExpired ? 'Total wall-clock budget exceeded' : quotaError ?? (firstFailure ? `${firstFailure.stage}: ${firstFailure.status}` : evaluatorReady ? 'EVALUATOR_READY; synthesis not requested; not a candidate PASS.' : `${snapshot.trust} completed all stages; not an adversarial evaluator.`),
        artifact_manifest: ['events.jsonl', 'commands.json', 'artifacts.json', rel(join(snapshot.directory, 'manifest.json'))] }
      await recorder.finish(final)
      return { schema_version: '1.3', snapshot_id: snapshot.id, status: evaluatorReady ? 'EVALUATOR_READY' : final.final_status, stages: results, artifacts: root, full_isolation_verified: false }
    } finally {
      clearTimeout(timer); clearInterval(watcher); await poll; await recorder.close()
      await finalArtifactManifest(root)
    }
  }

  private async command(executable: string, args: string[], cwd: string, label: string, timeoutMs: number, signal: AbortSignal,
    confine: (argv: readonly string[]) => readonly string[], observer: { accept(line: string, truncated?: boolean): void }, commands: Record<string, readonly string[]>, invocations: Invocation[], root: string, sources?: ResolvedHDLSource[]): Promise<CommandResult> {
    const path = await this.subprocess.resolveExecutable(executable, undefined, signal)
    const cmd = process.platform === 'win32' && /\.(bat|cmd)$/i.test(path) ? await this.subprocess.resolveExecutable('cmd.exe', undefined, signal) : undefined
    const argv = vivadoArgv(path, args, process.platform, cmd)
    commands[label] = argv
    await atomicJson(cwd, 'commands.json', commands)
    const launch = confine(argv)
    const outcome = await runCommand(this.subprocess, { ...this.config.limits, timeoutMs: Math.max(1, Math.floor(timeoutMs)), stopOnLogLimit: true }, launch, cwd, label, signal, observer)
    invocations.push({ label, executable: path, args, argv, launch_argv: launch, version_matches: null, systemverilog_mode: sources ? sources[0]!.language === 'systemverilog' : null,
      sources: sources ?? [], process: fact(outcome), stdout_log: relative(root, outcome.stdoutLog).replace(/\\/g, '/'), stderr_log: relative(root, outcome.stderrLog).replace(/\\/g, '/') })
    return outcome
  }
}
