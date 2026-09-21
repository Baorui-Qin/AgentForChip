import { readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = dirname(fileURLToPath(import.meta.url));
const read = async path => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const put = async (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const freeze = await read(join(root, 'experiment-freeze.json'));
const index = await read(join(root, 'execution-index.json'));
assert.equal(index.length, freeze.schedule.length);
assert.equal((await readdir(join(root, 'experiments'))).length, index.length);
for (const [path, expected] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), expected, path);
const requests = [], rows = [], manifests = [], bindings = [], configurations = [];
async function scan(directory, excluded) {
  const files = [];
  async function visit(relative = '') {
    for (const name of (await readdir(join(directory, relative))).sort()) {
      const path = relative ? relative + '/' + name : name;
      if (path === excluded) continue;
      const info = await lstat(join(directory, path));
      assert.ok(!info.isSymbolicLink(), 'Linked artifact: ' + path);
      if (info.isDirectory()) await visit(path);
      else if (info.isFile()) {
        const bytes = await readFile(join(directory, path));
        files.push({ path, bytes: bytes.length, sha256: hash(bytes) });
      }
    }
  }
  await visit();
  return files;
}
async function auditManifest(directory) {
  const manifest = await read(join(directory, 'artifacts.json'));
  const actual = await scan(directory, 'artifacts.json');
  assert.deepEqual(actual, manifest.files, directory);
  manifests.push({ directory, status: 'PASS', files: actual.length });
}
function knownSum(values) { return !values.length || values.some(v => v === null || v === undefined) ? null : values.reduce((a, b) => a + b, 0); }
function compactStages(result) {
  return Object.fromEntries(Object.entries(result.stages).map(([name, value]) => [name, value?.status ?? null]));
}
for (let i = 0; i < index.length; i++) {
  const entry = index[i], planned = freeze.schedule[i], dir = entry.directory;
  for (const key of ['pair', 'task', 'variant', 'budget']) assert.equal(entry[key], planned[key]);
  const state = await read(join(dir, 'state.json'));
  const config = await read(join(dir, 'configuration.json'));
  configurations.push({ pair: entry.pair, budget: entry.budget, config });
  assert.equal(state.phase, 'TERMINAL');
  assert.equal(state.fixture, planned.task);
  assert.equal(state.p09.variant_id, planned.variant);
  assert.equal(config.auto.sampleId, planned.sample);
  assert.equal(config.model.maxTokens, planned.budget);
  assert.equal(config.p09.limits.output, planned.budget);
  assert.equal(config.p09.limits.window, 16384);
  assert.equal(config.p09.limits.margin, 1024);
  assert.equal(state.full_os_isolation_verified, false);
  const event = await read(join(dir, 'event-' + String(state.seq).padStart(5, '0') + '.json'));
  assert.deepEqual(event.state, state);
  const claim = await read(join(root, 'claims', state.auto.claim_key + '.json'));
  assert.equal(claim.experiment, state.experiment_id);
  assert.equal(claim.identity.config_hash, state.configuration_sha256);
  assert.equal(claim.identity.sample, planned.sample);
  const task = freeze.tasks.find(t => t.id === planned.task);
  let initial = null;
  if (state.calibrated) {
    assert.equal(state.p09.source_history[0], task.bad_source_sha256);
    initial = await read(join(state.verification_runs[0], 'result.json'));
    assert.equal(initial.final_verified, false);
    assert.equal(initial.final_source_sha256, task.bad_source_sha256);
  }
  const models = [], rowRequests = [];
  for (const path of state.model_runs) {
    assert.ok(path.startsWith(dir + '\\') || path.startsWith(dir + '/'));
    const model = await read(join(path, 'model.json'));
    models.push(model);
    const chunks = await read(join(path, 'stream.json'));
    const usage = chunks.find(c => c.type === 'usage')?.usage;
    let requestAudit = { local_tokens: null, context_reduced: null, input_budget: 16384 - planned.budget - 1024 };
    if (model.dispatched) {
      const body = await read(join(path, 'prompt-final.txt'));
      const audit = await read(join(path, 'context-audit.json'));
      const input = await read(join(path, 'context.json'));
      assert.equal(hash(JSON.stringify(body)), model.prompt_sha256);
      assert.equal(audit.final_prompt_sha256, model.prompt_sha256);
      assert.equal(body.max_tokens, planned.budget);
      assert.equal(body.reasoning_effort, 'high');
      assert.equal(body.thinking.type, 'enabled');
      assert.equal(audit.output_reserve, planned.budget);
      assert.equal(audit.budget, requestAudit.input_budget);
      assert.ok(audit.tokens <= audit.budget);
      assert.equal(audit.tokens, model.local_tokens);
      assert.equal(audit.full_request_counted, true);
      const view = JSON.parse(body.messages.find(m => m.role === 'user').content);
      assert.equal(hash(view.current.source), audit.source_sha256);
      assert.equal(view.current.revision_id, audit.revision_id);
      if (input.pending_verification) { assert.equal(view.verification_key, null); assert.equal(view.observed, null); }
      if (planned.variant === 'A') assert.equal(view.history.length, 0);
      if (planned.variant !== 'C') assert.equal(view.guidance.length, 0);
      requestAudit = { ...requestAudit, local_tokens: audit.tokens, context_reduced: audit.prompt_view_reduced,
        omissions: audit.omissions, selected_skills: audit.selected_skills, revision: audit.revision_id,
        source_sha256: audit.source_sha256, pending_verification: audit.pending_verification,
        necessary_reasoning_replay: body.messages.some(m => Object.hasOwn(m, 'reasoning_content')) };
    }
    const names = [...new Set(chunks.filter(c => c.type === 'tool-call-delta' && c.name).map(c => c.name))];
    const truncation = model.error_code !== 'OUTPUT_TRUNCATED' ? null : model.finish_kind === 'max-tokens' ? 'provider_max_tokens'
      : model.response_bytes > config.model.maxResponseBytes ? 'host_response_byte_limit' : 'host_stream_event_limit_or_unknown';
    const request = { pair: entry.pair, task: entry.task, variant: entry.variant, budget: entry.budget, directory: path,
      dispatched: model.dispatched, finish_kind: model.finish_kind, error: model.error_code, truncation,
      input_tokens: model.prompt_tokens, output_tokens: model.completion_tokens, reasoning_tokens: usage?.reasoningTokens ?? null,
      request_ms: model.request_wall_ms, response_bytes: model.response_bytes, tool_names_observed: names,
      complete_tool_calls_accepted: model.error_code === null, ...requestAudit };
    requests.push(request); rowRequests.push(request);
  }
  let verified = false;
  if (state.outcome === 'VERIFIED') {
    assert.equal(state.auto.pending_verification, false);
    const result = await read(join(state.verification_run, 'result.json'));
    const diagnostic = await read(join(state.verification_run, 'diagnostics-1.4.json'));
    assert.equal(result.final_verified, true);
    assert.equal(result.final_revision_id, state.current.revision_id);
    assert.equal(result.final_source_sha256, state.current.source_sha256);
    assert.equal(hash(await readFile(join(dir, 'output/solution.sv'))), state.current.source_sha256);
    assert.deepEqual(compactStages(result), { compile: 'PASS', elaborate: 'PASS', simulation: 'PASS', synthesis: 'PASS' });
    assert.ok(result.verification_key);
    const stages = diagnostic.stages ?? diagnostic.receipt?.stages;
    assert.ok(Array.isArray(stages), 'Expected diagnostic receipt stages');
    assert.ok(stages.every(s => s.status === 'PASS' && s.complete && s.process_clean));
    verified = true;
    bindings.push({ directory: dir, revision: state.current.revision_id, source_sha256: state.current.source_sha256,
      verification_key: result.verification_key, stages: compactStages(result), export_matches: true });
  }
  for (const path of new Set([...state.model_runs, ...state.verification_runs, ...(state.calibration_run ? [state.calibration_run] : [])])) await auditManifest(path);
  rows.push({ pair: entry.pair, task: entry.task, variant: entry.variant, budget: entry.budget, sample: planned.sample,
    directory: dir, experiment_id: state.experiment_id, status: state.outcome, verified, accepted_repairs: state.attempts,
    verifications: state.auto.verifications, tool_steps: state.auto.tool_steps,
    requests: models.filter(m => m.dispatched).length, transport_retries: state.p09.transport_retries,
    input_tokens: knownSum(models.map(m => m.prompt_tokens)), output_tokens: knownSum(models.map(m => m.completion_tokens)),
    reasoning_tokens: knownSum(rowRequests.map(m => m.reasoning_tokens)), model_ms: models.reduce((s, m) => s + m.request_wall_ms, 0),
    active_ms: state.active_ms, initial_stages: initial ? compactStages(initial) : null,
    context_reduced: rowRequests.some(r => r.context_reduced), final_error: rowRequests.at(-1)?.error ?? null,
    truncation: rowRequests.at(-1)?.truncation ?? null, usage_incomplete: models.some(m => m.completion_tokens === null),
    evidence_kind: 'real_model_repair_with_real_vivado_of_controlled_fixture', full_os_isolation_verified: false });
  assert.ok(models.length <= 15 && state.attempts <= 3 && state.auto.tool_steps <= 15);
}
const pairedConfigChecks = [];
for (const pair of [1, 2, 3, 4]) {
  const configs = configurations.filter(c => c.pair === pair).map(c => structuredClone(c.config));
  for (const config of configs) { delete config.model.maxTokens; delete config.p09.limits.output; delete config.auto.sampleId; }
  assert.deepEqual(configs[0], configs[1]);
  pairedConfigChecks.push({ pair, identical_except: ['model.maxTokens', 'p09.limits.output', 'auto.sampleId'], status: 'PASS' });
}
const dispatches = (await readdir(join(root, 'dispatches'))).filter(n => n.endsWith('.json'));
assert.equal(dispatches.length, requests.filter(r => r.dispatched).length);
assert.ok(dispatches.length <= 120 && dispatches.length + freeze.limits.prior_dispatches <= 375);
const historicalManifest = await read(join(freeze.prior, 'campaign-artifact-manifest.json'));
assert.equal(hash(await readFile(join(freeze.prior, 'campaign-artifact-manifest.json'))), freeze.historical_manifest_sha256);
const actualHistorical = await scan(freeze.prior, 'campaign-artifact-manifest.json');
assert.deepEqual(actualHistorical, historicalManifest.files, 'Historical evidence changed');
const summaries = [2048, 8192].map(budget => {
  const selected = rows.filter(r => r.budget === budget);
  const reqs = requests.filter(r => r.budget === budget);
  return { budget, cells: selected.length, verified: selected.filter(r => r.verified).length,
    truncated: selected.filter(r => r.status === 'OUTPUT_TRUNCATED').length,
    outcomes: Object.fromEntries([...new Set(selected.map(r => r.status))].map(status => [status, selected.filter(r => r.status === status).length])),
    requests: reqs.filter(r => r.dispatched).length, input_tokens: knownSum(selected.map(r => r.input_tokens)),
    output_tokens: knownSum(selected.map(r => r.output_tokens)), known_output_tokens_lower_bound: reqs.reduce((s, r) => s + (r.output_tokens ?? 0), 0),
    reasoning_tokens: knownSum(selected.map(r => r.reasoning_tokens)),
    active_ms: selected.reduce((s, r) => s + r.active_ms, 0), model_ms: selected.reduce((s, r) => s + r.model_ms, 0),
    max_input_tokens: Math.max(...reqs.map(r => r.local_tokens ?? 0)), context_reduced: selected.filter(r => r.context_reduced).length,
    unknown_usage_requests: reqs.filter(r => r.output_tokens === null).length };
});
const report = { schema_version: freeze.schema_version, created_at: new Date().toISOString(), design: freeze.design,
  no_resampling: true, source_changes_since_original: freeze.source_changes_since_original,
  summaries, rows, paired_config_checks: pairedConfigChecks,
  historical_comparison_only: freeze.historical_rows, all_model_and_eda_manifests_pass: true,
  historical_archive_unchanged: { files: actualHistorical.length, manifest_sha256: freeze.historical_manifest_sha256 },
  dispatches_used: dispatches.length, dispatches_cap: 120, prior_plus_new_dispatches: freeze.limits.prior_dispatches + dispatches.length,
  statistically_significant: false, causal_gain_established: false, full_os_isolation_verified: false,
  limitations: freeze.limitations };
await put('output-budget-comparison.json', report);
await put('request-audit.json', requests);
await put('artifact-manifest-audit.json', manifests);
await put('verification-bindings.json', bindings);
const keys = ['pair', 'task', 'variant', 'budget', 'status', 'verified', 'accepted_repairs', 'requests', 'input_tokens', 'output_tokens', 'reasoning_tokens', 'model_ms', 'active_ms', 'truncation', 'context_reduced'];
const csv = value => value == null ? '' : '"' + String(value).replaceAll('"', '""') + '"';
await writeFile(join(root, 'output-budget-comparison.csv'), keys.join(',') + '\n' + rows.map(row => keys.map(key => csv(row[key])).join(',')).join('\n') + '\n', { flag: 'wx' });
const table = [1, 2, 3, 4].map(pair => {
  const low = rows.find(r => r.pair === pair && r.budget === 2048), high = rows.find(r => r.pair === pair && r.budget === 8192);
  return `| ${low.task} / ${low.variant} | ${low.status} | ${high.status} | ${low.output_tokens ?? 'unknown'} | ${high.output_tokens ?? 'unknown'} |`;
}).join('\n');
const totals = summaries.map(s => `| ${s.budget} | ${s.verified}/${s.cells} | ${s.truncated}/${s.cells} | ${s.requests} | ${s.output_tokens ?? 'unknown'} | ${(s.model_ms / 1000).toFixed(1)} | ${(s.active_ms / 1000).toFixed(1)} |`).join('\n');
await writeFile(join(root, 'output-budget-comparison.md'), `# P09 Output Budget Comparison\n\n## Design\n\nFresh paired experiments compare 2,048 and 8,192 output tokens on all four task/group cells that were truncated in the prior campaign. Each cell starts from its frozen incorrect DUT, uses the same full tool protocol and high reasoning, and is run once per budget. The two budgets alternate in the frozen schedule. These are targeted repair experiments, not a new full A/B/C benchmark or an estimate of population success.\n\nOnly max_tokens and the matching output reserve differ within each pair, apart from immutable sample identity. Both arms use the same post-campaign Host fix for disappearing Vivado child directories. Historical results are not overwritten or used as the concurrent control.\n\n## Results\n\n| Task / Group | New 2,048 | New 8,192 | 2,048 Actual Output Tokens | 8,192 Actual Output Tokens |\n| --- | --- | --- | ---: | ---: |\n${table}\n\nOutput token columns sum every request in an experiment, including reasoning and unsuccessful requests. They are not single-request limits.\n\n| Budget / Request | Verified | Truncated | API Dispatches | Actual Output Tokens | Model Seconds | Active Seconds |\n| ---: | ---: | ---: | ---: | ---: | ---: | ---: |\n${totals}\n\n## Context and Other Limits\n\nThe project window remains 16,384 tokens and the safety margin is 1,024. Input allowances are therefore 13,312 and 7,168. Exact whole-request counting, including required reasoning replay and tool messages, is retained. Requests with reduced context: ${requests.filter(r => r.context_reduced).length}. Unknown output usage is preserved as null, not estimated as zero. Model time includes request preparation; active time includes positive calibration, initial failure, model work and EDA verification.\n\nThe 60-second model timeout, 65,536-byte response cap, event cap and EDA limits are unchanged for both arms. A larger max_tokens is not an unlimited-output promise. Each truncation is classified from the actual finish metadata, rather than assumed to be a token cap.\n\n## Audit\n\nAll ${manifests.length} terminal model/EDA manifests match their complete file sets, byte sizes and SHA256. Verified outputs are independently bound to the current revision and four PASS stages. All ${actualHistorical.length} files in the historical archive are unchanged. New dispatches: ${dispatches.length}/120; prior plus new: ${freeze.limits.prior_dispatches + dispatches.length}/375. No failed cell was resampled.\n\nSee request-audit.json, verification-bindings.json and artifact-manifest-audit.json for machine-readable evidence. Raw tool streams, exact requests and EDA artifacts remain under experiments.\n\n## Interpretation Limits\n\nThere is only one sample per budget per selected cell. Selection was based on historical truncation; these results cannot establish statistical significance, general success rates or the efficacy of A/B/C context strategies. The provider alias can change and generation is stochastic. The official thinking-mode documentation says temperature is ignored, so a transmitted value of zero does not imply deterministic sampling. More output also leaves less room for input and retained reasoning. Full OS isolation and full implementation timing closure remain unverified.\n\nProvider references: [Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/), [Thinking Mode](https://api-docs.deepseek.com/guides/thinking_mode/), [Model Limits](https://api-docs.deepseek.com/quick_start/pricing/).\n`, { flag: 'wx' });
console.log(JSON.stringify({ summaries, audits: manifests.length, dispatches: dispatches.length, historical_files_unchanged: actualHistorical.length }));
