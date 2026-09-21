import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { buildContext, type TokenCounter } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-context.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
const root = 'D:/AMD/phase1-validation/p09-real-loop-20260917'
const full = process.argv.includes('--full')
const state = JSON.parse(await readFile(join(root, 'experiments/' + (full ? 'repair-29cee014-7d0f-4425-ac6a-589843df6798' : 'repair-1a021387-5dbf-43a2-b8d3-3fb8dd9cb3b0') + '/state.json'), 'utf8'))
const settings = JSON.parse(await readFile(join(root, 'configs/p09-A.json'), 'utf8'))
const name = full ? 'tokenizer-boundary-full-v2' : 'tokenizer-boundary'
const directory = join(root, name); await mkdir(directory)
const outcomes = []
let index = 0
for (const run of state.model_runs) {
  const input = JSON.parse(await readFile(join(run, 'context.json'), 'utf8'))
  const original = JSON.parse(await readFile(join(run, 'prompt-final.txt'), 'utf8'))
  const audit = JSON.parse(await readFile(join(run, 'context-audit.json'), 'utf8'))
  let finalHash = ''
  const counter: TokenCounter = { quality: 'exact_local', identity: audit.counter, async count(view) {
    const body = structuredClone(original)
    body.messages[0].content = view.system; body.messages[1].content = view.prompt
    const bytes = JSON.stringify(body), path = join(directory, String(++index).padStart(3, '0') + '.json')
    await writeFile(path, bytes)
    finalHash = sha256(bytes)
    return JSON.parse(execFileSync('D:/AMD/p09-runtime/bin/p09-official-counter.exe', [path, 'D:/AMD/p09-runtime/deepseek-recipe/static/tokenizers/v41/tokenizer.json'], { encoding: 'utf8' })).tokens
  } }
  const signal = new AbortController().signal
  const built = await buildContext(input, settings.limits, counter, signal)
  if (built.audit.tokens !== audit.tokens || finalHash !== audit.final_prompt_sha256) throw new Error('Full request recount mismatch')
  const exact = { ...settings.limits, window: built.audit.tokens + settings.limits.output + settings.limits.margin }
  const boundary = await buildContext(input, exact, counter, signal)
  const coreInput = { ...input, core_only: true }
  const core = await buildContext(coreInput, settings.limits, counter, signal)
  const coreExact = { ...settings.limits, window: core.audit.tokens + settings.limits.output + settings.limits.margin }
  await buildContext(coreInput, coreExact, counter, signal)
  let blocked = false
  try { await buildContext(coreInput, { ...coreExact, window: coreExact.window - 1 }, counter, signal) }
  catch (error) { if ((error as Error).message !== 'CONTEXT_UNSATISFIABLE') throw error; blocked = true }
  if (!blocked || boundary.audit.tokens !== built.audit.tokens) throw new Error('Boundary guard failed')
  outcomes.push({ run, full_request_hash_matches: true, local_tokens: built.audit.tokens, core_tokens: core.audit.tokens, exact_limit_accepted: true, core_one_token_over_blocked: true,
    provider_replay_fields: original.messages.some(m => typeof m.reasoning_content === 'string'), tools: original.tools.length,
    provider_usage_equivalence_claimed: false, network_dispatches: 0 })
}
await writeFile(join(root, name + '.json'), JSON.stringify(outcomes, null, 2), { flag: 'wx' })
console.log(JSON.stringify(outcomes))
