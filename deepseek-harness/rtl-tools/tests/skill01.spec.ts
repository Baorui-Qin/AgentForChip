import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { expect, it, vi } from 'vitest'
import { createUserMessage, ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import { serializeRequest } from '@deepseek-ai/dsh-llm-deepseek/src/serialize.ts'
import { buildContext, type ContextInput, type SkillEntry } from '../src/phase1/p09-context.ts'
import { loadP09Skills, type P09Settings } from '../src/phase1/p09-proposal.ts'
import { autoTools, checkAutoSource, parseAutoAction } from '../src/phase1/p09-auto-policy.ts'
import { loadKnowledge } from '../src/knowledge/knowledge-loader.ts'
import { assessSkill01, observedSkill01Summary, skill01Section, type Skill01Options } from '../src/phase1/skill01.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { Config } from '../src/phase1/p10-model.ts'
import { buildContext as buildParentContext } from './fixtures/skill01/current-parent-context.ts'

const here = resolve(import.meta.dirname, '../../../AMD/phase3-tool-skill/phase3-skill01-sequential-check-v1')
const fixture = JSON.parse(await readFile(resolve(here, 'parent-request-fixtures.json'), 'utf8')) as {
  settings: P09Settings; knowledge: { file: string; root: string; hash: string }
  cells: { mode: string; input: ContextInput; limits: P09Settings['limits']; view: { system: string; prompt: string }; wire: unknown }[]
}
const asset = resolve(import.meta.dirname, 'fixtures/skill01/skills.draft.json')
const bytes = await readFile(asset), entry = (JSON.parse(bytes.toString()) as SkillEntry[])[0]!
const activeBytes = await readFile(resolve(import.meta.dirname, '../phase3/skill01/skills.draft-v5.json'))
const options: Skill01Options = { entry: (JSON.parse(activeBytes.toString()) as SkillEntry[])[0]!, bundleHash: sha256(activeBytes), maxTokens: 512 }
const counter = { quality: 'estimated' as const, identity: { implementation: 'offline-fixture-bytes-div4' },
  async count(v: unknown) { return Math.ceil(Buffer.byteLength(JSON.stringify(v)) / 4) } }
const signal = new AbortController().signal
const cell = fixture.cells.find(c => c.mode === 'repair')!
const input = () => structuredClone(cell.input)
const knowledge = { bundle: await loadKnowledge(fixture.knowledge.file, fixture.knowledge.root, fixture.knowledge.hash), topK: 3, maxTokens: 768, toolVersion: '2026.1' }
const wire = (v: { system: string; prompt: string }, pending: boolean) => serializeRequest({ provider: 'deepseek-official', model: 'deepseek-flash', temperature: 0,
  maxTokens: 16384, reasoningEffort: ReasoningEffortId('high'), system: v.system, tools: autoTools('full', pending),
  messages: [createUserMessage({ content: [{ type: 'text', text: v.prompt }], source: { kind: 'user' } })] })

it('keeps all 16 disabled provider requests byte-identical to the current frozen parent, without normalization', async () => {
  for (const c of fixture.cells) {
    const v = await buildContext(c.input, c.limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge)
    const parent = await buildParentContext(c.input, c.limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge)
    expect({ system: v.system, prompt: v.prompt }).toEqual({ system: parent.system, prompt: parent.prompt })
    expect(JSON.stringify(wire(v, c.mode === 'pending'))).toBe(JSON.stringify(wire(parent, c.mode === 'pending')))
    expect(v.audit.experimental_skill_01).toBeUndefined()
  }
})
it('loads the separate draft through the original loader and leaves the old bundle unchanged', async () => {
  expect(await loadP09Skills({ ...fixture.settings, skillsFile: asset, skillsSha256: sha256(bytes) })).toEqual([entry])
  expect(sha256(await readFile(fixture.settings.skillsFile!))).toBe(fixture.settings.skillsSha256)
  expect((await loadP09Skills(fixture.settings)).map(e => e.id)).not.toContain(entry.id)
})
it('defaults off at the production configuration boundary', () => {
  const config = { campaignRoot: 'unused', preflightRoot: 'unused', datasetRoot: 'unused', settingsFile: 'unused', p09File: 'unused', autoFile: 'unused', freezeFile: 'unused', model: 'unused', maxTokens: 1, temperature: 0, timeoutMs: 1, activeMs: 1, maxResponseBytes: 1,
    compileMs: 1, elaborateMs: 1, simulationMs: 1, totalMs: 1, maxArtifactBytes: 1, artifactPollMs: 1, maxEventBytes: 1 }
  expect(Config(config).experimentalSkill01).toBe(false)
})
it('binds a real physical DUT hash without equating Agent and EDA revision ids', () => {
  const a = assessSkill01(input(), options)
  expect(a).toMatchObject({ eligible: true, selected: true, injected: false, token_count: 0, reason: 'ELIGIBLE' })
  expect(a.source_sha256).toBe(cell.input.current!.source_sha256)
  expect(cell.input.feedback!.inputs[0]!.path).not.toContain(cell.input.current!.revision_id)
})
it.each(['task-name', 'no-spec', 'combinational', 'stale-revision', 'stale-physical', 'replay', 'timeout', 'unknown', 'pending', 'incomplete'] as const)('rejects %s instead of forcing a temporal procedure', kind => {
  const c = input()
  if (kind === 'task-name') { c.task.id = 'counter_edge'; c.task.spec = 'Combinational bit inversion.' }
  if (kind === 'no-spec') c.task.spec = ''
  if (kind === 'combinational') c.task.spec = 'Combinational XOR, no clock.'
  if (kind === 'stale-revision') c.binding!.revision_id = 'other'
  if (kind === 'stale-physical') c.feedback!.inputs.find(x => x.path.endsWith('/rtl/solution.sv'))!.sha256 = '0'.repeat(64)
  if (kind === 'replay') c.feedback!.evidence_kind = 'diagnostic_replay'
  if (kind === 'timeout') c.feedback!.stages[2]!.process_normal = false
  if (kind === 'unknown') { c.feedback!.stages[2]!.functional_failure = false; c.feedback!.stages[2]!.diagnostics[0]!.kind = 'unknown' }
  if (kind === 'pending') c.pending_verification = true
  if (kind === 'incomplete') c.feedback!.stages[2]!.complete = false
  expect(assessSkill01(c, options).eligible).toBe(false)
})
it('does not condition applicability on a benchmark id or arbitrary always in RTL', () => {
  const c = input(), before = assessSkill01(c, options); c.task.id = 'unseen-random-id'
  expect(assessSkill01(c, options)).toEqual(before)
  c.task.spec = 'No clock or state update specified.'
  expect(assessSkill01(c, options).eligible).toBe(false)
})
it('adds only bounded procedure data, preserves old selector output, System Prompt and tool permissions', async () => {
  const c = input(), loader = vi.fn(() => loadP09Skills(fixture.settings))
  const off = await buildContext(c, cell.limits, counter, signal, loader, knowledge)
  const on = await buildContext(c, cell.limits, counter, signal, loader, knowledge, options)
  const p = JSON.parse(on.prompt)
  expect(on.audit.experimental_skill_01).toMatchObject({ eligible: true, selected: true, injected: true })
  expect(p.experimental_skill_01).toMatchObject({ version: '0.5.0', procedure: options.entry.rule, content_hash: options.entry.content_hash })
  expect(skill01Section({ entry, bundleHash: sha256(bytes), maxTokens: 512 }, { ...on.audit.experimental_skill_01!, version: entry.version, content_hash: entry.content_hash })).toMatchSnapshot()
  delete p.experimental_skill_01
  expect(p).toEqual(JSON.parse(off.prompt)); expect(on.system).toBe(off.system)
  expect(on.audit.selected_skills).toEqual(off.audit.selected_skills)
  expect(on.audit.tokens).toBeLessThanOrEqual(on.audit.budget)
  expect(on.audit.experimental_skill_01!.token_count).toBeGreaterThan(0)
})
it.each(['soft', 'combined', 'window', 'recovery'] as const)('drops the whole procedure for %s pressure and records the reason', async kind => {
  const c = input(), limits = { ...cell.limits }, opt = { ...options }
  if (kind === 'soft') opt.maxTokens = 1
  if (kind === 'combined') limits.skills = 100
  if (kind === 'recovery') c.core_only = true
  if (kind === 'window') {
    const off = await buildContext(c, limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge)
    limits.window = off.audit.tokens + limits.output + limits.margin + 25
  }
  const v = await buildContext(c, limits, counter, signal, () => loadP09Skills(fixture.settings), knowledge, opt)
  expect(v.audit.experimental_skill_01).toMatchObject({ eligible: true, selected: true, injected: false, token_count: 0,
    reason: kind === 'recovery' ? 'NOT_INJECTED_CONTEXT_RECOVERY' : 'NOT_INJECTED_BUDGET' })
  expect(JSON.parse(v.prompt).experimental_skill_01).toBeUndefined()
})
it('refuses stale context before any token counting', async () => {
  const c = input(); c.binding!.source_sha256 = 'a'.repeat(64)
  const count = vi.fn(counter.count)
  await expect(buildContext(c, cell.limits, { ...counter, count }, signal, undefined, knowledge, options)).rejects.toThrow('CONTEXT_BINDING_ERROR')
  expect(count).not.toHaveBeenCalled()
})
it('requires quoted structured evidence; an assertion of checking is not observed completion', () => {
  const c = input(), summary = { rules: { initial: 'UNSPECIFIED', reset: 'UNSPECIFIED', edge: 'SPECIFIED', enable: 'UNSPECIFIED', state: 'SPECIFIED', output: 'SPECIFIED' },
    spec_quote: 'positive edge of the clock', rtl_quote: 'assign anyedge = in ^ prev;', hypothesis: 'Candidate update mismatch', action: 'Change the output update event', limitations: 'No causal proof or exact error cycle' }
  const source = '// SKILL01_SUMMARY: ' + JSON.stringify(summary) + '\n' + c.current!.source
  expect(observedSkill01Summary(source, c).observed).toBe(true)
  checkAutoSource(source, c.task.interface)
  expect(observedSkill01Summary('// I checked everything\n' + c.current!.source, c).observed).toBe(false)
  expect(observedSkill01Summary(source.replace('positive edge of the clock', 'secret oracle rule'), c).observed).toBe(false)
  expect(observedSkill01Summary(source.replace('UNSPECIFIED', 'I checked'), c).observed).toBe(false)
  expect(() => parseAutoAction('edit_dut', JSON.stringify({ expected_revision_id: 'revision', source, summary }))).toThrow('INVALID_ACTION')
  expect(autoTools('full', true).map(t => t.name)).toEqual(['verify_rtl'])
})
