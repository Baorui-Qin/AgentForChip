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
import { observedSkill01Summary, skill01Section, type Skill01Options } from '../src/phase1/skill01.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { buildContext as buildParentContext } from './fixtures/skill01/current-parent-context.ts'

const parent = resolve(import.meta.dirname, '../../../AMD/phase3-tool-skill/phase3-skill01-sequential-check-v1')
const shared = resolve(import.meta.dirname, '../../../AMD/phase3-tool-skill/p3-shared-fix-01-v1')
const fixture = JSON.parse(await readFile(resolve(parent, 'parent-request-fixtures.json'), 'utf8')) as {
  settings: P09Settings; knowledge: { file: string; root: string; hash: string }
  cells: { mode: string; input: ContextInput; limits: P09Settings['limits']; view: { system: string; prompt: string }; wire: unknown }[]
}
const asset = resolve(import.meta.dirname, 'fixtures/skill01/skills.draft-v3.json'), bytes = await readFile(asset)
const entries = await loadP09Skills({ ...fixture.settings, skillsFile: asset, skillsSha256: sha256(bytes) })
const activeFile = resolve(import.meta.dirname, '../phase3/skill01/skills.draft-v5.json'), activeBytes = await readFile(activeFile)
const activeEntries = await loadP09Skills({ ...fixture.settings, skillsFile: activeFile, skillsSha256: sha256(activeBytes) })
const options: Skill01Options = { entry: activeEntries[0]!, bundleHash: sha256(activeBytes), maxTokens: 512 }
const cell = fixture.cells.find(c => c.mode === 'repair')!, input = () => structuredClone(cell.input)
const counter = { quality: 'estimated' as const, identity: { implementation: 'offline-fixture-bytes-div4' },
  async count(view: unknown) { return Math.ceil(Buffer.byteLength(JSON.stringify(view)) / 4) } }
const signal = new AbortController().signal
const knowledge = { bundle: await loadKnowledge(fixture.knowledge.file, fixture.knowledge.root, fixture.knowledge.hash), topK: 3, maxTokens: 768, toolVersion: '2026.1' }
const wire = (v: { system: string; prompt: string }, pending: boolean) => serializeRequest({ provider: 'deepseek-official', model: 'deepseek-flash', temperature: 0,
  maxTokens: 16384, reasoningEffort: ReasoningEffortId('high'), system: v.system, tools: autoTools('full', pending),
  messages: [createUserMessage({ content: [{ type: 'text', text: v.prompt }], source: { kind: 'user' } })] })
const runtimeRoot = fixture.settings.tokenizer.root
const manifestFile = resolve(runtimeRoot, 'manifest.json'), manifestBytes = await readFile(manifestFile)
const manifest = JSON.parse(manifestBytes.toString()) as { revision: string; executable: string; tokenizer: string; files: Record<string, string> }
if (sha256(manifestBytes) !== fixture.settings.tokenizer.manifestSha256) throw new Error('COUNTER_MANIFEST_DRIFT')
for (const [path, hash] of Object.entries(manifest.files)) if (sha256(await readFile(resolve(runtimeRoot, path))) !== hash) throw new Error('COUNTER_FILE_DRIFT')
const countRoot = await mkdtemp(resolve(tmpdir(), 'skill01-quote-')), ownedRoot = await realpath(countRoot)
afterAll(async () => { if (await realpath(countRoot) !== ownedRoot) throw new Error('COUNTER_CLEANUP_ROOT_CHANGED'); await rm(countRoot, { recursive: true, force: true }) })
let sequence = 0
const exactCounter = { quality: 'exact_local' as const, identity: { implementation: 'official-rust-deepseek-recipe', revision: manifest.revision },
  async count(view: TextView) {
    const path = resolve(countRoot, ++sequence + '.json'); writeFileSync(path, JSON.stringify(wire(view, false)), { flag: 'wx' })
    const result = JSON.parse(execFileSync(resolve(runtimeRoot, manifest.executable), [path, resolve(runtimeRoot, manifest.tokenizer)], { windowsHide: true, timeout: 10000 }).toString()) as { tokens: number }
    return result.tokens
  } }
