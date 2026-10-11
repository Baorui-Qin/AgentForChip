import { readFile, mkdtemp, rm, realpath } from 'node:fs/promises'
import { writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { afterAll, expect, it } from 'vitest'
import { createUserMessage, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import { serializeRequest } from '@deepseek-ai/dsh-llm-deepseek/src/serialize.ts'
import { buildContext, type ContextInput, type TextView } from '../src/phase1/p09-context.ts'
import { loadP09Skills, type P09Settings } from '../src/phase1/p09-proposal.ts'
import { autoTools } from '../src/phase1/p09-auto-policy.ts'
import { loadKnowledge } from '../src/knowledge/knowledge-loader.ts'
import { observedSkill01Summary, skill01Section, strictSkill01Summary, type Skill01Options } from '../src/phase1/skill01.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { buildContext as buildParentContext } from './fixtures/skill01/current-parent-context.ts'

const base = resolve(import.meta.dirname, '../../../AMD/phase3-tool-skill')
const fixture = JSON.parse(await readFile(resolve(base, 'phase3-skill01-sequential-check-v1/parent-request-fixtures.json'), 'utf8')) as {
  settings: P09Settings; knowledge: { file: string; root: string; hash: string }
  cells: { mode: string; input: ContextInput; limits: P09Settings['limits']; view: { system: string; prompt: string }; wire: unknown }[]
}
const asset = resolve(import.meta.dirname, 'fixtures/skill01/skills.draft-v4.json'), bytes = await readFile(asset)
const entries = await loadP09Skills({ ...fixture.settings, skillsFile: asset, skillsSha256: sha256(bytes) })
const activeFile = resolve(import.meta.dirname, '../phase3/skill01/skills.draft-v5.json'), activeBytes = await readFile(activeFile)
const activeEntries = await loadP09Skills({ ...fixture.settings, skillsFile: activeFile, skillsSha256: sha256(activeBytes) })
const options: Skill01Options = { entry: activeEntries[0]!, bundleHash: sha256(activeBytes), maxTokens: 512 }
const cell = fixture.cells.find(c => c.mode === 'repair')!, input = () => structuredClone(cell.input)
const counter = { quality: 'estimated' as const, identity: { implementation: 'offline-fixture-bytes-div4' },
  async count(view: unknown) { return Math.ceil(Buffer.byteLength(JSON.stringify(view)) / 4) } }
const signal = new AbortController().signal
const knowledge = { bundle: await loadKnowledge(fixture.knowledge.file, fixture.knowledge.root, fixture.knowledge.hash), topK: 3, maxTokens: 768, toolVersion: '2026.1' }
const runtimeRoot = fixture.settings.tokenizer.root, manifestBytes = await readFile(resolve(runtimeRoot, 'manifest.json'))
const manifest = JSON.parse(manifestBytes.toString()) as { revision: string; executable: string; tokenizer: string; files: Record<string, string> }
if (sha256(manifestBytes) !== fixture.settings.tokenizer.manifestSha256) throw new Error('COUNTER_MANIFEST_DRIFT')
for (const [path, hash] of Object.entries(manifest.files)) if (sha256(await readFile(resolve(runtimeRoot, path))) !== hash) throw new Error('COUNTER_FILE_DRIFT')
const countRoot = await mkdtemp(resolve(tmpdir(), 'skill01-enum-')), ownedRoot = await realpath(countRoot)
afterAll(async () => { if (await realpath(countRoot) !== ownedRoot) throw new Error('COUNTER_CLEANUP_ROOT_CHANGED'); await rm(countRoot, { recursive: true, force: true }) })
let sequence = 0
const exactCounter = { quality: 'exact_local' as const, identity: { implementation: 'official-rust-deepseek-recipe', revision: manifest.revision },
  async count(view: TextView) {
    const wire = serializeRequest({ provider: 'deepseek-official', model: 'deepseek-flash', temperature: 0, maxTokens: 16384,
      reasoningEffort: ReasoningEffortId('high'), system: view.system, tools: autoTools('full'),
      messages: [createUserMessage({ content: [{ type: 'text', text: view.prompt }], source: { kind: 'user' } })] })
    const file = resolve(countRoot, ++sequence + '.json'); writeFileSync(file, JSON.stringify(wire), { flag: 'wx' })
    return (JSON.parse(execFileSync(resolve(runtimeRoot, manifest.executable), [file, resolve(runtimeRoot, manifest.tokenizer)], { windowsHide: true, timeout: fixture.settings.tokenizer.timeoutMs }).toString()) as { tokens: number }).tokens
  } }
const allowed = ['SPECIFIED', 'UNSPECIFIED', 'AMBIGUOUS', 'NOT_OBSERVED']
const summary = () => ({ rules: { initial: 'UNSPECIFIED', reset: 'NOT_OBSERVED', edge: 'SPECIFIED', enable: 'AMBIGUOUS', state: 'SPECIFIED', output: 'SPECIFIED' } as Record<string, unknown>,
  spec_quote: 'positive edge of the clock', rtl_quote: 'assign anyedge = in ^ prev;', hypothesis: 'Compare the current event and public rule', action: 'Apply one bounded edit', limitations: 'Public evidence does not prove causal use' })
const source = (value: ReturnType<typeof summary>) => '// SKILL01_SUMMARY: ' + JSON.stringify(value) + '\nmodule candidate; endmodule'

it.each(allowed)('accepts the original exact enum %s without changing quotation checks', value => {
  const record = summary(); record.rules.edge = value
  expect(observedSkill01Summary(source(record), input()).observed).toBe(true)
})
it.each(['SPECIFIED: explanation', 'SPECIFIED：解释', 'SPECIFIED\nexplanation', ' SPECIFIED', 'SPECIFIED ', 'SPEC IFIED', 'prefix_SPECIFIED', 'UNSPECIFIED_suffix'])('rejects the unmodified enum string %j without normalization', value => {
  const record = summary(); record.rules.edge = value
  expect(observedSkill01Summary(source(record), input()).reason).toBe('INCOMPLETE_RULE_SUMMARY')
})
it.each([null, 17, true, { status: 'SPECIFIED' }])('retains the original rejection for rule value %j', value => {
  const record = summary(); record.rules.edge = value
  expect(observedSkill01Summary(source(record), input()).reason).toBe('INCOMPLETE_RULE_SUMMARY')
})
it('rejects a missing rule key under the original validator', () => {
  const record = summary(); delete record.rules.edge
  expect(observedSkill01Summary(source(record), input()).reason).toBe('INCOMPLETE_RULE_SUMMARY')
})
it('accepts ordinary single-line JSON layout outside exact enum strings', () => {
  const encoded = JSON.stringify(summary(), null, ' ').replaceAll('\n', ' ')
  expect(observedSkill01Summary('  // SKILL01_SUMMARY: ' + encoded + '\n', input()).observed).toBe(true)
})
it('records the existing single-element array coercion without adding validator semantics', () => {
  const record = summary(); record.rules.edge = ['SPECIFIED']
  expect(observedSkill01Summary(source(record), input()).observed).toBe(true)
})
it('excludes singleton-array coercion from the separate strict procedure audit', () => {
  const record = summary(); record.rules.edge = ['SPECIFIED']
  expect(strictSkill01Summary(source(record), input())).toMatchObject({ strict: false, reason: 'NON_SCALAR_RULE_SUMMARY' })
  record.rules.edge = 'SPECIFIED'
  expect(strictSkill01Summary(source(record), input())).toMatchObject({ strict: true, reason: 'STRICT_BOUND_SUMMARY_OBSERVED_NOT_CAUSAL_PROOF' })
})
it('reproduces the sealed 0.3.0 enum rejection with its exact pre-edit source', async () => {
  const saved = JSON.parse(await readFile(resolve(base, 'p3-test-isolation-01-v1/pilot-failure-analysis.json'), 'utf8')) as {
    records: { validator_reason: string; evidence: { path: string; sha256: string }[] }[]
  }
  const failed = saved.records.find(r => r.validator_reason === 'INCOMPLETE_RULE_SUMMARY')!
  const before = failed.evidence.find(r => r.path.endsWith('context.json'))!, after = failed.evidence.find(r => /revisions.*solution.sv$/.test(r.path))!
  const beforeBytes = await readFile(before.path), afterBytes = await readFile(after.path)
  expect(sha256(beforeBytes)).toBe(before.sha256); expect(sha256(afterBytes)).toBe(after.sha256)
  expect(observedSkill01Summary(afterBytes.toString(), JSON.parse(beforeBytes.toString()) as ContextInput).reason).toBe('INCOMPLETE_RULE_SUMMARY')
})
it('uses a six-key mixed enum example solely as a format illustration', () => {
  const example = JSON.parse(entries[0]!.rule.match(/Format only: (\{[^}]+\})/)![1]!) as Record<string, string>
  expect(Object.keys(example)).toEqual(['initial', 'reset', 'edge', 'enable', 'state', 'output'])
  expect(Object.values(example).every(v => allowed.includes(v))).toBe(true)
  expect(new Set(Object.values(example)).size).toBe(4)
  expect(entries[0]!.rule).toContain('never default to example')
  expect(entries[0]!.rule).toContain('PRE-EDIT current.source')
  expect(entries[0]!.rule).toContain('never proposed/older code')
  expect(entries[0]!.rule).not.toMatch(/Prob045|Prob104|q_in|r_in/)
})
it('loads an independent draft and preserves all non-procedure selection and scope fields', async () => {
  const priorBytes = await readFile(resolve(asset, '../skills.draft-v3.json')), prior = JSON.parse(priorBytes.toString())[0]
  expect(sha256(priorBytes)).toBe('190b56e2322448bc7a47bf83af89d86af8333f4eb771b5a42b2823c1cb122d0c')
  expect(entries).toHaveLength(1); expect(entries[0]).toMatchObject({ version: '0.4.0', status: 'draft', validation_records: [] })
  for (const key of ['id', 'trigger_tags', 'scope', 'limitations'] as const) expect(entries[0]![key]).toEqual(prior[key])
})
it('records the complete enum procedure in a keyless model-visible snapshot', async () => {
  const off = await buildContext(input(), cell.limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge)
  const on = await buildContext(input(), cell.limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge, options)
  expect(on.audit.experimental_skill_01).toMatchObject({ injected: true, version: '0.5.0' })
  const prompt = JSON.parse(on.prompt) as Record<string, unknown>
  expect(prompt.experimental_skill_01).toMatchObject({ version: '0.5.0', procedure: options.entry.rule, content_hash: options.entry.content_hash })
  expect(skill01Section({ entry: entries[0]!, bundleHash: sha256(bytes), maxTokens: 512 }, { ...on.audit.experimental_skill_01!, version: entries[0]!.version, content_hash: entries[0]!.content_hash })).toMatchSnapshot()
  delete prompt.experimental_skill_01
  expect(prompt).toEqual(JSON.parse(off.prompt)); expect(on.system).toBe(off.system)
  expect(on.audit.selected_skills).toEqual(off.audit.selected_skills)
})
it('preserves every disabled request without accessing the new asset loader', async () => {
  for (const c of fixture.cells) {
    const view = await buildContext(c.input, c.limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge)
    const parent = await buildParentContext(c.input, c.limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge)
    expect({ system: view.system, prompt: view.prompt }).toEqual({ system: parent.system, prompt: parent.prompt })
    const wire = serializeRequest({ provider: 'deepseek-official', model: 'deepseek-flash', temperature: 0, maxTokens: 16384,
      reasoningEffort: ReasoningEffortId('high'), system: view.system, tools: autoTools('full', c.mode === 'pending'),
      messages: [createUserMessage({ content: [{ type: 'text', text: view.prompt }], source: { kind: 'user' } })] })
    const parentWire = serializeRequest({ provider: 'deepseek-official', model: 'deepseek-flash', temperature: 0, maxTokens: 16384,
      reasoningEffort: ReasoningEffortId('high'), system: parent.system, tools: autoTools('full', c.mode === 'pending'),
      messages: [createUserMessage({ content: [{ type: 'text', text: parent.prompt }], source: { kind: 'user' } })] })
    expect(JSON.stringify(wire)).toBe(JSON.stringify(parentWire)); expect(view.audit.experimental_skill_01).toBeUndefined()
  }
})
it.each(['soft', 'combined', 'window', 'recovery'] as const)('retains complete removal and original audit for %s pressure', async kind => {
  const c = input(), limits = { ...cell.limits }, opt = { ...options }
  if (kind === 'soft') opt.maxTokens = 1
  if (kind === 'combined') limits.skills = 100
  if (kind === 'recovery') c.core_only = true
  if (kind === 'window') {
    const off = await buildContext(c, limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge)
    limits.window = off.audit.tokens + limits.output + limits.margin + 25
  }
  const view = await buildContext(c, limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge, opt)
  expect(view.audit.experimental_skill_01).toMatchObject({ eligible: true, selected: true, injected: false, token_count: 0,
    reason: kind === 'recovery' ? 'NOT_INJECTED_CONTEXT_RECOVERY' : 'NOT_INJECTED_BUDGET' })
  expect(JSON.parse(view.prompt).experimental_skill_01).toBeUndefined()
})
