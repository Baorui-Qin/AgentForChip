/** Model-free full-suite migration and calibration, followed by sealed fixed-ten preflight. @module rtl-tools/phase1/p10-suite-preflight */
import { mkdir, readFile, readdir, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import { Config } from './p10-preflight.ts'
import { runCommand } from '../process.ts'
import { publish } from './candidates.ts'
import { sha256 } from './snapshots.ts'
import { loadP10Dataset, selectP10, type P10Task } from './p10-dataset.ts'
import { loadCompatAssets, negativeControl } from './p10-compat.ts'
import { assertSharedEvaluator, buildSuite, loadSuiteAssets, suiteManifestName, type SuiteManifest } from './p10-compat-suite.ts'
import { readDoctorConfig } from './doctor.ts'
import { VerificationRunner, type VerificationResult } from './verification.ts'
import { classifyPreflight } from './p10-report.ts'
import type { PhaseId } from './contracts.ts'

export { Config }
export const name = 'rtl-p10-suite-preflight'
export const inject = ['cmdlineArgs', 'appReady', 'subprocess', 'sandboxPolicy']
const json = (value: unknown) => JSON.stringify(value, null, 2) + '\n'
interface Row {
  task_id: string; kind: string; status: string; default_timescale: string | null; run: string
  stages: VerificationResult['stages']; evaluator: Record<string, unknown>; started_at: string
}
/** Require observable wrong-DUT failure, distinguishing informational version probes from EDA commands. @param positive - correct-DUT run. @param negative - faulty-DUT run. @returns whether both controls meet the evaluator acceptance criteria. */
export function calibrationPairReady(positive: Row, negative: Row) {
  const sim = negative.stages.find(s => s.stage === 'simulation')!
  return positive.status === 'EVALUATOR_READY' && negative.stages[0]!.status === 'PASS' && negative.stages[1]!.status === 'PASS' && sim.status === 'FAIL' &&
    sim.evidence.test_completed && (sim.evidence.checks_executed ?? 0) > 0 && (sim.evidence.mismatch_count ?? 0) > 0 &&
    negative.stages.slice(0, 3).every(s => s.invocations && s.invocations.length > 0 && s.invocations.every(v => {
      const p = v.process, version = v.args.length === 1 && v.args[0] === '-version' && v.version_matches === true
      return (p.exit_code === 0 || version && p.exit_code === 1) && !p.timed_out && !p.cancelled && !p.signal && !p.log_truncated
    }))
}

/** Separate commands enforce real calibration before external read-only freeze and worker preflight. @param ctx - Host services only. @param config - frozen deployment and source inventory. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const command = ctx.cmdlineArgs!.get().join(' ')
  if (!['calibrate', 'preflight'].includes(command)) throw new Error('Use calibrate|preflight')
  if (ctx.get('llm')) throw new Error('P10_PREFLIGHT_MUST_NOT_LOAD_MODEL')
  const controller = new AbortController(); let pending: Promise<void> | undefined
  ctx.effect(() => async () => { controller.abort(); await pending })
  ctx.effect(() => ctx.get('appReady')!.onReady(() => {
    pending = run(ctx, config, command, controller.signal).then(() => ctx.get('appExit')!(0)).catch(error => {
      process.stderr.write(String(error) + '\n'); ctx.get('appExit')!(1)
    })
  }))
}

async function run(ctx: Context, config: ReturnType<typeof Config>, command: string, signal: AbortSignal) {
  if (!config.allowUnisolatedPreflight || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('P10_EXPLICIT_PREFLIGHT_AUTHORITY_REQUIRED')
  const root = await realpath(config.campaignRoot), dataset = await realpath(config.datasetRoot), derived = join(root, 'derived')
  const frozenBytes = await readFile(config.freezeFile), frozen = JSON.parse(frozenBytes.toString()) as { files: Record<string, string>; fixed_manifest: string; build_epoch: string }
  async function assertFreeze() {
    if (sha256(await readFile(config.freezeFile)) !== sha256(frozenBytes)) throw new Error('CAMPAIGN_FREEZE_CHANGED')
    if (!Object.keys(frozen.files).length) throw new Error('CAMPAIGN_FREEZE_EMPTY')
    for (const [path, hash] of Object.entries(frozen.files)) if (sha256(await readFile(path)) !== hash) throw new Error('CAMPAIGN_SOURCE_CHANGED: ' + path)
  }
  await assertFreeze()
  await publish(root, command + '.claim', json({ pid: process.pid, at: new Date().toISOString() }))
  const gitRoot = join(root, 'git-' + command); await mkdir(gitRoot)
  const git = await ctx.subprocess.resolveExecutable('git', undefined, signal)
  async function inspect(label: string, args: string[]) {
    const result = await runCommand(ctx.subprocess, { timeoutMs: 30000, graceMs: 1000, maxLogBytes: 1048576, maxLineChars: 4096, stopOnLogLimit: true },
      [git, '-C', dataset, ...args], gitRoot, label, signal, { accept() {} })
    if (result.exitCode !== 0 || result.aborted || result.timedOut || result.logTruncated) throw new Error('DATASET_GIT_INSPECTION_FAILED')
    return readFile(result.stdoutLog, 'utf8')
  }
  const revision = (await inspect('head', ['rev-parse', 'HEAD'])).trim()
  if ((await inspect('status', ['status', '--porcelain=v1', '--untracked-files=all'])).trim()) throw new Error('DATASET_WORKTREE_CHANGED')
  if ((await inspect('origin', ['remote', 'get-url', 'origin'])).trim() !== 'https://github.com/NVlabs/verilog-eval.git') throw new Error('DATASET_ORIGIN_CHANGED')
  const tree = await inspect('tree', ['ls-tree', '-r', '--full-tree', revision, 'dataset_spec-to-rtl']), eol = await inspect('eol', ['ls-files', '--eol', '--', 'dataset_spec-to-rtl'])
  const catalog = await loadP10Dataset(dataset, revision, tree, eol), selected = selectP10(catalog).map(s => s.task.task_id)
  const fixed = JSON.parse(await readFile(frozen.fixed_manifest, 'utf8')) as { task_ids: string[] }
  if (JSON.stringify(selected.slice(0, 10)) !== JSON.stringify(fixed.task_ids)) throw new Error('P10_FIXED_SELECTION_CHANGED')
  const tasks = fixed.task_ids.map(id => catalog.find(t => t.task_id === id)!), sentinel = catalog.find(t => t.task_id === 'Prob038_count15')!
  let manifest: SuiteManifest
  if (command === 'calibrate') {
    await mkdir(derived)
    manifest = await buildSuite(dataset, catalog, derived, frozen.build_epoch)
    const repeat = join(root, 'reproducibility-copy'); await mkdir(repeat)
    await buildSuite(dataset, catalog, repeat, frozen.build_epoch)
    const files: Record<string, string> = {}
    for (const entry of await readdir(derived, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile()) continue
      const path = join(entry.parentPath, entry.name), relative = path.slice(derived.length + 1)
      const bytes = await readFile(path)
      if (!bytes.equals(await readFile(join(repeat, relative)))) throw new Error('COMPAT_BUILD_NONDETERMINISTIC')
      files[relative.replace(/\\/g, '/')] = sha256(bytes)
    }
    await publish(root, 'build-reproducibility.json', json({ equal: true, build_epoch: frozen.build_epoch, files }))
    await publish(root, 'catalog.json', json(catalog)); await publish(root, 'selection-order.json', json(selected))
    for (const file of [suiteManifestName, 'compat-scan.json', 'compat-scan.csv']) await publish(root, file, await readFile(join(derived, file), 'utf8'))
  } else {
    manifest = JSON.parse(await readFile(join(derived, suiteManifestName), 'utf8')) as SuiteManifest
    const readonly = JSON.parse(await readFile(join(root, 'readonly-proof.json'), 'utf8'))
    if (readonly.modify_denied !== true || readonly.create_denied !== true || readonly.delete_denied !== true) throw new Error('COMPAT_READONLY_NOT_VERIFIED')
    const seal = JSON.parse(await readFile(join(derived, 'suite-freeze.json'), 'utf8'))
    if (seal.representative_calibration_sha256 !== sha256(await readFile(join(root, 'representative-calibration.json')))) throw new Error('COMPAT_CALIBRATION_CHANGED')
  }
  const { config: eda } = await readDoctorConfig(config.settingsFile)
  const edaRoot = join(root, 'eda-' + command); await mkdir(edaRoot)
  const runner = new VerificationRunner(ctx.subprocess, { ...eda, outputRoot: edaRoot }, config), id = randomUUID() as PhaseId, rows: Row[] = []
  async function verify(task: P10Task, kind: string, timescale?: '1ps/1ps') {
    await assertFreeze()
    const baseline = command === 'calibrate' ? await loadSuiteAssets(dataset, task, derived, timescale, true) : await loadCompatAssets(dataset, task, derived, timescale)
    const agent = command === 'calibrate' ? await loadSuiteAssets(dataset, task, derived, timescale, true) : await loadCompatAssets(dataset, task, derived, timescale)
    assertSharedEvaluator(baseline, agent)
    const { assets, evaluation } = baseline
    if (timescale && !/^`timescale\s+1\s*ps\s*\/\s*1\s*ps\s*$/m.test(assets['trusted/tb.sv']!)) throw new Error('COMPAT_TIMESCALE_UNREVIEWED')
    if (kind === 'negative') assets['rtl/solution.sv'] = negativeControl(task)
    const started_at = new Date().toISOString()
    const snapshot = await runner.registerDataset(assets, evaluation, { experiment_id: id, task_id: task.task_id as PhaseId, sample_id: rows.length, mode: kind === 'negative' ? 'agent' : 'baseline' })
    const result = await runner.preflightDataset(snapshot, signal, argv => argv)
    const row: Row = { task_id: task.task_id, kind, default_timescale: timescale ?? null, status: kind === 'negative' ? result.status : classifyPreflight(result).status,
      run: result.artifacts, stages: result.stages, evaluator: { ...evaluation.compatibility, baseline_agent_identity_asserted: true }, started_at }
    rows.push(row); await publish(root, `${command}-${String(rows.length).padStart(2, '0')}.json`, json(row))
    process.stdout.write(json({ task_id: row.task_id, kind, status: row.status, stages: row.stages.map(s => [s.stage, s.status]), evidence: row.stages[2]!.evidence, run: row.run }))
    return row
  }
  let timescale: '1ps/1ps' | undefined
  try {
    if (command === 'calibrate') {
      for (const task of [tasks[0]!, sentinel]) await verify(task, 'declaration-only')
      const needsDefault = rows.some(r => r.stages.some(s => s.stage === 'elaborate' && s.errors.some(e => /43-4099|timescale|time unit/i.test(JSON.stringify(e)))))
      timescale = needsDefault ? '1ps/1ps' : undefined
      await publish(root, 'evaluator-policy.json', json({ defaultTimescale: timescale ?? null, preserve_explicit_timescales: true,
        rationale: needsDefault ? 'Observed xelab timescale errors; explicit TB is 1ps/1ps. Only default missing units, never override.' : 'No timescale change required.', model_changes: false }))
      for (const task of [tasks[0]!, sentinel]) {
        const positive = await verify(task, 'positive', timescale), negative = await verify(task, 'negative', timescale)
        if (!calibrationPairReady(positive, negative)) throw new Error('EVALUATOR_CALIBRATION_FAILED: ' + task.task_id)
      }
      await publish(root, 'representative-calibration.json', json({ passed: true, rows, defaultTimescale: timescale ?? null, model_requests: 0 }))
    } else {
      const policy = JSON.parse(await readFile(join(root, 'evaluator-policy.json'), 'utf8'))
      if (policy.defaultTimescale !== null && policy.defaultTimescale !== '1ps/1ps') throw new Error('COMPAT_TIMESCALE_UNREVIEWED')
      timescale = policy.defaultTimescale ?? undefined
      for (const task of tasks) { await verify(task, 'positive', timescale); await verify(task, 'negative', timescale) }
    }
  } finally { await runner.close() }
  const after = await loadP10Dataset(dataset, (await inspect('final-head', ['rev-parse', 'HEAD'])).trim(), tree, eol)
  if (JSON.stringify(after) !== JSON.stringify(catalog) || (await inspect('final-status', ['status', '--porcelain=v1', '--untracked-files=all'])).trim()) throw new Error('DATASET_CHANGED')
  await assertFreeze()
  if (command !== 'preflight') return
  const preflight = tasks.map(task => {
    const positive = rows.find(r => r.task_id === task.task_id && r.kind === 'positive')!, negative = rows.find(r => r.task_id === task.task_id && r.kind === 'negative')!
    return { ...manifest.tasks.find(t => t.task_id === task.task_id)!, original_status: 'ORIGINAL_EVALUATOR_BLOCKED', original_evidence: frozen.fixed_manifest,
      compat_status: calibrationPairReady(positive, negative) ? 'EVALUATOR_READY' : positive.status === 'EVALUATOR_READY' ? 'INCONCLUSIVE' : positive.status,
      evaluable: calibrationPairReady(positive, negative), positive, negative, baseline_status: 'NOT_RUN', agent_status: 'NOT_RUN' }
  })
  await publish(root, 'p10-compat-preflight-10.json', json(preflight))
  await publish(root, 'compat-positive-negative-results.json', json(preflight))
  const columns = ['task_id', 'original_status', 'compat_status', 'original_tb_sha256', 'effective_tb_sha256', 'compatibility_version'] as const
  await publish(root, 'p10-compat-preflight-10.csv', columns.join(',') + ',rule,compile,elaborate,simulation,positive_checks,negative_mismatches\n' + preflight.map(r => [
    ...columns.map(c => r[c]), r.compatibility_rules.map(v => v.id).join('|'), ...r.positive.stages.slice(0, 3).map(s => s.status), r.positive.stages[2]!.evidence.checks_executed, r.negative.stages[2]!.evidence.mismatch_count,
  ].join(',')).join('\n') + '\n')
  const calibration = JSON.parse(await readFile(join(root, 'representative-calibration.json'), 'utf8')) as { rows: Row[] }
  const allRows = [...calibration.rows, ...rows], validation = { protocol: 'VerilogEval V2 tasks evaluated with Vivado 2025.2 compatibility evaluator v1',
    dataset_revision: revision, manifest_sha256: sha256(await readFile(join(derived, suiteManifestName))), counts: { total: manifest.task_count, converted: manifest.converted_task_count,
      unchanged: manifest.unchanged_task_count, unknown: manifest.unknown_task_count, fixed_ten_ready: preflight.filter(t => t.evaluable).length },
    dataset_unchanged: true, host_only: true, model_requests: 0, model_comparison: 'NOT_RUN', main_40: 'NOT_RUN',
    representative_calibration: calibration, frozen_before_preflight: true, baseline_agent_identity_asserted: true, full_os_isolation_verified: false,
    ready_to_restart_p10_ten: preflight.every(t => t.evaluable), tasks: manifest.tasks.map(task => ({ ...task,
      positive: allRows.filter(r => r.task_id === task.task_id && r.kind === 'positive'), negative: allRows.filter(r => r.task_id === task.task_id && r.kind === 'negative'),
      compile: allRows.find(r => r.task_id === task.task_id && r.kind === 'positive')?.stages[0]!.status ?? 'NOT_RUN',
      elaborate: allRows.find(r => r.task_id === task.task_id && r.kind === 'positive')?.stages[1]!.status ?? 'NOT_RUN',
      simulation: allRows.find(r => r.task_id === task.task_id && r.kind === 'positive')?.stages[2]!.status ?? 'NOT_RUN',
      positive_calibration: allRows.some(r => r.task_id === task.task_id && r.kind === 'positive') ? 'RUN_SEE_EVIDENCE' : 'NOT_RUN',
      negative_calibration: allRows.some(r => r.task_id === task.task_id && r.kind === 'negative') ? 'RUN_SEE_EVIDENCE' : 'NOT_RUN',
    })) }
  await publish(root, 'compatibility-validation.json', json(validation))
  await publish(root, 'compatibility-validation.md', `# Compatibility Validation\n\n${validation.protocol}.\n\nRevision: ${revision}. Manifest SHA256: ${validation.manifest_sha256}.\n\nStatic: ${manifest.converted_task_count} converted, ${manifest.unchanged_task_count} unchanged, ${manifest.unknown_task_count} manual review. Static matches are not Vivado results.\n\nReal EDA: two declaration-only probes, two representative positive/negative pairs, then ${tasks.length} fixed-task positive/negative pairs after read-only freeze. Ready: ${preflight.filter(t => t.evaluable).length}/10. All other tasks: NOT_RUN.\n\nHost default timescale: ${timescale ?? 'none'}, no explicit unit override. Only two complete TB declaration lines move. Stimulus, reference, comparison, verdict and sampling remain byte-identical.\n\nBaseline and Agent load identical evaluator SHA/version through the shared frozen loader. This is an integration assertion, not a new model score: model calls 0, comparison NOT_RUN, 40-task expansion NOT_RUN. Separate managed snapshot/build/log directories are used for every run. Full adversarial OS isolation is not claimed.\n`)
}
