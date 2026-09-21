/** Model-free P10 evaluator campaign through the supported dsh launcher. @module rtl-tools/phase1/p10-preflight */
import { mkdir, readFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-subprocess'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import type {} from '@deepseek-ai/dsh-llm'
import { runCommand } from '../process.ts'
import { readDoctorConfig } from './doctor.ts'
import { VerificationRunner, type VerificationLimits } from './verification.ts'
import { parseRecord, type RunRecord } from './records.ts'
import { sha256 } from './snapshots.ts'
import { publish } from './candidates.ts'
import { claimExperiment } from './p09-claims.ts'
import { datasetRevision } from './protocol.ts'
import { loadP10Dataset, selectP10, selectionRules, selectionSeed, p10PreflightAssets, type P10Task } from './p10-dataset.ts'
import { classifyPreflight, reportP10Preflight, type P10Preflight } from './p10-report.ts'
import type { AttributedDiagnostic } from './attribution.ts'
import type { PhaseId } from './contracts.ts'

export const name = 'rtl-p10-preflight'
export const inject = ['cmdlineArgs', 'appReady', 'subprocess', 'sandboxPolicy']
export const Config = z.object({ datasetRoot: z.string().required(), campaignRoot: z.string().required(), settingsFile: z.string().required(), freezeFile: z.string().required(),
  allowUnisolatedPreflight: z.boolean().default(false), compileMs: z.natural().min(1).required(), elaborateMs: z.natural().min(1).required(),
  simulationMs: z.natural().min(1).required(), totalMs: z.natural().min(1).required(), maxArtifactBytes: z.natural().min(1).required(),
  artifactPollMs: z.natural().min(1).required(), maxEventBytes: z.natural().min(1).required() })

/** No model service or model tools are mounted in this application. @param ctx - dsh services. @param config - explicit host-only paths and limits. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const ready = ctx.get('appReady')!, exit = ctx.get('appExit')!, args = ctx.cmdlineArgs!.get()
  if (args.length !== 1 || args[0] !== 'preflight') throw new Error('Use preflight')
  if (ctx.get('llm')) throw new Error('P10_PREFLIGHT_MUST_NOT_LOAD_MODEL')
  const control = new AbortController(); let pending: Promise<void> | undefined
  ctx.effect(() => async () => { control.abort(); await pending })
  ctx.effect(() => ready.onReady(() => {
    pending = run(ctx, config, control.signal).then(() => exit(0)).catch(error => {
      process.stderr.write((error instanceof Error ? error.message : 'P10 preflight failed') + '\n'); exit(1)
    })
  }))
}

async function run(ctx: Context, config: ReturnType<typeof Config>, signal: AbortSignal): Promise<void> {
  if (!config.allowUnisolatedPreflight || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('P10_EXPLICIT_PREFLIGHT_AUTHORITY_REQUIRED')
  const root = await realpath(config.campaignRoot), dataset = await realpath(config.datasetRoot)
  const freezeBytes = await readFile(config.freezeFile), freeze = JSON.parse(freezeBytes.toString('utf8').replace(/^\uFEFF/, '')) as { files: Record<string, string> }
  async function assertFreeze() {
    if (sha256(await readFile(config.freezeFile)) !== sha256(freezeBytes)) throw new Error('CAMPAIGN_FREEZE_CHANGED')
    if (!freeze.files || !Object.keys(freeze.files).length) throw new Error('CAMPAIGN_FREEZE_EMPTY')
    for (const [path, hash] of Object.entries(freeze.files)) if (sha256(await readFile(path)) !== hash.toLowerCase()) throw new Error('CAMPAIGN_SOURCE_CHANGED')
  }
  await assertFreeze()
  const directory = join(root, 'pilot-10'); await mkdir(directory)
  const id = randomUUID(), started = performance.now()
  await publish(directory, 'campaign-identity.json', JSON.stringify({ schema_version: 'p10-preflight-1', campaign_id: id, freeze_sha256: sha256(freezeBytes), evidence_kind: 'real_evaluator_preflight', model_requests: 0, full_os_isolation_verified: false }))
  await mkdir(join(directory, 'git'))
  const git = await ctx.subprocess.resolveExecutable('git', undefined, signal)
  async function gitRead(label: string, argv: string[]) {
    const result = await runCommand(ctx.subprocess, { timeoutMs: 30000, graceMs: 1000, maxLogBytes: 1048576, maxLineChars: 4096, stopOnLogLimit: true },
      [git, '-C', dataset, ...argv], join(directory, 'git'), label, signal, { accept() {} })
    if (result.exitCode !== 0 || result.aborted || result.timedOut || result.logTruncated) throw new Error('DATASET_GIT_INSPECTION_FAILED')
    return readFile(result.stdoutLog, 'utf8')
  }
  const revision = (await gitRead('head', ['rev-parse', 'HEAD'])).trim()
  if (revision !== datasetRevision) throw new Error('DATASET_REVISION_CHANGED')
  const origin = (await gitRead('origin', ['remote', 'get-url', 'origin'])).trim()
  if (origin !== 'https://github.com/NVlabs/verilog-eval.git') throw new Error('DATASET_ORIGIN_CHANGED')
  if ((await gitRead('status', ['status', '--porcelain=v1', '--untracked-files=all'])).trim()) throw new Error('DATASET_WORKTREE_CHANGED')
  const tree = await gitRead('tree', ['ls-tree', '-r', '--full-tree', revision, 'dataset_spec-to-rtl'])
  const eol = await gitRead('eol', ['ls-files', '--eol', '--', 'dataset_spec-to-rtl'])
  const catalog = await loadP10Dataset(dataset, revision, tree, eol), selected = selectP10(catalog)
  await mkdir(join(directory, 'manifest')); await mkdir(join(directory, 'tasks'))
  const entries = selected.map(({ task, category, selection_key }, index) => ({ manifest_index: index + 1, task_id: task.task_id, category, selection_key,
    assets: task.assets, git_crlf_checkout_files: task.git_crlf_checkout_files, public_interface: task.interface, interface_error: task.interface_error, clock: task.clock }))
  const manifest = { schema_version: 'p10-manifest-1', campaign_id: id, dataset_source: origin, dataset_revision: revision, dataset_task_count: catalog.length,
    selection_algorithm: 'ordered-public-spec-predicates-then-sha256-v1', selection_seed: selectionSeed, selection_rules: selectionRules,
    task_ids: entries.slice(0, 10).map(e => e.task_id), tasks: entries.slice(0, 10), shared_initial_candidate_planned: true }
  const manifestBytes = JSON.stringify(manifest, null, 2) + '\n', manifestHash = sha256(manifestBytes)
  await publish(join(directory, 'manifest'), 'p10-manifest-10.json', manifestBytes)
  await publish(join(directory, 'manifest'), 'manifest-receipt.json', JSON.stringify({ path: 'p10-manifest-10.json', sha256: manifestHash }))
  await publish(join(directory, 'manifest'), 'selection-order.json', JSON.stringify({ seed: selectionSeed, tasks: entries, main_40_run_authorized: false }, null, 2))
  await publish(join(directory, 'manifest'), 'dataset-catalog.json', JSON.stringify({ dataset_revision: revision, tasks: catalog.map(t => ({ task_id: t.task_id, assets: t.assets })) }, null, 2))
  const { config: eda } = await readDoctorConfig(config.settingsFile)
  const limits: VerificationLimits = { compileMs: config.compileMs, elaborateMs: config.elaborateMs, simulationMs: config.simulationMs,
    totalMs: config.totalMs, maxArtifactBytes: config.maxArtifactBytes, artifactPollMs: config.artifactPollMs, maxEventBytes: config.maxEventBytes }
  await publish(directory, 'resolved-evaluator.json', JSON.stringify({ eda, limits, source_order: ['dut', 'reference', 'testbench'], language: 'systemverilog', seed: 1, synthesis_requested: false }, null, 2))
  const rows: P10Preflight[] = []
  async function inspect(task: P10Task, index: number | null): Promise<P10Preflight> {
    signal.throwIfAborted(); await assertFreeze()
    await claimExperiment(directory, { campaign_id: id, task: task.task_id, purpose: index === null ? 'sentinel' : 'selected', manifest_sha256: manifestHash }, id)
    const target = join(directory, 'tasks', task.task_id); await mkdir(target); await mkdir(join(target, 'eda'))
    await publish(target, 'prompt.txt', task.spec)
    let runner: VerificationRunner | undefined
    const begin = performance.now()
    const row: P10Preflight = { campaign_id: id, task_id: task.task_id, manifest_index: index, status: 'INCONCLUSIVE', reason: 'PREFLIGHT_NOT_COMPLETED',
      verification_run: null, verification_key: null, wrapper_sha256: null, stages: {}, blocked_stage: null, diagnostics: [], eda_wall_ms: 0, processes_joined: false, model_requests: 0 }
    try {
      const { assets, evaluation } = await p10PreflightAssets(dataset, task)
      await publish(target, 'wrapper.sv', assets['rtl/solution.sv']!)
      row.wrapper_sha256 = sha256(assets['rtl/solution.sv']!)
      runner = new VerificationRunner(ctx.subprocess, { ...eda, outputRoot: join(target, 'eda') }, limits)
      const snapshot = await runner.registerDataset(assets, evaluation, { experiment_id: id as PhaseId, task_id: task.task_id as PhaseId, sample_id: 0, mode: 'agent' })
      const result = await runner.preflightDataset(snapshot, signal, argv => argv)
      row.verification_run = result.artifacts
      const record = parseRecord('RunResult', JSON.parse(await readFile(join(result.artifacts, 'result.json'), 'utf8'))) as RunRecord
      if (record.final_verified || record.final_source_sha256 !== row.wrapper_sha256 || record.task_id !== task.task_id || record.experiment_id !== id) throw new Error('PREFLIGHT_RESULT_BINDING_INVALID')
      Object.assign(row, classifyPreflight(result))
      row.reason = record.stop_reason; row.verification_key = record.verification_key
      row.stages = Object.fromEntries(result.stages.map(s => [s.stage, s.status]))
      row.diagnostics = result.stages.flatMap(s => s.errors as AttributedDiagnostic[])
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      row.status = 'INCONCLUSIVE'; row.reason = /^[A-Z_]+$/.test(message) ? message : 'PREFLIGHT_HOST_FAILURE'
      if (/DATASET_|CAMPAIGN_|BINDING/.test(message)) throw error
    } finally { await runner?.close(); row.processes_joined = true; row.eda_wall_ms = Math.round(performance.now() - begin) }
    await publish(target, 'preflight.json', JSON.stringify(row, null, 2) + '\n')
    process.stdout.write(JSON.stringify({ task_id: task.task_id, selected: index !== null, status: row.status, stage: row.blocked_stage }) + '\n')
    return row
  }
  for (const [index, { task }] of selected.slice(0, 10).entries()) rows.push(await inspect(task, index + 1))
  const sentinel = await inspect(catalog.find(t => t.task_id === 'Prob038_count15')!, null)
  if ((await gitRead('final-head', ['rev-parse', 'HEAD'])).trim() !== revision || (await gitRead('final-status', ['status', '--porcelain=v1', '--untracked-files=all'])).trim()) throw new Error('DATASET_CHANGED_DURING_PREFLIGHT')
  const after = await loadP10Dataset(dataset, revision, tree, await gitRead('final-eol', ['ls-files', '--eol', '--', 'dataset_spec-to-rtl']))
  if (JSON.stringify(after) !== JSON.stringify(catalog)) throw new Error('DATASET_CHANGED_DURING_PREFLIGHT')
  await assertFreeze()
  const decision = await reportP10Preflight(directory, revision, rows, sentinel, Math.round(performance.now() - started))
  await publish(directory, 'terminal.json', JSON.stringify({ campaign_id: id, phase: 'TERMINAL', ...decision, dataset_unchanged: true }, null, 2) + '\n')
  process.stdout.write(JSON.stringify(decision) + '\n')
}
