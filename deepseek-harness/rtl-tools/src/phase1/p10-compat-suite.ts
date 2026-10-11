/** Build once, then load frozen full-dataset evaluator bytes without runtime transformations. @module rtl-tools/phase1/p10-compat-suite */
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative } from 'node:path'
import { publish } from './candidates.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { datasetRevision } from './protocol.ts'
import { p10PreflightAssets, type P10Task } from './p10-dataset.ts'
import { compatibilityVersion, convertTB, rule, scanTB, type ScanStatus } from './p10-compat-rule.ts'

/** Authoritative immutable full-suite inventory. */
export const suiteManifestName = (version: string) => `verilogeval-${compatibilityVersion(version)}-manifest.json`
/** Presence selects the full-suite loader, including fail-closed unsealed builds. */
export const suiteMarkerName = 'suite-format.json'
const json = (value: unknown) => JSON.stringify(value, null, 2) + '\n'

/** One immutable asset receipt; tool results live outside the frozen build. */
export interface SuiteTask {
  task_id: string; original_path: string; dataset_revision: string; original_tb_sha256: string; effective_tb_sha256: string
  evaluator_id: string; compatibility_version: string; vivado_version: string; compatibility_rules: typeof rule[]
  status: ScanStatus; review_status: string; static_evidence: string; conversion_timestamp: string; converter_source_sha256: string
  patch_sha256: string; source_map_sha256: string; tool_validation: 'NOT_RUN'
}
/** Deterministic build inventory, with unchanged and unknown tasks retained. */
export interface SuiteManifest {
  dataset_revision: string; compatibility_version: string; vivado_version: string; conversion_timestamp: string
  converter_source_sha256: string; task_count: number; converted_task_count: number; unchanged_task_count: number; unknown_task_count: number
  rules: typeof rule[]; tasks: SuiteTask[]
}

/** Hash the complete converter implementation rather than a filename or package version. @returns deterministic source digest. */
export async function converterHash() {
  const sources = []
  for (const file of ['p10-compat-rule.ts', 'p10-compat-suite.ts']) sources.push([file, sha256(await readFile(new URL(file, import.meta.url)))])
  return sha256(json(sources))
}

/** Exclusively publish all TB copies and deterministic provenance outside upstream. @param dataset - pinned checkout. @param catalog - Git-verified catalog. @param parent - existing external output directory. @param timestamp - explicit build epoch, reused for reproducibility. @returns full suite manifest. */
export async function buildSuite(dataset: string, catalog: P10Task[], parent: string, timestamp: string, policy: { vivadoVersion: string; applyDeclarationOrderRule: boolean }): Promise<SuiteManifest> {
  const version = compatibilityVersion(policy.vivadoVersion)
  const upstream = await realpath(dataset), output = await realpath(parent), rel = relative(upstream, output)
  if (!rel || !rel.startsWith('..') && !isAbsolute(rel)) throw new Error('COMPAT_OUTPUT_INSIDE_DATASET')
  if (new Date(timestamp).toISOString() !== timestamp) throw new Error('COMPAT_BUILD_EPOCH_INVALID')
  const converter = await converterHash(), tasks: SuiteTask[] = []
  await publish(output, suiteMarkerName, json({ compatibility_version: version, vivado_version: policy.vivadoVersion }))
  for (const task of [...catalog].sort((a, b) => a.task_id.localeCompare(b.task_id, 'en'))) {
    const original_path = `dataset_spec-to-rtl/${task.task_id}_test.sv`, expected = task.assets[original_path]
    const bytes = await readFile(await checkedFile(upstream, original_path))
    if (sha256(bytes) !== expected) throw new Error('COMPAT_INPUT_SHA_MISMATCH')
    const scan = scanTB(bytes), converted = policy.applyDeclarationOrderRule && scan.status === 'MATCH_VIVADO_COMPAT_001'
    const transformed = converted ? convertTB(task.task_id, bytes, expected) : {
      effective: bytes, patch: '', sourceMap: { version: 1, new_to_original_line: (bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? []).map((_, i) => i + 1) },
    }
    const mapping = json(transformed.sourceMap), metadata: SuiteTask = {
      task_id: task.task_id, original_path, dataset_revision: datasetRevision, original_tb_sha256: expected,
      effective_tb_sha256: sha256(transformed.effective), evaluator_id: `verilogeval-${task.task_id}-${version}`,
      compatibility_version: version, vivado_version: policy.vivadoVersion, compatibility_rules: converted ? [rule] : [],
      status: scan.status, review_status: converted || scan.status === 'NO_KNOWN_COMPAT_ISSUE' || scan.status === 'MATCH_VIVADO_COMPAT_001' ? 'STATIC_SCAN_COMPLETE_NOT_TOOL_VALIDATED' : 'NEEDS_MANUAL_COMPAT_REVIEW',
      static_evidence: scan.reason, conversion_timestamp: timestamp, converter_source_sha256: converter,
      patch_sha256: sha256(transformed.patch), source_map_sha256: sha256(mapping), tool_validation: 'NOT_RUN',
    }
    const target = join(output, task.task_id); await mkdir(target)
    // Buffer publishing is necessary for untouched unknown/invalid-UTF8 inputs.
    await writeFile(join(target, 'tb.sv'), transformed.effective, { flag: 'wx', mode: 0o600 })
    await publish(target, 'change.diff', transformed.patch)
    await publish(target, 'source-map.json', mapping)
    await publish(target, 'transform.json', json(metadata))
    tasks.push(metadata)
  }
  const manifest: SuiteManifest = { dataset_revision: datasetRevision, compatibility_version: version, vivado_version: policy.vivadoVersion,
    conversion_timestamp: timestamp, converter_source_sha256: converter, task_count: tasks.length,
    converted_task_count: tasks.filter(t => t.compatibility_rules.length).length, unchanged_task_count: tasks.filter(t => !t.compatibility_rules.length).length,
    unknown_task_count: tasks.filter(t => t.review_status === 'NEEDS_MANUAL_COMPAT_REVIEW').length, rules: policy.applyDeclarationOrderRule ? [rule] : [], tasks }
  await publish(output, suiteManifestName(policy.vivadoVersion), json(manifest))
  await publish(output, 'compat-scan.json', json({ meaning: 'Static pattern classification, not Vivado results.', tasks: tasks.map(t => ({ task_id: t.task_id, status: t.status, evidence: t.static_evidence })) }))
  await publish(output, 'compat-scan.csv', 'task_id,status,evidence\n' + tasks.map(t => `${t.task_id},${t.status},${t.static_evidence}`).join('\n') + '\n')
  return manifest
}

