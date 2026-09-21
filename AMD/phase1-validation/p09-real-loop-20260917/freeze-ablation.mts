import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { taskIds, taskSpec } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-tasks.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
import { autoTools } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-auto-policy.ts'
const root = 'D:/AMD/phase1-validation/p09-real-loop-20260917'
const repo = 'D:/deepseek-harness'
const skills = JSON.parse(await readFile(join(root, 'skills/skills.validated.json'), 'utf8'))
if (skills.length !== 3 || skills.some(s => s.status !== 'validated')) throw new Error('Incomplete skills')
const files: Record<string, string> = {}
async function collect(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await collect(path)
    else if (entry.isFile()) files[path] = sha256(await readFile(path))
  }
}
await collect(join(repo, 'rtl-tools/src'))
await collect(join(repo, 'packages/llm/llm-deepseek/src'))
await collect(join(repo, 'packages/llm/llm/src'))
await collect(join(repo, 'packages/subprocess/subprocess/src'))
await collect(join(repo, 'packages/subprocess/subprocess-local/src'))
await collect(join(root, 'configs'))
await collect(join(root, 'skills'))
for (const path of [join(root, 'settings.yaml'), join(repo, 'pnpm-lock.yaml'), join(repo, 'rtl-tools/tsconfig.json'), join(repo, 'tsconfig.base.json'),
  ...['cordis.yml','cordis.patch.yml','package.json'].map(name => 'D:/AMD/phase1-validation/p09-20260917-development/dsh-home/profiles/rtl-p09/' + name)]) files[path] = sha256(await readFile(path))
const schedule = taskIds.flatMap((task, index) => ['ABC', 'BCA', 'CAB'][index % 3]!.split('').map(variant => ({ task, variant, sample: 'main-1' })))
const tasks = taskIds.map(id => { const task = taskSpec(id); return { id, task_sha256: task.hash, bad_source_sha256: sha256(task.bad), good_calibration_sha256: sha256(task.good), public_task: task.public, trusted_assets: Object.fromEntries(Object.entries(task.assets).filter(([p]) => p.startsWith('trusted/')).map(([p, source]) => [p, sha256(source)])) } })
const value = { schema_version: '1.7', created_at: new Date().toISOString(), schedule, tasks, files, tools: autoTools('full'),
  model: { provider: 'deepseek-official', model: 'deepseek-flash', temperature: 0, maxTokens: 2048, reasoningEffort: 'high' },
  runtime_manifest_sha256: sha256(await readFile('D:/AMD/p09-runtime/manifest.json')),
  window: 16384, output_reserve: 2048, safety_margin: 1024, max_main_dispatches: 225, max_preflight_dispatches: 150, max_total_dispatches: 375,
  independent_states: true, formal_results_reused_from_preflight: false, natural_generation_scores: false, full_os_isolation_verified: false }
await writeFile(join(root, 'ablation-freeze.json'), JSON.stringify(value, null, 2), { flag: 'wx' })
console.log('Frozen full protocol, source, model identity, assets, skills and 15-cell rotating schedule.')
