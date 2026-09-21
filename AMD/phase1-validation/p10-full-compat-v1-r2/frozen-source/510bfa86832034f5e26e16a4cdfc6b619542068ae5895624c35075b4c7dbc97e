/** Reviewed byte-preserving P10 evaluator portability rule. @module rtl-tools/phase1/p10-compat */
import { mkdir, readFile, realpath } from 'node:fs/promises'
import { join, relative, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sha256 } from './snapshots.ts'
import { publish } from './candidates.ts'
import { p10PreflightAssets, type P10Task } from './p10-dataset.ts'
import { loadSuiteAssets, suiteMarkerName } from './p10-compat-suite.ts'

/** Exact Windows checkout bytes reviewed against the v8 frozen task snapshots. */
export const reviewedTBs: Readonly<Record<string, string>> = Object.freeze({
  Prob005_notgate: '77a5052ee99d7d475af722ed3222fe56cce92971da0bfe82723d3f29504e55f3',
  Prob035_count1to10: 'be2d2f038961bd715d78127e2f8a135dbd86f2fb0415b74f69ab371fbc1c6864',
  Prob045_edgedetect2: '0a6b46401b15754c7f868715a4b91a055bfe3aca1ed91b922cc2e4427b44b320',
  Prob074_ece241_2014_q4: '8610378f92fc7465960d5e87570f76fdd91c1c7d7e51f5c8374f9145cb60fc7b',
  Prob015_vector1: '182abe01965597b4f3eddf19d4453376c2d5140c6408d627c3259e3df0c6dec4',
  Prob033_ece241_2014_q1c: 'a8122a224d545d16e811515749695b7f0d63b5b1be292ad358da429135b4fbf4',
  Prob004_vector2: '4d7d5a276121d9b81a89310eac8740ce2395bce31e025ef5f9494c6e10554a20',
  Prob020_mt2015_eq2: '597db0f4704f36a63a17b64aa58a8d0fafbc7858e3b5442a2bdf127cff9cf627',
  Prob018_mux256to1: 'e35b074e13f26a58cba329c72d149206ddca7ac1e655d34631cd0cd5686e14ea',
  Prob061_2014_q4a: '880aefee692d39245be7f132150989ec6f7d73f1ecd7446372491455e9a1e292',
  Prob038_count15: 'ec621347c00ecf662327c33fcc2686514cae4f52f84704ad805d484c1775c9df',
})

/** Move only two complete declaration lines; reject every unreviewed input. @param taskId - frozen identity. @param bytes - exact upstream bytes. @returns reversible permutation and unified diff. */
export function adaptTB(taskId: string, bytes: Buffer) {
  if (!Object.hasOwn(reviewedTBs, taskId) || sha256(bytes) !== reviewedTBs[taskId]) throw new Error('COMPAT_RULE_UNSUPPORTED')
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  const lines = text.match(/[^\n]*\n|[^\n]+$/g)!
  const decl = lines.findIndex(line => /^\s*wire tb_match;\s*\/\/ Verification\r?\n$/.test(line))
  const dump = lines.findIndex(line => line.includes('$dumpvars('))
  const initial = dump - 2
  const prefix = lines.slice(0, initial).join('')
  const moduleStart = [...prefix.matchAll(/\bmodule\s+\w+/g)].at(-1)?.index
  const scope = moduleStart === undefined ? '' : prefix.slice(moduleStart)
  if (decl < 0 || dump < 2 || !/^\s*wire tb_mismatch = ~tb_match;\r?\n$/.test(lines[decl + 1]!) ||
    !/^\s*initial begin\s*$/.test(lines[initial]!) || !lines[initial + 1]!.includes('$dumpfile(') ||
    !/^module tb\(\);/.test(scope ?? '') || /\bendmodule\b/.test(scope!) ||
    (text.match(/\bwire tb_match;/g) ?? []).length !== 1 || (text.match(/\bwire tb_mismatch/g) ?? []).length !== 1 ||
    decl <= dump || !/^\s*end\s*$/.test(lines[dump + 1]!) || lines.slice(dump + 2, decl).some(line => line.trim())) throw new Error('COMPAT_RULE_UNSUPPORTED')
  const order = lines.map((_, i) => i)
  const moved = order.splice(decl, 2); order.splice(initial, 0, ...moved)
  const effective = Buffer.from(order.map(i => lines[i]).join(''))
  const sourceMap = JSON.stringify({ version: 1, new_to_original_line: order.map(i => i + 1) }, null, 2) + '\n'
  const patch = `--- original/${taskId}_test.sv\n+++ derived/${taskId}_test.sv\n@@ -${initial + 1},${decl + 2 - initial} +${initial + 1},${decl + 2 - initial} @@\n` +
    lines.slice(decl, decl + 2).map(line => '+' + line).join('') + lines.slice(initial, decl).map(line => ' ' + line).join('') + lines.slice(decl, decl + 2).map(line => '-' + line).join('')
  return { effective, patch, sourceMap }
}

