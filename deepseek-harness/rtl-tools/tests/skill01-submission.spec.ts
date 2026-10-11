import { mkdir, mkdtemp, readFile, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { afterAll, expect, it } from 'vitest'
import { BlockAssembler, ToolCallId } from '@deepseek-ai/dsh-llm'
import { autoTools, checkAutoSource, parseAutoAction } from '../src/phase1/p09-auto-policy.ts'
import { extractSource, publish } from '../src/phase1/candidates.ts'
import { assessSkill01, observedSkill01Summary, skill01Section, type Skill01Options } from '../src/phase1/skill01.ts'
import { buildContext, ledgerEntry, type ContextInput, type TextView, type TokenCounter } from '../src/phase1/p09-context.ts'
import { loadP09Skills, type P09Settings } from '../src/phase1/p09-proposal.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { loadKnowledge } from '../src/knowledge/knowledge-loader.ts'
import { buildContext as buildParentContext } from './fixtures/skill01/current-parent-context.ts'

const base = resolve(import.meta.dirname, '../../../AMD/phase3-tool-skill')
const fixture = JSON.parse(await readFile(resolve(base, 'phase3-skill01-sequential-check-v1/parent-request-fixtures.json'), 'utf8')) as {
  settings: P09Settings; knowledge: { file: string; root: string; hash: string }; cells: { mode: string; input: ContextInput; limits: P09Settings['limits'] }[]
}
const knowledge = { bundle: await loadKnowledge(fixture.knowledge.file, fixture.knowledge.root, fixture.knowledge.hash), topK: 3, maxTokens: 768, toolVersion: '2026.1' }
const file = resolve(import.meta.dirname, '../phase3/skill01/skills.draft-v5.json'), bytes = await readFile(file)
const entries = await loadP09Skills({ ...fixture.settings, skillsFile: file, skillsSha256: sha256(bytes) })
const options: Skill01Options = { entry: entries[0]!, bundleHash: sha256(bytes), maxTokens: 512 }
const root = await mkdtemp(resolve(tmpdir(), 'skill01-submission-')), ownedRoot = await realpath(root)
afterAll(async () => {
  if (await realpath(root) !== ownedRoot || !ownedRoot.startsWith(resolve(tmpdir()) + '\\') && !ownedRoot.startsWith(resolve(tmpdir()) + '/')) throw new Error('PIPELINE_CLEANUP_ROOT_CHANGED')
  await rm(ownedRoot, { recursive: true, force: true })
})
let sequence = 0
const before = 'module TopModule(input clk, en, output reg q);\r\nalways_ff @(posedge clk)\r\n\tif (en) q <= ~q;\r\nendmodule\r\n'
const after = before.replace('q <= ~q;', 'q <= en;')
const input = (): ContextInput => ({ task: { id: 'synthetic_submission_only', spec: 'Update q on the positive edge of the clock when en is high.', constraints: 'Synthetic offline fixture',
  interface: { top: 'TopModule', ports: [{ name: 'clk', direction: 'input', width: 1 }, { name: 'en', direction: 'input', width: 1 }, { name: 'q', direction: 'output', width: 1 }] } },
  sample_id: 'synthetic-only', variant_id: 'B', current: { revision_id: 'before', source_sha256: sha256(before), source: before }, binding: { revision_id: 'before', source_sha256: sha256(before), verification_key: 'sha256:' + 'a'.repeat(64) },
  feedback: null, ledger: [], purpose: 'repair', tool_mode: true })
const summary = () => ({ rules: { initial: 'UNSPECIFIED', reset: 'NOT_OBSERVED', edge: 'SPECIFIED', enable: 'SPECIFIED', state: 'SPECIFIED', output: 'SPECIFIED' } as Record<string, unknown>,
  spec_quote: 'positive edge of the clock', rtl_quote: 'always_ff @(posedge clk)\r\n\tif (en) q <= ~q;', hypothesis: 'Check the current update condition', action: 'Make one candidate update', limitations: 'Synthetic format evidence only' })
const line = (value = summary()) => '// SKILL01_SUMMARY: ' + JSON.stringify(value) + '\r\n'
// These are the unchanged stages used by the tool path; no Agent-loop, EDA or Provider replacement is installed.
async function pipeline(source: string, context = input(), publicText = '') {
  const argumentsText = JSON.stringify({ expected_revision_id: context.current!.revision_id, source })
  const assembler = new BlockAssembler(), split = Math.floor(argumentsText.length / 2)
  assembler.push({ type: 'tool-call-delta', index: 0, id: ToolCallId('offline-' + sequence), name: 'edit_dut', argumentsDelta: argumentsText.slice(0, split) })
  assembler.push({ type: 'tool-call-delta', index: 0, id: ToolCallId('offline-' + sequence), argumentsDelta: argumentsText.slice(split) })
  if (publicText) assembler.push({ type: 'text-delta', index: 1, text: publicText })
  assembler.push({ type: 'finish', reason: { kind: 'tool-calls' } })
  const message = assembler.message({ kind: 'model', provider: 'offline-test', model: 'synthetic' })
  const calls = message.content.filter(b => b.type === 'tool-call')
  expect(calls).toHaveLength(1)
  const action = parseAutoAction(calls[0]!.name, calls[0]!.arguments)
  if (action.name !== 'edit_dut') throw new Error('UNEXPECTED_TEST_ACTION')
  checkAutoSource(action.source, context.task.interface)
  const directory = resolve(ownedRoot, String(++sequence)); await mkdir(directory)
  await publish(directory, 'solution.sv', action.source)
  const accepted = await readFile(resolve(directory, 'solution.sv'), 'utf8')
  expect(accepted).toBe(source); expect(sha256(accepted)).toBe(sha256(action.source))
  return { directory, action, argumentsText, accepted, audit: observedSkill01Summary(accepted, context) }
}

it.each(['before', 'inside', 'after'] as const)('preserves a complete submitted summary at the allowed %s module position', async position => {
  const source = position === 'before' ? line() + after : position === 'after' ? after + line() : after.replace('always_ff', line() + 'always_ff')
  const result = await pipeline(source)
  expect(result.audit.observed).toBe(true)
  expect(result.argumentsText).toContain('\\r\\n')
  expect(result.accepted).toContain('\\r\\n\\t')
})
it('does not move a summary from public free text into the submitted DUT', async () => {
  const result = await pipeline(after, input(), line())
  expect(result.audit.reason).toBe('NO_SUMMARY'); expect(result.accepted).not.toContain('SKILL01_SUMMARY')
})
it('keeps the existing acceptance behavior for a valid source with no summary', async () => {
  expect((await pipeline(after)).audit.reason).toBe('NO_SUMMARY')
})
it.each(['raw', 'fence', 'markers'] as const)('preserves a legal comment through the separate existing %s text-source extractor', async mode => {
  const source = line() + after, encoded = mode === 'raw' ? source : mode === 'fence' ? '```systemverilog\n' + source + '```' : '[BEGIN]' + source + '[DONE]'
  const extracted = extractSource(encoded, false, 65536, input().task.interface)
  expect(extracted.source).toBe(source)
  expect((await pipeline(extracted.source)).audit.observed).toBe(true)
})
it('retains INVALID_SUMMARY_JSON for a malformed marker line', async () => {
  expect((await pipeline('// SKILL01_SUMMARY: {"rules":}\r\n' + after)).audit.reason).toBe('INVALID_SUMMARY_JSON')
})
it('retains the original rejection for an explanatory enum suffix', async () => {
  const value = summary(); value.rules.edge = 'SPECIFIED: rising clock'
  expect((await pipeline(line(value) + after)).audit.reason).toBe('INCOMPLETE_RULE_SUMMARY')
})
it('rejects a spec quotation absent from the current public specification', async () => {
  const value = summary(); value.spec_quote = 'a private or older specification'
  expect((await pipeline(line(value) + after)).audit.reason).toBe('UNSUPPORTED_SUMMARY_EVIDENCE')
})
it('rejects a reformatted quotation rather than normalizing source whitespace', async () => {
  const value = summary(); value.rtl_quote = value.rtl_quote.replace('\r\n\t', '\n ')
  expect((await pipeline(line(value) + after)).audit.reason).toBe('UNSUPPORTED_SUMMARY_EVIDENCE')
})
it('rejects a quotation that occurs only in the proposed post-edit source', async () => {
  const value = summary(); value.rtl_quote = 'q <= en;'
  expect((await pipeline(line(value) + after)).audit.reason).toBe('UNSUPPORTED_SUMMARY_EVIDENCE')
})
it('does not treat an old retained comment as a current exact quotation', async () => {
  const context = input(); context.current!.source = before.replace('~q', '~en'); context.current!.source_sha256 = sha256(context.current!.source)
  expect((await pipeline(line() + after, context)).audit.reason).toBe('UNSUPPORTED_SUMMARY_EVIDENCE')
})
it.each(['revision', 'source'] as const)('retains the original applicability rejection for a stale %s binding', kind => {
  const context = structuredClone(fixture.cells.find(c => c.mode === 'repair')!.input)
  if (kind === 'revision') context.binding!.revision_id = 'different-revision'
  else context.binding!.source_sha256 = '0'.repeat(64)
  expect(assessSkill01(context, options).reason).toBe('STALE_BINDING')
})
it('records the original singleton-array coercion without using it as an asset instruction', async () => {
  const value = summary(); value.rules.edge = ['SPECIFIED']
  expect((await pipeline(line(value) + after)).audit.observed).toBe(true)
  expect(options.entry.rule).toContain('exact scalar')
})
it('rejects an extra model-selected path parameter before publication', () => {
  expect(() => parseAutoAction('edit_dut', JSON.stringify({ expected_revision_id: 'before', source: line() + after, path: '../trusted/tb.sv' }))).toThrow('INVALID_ACTION')
})
it('keeps executable source safety checks while permitting inert summary comments', () => {
  expect(() => checkAutoSource(after.replace('q <= en;', '$fopen("x");'), input().task.interface)).toThrow('RTL_POLICY_REJECTED')
})
it('refuses an overwrite without changing the first published DUT', async () => {
  const result = await pipeline(line() + after)
  await expect(publish(result.directory, 'solution.sv', before)).rejects.toMatchObject({ code: 'EEXIST' })
  expect(await readFile(resolve(result.directory, 'solution.sv'), 'utf8')).toBe(result.accepted)
})
const counter = { quality: 'estimated' as const, identity: { implementation: 'offline-public-fixture-bytes-div4' }, async count(value: unknown) { return Math.ceil(Buffer.byteLength(JSON.stringify(value)) / 4) } }
it('keeps Skill-off requests identical to the current frozen parent request views', async () => {
  const original = JSON.parse(await readFile(resolve(base, 'phase3-skill01-sequential-check-v1/parent-request-fixtures.json'), 'utf8'))
  for (const cell of original.cells) {
    const view = await buildContext(cell.input, cell.limits, counter, new AbortController().signal, () => loadP09Skills(fixture.settings), knowledge)
    const parent = await buildParentContext(cell.input, cell.limits, counter, new AbortController().signal, () => loadP09Skills(fixture.settings), knowledge)
    expect({ system: view.system, prompt: view.prompt }).toEqual({ system: parent.system, prompt: parent.prompt })
    expect(view.audit.experimental_skill_01).toBeUndefined()
  }
})
it('removes the whole procedure on context recovery instead of counting an uninjected edit', async () => {
  const cell = fixture.cells.find(c => c.mode === 'repair')!, context = { ...structuredClone(cell.input), core_only: true }
  const view = await buildContext(context, cell.limits, counter, new AbortController().signal, () => loadP09Skills(fixture.settings), undefined, options)
  expect(view.audit.experimental_skill_01?.injected).toBe(false)
  expect(view.audit.experimental_skill_01?.reason).toBe('NOT_INJECTED_CONTEXT_RECOVERY')
  expect(JSON.parse(view.prompt).experimental_skill_01).toBeUndefined()
})
it.each(['ledger', 'knowledge'] as const)('checks the final whole-envelope procedure cap after %s soft pruning changes rounding', async kind => {
  const cell = fixture.cells.find(c => c.mode === 'repair')!, context = structuredClone(cell.input), limits = { ...cell.limits }
  if (kind === 'ledger') context.ledger.push({ ...ledgerEntry(context), revision_id: 'synthetic-prior-observation' })
  const selectedKnowledge = kind === 'knowledge' ? knowledge : undefined
  const beforeView = await buildParentContext(context, limits, counter, new AbortController().signal, async () => [], selectedKnowledge)
  const prunedKnowledge = selectedKnowledge ? { ...selectedKnowledge, maxTokens: 1 } : undefined
  if (kind === 'ledger') limits.ledger = 1
  const afterView = await buildParentContext(context, limits, counter, new AbortController().signal, async () => [], prunedKnowledge)
  const section = skill01Section(options, assessSkill01(context, options))
  const withProcedure = (view: TextView): TextView => ({ system: view.system, prompt: JSON.stringify({ ...JSON.parse(view.prompt), experimental_skill_01: section }) })
  const bytes = (view: TextView) => Buffer.byteLength(JSON.stringify({ system: view.system, prompt: view.prompt }))
  const beforeText = { system: beforeView.system, prompt: beforeView.prompt }, afterText = { system: afterView.system, prompt: afterView.prompt }
  const delta = bytes(withProcedure(beforeText)) - bytes(beforeText), divisor = delta / 512.5
  // The same fixed ceil counter sees a different fractional phase when the retained envelope shrinks.
  let offset: number | undefined
  const count = (view: TextView, phase: number) => Math.ceil((bytes(view) + phase) / divisor)
  for (let step = 0; step < 4096; step++) {
    const phase = divisor * step / 4096
    if (count(withProcedure(beforeText), phase) - count(beforeText, phase) === 512 &&
      count(withProcedure(afterText), phase) - count(afterText, phase) === 513) { offset = phase; break }
  }
  expect(offset).toBeDefined()
  const roundingCounter: TokenCounter = { quality: 'estimated', identity: { implementation: 'synthetic-whole-envelope-ceil', divisor: String(divisor), offset: String(offset) },
    async count(view) { return count(view, offset!) } }
  const before = JSON.parse(beforeText.prompt), after = JSON.parse(afterText.prompt)
  if (kind === 'ledger') { expect(before.history).toHaveLength(1); expect(after.history).toEqual([]) }
  else { expect(before.diagnostic_knowledge.matches.length).toBeGreaterThan(0); expect(after.diagnostic_knowledge).toBeUndefined() }
  expect(count(withProcedure(beforeText), offset!) - count(beforeText, offset!)).toBe(512)
  expect(count(withProcedure(afterText), offset!) - count(afterText, offset!)).toBe(513)
  const view = await buildContext(context, limits, roundingCounter, new AbortController().signal, async () => [], prunedKnowledge, options)
  expect(view.audit.experimental_skill_01).toMatchObject({ eligible: true, selected: true, injected: false, token_count: 0, reason: 'NOT_INJECTED_BUDGET' })
  expect(JSON.parse(view.prompt).experimental_skill_01).toBeUndefined()
  expect(view.audit.omissions).toContain(kind === 'ledger' ? 'ledger:soft_budget' : 'knowledge:' + before.diagnostic_knowledge.matches[0].knowledge_id)
})
it('replays all four bound historical public tool sources without rewriting their rejection', async () => {
  const chain = JSON.parse(await readFile(resolve(base, 'p3-summary-contract-01-v1/summary-submission-chain.json'), 'utf8')) as {
    records: { request_id: string; submitted_source_sha256: string; evidence: { path: string; sha256: string }[] }[]
  }
  expect(chain.records).toHaveLength(4)
  for (const record of chain.records) {
    const exported = record.evidence.find(e => e.path.includes('public-chain-evidence'))!, current = record.evidence.find(e => e.path.endsWith('context.json'))!
    const publicBytes = await readFile(exported.path), inputBytes = await readFile(current.path)
    expect(sha256(publicBytes)).toBe(exported.sha256); expect(sha256(inputBytes)).toBe(current.sha256)
    const publicCall = JSON.parse(publicBytes.toString()) as { decoded_source: string }
    const result = await pipeline(publicCall.decoded_source, JSON.parse(inputBytes.toString()) as ContextInput)
    expect(sha256(result.accepted)).toBe(record.submitted_source_sha256); expect(result.audit.reason).toBe('NO_SUMMARY')
  }
})
it('records the complete submission wording and unchanged tools in a keyless snapshot', () => {
  expect({ id: options.entry.id, version: options.entry.version, status: options.entry.status, procedure: options.entry.rule, limitations: options.entry.limitations,
    tools: autoTools('full') }).toMatchSnapshot()
})