/** Read and authenticate one frozen evaluator; only the Host calibration entry may load an unsealed build. @param dataset - original checkout. @param task - original catalog entry. @param parent - full-suite root. @param defaultTimescale - evidence-backed default, never override. @param calibration - explicit Host-only pre-freeze phase. @returns shared baseline/agent assets and cache identity. */
export async function loadSuiteAssets(dataset: string, task: P10Task, parent: string, defaultTimescale?: '1ps/1ps', calibration = false) {
  const original = await p10PreflightAssets(dataset, task), root = await realpath(parent)
  const marker = JSON.parse(await readFile(await checkedFile(root, suiteMarkerName), 'utf8')) as { vivado_version: string; compatibility_version: string }
  const version = compatibilityVersion(marker.vivado_version)
  if (marker.compatibility_version !== version) throw new Error('COMPAT_MANIFEST_INVALID')
  const manifestBytes = await readFile(await checkedFile(root, suiteManifestName(marker.vivado_version))), manifest = JSON.parse(manifestBytes.toString()) as SuiteManifest
  if (manifest.dataset_revision !== datasetRevision || manifest.compatibility_version !== version || manifest.vivado_version !== marker.vivado_version ||
    manifest.converter_source_sha256 !== await converterHash() || manifest.tasks.length !== manifest.task_count || new Set(manifest.tasks.map(t => t.task_id)).size !== manifest.task_count) throw new Error('COMPAT_MANIFEST_INVALID')
  if (!calibration) {
    const seal = JSON.parse(await readFile(await checkedFile(root, 'suite-freeze.json'), 'utf8'))
    if (seal.manifest_sha256 !== sha256(manifestBytes) || seal.defaultTimescale !== defaultTimescale || seal.representative_calibration_passed !== true) throw new Error('COMPAT_SUITE_NOT_FROZEN')
  }
  const metadata = manifest.tasks.find(t => t.task_id === task.task_id)
  if (!metadata || metadata.vivado_version !== manifest.vivado_version || metadata.compatibility_version !== version || metadata.evaluator_id !== `verilogeval-${task.task_id}-${version}` || metadata.review_status === 'NEEDS_MANUAL_COMPAT_REVIEW' || metadata.original_tb_sha256 !== sha256(original.assets['trusted/tb.sv']!)) throw new Error('COMPAT_ASSET_CHANGED_OR_UNREVIEWED')
  const read = async (name: string) => readFile(await checkedFile(root, `${task.task_id}/${name}`))
  const effective = await read('tb.sv')
  if (sha256(effective) !== metadata.effective_tb_sha256 || sha256(await read('change.diff')) !== metadata.patch_sha256 ||
    sha256(await read('source-map.json')) !== metadata.source_map_sha256 || !Buffer.from(json(metadata)).equals(await read('transform.json'))) throw new Error('COMPAT_ASSET_CHANGED')
  original.assets['trusted/tb.sv'] = new TextDecoder('utf-8', { fatal: true }).decode(effective)
  original.evaluation = { ...original.evaluation, evaluatorId: metadata.evaluator_id + (defaultTimescale ? '-default-1ps' : '-no-default-timescale'),
    compatibility: { ...metadata, manifest_sha256: sha256(manifestBytes), preserve_explicit_timescales: true }, ...(defaultTimescale ? { defaultTimescale } : {}) }
  return original
}

/** Assert the independently loaded comparison arms bind to identical evaluator bytes and protocol. @param baseline - first evaluator configuration. @param agent - second evaluator configuration. */
export function assertSharedEvaluator(baseline: Awaited<ReturnType<typeof loadSuiteAssets>>, agent: Awaited<ReturnType<typeof loadSuiteAssets>>) {
  if (sha256(baseline.assets['trusted/tb.sv']!) !== sha256(agent.assets['trusted/tb.sv']!) || JSON.stringify(baseline.evaluation) !== JSON.stringify(agent.evaluation)) throw new Error('BASELINE_AGENT_EVALUATOR_MISMATCH')
}
