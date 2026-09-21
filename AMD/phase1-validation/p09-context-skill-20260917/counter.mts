import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { buildContext, type TokenCounter } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-context.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
const root = dirname(fileURLToPath(import.meta.url))
const read = async (p: string) => JSON.parse(await readFile(p, 'utf8'))
const prior = 'D:/AMD/phase1-validation/p09-output-budget-20260917-v2'
const rows = (await read(prior + '/output-budget-comparison.json')).rows
const seed = rows.find(r => r.task === 'sequence_101' && r.variant === 'C' && r.budget === 8192)
const state = await read(seed.directory + '/state.json')
const run = state.model_runs[1]
const original = await read(run + '/prompt-final.txt'), input = await read(run + '/context.json')
input.variant_id = 'A'; input.ledger = []; delete input.skill_validation
const p09 = await read(root + '/configs/p09-C.json'), auto = await read(root + '/configs/auto.json')
const runtime = await read(auto.runtimeRoot + '/manifest.json')
assert.equal(sha256(await readFile(auto.runtimeRoot + '/manifest.json')), auto.runtimeManifestSha256)
for (const [p, digest] of Object.entries(runtime.files)) assert.equal(sha256(await readFile(join(auto.runtimeRoot, p))), digest)
const directory = root + '/counter'; await mkdir(directory)
let index = 0
const cache = new Map<string, number>()
const counter: TokenCounter = { quality: 'exact_local', identity: { implementation: 'official-rust-deepseek-recipe', revision: runtime.revision, cloud_equivalence: 'unconfirmed' },
  async count(view) {
    const body = structuredClone(original)
    body.messages[0].content = view.system; body.messages[1].content = view.prompt
    const text = JSON.stringify(body), digest = sha256(text)
    if (cache.has(digest)) return cache.get(digest)!
    const path = join(directory, String(++index).padStart(3, '0') + '.json'); await writeFile(path, text, { flag: 'wx' })
    const tokens = JSON.parse(execFileSync(join(auto.runtimeRoot, runtime.executable), [path, join(auto.runtimeRoot, runtime.tokenizer)], { encoding: 'utf8', timeout: 10000 })).tokens
    cache.set(digest, tokens); return tokens
  } }
const signal = new AbortController().signal
const base = await buildContext(input, p09.limits, counter, signal)
const prompt = JSON.parse(base.prompt), originalSpec = input.task.spec
const count = async (n: number) => {
  prompt.task.spec = originalSpec + '\nSynthetic offline capacity padding:' + ' x'.repeat(n)
  return counter.count({ system: base.system, prompt: JSON.stringify(prompt) }, signal)
}
const budget = 131072 - 8192 - 1024
let lower = 0, upper = budget
while (lower < upper) {
  const middle = Math.ceil((lower + upper) / 2)
  if (await count(middle) <= budget) lower = middle; else upper = middle - 1
}
assert.equal(await count(lower), budget)
assert.equal(await count(lower + 1), budget + 1)
input.task.spec = originalSpec + '\nSynthetic offline capacity padding:' + ' x'.repeat(lower)
const accepted = await buildContext(input, p09.limits, counter, signal)
assert.equal(accepted.audit.tokens, budget)
assert.equal(JSON.parse(accepted.prompt).task.spec, input.task.spec)
let oldBlocked = false, overflowBlocked = false
try { await buildContext(input, { ...p09.limits, window: 16384 }, counter, signal) }
catch (error) { if ((error as Error).message !== 'CONTEXT_UNSATISFIABLE') throw error; oldBlocked = true }
input.task.spec += ' x'
try { await buildContext(input, p09.limits, counter, signal) }
catch (error) { if ((error as Error).message !== 'CONTEXT_UNSATISFIABLE') throw error; overflowBlocked = true }
assert.ok(oldBlocked && overflowBlocked)
const result = { evidence_kind: 'offline_exact_official_tokenizer_synthetic_capacity_test', window: 131072, output: 8192, margin: 1024,
  input_budget: budget, exact_boundary_accepted: accepted.audit.tokens, one_token_over_blocked: overflowBlocked,
  same_large_core_blocked_at_16k: oldBlocked, tools: original.tools.length,
  assistant_tool_calls: original.messages.filter(m => m.role === 'assistant' && m.tool_calls).length,
  tool_returns: original.messages.filter(m => m.role === 'tool').length,
  required_reasoning_replay_present: original.messages.some(m => typeof m.reasoning_content === 'string'),
  runtime_manifest_sha256: auto.runtimeManifestSha256, counted_requests: index, api_dispatches: 0,
  provider_128k_stress_test: false, provider_usage_equivalence_claimed: false, seed_request: run }
await writeFile(root + '/counter-128k.json', JSON.stringify(result, null, 2), { flag: 'wx' })
console.log(JSON.stringify(result))
