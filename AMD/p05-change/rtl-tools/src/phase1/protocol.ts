/** Frozen VerilogEval protocol and trusted assets, without model or EDA services. @module rtl-tools/phase1/protocol */
import { readFile, realpath } from 'node:fs/promises'
import { checkedFile, sha256, type Evaluation } from './snapshots.ts'

/** Pinned local dataset identity; no online updates occur during an experiment. */
export const datasetRevision = 'c498220d0a52248f8e3fdffe279075215bde2da6'
/** The single public task supported by this development comparison. */
export const taskId = 'Prob038_count15'
/** Experiment variants are not repair rounds or independent pass@k samples. */
export const variants = ['baseline', 'agent_base', 'agent_domain'] as const
/** Host-selected route. */
export type Variant = typeof variants[number]
const files = {
  prompt: ['dataset_spec-to-rtl/Prob038_count15_prompt.txt', '5dd2ec21b518167327b0bc576d69868e89ede59e336c309a643e062edf69dd05'],
  test: ['dataset_spec-to-rtl/Prob038_count15_test.sv', 'ec621347c00ecf662327c33fcc2686514cae4f52f84704ad805d484c1775c9df'],
  reference: ['dataset_spec-to-rtl/Prob038_count15_ref.sv', '78f018149954ca4fa2864f1bb962d1f85c8acc01fe067fcb52d9e7526c013d66'],
  script: ['scripts/sv-generate', 'f8f789a02db508d4914f46ab77fcb5a294f1bd5bafdb97a42a8e60dc4ea59fc5'],
} as const
async function asset(root: string, key: keyof typeof files): Promise<string> {
  const [path, hash] = files[key], bytes = await readFile(await checkedFile(await realpath(root), path))
  if (sha256(bytes) !== hash) throw new Error('Pinned dataset asset changed: ' + key)
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}
/** Public-only prompt material. Baseline does not read evaluator sources. */
export interface Protocol { system: string; user: string; rules: string; publicSpec: string; sha256: string }
/** Read pinned Python string literals as data, never execute the upstream script. @param root - trusted dataset root. @returns exact zero-shot wrapper and optional rule block. */
export async function loadProtocol(root: string): Promise<Protocol> {
  const publicSpec = await asset(root, 'prompt'), script = await asset(root, 'script')
  const system = /prompts\['spec-to-rtl'\] = \{\s*'system_msg' : """([\s\S]*?)"""/.exec(script)?.[1]
  const rules = /^prompt_rules_suffix="""([\s\S]*?)"""/m.exec(script)?.[1]
  const suffix = /^prompt_no_explain_suffix="""([\s\S]*?)"""/m.exec(script)?.[1]
  if (system === undefined || rules === undefined || suffix === undefined) throw new Error('Pinned protocol literals unavailable')
  const user = ('\nQuestion:\n' + publicSpec.trim() + '\n').trimEnd() + '\n' + suffix + '\nAnswer:\n'
  return { system, user, rules, publicSpec, sha256: sha256(JSON.stringify({ system, user, rules })) }
}
/** Select a frozen generation prompt; domain rules occupy only the extra system block. @param protocol - pinned public data. @param variant - route. @returns exact system/user text. */
export function generationPrompt(protocol: Protocol, variant: Variant): { system: string; user: string } {
  return { system: protocol.system + (variant === 'agent_domain' ? protocol.rules : ''), user: protocol.user }
}
/** Evaluator profile is host-owned and never model-selectable. */
export const evaluation: Evaluation = { top: 'TopModule', tbTop: 'tb', sources: ['rtl/solution.sv', 'trusted/ref.sv', 'trusted/tb.sv'], evaluatorId: 'verilogeval-count15-v1', seed: 1, datasetRevision }
/** Read reference/testbench only in the external evaluator. @param root - pinned dataset. @param source - reviewed candidate. @returns isolated snapshot contents. */
export async function evaluatorAssets(root: string, source: string): Promise<Record<string, string>> {
  return { 'rtl/solution.sv': source, 'trusted/tb.sv': await asset(root, 'test'), 'trusted/ref.sv': await asset(root, 'reference'), 'trusted/clock.xdc': 'create_clock -name clk -period 5.000 [get_ports clk]\n' }
}
/** Expected scoring assets without reading reference RTL in the generation process. */
export const scoringIdentity = { datasetRevision, taskId, test: files.test[1], reference: files.reference[1], xdc: sha256('create_clock -name clk -period 5.000 [get_ports clk]\n'), evaluation }
