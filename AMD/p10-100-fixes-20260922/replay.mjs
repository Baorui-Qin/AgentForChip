import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readDiagnostics } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/repair-diagnostics.ts';
import { decideRepair } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/repair-policy.ts';
import { revisionScore } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-revision.ts';
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts';
export const name = 'p10-readonly-evidence-replay';
export const inject = ['cmdlineArgs', 'appReady'];
export function apply(ctx) {
  if (ctx.get('llm') || ctx.cmdlineArgs.get().join(' ') !== 'replay') throw new Error('READONLY_REPLAY_REQUIRED');
  let pending;
  ctx.effect(() => async () => { await pending; });
  ctx.effect(() => ctx.get('appReady').onReady(() => {
    pending = run().then(() => ctx.get('appExit')(0)).catch(error => { process.stderr.write(String(error)); ctx.get('appExit')(1); });
  }));
}
async function run() {
  const prior = 'D:/AMD/phase1-validation/p10-repair-v2-40-full-trace-20260921-v1';
  const cases = [['Prob043_vector5', 1, 'VERIFIED'], ['Prob074_ece241_2014_q4', 1, 'DUT_MULTIPLE_DRIVERS'], ['Prob104_mt2015_muxdff', 2, 'DUT_MULTIPLE_DRIVERS']];
  const rows = [];
  for (const [task, round, expectedRule] of cases) {
    const path = join(prior, `compare-${task}/feedback-${round}.json`), oldBytes = await readFile(path), old = JSON.parse(oldBytes);
    const before = await readFile(join(old.original_run, 'result.json'));
    const { receipt, record } = await readDiagnostics(old.original_run, 'diagnostic_replay');
    const context = { calibrated: true, bound: true, attempts: 0, top: 'TopModule', maxAttempts: 3 };
    const replayDecision = decideRepair(receipt, context);
    assert.equal(replayDecision.rule, 'UNTRUSTED_EVIDENCE');
    const hypothetical = { ...receipt, evidence_kind: 'live_verification' };
    const decision = decideRepair(hypothetical, context);
    assert.equal(decision.rule, expectedRule);
    assert.equal(sha256(await readFile(path)), sha256(oldBytes));
    assert.equal(sha256(await readFile(join(old.original_run, 'result.json'))), sha256(before));
    rows.push({ task_id: task, round, raw_files_unchanged: true, evidence_kind: receipt.evidence_kind,
      execution_authorized: false, replay_decision: replayDecision, counterfactual_live_decision: decision,
      counterfactual_revision_score: revisionScore(hypothetical, record.final_verified),
      old_stages: old.stages, reparsed_receipt: receipt });
  }
  await writeFile('D:/AMD/p10-100-fixes-20260922/historical-replay.json', JSON.stringify({ status: 'PASS', eda_rerun: false, model_calls: 0, rows }, null, 2));
  process.stdout.write(JSON.stringify(rows.map(row => ({ task: row.task_id, replay: row.replay_decision.rule, counterfactual: row.counterfactual_live_decision.rule, score: row.counterfactual_revision_score }))));
}
