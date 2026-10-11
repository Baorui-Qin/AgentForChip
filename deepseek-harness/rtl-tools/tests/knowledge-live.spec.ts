import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { afterEach, expect, it } from 'vitest'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import { VerificationRunner } from '../src/phase1/verification.ts'
import { loadCompatAssets } from '../src/phase1/p10-compat.ts'
import type { P10Task } from '../src/phase1/p10-dataset.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'
import { sha256 } from '../src/phase1/snapshots.ts'

let runner: VerificationRunner | undefined
let context: Context | undefined
let output: string | undefined
let passed = false
afterEach(async () => {
  try { await runner?.close() }
  finally { await context?.fiber.dispose() }
  if (output && passed) await rm(output, { recursive: true, force: true })
  else if (output) console.error('Knowledge calibration failure artifacts: ' + output)
  runner = undefined; context = undefined; output = undefined; passed = false
})

it.skipIf(process.env.P2_LIVE !== '1')('calibrates all new R1 evaluators against unchanged reference and explicit negative controls', async () => {
  const repository = fileURLToPath(new URL('../../../', import.meta.url))
  const historical = join(repository, 'AMD/phase2-tool-skill/p2-knowledge-v1')
  const baseline = join(repository, 'AMD/phase2-tool-skill/runtime/B0-local-10/preflight')
  const manifestBytes = await readFile(join(historical, 'repair-subset-manifest.json'))
  expect(sha256(manifestBytes)).toBe((await readFile(join(historical, 'repair-subset-manifest.json.sha256'), 'utf8')).trim())
  const manifest = JSON.parse(manifestBytes.toString()) as { cases: { task_id: string }[] }
  const catalog = JSON.parse(await readFile(join(baseline, 'catalog.json'), 'utf8')) as P10Task[]
  const existing = JSON.parse(await readFile(join(baseline, 'compat-positive-negative-results.json'), 'utf8')) as { task_id: string; evaluable: boolean }[]
  const tasks = [...new Set(manifest.cases.map(c => c.task_id))].sort().filter(id => !existing.some(c => c.task_id === id && c.evaluable))
  const settings = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  output = await mkdtemp(join(tmpdir(), 'knowledge-calibration-'))
  context = new Context(); await context.plugin(LocalSubprocess)
  runner = new VerificationRunner(context.subprocess, { ...settings.config, outputRoot: output }, { compileMs: 60000, elaborateMs: 60000, simulationMs: 30000,
    totalMs: 300000, maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 })
  const rows = []
  for (const id of tasks) {
    const task = catalog.find(t => t.task_id === id)!
    const inputs = await loadCompatAssets(join(repository, 'AMD/phase2-vivado2026.1/verilog-eval'), task, join(baseline, 'derived'))
    const run = async (kind: string, assets: typeof inputs.assets) => {
      const snapshot = await runner!.registerDataset(assets, inputs.evaluation, { experiment_id: 'new-agent-knowledge-calibration' as PhaseId, task_id: id as PhaseId, sample_id: rows.length, mode: 'baseline' })
      const result = await runner!.preflightDataset(snapshot, new AbortController().signal, argv => argv)
      console.log(JSON.stringify({ task: id, kind, status: result.status, artifacts: result.artifacts }))
      return result
    }
    const positive = await run('unchanged-reference', inputs.assets)
    const ports = task.interface!.ports
    const source = `module TopModule(${ports.map(p => `${p.direction} wire [${p.width - 1}:0] ${p.name}`).join(', ')});\n` + ports.filter(p => p.direction === 'output').map(p => `assign ${p.name} = '0;\n`).join('') + 'endmodule\n'
    const negative = await run('CALIBRATION_NEGATIVE_CONTROL_NOT_REPAIR_SCORE', { ...inputs.assets, 'rtl/solution.sv': source })
    rows.push({ task_id: id, evaluable: positive.status === 'EVALUATOR_READY' && negative.stages.find(s => s.stage === 'simulation')?.status === 'FAIL', positive, negative, evidence_origin: 'CURRENT_AGENT_VIVADO_2026_1_CALIBRATION' })
    await writeFile(join(output, 'results.json'), JSON.stringify(rows, null, 2) + '\n')
  }
  await writeFile(join(output, 'calibration-index.json'), JSON.stringify({ manifest_sha256: sha256(manifestBytes), results_sha256: sha256(await readFile(join(output, 'results.json'))) }, null, 2) + '\n', { flag: 'wx' })
  expect(rows.length).toBe(tasks.length)
  expect(rows.every(r => r.evaluable), JSON.stringify(rows.map(r => ({ task: r.task_id, evaluable: r.evaluable })))).toBe(true)
  passed = true
}, 1200000)