const summary = (rtl: string, spec = 'positive edge of the clock') => ({ rules: { initial: 'UNSPECIFIED', reset: 'UNSPECIFIED', edge: 'SPECIFIED', enable: 'UNSPECIFIED', state: 'SPECIFIED', output: 'SPECIFIED' },
  spec_quote: spec, rtl_quote: rtl, hypothesis: 'Compare the current update event with the public event', action: 'Make a bounded candidate update', limitations: 'A public summary is not causal proof' })
const source = (value: ReturnType<typeof summary>, post = 'module candidate; endmodule') => '// SKILL01_SUMMARY: ' + JSON.stringify(value) + '\n' + post

it.each(['assign anyedge = in ^ prev;', 'always @(posedge clk) begin'])('accepts exact pre-edit quotation %s, including fragments retained after edit', quote => {
  const c = input(); c.current!.source += '\n' + quote
  expect(observedSkill01Summary(source(summary(quote), c.current!.source), c).observed).toBe(true)
})
it('decodes JSON escapes once and preserves the exact tab and newline in a quotation', () => {
  const c = input(), quote = 'always_ff @(posedge clk)\n\tQ <= D;'; c.current!.source = quote
  const saved = source(summary(quote)); expect(saved).toContain('\\n\\t')
  expect(observedSkill01Summary(saved, c).observed).toBe(true)
})
it('rejects a quotation that matches only after spaces are reformatted', () => {
  const c = input(); c.current!.source = 'Q  <=  D;'
  expect(observedSkill01Summary(source(summary('Q <= D;')), c).reason).toBe('UNSUPPORTED_SUMMARY_EVIDENCE')
})
it('rejects begin inserted into a quotation when the current event has no begin', () => {
  const c = input(); c.current!.source = 'always @(posedge clk) Q <= D;'
  expect(observedSkill01Summary(source(summary('always @(posedge clk) begin')), c).observed).toBe(false)
})
it('rejects an event found only in post-edit code rather than the supplied current source', () => {
  const c = input(); c.current!.source = 'always_ff @(posedge clk) Q <= D;'
  const quote = 'always @(posedge clk) begin'
  expect(observedSkill01Summary(source(summary(quote), quote + '\nQ <= D;\nend'), c).observed).toBe(false)
})
it('rejects a quotation from a stale revision without replacing the current input', () => {
  const c = input(), prior = 'Q <= previous_D;'; c.current!.source = 'Q <= current_D;'
  expect(observedSkill01Summary(source(summary(prior)), c).observed).toBe(false)
})
it.each(['enum', 'missing'] as const)('keeps the original rejection for %s rule evidence', kind => {
  const value = summary('assign anyedge = in ^ prev;')
  if (kind === 'enum') value.rules.edge = 'CHECKED'
  else Reflect.deleteProperty(value.rules, 'edge')
  expect(observedSkill01Summary(source(value), input()).reason).toBe('INCOMPLETE_RULE_SUMMARY')
})
it('still rejects the sealed 0.2.0 failed summary against that exact request pre-edit source', async () => {
  const saved = JSON.parse(await readFile(resolve(shared, 'pilot-summary-failures.json'), 'utf8')) as {
    failures: { source: { path: string; sha256: string }; context: { path: string; sha256: string } }[]
  }
  const f = saved.failures[0]!, before = await readFile(f.context.path), after = await readFile(f.source.path)
  expect(sha256(before)).toBe(f.context.sha256); expect(sha256(after)).toBe(f.source.sha256)
  expect(observedSkill01Summary(after.toString(), JSON.parse(before.toString()) as ContextInput).reason).toBe('UNSUPPORTED_SUMMARY_EVIDENCE')
})
it('loads a separate 0.3.0 draft while preserving the sealed 0.2.0 and old Skill bundle', async () => {
  expect(entries).toHaveLength(1); expect(entries[0]).toMatchObject({ version: '0.3.0', status: 'draft', validation_records: [] })
  expect(sha256(await readFile(resolve(asset, '../skills.draft-v2.json')))).toBe('ccc5bde6cfef7bbcb69a71786a7fcb68c60f14084cdae9bab2c4a2258b80d187')
  expect(sha256(await readFile(fixture.settings.skillsFile!))).toBe(fixture.settings.skillsSha256)
})
it('preserves every disabled provider request without loading the new guidance', async () => {
  for (const c of fixture.cells) {
    const view = await buildContext(c.input, c.limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge)
    const parent = await buildParentContext(c.input, c.limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge)
    expect({ system: view.system, prompt: view.prompt }).toEqual({ system: parent.system, prompt: parent.prompt })
    expect(JSON.stringify(wire(view, c.mode === 'pending'))).toBe(JSON.stringify(wire(parent, c.mode === 'pending')))
    expect(view.audit.experimental_skill_01).toBeUndefined()
  }
})
it('records the new model-visible procedure while preserving old guidance, system and tools', async () => {
  const off = await buildContext(input(), cell.limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge)
  const on = await buildContext(input(), cell.limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge, options)
  expect(on.audit.experimental_skill_01).toMatchObject({ injected: true, version: '0.5.0' })
  expect(on.audit.experimental_skill_01!.token_count).toBeLessThanOrEqual(512)
  const prompt = JSON.parse(on.prompt) as Record<string, unknown>
  expect(prompt.experimental_skill_01).toMatchObject({ version: '0.5.0', procedure: options.entry.rule, content_hash: options.entry.content_hash })
  expect(skill01Section({ entry: entries[0]!, bundleHash: sha256(bytes), maxTokens: 512 }, { ...on.audit.experimental_skill_01!, version: entries[0]!.version, content_hash: entries[0]!.content_hash })).toMatchSnapshot()
  delete prompt.experimental_skill_01
  expect(prompt).toEqual(JSON.parse(off.prompt)); expect(on.system).toBe(off.system)
  expect(on.audit.selected_skills).toEqual(off.audit.selected_skills)
  expect(wire(on, false).tools).toEqual(wire(off, false).tools)
})
it.each(['soft', 'combined', 'window', 'recovery'] as const)('removes the whole procedure and retains the audit for %s pressure', async kind => {
  const c = input(), limits = { ...cell.limits }, opt = { ...options }
  if (kind === 'soft') opt.maxTokens = 1
  if (kind === 'combined') limits.skills = 100
  if (kind === 'recovery') c.core_only = true
  if (kind === 'window') {
    const off = await buildContext(c, limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge)
    limits.window = off.audit.tokens + limits.output + limits.margin + 25
  }
  const v = await buildContext(c, limits, exactCounter, signal, () => loadP09Skills(fixture.settings), knowledge, opt)
  expect(v.audit.experimental_skill_01).toMatchObject({ eligible: true, selected: true, injected: false, token_count: 0,
    reason: kind === 'recovery' ? 'NOT_INJECTED_CONTEXT_RECOVERY' : 'NOT_INJECTED_BUDGET' })
  expect(JSON.parse(v.prompt).experimental_skill_01).toBeUndefined()
})
it('excludes the actual un-injected recovery edit from the original injected-summary denominator', async () => {
  const audit = JSON.parse(await readFile(resolve(shared, 'pilot-results.json'), 'utf8')) as {
    workflows: { injected: boolean; accepted_changed_edit: boolean; procedure_summary_observed: boolean; reason: string }[]
  }
  const changed = audit.workflows.filter(w => w.accepted_changed_edit), injected = changed.filter(w => w.injected)
  expect(changed).toHaveLength(3); expect(injected).toHaveLength(2)
  expect(injected.filter(w => !w.procedure_summary_observed)).toHaveLength(1)
  expect(changed.filter(w => !w.injected)).toEqual([expect.objectContaining({ reason: 'NOT_INJECTED_CONTEXT_RECOVERY', procedure_summary_observed: false })])
})
