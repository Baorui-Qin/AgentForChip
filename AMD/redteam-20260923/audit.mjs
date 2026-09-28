import assert from 'node:assert/strict';
import { readFile, writeFile, readdir, mkdtemp, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const root = 'D:/AMD/redteam-20260923';
const campaign = 'D:/AMD/p156-0923-v1';
const repo = 'D:/deepseek-harness';
const json = async p => JSON.parse(await readFile(p, 'utf8'));
const sha = v => createHash('sha256').update(v).digest('hex');
const files = ['phase1/p10-model.ts', 'phase1/p09-auto-policy.ts', 'phase1/p10-revision.ts', 'phase1/p09-context.ts', 'phase1/repair-policy.ts', 'phase1/verification.ts', 'vivado-parser.ts'];
const sourceIdentity = [];
for (const file of files) {
  const current = sha(await readFile(`${repo}/rtl-tools/src/${file}`));
  const frozen = await readFile(`${campaign}/source-snapshot/rtl-tools/src/${file}`).then(sha).catch(() => null);
  sourceIdentity.push({file, current, frozen, identical: current === frozen});
}
const comparisons = [];
for (const name of (await readdir(campaign)).filter(n => n.startsWith('compare-'))) {
  const result = await json(join(campaign, name, 'result.json'));
  const baseline = await json(join(result.baseline_run, 'result.json'));
  assert.equal(baseline.final_source_sha256, result.shared_initial_sha256);
  comparisons.push({task: result.task_id, baseline: baseline.final_verified, final: result.status, repairs: result.semantic_repairs, calls: result.physical_dispatches, eligible: result.repair_eligible, prompt: result.prompt_tokens, completion: result.completion_tokens, unknown: result.unknown_usage_requests, actions: result.actions.length, rejected: result.actions.filter(a => !a.accepted).map(a => a.observation.error)});
}
const generations = [];
for (const name of (await readdir(campaign)).filter(n => n.startsWith('generate-'))) {
  const result = await json(join(campaign, name, 'result.json'));
  generations.push({task: result.task_id, status: result.status, calls: result.physical_dispatches, prompt: result.prompt_tokens, completion: result.completion_tokens, unknown: result.unknown_usage_requests});
}
const evidence = {sourceIdentity, comparisons: {count: comparisons.length, baseline_pass: comparisons.filter(r => r.baseline).length, final_pass: comparisons.filter(r => r.final === 'VERIFIED').length, initial_failures: comparisons.filter(r => !r.baseline).length, repair_eligible: comparisons.filter(r => r.eligible).length, shared_hash_bindings_checked: comparisons.length, calls: comparisons.reduce((a,b) => a+b.calls,0), completion: comparisons.reduce((a,b) => a+b.completion,0), unknown: comparisons.reduce((a,b) => a+b.unknown,0)}, generation: {count: generations.length, calls: generations.reduce((a,b) => a+b.calls,0), completion: generations.reduce((a,b) => a+b.completion,0)}, failed_initial_cases: comparisons.filter(r => !r.baseline)};
const { ModelTranscript } = await import(pathToFileURL(`${repo}/rtl-tools/src/phase1/model-transcript.ts`).href);
const directory = await mkdtemp(join(root, 'empty-chunks-'));
const transcript = await ModelTranscript.create(directory);
for (let i = 0; i < 10000; i++) await transcript.append({type: 'reasoning-delta', index: 0, text: ''});
await transcript.finish({complete: false, error: 'BOUNDED_REDTEAM_PROBE_STOP'});
const bytes = (await stat(join(directory, 'stream.jsonl'))).size;
assert.ok(bytes > 262144);
evidence.empty_chunk_probe = {directory, chunks: 10000, response_text_bytes: 0, stream_bytes: bytes, result: 'Transcript exceeds response-byte cap without consuming content budget; bounded component test, not live provider OOM.'};
await writeFile(join(root, 'audit-results.json'), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
