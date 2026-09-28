import { test } from 'node:test'
import assert from 'node:assert/strict'
import { acquireCandidates, compareCandidates, summarize } from '../phase1/p10/generation-stability.mjs'

test('opens the circuit without consuming subsequent tasks after an unhealthy probe', async () => {
  const calls = []
  const state = await acquireCandidates(['a', 'b', 'c'], { read: async () => null,
    invoke: async (command, task) => { calls.push([command, task]); return { status: 'INFRA_PAUSED', generation_resumes: 0 } },
    pause: async () => {}, probe: async () => false }, 1)
  assert.equal(state, 'INFRA_PAUSED'); assert.deepEqual(calls, [['generate', 'a']])
})

test('resumes the paused task and does not resample a completed candidate', async () => {
  const calls = []
  const state = await acquireCandidates(['a', 'b'], { read: async task => task === 'a' ? { status: 'GENERATED_UNVERIFIED' } : { status: 'INFRA_PAUSED', generation_resumes: 0 },
    invoke: async (command, task) => { calls.push([command, task]); return { status: 'GENERATED_UNVERIFIED' } }, pause: async () => {}, probe: async () => true }, 1)
  assert.equal(state, 'GENERATION_READY'); assert.deepEqual(calls, [['resume-generate', 'b']])
})

test('does not probe or dispatch after the fixed resume cap', async () => {
  const state = await acquireCandidates(['a', 'b'], { read: async () => ({ status: 'INFRA_PAUSED', generation_resumes: 1 }),
    invoke: async () => assert.fail('dispatch'), pause: async () => assert.fail('pause'), probe: async () => assert.fail('probe') }, 1)
  assert.equal(state, 'INFRA_PAUSED')
})

test('separates acquisition, infrastructure reliability and model scores', () => {
  const rows = Array.from({ length: 10 }, (_, i) => ({ candidate_valid: i < 6, response_complete: i < 6, comparison_complete: i < 6,
    generation_status: i < 6 ? 'GENERATED_UNVERIFIED' : 'INFRA_PAUSED', baseline_status: i < 6 ? 'PASS' : 'NOT_RUN', agent_status: i < 6 ? 'VERIFIED' : 'NOT_RUN' }))
  assert.deepEqual(summarize(rows), { selected: 10, complete_model_responses: 6, valid_candidates: 6, calibration_blocked: 0, interface_blocked: 0, infrastructure_pending: 4, unstarted: 0,
    acquisition_completion: 0.6, e2e_completion: 0.6, model_evaluable: 6, evaluated: 6, baseline_pass: 6, agent_pass: 6,
    baseline_pass_rate: 1, agent_pass_rate: 1, natural_repair_opportunities: 0, natural_repair_success_rate: null })
  assert.equal(summarize([]).baseline_pass_rate, null)
  assert.equal(summarize([{ generation_status: 'EVALUATOR_BLOCKED' }]).calibration_blocked, 1)
})

test('keeps all tasks while separating generated candidates from calibrated evaluation', () => {
  const rows = [
    { candidate_valid: true, generation_status: 'GENERATED_UNVERIFIED', calibration_exclusion: { reason: 'EVALUATOR_INCONCLUSIVE' } },
    { generation_status: 'INTERFACE_BLOCKED', calibration_exclusion: { reason: 'PUBLIC_INTERFACE_CONFLICT' } },
    { candidate_valid: true, generation_status: 'GENERATED_UNVERIFIED', comparison_complete: true, baseline_status: 'PASS', agent_status: 'VERIFIED' },
  ]
  assert.deepEqual(summarize(rows), { selected: 3, complete_model_responses: 0, valid_candidates: 2,
    calibration_blocked: 2, interface_blocked: 1, infrastructure_pending: 0, unstarted: 0,
    acquisition_completion: 2 / 3, e2e_completion: 1 / 3, model_evaluable: 1, evaluated: 1,
    baseline_pass: 1, agent_pass: 1, baseline_pass_rate: 1, agent_pass_rate: 1,
    natural_repair_opportunities: 0, natural_repair_success_rate: null })
})

test('zero generation resumes never spends an extra probe request', async () => {
  const calls = []
  const state = await acquireCandidates(['a', 'b'], { read: async () => null,
    invoke: async (command, task) => { calls.push([command, task]); return { status: 'INFRA_PAUSED', generation_resumes: 0 } },
    pause: async () => assert.fail('pause'), probe: async () => assert.fail('probe') }, 0, true)
  assert.equal(state, 'INFRA_PAUSED'); assert.deepEqual(calls, [['generate', 'a']])
})

test('provider authority and configuration errors do not dispatch later tasks', async () => {
  for (const category of ['authentication', 'configuration', 'rate_limit']) {
    const calls = []
    const state = await acquireCandidates(['a', 'b'], { read: async () => null,
      invoke: async (_command, task) => { calls.push(task); return { status: 'MODEL_RESPONSE_ERROR', error: { category } } } }, 0, true)
    assert.equal(state, 'PROVIDER_BLOCKED'); assert.deepEqual(calls, ['a'])
  }
})

test('cancellation and campaign faults cannot be treated as bad candidate output', async () => {
  for (const status of ['CANCELLED', 'HOST_FAILURE', 'CAMPAIGN_BUDGET_EXHAUSTED']) {
    const calls = []
    const state = await acquireCandidates(['a', 'b'], { read: async () => null,
      invoke: async (_command, task) => { calls.push(task); return { status } } }, 0, true)
    assert.equal(state, 'CAMPAIGN_BLOCKED'); assert.deepEqual(calls, ['a'])
  }
})

test('retains terminal model failures without dropping later fixed tasks in an authorized forty run', async () => {
  const tasks = Array.from({ length: 40 }, (_, i) => 'task-' + i), calls = []
  const state = await acquireCandidates(tasks, { read: async () => null,
    invoke: async (_command, task) => { calls.push(task); return { status: task === tasks[2] ? 'INVALID_MODEL_OUTPUT' : 'GENERATED_UNVERIFIED' } },
    pause: async () => assert.fail('pause'), probe: async () => assert.fail('probe') }, 1, true)
  assert.equal(state, 'GENERATION_PARTIAL'); assert.deepEqual(calls, tasks)
})

test('bounds EDA concurrency and awaits active jobs after a host failure', async () => {
  let active = 0, peak = 0
  const done = []
  await compareCandidates(['a', 'b', 'c', 'd'], 2, async task => {
    active++; peak = Math.max(peak, active)
    await new Promise(resolve => setTimeout(resolve, 5))
    done.push(task); active--
  })
  assert.equal(peak, 2); assert.equal(done.length, 4)
  await assert.rejects(compareCandidates(['a', 'b', 'c'], 2, async task => {
    if (task === 'a') throw new Error('host failure')
    active++; await new Promise(resolve => setTimeout(resolve, 10)); active--
  }), /host failure/)
  assert.equal(active, 0)
  await assert.rejects(compareCandidates([], 5, async () => {}), /INVALID_COMPARISON_WORKERS/)
})
