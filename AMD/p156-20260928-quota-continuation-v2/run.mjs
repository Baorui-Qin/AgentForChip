import assert from 'node:assert/strict';
import { readFile, writeFile, open, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { auditComparison } from 'file:///D:/deepseek-harness/rtl-tools/phase1/p10/acceptance-audit.mjs';

const [root, repo] = process.argv.slice(2);
const json = async p => JSON.parse(await readFile(p, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const freeze = await json(join(root, 'campaign-freeze.json')), manifest = await json(join(root, 'continuation.json'));
async function verifyFreeze() {
  for (const [path, digest] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), digest, path);
}
await verifyFreeze();
const lock = await open(join(root, 'continuation.lock'), 'wx');
const results = [];
let state = 'SUPPLEMENTAL_FAILED';
try {
  for (const task of manifest.tasks) {
    await verifyFreeze();
    const log = await open(join(root, 'runner-logs', `${task.task_id}.log`), 'wx');
    let code;
    try {
      const child = spawn(process.execPath, ['--import', 'tsx/esm', 'apps/cli/src/bin.ts', '--profile', 'rtl-p10-model', '--patch', join(root, `${task.task_id}.patch.yml`), 'compare', task.task_id],
        { cwd: repo, env: { ...process.env, DSH_HOME: join(root, 'dsh-home'), NODE_OPTIONS: '--max-old-space-size=4096' }, windowsHide: true, stdio: ['ignore', log.fd, log.fd] });
      code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve); });
    } finally { await log.close(); }
    assert.equal(code, 0, 'CONTINUATION_HOST_FAILED');
    const result = await json(join(root, `compare-${task.task_id}/result.json`));
    await auditComparison(result, 'p10-netlist-1');
    assert.equal(result.shared_initial_sha256, task.source_sha256);
    assert.ok(result.model_call_attempts + task.used.requests <= 120);
    assert.ok(result.actions.length + task.used.tools <= 60);
    assert.ok(result.semantic_repairs + task.used.edits <= 15);
    results.push({ task_id: task.task_id, status: result.status, added_dispatches: result.physical_dispatches });
    console.log(JSON.stringify(results.at(-1)));
    if (['QUOTA', 'TRANSPORT', 'HOST_FAILURE'].includes(result.status) || result.terminal_policy_rule === 'EXECUTION_OR_EVIDENCE') throw new Error('SUPPLEMENTAL_INFRA_BLOCKED');
  }
  state = 'SUPPLEMENTAL_FINISHED';
} finally {
  await writeFile(join(root, 'report/latest.json'), JSON.stringify({ state, context_restarted: true, results }, null, 2) + '\n');
  await lock.close(); await unlink(join(root, 'continuation.lock'));
}
