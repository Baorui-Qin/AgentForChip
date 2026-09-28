import { createHash, randomUUID } from 'node:crypto'
import { readFile, writeFile, mkdir, readdir, appendFile, open, unlink } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as sleep } from 'node:timers/promises'

const hash = value => createHash('sha256').update(value).digest('hex')
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const optional = async path => { try { return await json(path) } catch (error) { if (error.code === 'ENOENT') return null; throw error } }

/** Stop selection on the first exhausted transport window; recovery stays on that task. */
export async function acquireCandidates(tasks, io, maxResumes, continueAfterModelFailure = false) {
  let failed = false
  for (const task of tasks) {
    let result = await io.read(task)
    if (!result) result = await io.invoke('generate', task)
    if (result.status === 'INFRA_PAUSED' && result.generation_resumes < maxResumes) {
      await io.pause(task)
      if (!(await io.probe(task))) return 'INFRA_PAUSED'
      result = await io.invoke('resume-generate', task)
    }
    if (result.status === 'INFRA_PAUSED') return 'INFRA_PAUSED'
    if (result.status !== 'GENERATED_UNVERIFIED') {
      if (!continueAfterModelFailure) return 'GENERATION_FAILED'
      failed = true
    }
  }
  return failed ? 'GENERATION_PARTIAL' : 'GENERATION_READY'
}

/** Bound independent EDA jobs and await active children even after one fails. */
export async function compareCandidates(tasks, workers, invoke) {
  if (!Number.isInteger(workers) || workers < 1 || workers > 4) throw new Error('INVALID_COMPARISON_WORKERS')
  let next = 0, failure
  const results = await Promise.allSettled(Array.from({ length: workers }, async () => {
    while (next < tasks.length && !failure) {
      const task = tasks[next++]
      try { await invoke(task) } catch (error) { failure = error; throw error }
    }
  }))
  const rejected = results.find(result => result.status === 'rejected')
  if (rejected) throw rejected.reason
}

/** Report acquisition separately from measured model performance; empty repair rates are null. */
export function summarize(rows) {
  const valid = rows.filter(row => row.candidate_valid)
  const completed = valid.filter(row => row.comparison_complete)
  const opportunities = completed.filter(row => row.repair_eligible)
  const rate = (n, d) => d ? n / d : null
  return { selected: rows.length, complete_model_responses: rows.filter(row => row.response_complete).length, valid_candidates: valid.length,
    calibration_blocked: rows.filter(row => row.generation_status === 'EVALUATOR_BLOCKED').length,
    infrastructure_pending: rows.filter(row => row.generation_status === 'INFRA_PAUSED').length,
    unstarted: rows.filter(row => row.generation_status === 'NOT_RUN').length,
    acquisition_completion: rate(valid.length, rows.length), e2e_completion: rate(completed.length, rows.length),
    model_evaluable: valid.length, evaluated: completed.length,
    baseline_pass: completed.filter(row => row.baseline_status === 'PASS').length,
    agent_pass: completed.filter(row => row.agent_status === 'VERIFIED').length,
    baseline_pass_rate: rate(completed.filter(row => row.baseline_status === 'PASS').length, completed.length),
    agent_pass_rate: rate(completed.filter(row => row.agent_status === 'VERIFIED').length, completed.length),
    natural_repair_opportunities: opportunities.length,
    natural_repair_success_rate: rate(opportunities.filter(row => row.recovered_by_agent).length, opportunities.length) }
}