/** Build outside the upstream root, exclusively publishing auditable artifacts. @param dataset - unchanged upstream. @param task - pinned public identity. @param parent - external derived directory. @returns provenance. */
export async function buildCompatAssets(dataset: string, task: P10Task, parent: string) {
  const upstream = await realpath(dataset), output = await realpath(parent)
  const rel = relative(upstream, output)
  if (!rel || !rel.startsWith('..') && !isAbsolute(rel)) throw new Error('COMPAT_OUTPUT_INSIDE_DATASET')
  const original = await p10PreflightAssets(upstream, task)
  const bytes = Buffer.from(original.assets['trusted/tb.sv']!)
  const derived = adaptTB(task.task_id, bytes)
  const metadata = { task_id: task.task_id, evaluator_id: `p10-verilogeval-${task.task_id}-vivado-compat-v1`,
    upstream_revision: original.evaluation.datasetRevision, original_tb_sha256: sha256(bytes), effective_tb_sha256: sha256(derived.effective),
    adapter_rule_id: 'tb-net-declaration-order-v1', adapter_source_sha256: sha256(await readFile(fileURLToPath(import.meta.url))),
    patch_sha256: sha256(derived.patch), source_map_sha256: sha256(derived.sourceMap), preserve_explicit_timescales: true }
  const target = join(output, task.task_id); await mkdir(target)
  await publish(target, 'tb.sv', derived.effective.toString('utf8'))
  await publish(target, 'tb.patch', derived.patch)
  await publish(target, 'source-map.json', derived.sourceMap)
  await publish(target, 'compatibility.json', JSON.stringify(metadata, null, 2) + '\n')
  return metadata
}

/** Both calibration and candidate scoring load the same fixed derived bytes. @param dataset - unchanged upstream. @param task - checked identity. @param parent - frozen derived directory. @param defaultTimescale - evidence-backed evaluator default, never override. @returns trusted assets and verification-key inputs. */
export async function loadCompatAssets(dataset: string, task: P10Task, parent: string, defaultTimescale?: '1ps/1ps') {
  let fullSuite = false
  try { await readFile(join(parent, suiteMarkerName)); fullSuite = true } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  if (fullSuite) return loadSuiteAssets(dataset, task, parent, defaultTimescale)
  const original = await p10PreflightAssets(dataset, task), target = join(parent, task.task_id)
  const metadata = JSON.parse(await readFile(join(target, 'compatibility.json'), 'utf8'))
  const derived = adaptTB(task.task_id, Buffer.from(original.assets['trusted/tb.sv']!))
  if (metadata.original_tb_sha256 !== reviewedTBs[task.task_id] || metadata.effective_tb_sha256 !== sha256(derived.effective) ||
    metadata.adapter_source_sha256 !== sha256(await readFile(fileURLToPath(import.meta.url))) ||
    metadata.patch_sha256 !== sha256(derived.patch) || metadata.source_map_sha256 !== sha256(derived.sourceMap)) throw new Error('COMPAT_ASSET_CHANGED')
  for (const [file, expected] of [['tb.sv', metadata.effective_tb_sha256], ['tb.patch', metadata.patch_sha256], ['source-map.json', metadata.source_map_sha256]]) {
    if (sha256(await readFile(join(target, file))) !== expected) throw new Error('COMPAT_ASSET_CHANGED')
  }
  original.assets['trusted/tb.sv'] = (await readFile(join(target, 'tb.sv'))).toString('utf8')
  original.evaluation = { ...original.evaluation, evaluatorId: metadata.evaluator_id + (defaultTimescale ? '-default-1ps' : ''),
    compatibility: metadata, ...(defaultTimescale ? { defaultTimescale } : {}) }
  return original
}

/** Host-only negative control; no reference contents or dependencies. @param task - reviewed interface. @returns immutable faulty DUT to calibrate observability. */
export function negativeControl(task: P10Task): string {
  if (!Object.hasOwn(reviewedTBs, task.task_id) || !task.interface) throw new Error('COMPAT_RULE_UNSUPPORTED')
  if (task.task_id === 'Prob005_notgate') return 'module TopModule(input in, output out); assign out = in; endmodule\n'
  if (task.task_id === 'Prob038_count15') return "module TopModule(input clk, input reset, output reg [3:0] q); always @(posedge clk) if (reset) q <= 0; else q <= q + 2; endmodule\n"
  const ports = task.interface.ports
  return `module TopModule(${ports.map(p => `${p.direction} wire [${p.width - 1}:0] ${p.name}`).join(', ')});\n` +
    ports.filter(p => p.direction === 'output').map(p => `assign ${p.name} = '0;\n`).join('') + 'endmodule\n'
}
