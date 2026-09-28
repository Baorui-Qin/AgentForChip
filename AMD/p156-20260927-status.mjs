import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const root = process.argv[2] ?? 'D:/AMD/p156-20260927-v3';
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const config = await json(join(root, 'configuration-check.json'));
const names = await readdir(root), rows = [];
for (const name of names.filter(name => /^(generate|compare)-/.test(name))) {
  try { const result = await json(join(root, name, 'result.json')); rows.push({ phase: name.startsWith('generate-') ? 'generation' : 'comparison', task_id: result.task_id, status: result.status, initial_status: result.initial_status, requests: result.physical_dispatches ?? 0 }); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
const generation = rows.filter(r => r.phase === 'generation'), comparison = rows.filter(r => r.phase === 'comparison');
const terminal = names.includes('stability.lock') ? null : await json(join(root, 'report/latest.json'));
const value = { state: terminal?.state ?? 'RUNNING', recorded_at: new Date().toISOString(), tasks: 156, calibrated: 156,
  authorization: 'authorization-confirmation.json', code_commit: config.git_commit,
  freeze_sha256: config.freeze_sha256, prior_dispatches: config.prior_dispatches ?? 0,
  generation_complete: generation.length, valid_candidates: generation.filter(r => r.status === 'GENERATED_UNVERIFIED').length,
  comparison_complete: comparison.length, baseline_pass_provisional: comparison.filter(r => r.initial_status === 'PASS').length,
  agent_verified_provisional: comparison.filter(r => r.status === 'VERIFIED').length,
  terminal_record_api_dispatches: rows.reduce((sum, r) => sum + r.requests, 0),
  dispatch_claims_including_active: (await readdir(join(root, 'dispatches'))).filter(n => n.endsWith('.json')).length,
  note: 'Intermediate status only; final rates require evidence audit. Terminal-record request counts exclude active tasks.' };
await mkdir(join(root, 'report'), { recursive: true });
await writeFile(join(root, 'report/execution-status.json'), JSON.stringify(value, null, 2) + '\n');
console.log(JSON.stringify(value, null, 2));
