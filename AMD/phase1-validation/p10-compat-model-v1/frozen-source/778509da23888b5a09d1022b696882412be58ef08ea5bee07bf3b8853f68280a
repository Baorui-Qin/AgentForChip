/** Separate model-free portability campaign; upstream and historical evidence remain immutable. @module rtl-tools/phase1/p10-compat-preflight */
import { mkdir, readFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import { Config } from './p10-preflight.ts'
import { runCommand } from '../process.ts'
import { publish } from './candidates.ts'
import { sha256 } from './snapshots.ts'
import { loadP10Dataset, selectP10, type P10Task } from './p10-dataset.ts'
import { buildCompatAssets, loadCompatAssets, negativeControl } from './p10-compat.ts'
import { readDoctorConfig } from './doctor.ts'
import { VerificationRunner } from './verification.ts'
import type { PhaseId } from './contracts.ts'

export { Config }
export const name = 'rtl-p10-compat-preflight'
export const inject = ['cmdlineArgs', 'appReady', 'subprocess', 'sandboxPolicy']

/** Supported dsh entry; deliberately refuses a model service. @param ctx - host services. @param config - frozen deployment. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  if (ctx.get('llm')) throw new Error('P10_PREFLIGHT_MUST_NOT_LOAD_MODEL')
  if (ctx.cmdlineArgs!.get().join(' ') !== 'preflight') throw new Error('Use preflight')
  const controller = new AbortController(); let pending: Promise<void> | undefined
  ctx.effect(() => async () => { controller.abort(); await pending })
  ctx.effect(() => ctx.get('appReady')!.onReady(() => {
    pending = run(ctx, config, controller.signal).then(() => ctx.get('appExit')!(0)).catch(error => {
      process.stderr.write(String(error) + '\n'); ctx.get('appExit')!(1)
    })
  }))
}

async function run(ctx: Context, config: ReturnType<typeof Config>, signal: AbortSignal) {
  if (!config.allowUnisolatedPreflight || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('P10_EXPLICIT_PREFLIGHT_AUTHORITY_REQUIRED')
  const root = await realpath(config.campaignRoot), dataset = await realpath(config.datasetRoot)
  const freezeBytes = await readFile(config.freezeFile), freeze = JSON.parse(freezeBytes.toString('utf8'))
  const assertFreeze = async () => {
    if (sha256(await readFile(config.freezeFile)) !== sha256(freezeBytes)) throw new Error('CAMPAIGN_FREEZE_CHANGED')
    for (const [path, hash] of Object.entries(freeze.files)) if (sha256(await readFile(path)) !== hash) throw new Error('CAMPAIGN_SOURCE_CHANGED: ' + path)
  }
  await assertFreeze()
  await publish(root, 'preflight.claim', JSON.stringify({ pid: process.pid, at: new Date().toISOString() }))
  const gitRoot = join(root, 'git'); await mkdir(gitRoot)
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
  const tree = await inspect('tree', ['ls-tree', '-r', '--full-tree', revision, 'dataset_spec-to-rtl'])
  const eol = await inspect('eol', ['ls-files', '--eol', '--', 'dataset_spec-to-rtl'])
  const catalog = await loadP10Dataset(dataset, revision, tree, eol), selected = selectP10(catalog)
  const tasks = [...selected.slice(0, 10).map(s => s.task), catalog.find(t => t.task_id === 'Prob038_count15')!]
  const derived = join(root, 'derived'); await mkdir(derived)
  const manifests = []
  for (const task of tasks) manifests.push(await buildCompatAssets(dataset, task, derived))
  await publish(root, 'compatibility-manifest.json', JSON.stringify({ predecessor: freeze.predecessor, dataset_revision: revision, tasks: manifests }, null, 2))
  await publish(root, 'catalog.json', JSON.stringify(catalog, null, 2))
  await publish(root, 'selection-order.json', JSON.stringify(selected.map(s => s.task.task_id), null, 2))
  const { config: eda } = await readDoctorConfig(config.settingsFile)
  const edaRoot = join(root, 'eda'); await mkdir(edaRoot)
  const runner = new VerificationRunner(ctx.subprocess, { ...eda, outputRoot: edaRoot }, config)
  const id = randomUUID() as PhaseId
  const rows: { task_id: string; kind: string; default_timescale: string | null; status: string; run: string; stages: unknown; evidence: unknown; errors: unknown }[] = []
  async function verify(task: P10Task, kind: 'declaration-only' | 'positive' | 'negative', defaultTimescale?: '1ps/1ps') {
    await assertFreeze()
    const { assets, evaluation } = await loadCompatAssets(dataset, task, derived, defaultTimescale)
    if (kind === 'negative') assets['rtl/solution.sv'] = negativeControl(task)
    const snapshot = await runner.registerDataset(assets, evaluation, { experiment_id: id, task_id: task.task_id as PhaseId, sample_id: rows.length, mode: 'agent' })
    const result = await runner.preflightDataset(snapshot, signal, argv => argv)
    const row = { task_id: task.task_id, kind, default_timescale: defaultTimescale ?? null, status: result.status, run: result.artifacts,
      stages: Object.fromEntries(result.stages.map(s => [s.stage, s.status])), evidence: result.stages.find(s => s.stage === 'simulation')!.evidence,
      errors: result.stages.flatMap(s => s.errors) }
    rows.push(row)
    await publish(root, `preflight-${String(rows.length).padStart(2, '0')}.json`, JSON.stringify(row, null, 2))
    process.stdout.write(JSON.stringify(row) + '\n')
    return result
  }
  try {
    const probes = [tasks[0]!, tasks.at(-1)!]
    let needsDefault = false
    for (const task of probes) {
      const result = await verify(task, 'declaration-only')
      needsDefault ||= result.stages.some(s => s.stage === 'elaborate' && s.errors.some(e => /timescale|time unit|43-4099/i.test(JSON.stringify(e))))
    }
    const defaultTimescale = needsDefault ? '1ps/1ps' as const : undefined
    await publish(root, 'evaluator-policy.json', JSON.stringify({ defaultTimescale: defaultTimescale ?? null, preserve_explicit_timescales: true,
      rationale: needsDefault ? 'Real declaration-only xelab evidence requires a default for DUT/reference lacking timescale; TB explicitly uses 1 ps / 1 ps.' : 'No timescale error observed; no default added.', seed: 1, clock_period_ns: 5 }, null, 2))
    for (const task of tasks) { await verify(task, 'positive', defaultTimescale); await verify(task, 'negative', defaultTimescale) }
  } finally { await runner.close() }
  const after = await loadP10Dataset(dataset, (await inspect('final-head', ['rev-parse', 'HEAD'])).trim(), tree, eol)
  if (JSON.stringify(after) !== JSON.stringify(catalog) || (await inspect('final-status', ['status', '--porcelain=v1', '--untracked-files=all'])).trim()) throw new Error('DATASET_CHANGED')
  await assertFreeze()
  await publish(root, 'compat-preflight-results.json', JSON.stringify({ rows, dataset_unchanged: true, model_requests: 0, full_os_isolation_verified: false }, null, 2))
  await publish(root, 'compat-positive-negative-results.json', JSON.stringify(tasks.map(task => {
    const positive = rows.find(r => r.task_id === task.task_id && r.kind === 'positive')!, negative = rows.find(r => r.task_id === task.task_id && r.kind === 'negative')!
    const stages = negative.stages as Record<string, string>, evidence = negative.evidence as { mismatch_count: number | null; checks_executed: number | null }
    return { task_id: task.task_id, original_status: 'TESTBENCH_COMPATIBILITY_BLOCKED', positive, negative,
      evaluable: positive.status === 'EVALUATOR_READY' && stages.compile === 'PASS' && stages.elaborate === 'PASS' && stages.simulation === 'FAIL' && (evidence.mismatch_count ?? 0) > 0 && (evidence.checks_executed ?? 0) > 0 }
  }), null, 2))
}