async function main(root, repo, stage) {
  if (stage !== 'compare' || process.env.XILINX_LOCAL_USER_DATA !== 'no') throw new Error('FROZEN_CONTINUATION_ENVIRONMENT_REQUIRED')
  if (!root || !repo || !['all', 'generation', 'compare', 'report', 'smoke'].includes(stage)) throw new Error('Usage: generation-stability.mjs <campaign-root> <repo> all|generation|compare|report|smoke')
  const settings = await json(join(root, 'stability.json'))
  const freeze = await json(join(root, 'campaign-freeze.json'))
  async function assertFreeze() {
    for (const [path, digest] of Object.entries(freeze.files)) if (hash(await readFile(path)) !== digest) throw new Error('CAMPAIGN_SOURCE_CHANGED:' + path)
  }
  await assertFreeze()
  const manifestFile = settings.manifestFile ?? 'p10-manifest-10.json'
  const manifestHash = settings.manifestSha256 ?? '02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742'
  const tasks = (await json(join(root, manifestFile))).task_ids
  if (hash(await readFile(join(root, manifestFile))) !== manifestHash || tasks.length !== settings.selected || new Set(tasks).size !== tasks.length) throw new Error('FIXED_MANIFEST_CHANGED')
  const excluded = new Map((settings.calibrationExcluded ?? []).map(item => [item.task_id, item]))
  const runnable = tasks.filter(task => !excluded.has(task))
  const lock = await open(join(root, 'stability.lock'), 'wx')
  const read = task => optional(join(root, `generate-${task}`, 'result.json'))
  await mkdir(join(root, 'runner-logs'), { recursive: true })
  async function invoke(command, task) {
    await assertFreeze()
    const id = `${command}-${task}-${randomUUID()}`
    const log = await open(join(root, 'runner-logs', id + '.log'), 'wx')
    try {
      const child = spawn(process.execPath, ['--import', 'tsx/esm', 'apps/cli/src/bin.ts', '--profile', 'rtl-p10-model', '--patch', join(root, 'model.patch.yml'), command, task],
        { cwd: repo, env: { ...process.env, DSH_HOME: join(root, 'dsh-home'), NODE_OPTIONS: '--max-old-space-size=4096' }, windowsHide: true, stdio: ['ignore', log.fd, log.fd] })
      const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve) })
      if (code !== 0) throw new Error('DSH_HOST_FAILED:' + id)
    } finally { await log.close() }
    const target = command === 'resume-generate' ? 'generate' : command
    if (target === 'probe') return null
    const result = await json(join(root, `${target}-${task}`, 'result.json'))
    process.stdout.write(`${command} ${task}: ${result.status}\n`)
    return result
  }
  let state = 'REPORT_ONLY'
  try {
    if (stage === 'generation' || stage === 'all') state = await acquireCandidates(runnable, { read, invoke,
      pause: async task => {
        await appendFile(join(root, 'campaign-trace.jsonl'), JSON.stringify({ event: 'CIRCUIT_OPEN', task, cooldown_ms: settings.cooldownMs }) + '\n')
        await sleep(settings.cooldownMs)
      }, probe: async task => {
        const before = new Set(await readdir(root))
        await invoke('probe', task)
        const names = (await readdir(root)).filter(name => name.startsWith(`probe-${task}-`) && !before.has(name))
        if (names.length !== 1) throw new Error('PROBE_BINDING_INVALID')
        const result = await json(join(root, names[0], 'result.json'))
        await appendFile(join(root, 'campaign-trace.jsonl'), JSON.stringify({ event: 'PROVIDER_PROBE', task, directory: names[0], status: result.status, observation: result.observation }) + '\n')
        return result.status === 'HEALTHY'
      } }, settings.maxGenerationResumes, settings.continueAfterModelFailure)
    if (stage === 'compare' || stage === 'all' && ['GENERATION_READY', 'GENERATION_PARTIAL'].includes(state)) {
      const ready = []
      for (const task of runnable) {
        const generated = await read(task)
        if (!generated || generated.status === 'INFRA_PAUSED' || !settings.continueAfterModelFailure && generated.status !== 'GENERATED_UNVERIFIED') throw new Error('GENERATION_GATE_NOT_READY')
        if (generated.status === 'GENERATED_UNVERIFIED' && !await optional(join(root, `compare-${task}`, 'result.json'))) ready.push(task)
      }
      await compareCandidates(ready, settings.comparisonWorkers ?? 1, async task => {
        const result = await invoke('compare', task)
        const initial = result.baseline_run ? await json(join(result.baseline_run, 'result.json')) : null
        const directoryError = Object.values(initial?.stages ?? {}).some(stage => stage.errors.some(error => error.message_id === 'Common 17-1257'))
        if (result.terminal_policy_rule === 'EXECUTION_OR_EVIDENCE' || directoryError) throw new Error('EDA_INFRA_CIRCUIT_OPEN:' + task)
      })
      state = 'COMPARISON_FINISHED'
    }
    if (stage === 'smoke') { await invoke('repair-control', 'Prob005_notgate'); state = 'SMOKE_FINISHED' }
  } catch (error) {
    state = 'HOST_FAILURE'
    throw error
  } finally {
    try {
      const rows = []
      for (const task of tasks) {
        const generation = await read(task), comparison = await optional(join(root, `compare-${task}`, 'result.json'))
        let valid = false
        if (generation?.status === 'GENERATED_UNVERIFIED') {
          valid = hash(await readFile(join(root, `generate-${task}`, 'initial.sv'))) === generation.source_sha256
          if (!valid) throw new Error('CANDIDATE_HASH_CHANGED')
        }
        let trace = []
        if (comparison) {
          try { trace = (await readFile(join(root, `compare-${task}`, 'tool-trace.jsonl'), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse) }
          catch (error) { if (error.code !== 'ENOENT') throw error }
        }
        rows.push({ task_id: task, generation_status: excluded.has(task) ? 'EVALUATOR_BLOCKED' : generation?.status ?? 'NOT_RUN', candidate_valid: valid,
          calibration_exclusion: excluded.get(task) ?? null,
          response_complete: generation?.generation_attempts?.some(a => a.response_complete) ?? false,
          physical_provider_attempts: generation?.physical_dispatches ?? 0, transport_retries: generation?.transport_retries ?? 0,
          generation_attempts: generation?.generation_attempts ?? [], baseline_status: comparison?.initial_status ?? 'NOT_RUN', agent_status: comparison?.status ?? 'NOT_RUN',
          comparison_complete: !!comparison?.initial_status, repair_eligible: comparison?.repair_eligible ?? false, recovered_by_agent: comparison?.recovered_by_agent ?? false,
          tool_trace: trace, agent_tool_calls: trace.filter(e => e.event === 'agent_tool').length,
          agent_xsim_executions: trace.filter(e => e.event === 'verification' && e.verification_trigger === 'AGENT_TOOL' && e.xsim_executed).length,
          feedback_consumed: trace.filter(e => e.event === 'model_request' && e.consumed_feedback_sha256).length })
      }
      const report = { schema_version: 'p10-stability-1', state, summary: summarize(rows), rows }
      await mkdir(join(root, 'report'), { recursive: true })
      const stamp = new Date().toISOString().replaceAll(/[:.]/g, '-')
      await writeFile(join(root, 'report', `stability-${stage}-${stamp}.json`), JSON.stringify(report, null, 2), { flag: 'wx' })
      await writeFile(join(root, 'report', 'latest.json'), JSON.stringify(report, null, 2))
      const s = report.summary
      await writeFile(join(root, 'report', 'latest.md'), `# P10 Transport and Tool Trace\n\nState: ${state}\n\nSelected: ${s.selected}; complete responses: ${s.complete_model_responses}; valid candidates: ${s.valid_candidates}; infrastructure pending: ${s.infrastructure_pending}; unstarted: ${s.unstarted}.\n\nAcquisition: ${s.valid_candidates}/${s.selected}; E2E evaluated: ${s.evaluated}/${s.selected}.\n\nBaseline: ${s.baseline_pass}/${s.evaluated}; Agent: ${s.agent_pass}/${s.evaluated}; natural repair opportunities: ${s.natural_repair_opportunities}; repair success: ${s.natural_repair_success_rate ?? 'N/A'}.\n\n| Task | Generation | Baseline | Agent | Tool calls | Agent XSim | Feedback consumed |\n|---|---|---|---|---:|---:|---:|\n` + rows.map(r => `| ${r.task_id} | ${r.generation_status} | ${r.baseline_status} | ${r.agent_status} | ${r.agent_tool_calls} | ${r.agent_xsim_executions} | ${r.feedback_consumed} |`).join('\n') + '\n')
      process.stdout.write(JSON.stringify(report.summary) + '\n')
    } finally { await lock.close(); await unlink(join(root, 'stability.lock')) }
  }
  if (['INFRA_PAUSED', 'GENERATION_FAILED'].includes(state)) process.exitCode = 2
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main(...process.argv.slice(2))
