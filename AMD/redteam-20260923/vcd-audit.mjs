import {readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const root = 'D:/AMD/p156-0923-v1/compare-Prob078_dualedge';
const result = JSON.parse(await readFile(join(root, 'result.json'), 'utf8'));
const reports = [];
for (const [label, run] of [['baseline', result.baseline_run], ['final', result.final_verification_run]]) {
  const path = join(run, 'build/wave.vcd');
  const bytes = await readFile(path);
  const text = bytes.toString('utf8');
  const end = text.indexOf('$enddefinitions $end');
  const scopes = [], ids = new Map();
  for (const m of text.slice(0, end).matchAll(/\$(scope|upscope|var)\s+([\s\S]*?)\$end/g)) {
    const p = m[2].trim().split(/\s+/);
    if (m[1] === 'scope') scopes.push(p[1]);
    else if (m[1] === 'upscope') scopes.pop();
    else if (scopes.join('.') === 'tb' && ['q_ref','q_dut','clk','d'].includes(p[3])) ids.set(p[2], p[3]);
  }
  const values = {}, examples = [];
  let time = 0, known = 0, mismatch = 0;
  const flush = () => {
    if (!['0','1'].includes(values.q_ref) || !['0','1'].includes(values.q_dut)) return;
    known++;
    if (values.q_ref !== values.q_dut) { mismatch++; if(examples.length < 4) examples.push({time, ...values}); }
  };
  for (const line of text.slice(end + '$enddefinitions $end'.length).split(/\r?\n/)) {
    const tick = /^#(\d+)$/.exec(line.trim());
    if (tick) { if(Number(tick[1]) !== time) flush(); time = Number(tick[1]); continue; }
    const scalar = /^([01xXzZ])(\S+)$/.exec(line.trim());
    if(scalar && ids.has(scalar[2])) values[ids.get(scalar[2])] = scalar[1].toLowerCase();
  }
  flush();
  const verdict = JSON.parse(await readFile(join(run, 'result.json'), 'utf8'));
  reports.push({label, path, sha256: createHash('sha256').update(bytes).digest('hex'), harness_status: verdict.final_status, harness_evidence: verdict.stages.simulation.evidence, timestamp_end_known: known, timestamp_end_mismatches: mismatch, examples});
}
const output = {purpose: 'Independent read-only VCD timestamp-end audit. Counts are not testbench sampling events.', reports};
await writeFile('D:/AMD/redteam-20260923/vcd-audit-results.json', JSON.stringify(output, null, 2));
console.log(JSON.stringify(output, null, 2));
