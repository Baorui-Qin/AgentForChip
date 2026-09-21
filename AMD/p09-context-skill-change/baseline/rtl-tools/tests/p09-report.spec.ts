import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { afterEach, expect, it } from 'vitest'
import { freezeP09, reportP09 } from '../src/phase1/p09-report.ts'
import { readP09Settings, newP09State } from '../src/phase1/p09-proposal.ts'

const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
async function root() { const value = await mkdtemp(join(tmpdir(), 'p09-report-')); roots.push(value); return value }
async function state(directory: string, calibration: boolean, outcome = 'CALIBRATION_FAILED') {
  const id = randomUUID(), child = join(directory, 'repair-' + id)
  await mkdir(child)
  const value = { schema_version: '1.6', experiment_id: id, fixture: 'enable_counter', seq: 0, phase: 'TERMINAL', outcome,
    current: null, model_runs: [], verification_run: null, attempts: 0, active_ms: 1, review_wait_ms: 0,
    p09: { ...newP09State('A'), calibration_only: calibration } }
  await writeFile(join(child, 'state.json'), JSON.stringify(value))
  await writeFile(join(child, 'event-00000.json'), JSON.stringify({ state: value }))
  return child
}
it('freezes all 15 cells in rotated order without overwriting the first manifest', async () => {
  const directory = await root(), path = await freezeP09(directory)
  const before = await readFile(path)
  const value = JSON.parse(before.toString())
  expect(value.schedule).toHaveLength(15)
  expect(value.schedule.map((s: { variant: string }) => s.variant).join('')).toBe('ABCBCACABABCBCA')
  await expect(freezeP09(directory)).rejects.toThrow()
  expect(await readFile(path)).toEqual(before)
})
it('retains every unstarted cell with null measurements, not fabricated zero tokens', async () => {
  const directory = await root(); await freezeP09(directory)
  const report = JSON.parse(await readFile(join(await reportP09(directory), 'p09-ablation.json'), 'utf8'))
  expect(report.rows).toHaveLength(15)
  expect(report.rows.every((r: { status: string; input_tokens: unknown }) => r.status === 'NOT_RUN' && r.input_tokens === null)).toBe(true)
})
it('distinguishes independent calibration from a natural experiment blocked before generation', async () => {
  const directory = await root()
  await state(directory, true); await state(directory, false)
  const report = JSON.parse(await readFile(join(await reportP09(directory), 'p09-ablation.json'), 'utf8'))
  expect(report.rows[0]).toMatchObject({ status: 'CALIBRATION_FAILED', provider_attempts: 0, budget_reserved_attempts: 0 })
})
it('refuses duplicate cells instead of selecting a favorable result', async () => {
  const directory = await root(); await state(directory, false); await state(directory, false)
  await expect(reportP09(directory)).rejects.toThrow('Duplicate')
})
it('refuses state history divergence', async () => {
  const directory = await root(), child = await state(directory, false)
  await writeFile(join(child, 'event-00000.json'), JSON.stringify({ state: {} }))
  await expect(reportP09(directory)).rejects.toThrow('State/event')
})
it('requires exact limit keys and supports Windows forward-slash config paths', async () => {
  const directory = await root(), path = join(directory, 'config.json')
  const config = { variant: 'A', maxRequests: 15, skillsFile: null, skillsSha256: null,
    tokenizer: { python: 'python', root: directory, manifestSha256: 'a'.repeat(64), timeoutMs: 1000 },
    limits: { window: 16384, output: 2048, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 } }
  await writeFile(path, JSON.stringify(config))
  expect(await readP09Settings(path.replace(/\\/g, '/'))).toEqual(config)
  await writeFile(path, JSON.stringify({ ...config, limits: { ...config.limits, window: undefined, unknown: 16384 } }))
  await expect(readP09Settings(path)).rejects.toThrow('Invalid')
})
