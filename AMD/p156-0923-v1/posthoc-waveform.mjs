import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const root = process.argv[2];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

// This reads timestamp-end VCD values, not the testbench's active-region samples.
function samples(text) {
  const marker = '$enddefinitions $end', split = text.indexOf(marker);
  assert.ok(split >= 0);
  const header = text.slice(0, split), scope = [], ids = new Map();
  for (const directive of header.matchAll(/\$(scope|upscope|var)\s+([\s\S]*?)\$end/g)) {
    const parts = directive[2].trim().split(/\s+/);
    if (directive[1] === 'scope') scope.push(parts[1]);
    else if (directive[1] === 'upscope') scope.pop();
    else if (scope.length === 1 && scope[0] === 'tb' && ['clk', 'd', 'q_ref', 'q_dut', 'tb_mismatch'].includes(parts[3])) {
      assert.equal(parts[1], '1'); ids.set(parts[2], parts[3]);
    }
  }
  assert.ok([...ids.values()].includes('q_ref') && [...ids.values()].includes('q_dut'));
  const values = {}, result = []; let time = null;
  const flush = () => { if (time !== null) result.push({ time, values: { ...values } }); };
  for (const line of text.slice(split + marker.length).split(/\r?\n/)) {
    const tick = /^#(\d+)\s*$/.exec(line);
    if (tick) {
      const next = Number(tick[1]); assert.ok(Number.isSafeInteger(next) && (time === null || next >= time));
      if (next !== time) { flush(); time = next; } continue;
    }
    const value = /^([01xXzZ])(\S+)\s*$/.exec(line);
    if (value && ids.has(value[2])) values[ids.get(value[2])] = value[1].toLowerCase();
  }
  flush();
  return { timescale: /\$timescale\s+([^$]+)\$end/.exec(header)?.[1].trim(), samples: result };
}

const fixture = '$scope module tb $end\n$var reg 1 % q_ref $end\n$var reg 1 & q_dut $end\n$upscope $end\n$enddefinitions $end\n#0\nx%\nx&\n#5\n0%\n1&\n0&\n#10\n1%\n#15\n1&\n';
assert.deepEqual(samples(fixture).samples.map(row => [row.time, row.values.q_ref, row.values.q_dut]), [[0, 'x', 'x'], [5, '0', '0'], [10, '1', '0'], [15, '1', '1']]);

const directory = join(root, 'compare-Prob078_dualedge');
const result = JSON.parse(await readFile(join(directory, 'result.json'), 'utf8'));
assert.equal(result.status, 'VERIFIED');
const evidence = [];
for (const [phase, run] of [['baseline', result.baseline_run], ['agent_final', result.final_verification_run]]) {
  const path = join(run, 'build', 'wave.vcd'), bytes = await readFile(path);
  const parsed = samples(bytes.toString('utf8'));
  const known = parsed.samples.filter(s => /^[01]$/.test(s.values.q_ref ?? '') && /^[01]$/.test(s.values.q_dut ?? ''));
  const mismatch = known.filter(s => s.values.q_ref !== s.values.q_dut);
  const receipt = JSON.parse(await readFile(join(run, 'result.json'), 'utf8'));
  evidence.push({ phase, run, path, sha256: hash(bytes), timescale: parsed.timescale,
    official_result: receipt, timestamp_count: parsed.samples.length, known_pair_timestamps: known.length,
    unequal_known_pair_timestamps: mismatch.length, examples: mismatch.slice(0, 12) });
}
const analysis = { schema_version: 1, purpose: 'Post-hoc evaluator validity check; not a replacement score and never sent to the model.',
  sampling: 'End-of-timestamp VCD values, not testbench active-region samples. Timestamp count is not cycle count or official check count.',
  conclusion: 'The frozen testbench reports the final candidate as PASS despite known settled q_ref/q_dut differences. Treat this gain as an evaluator sampling artifact, not established functional repair.',
  evidence };
await writeFile(join(root, 'report', 'Prob078-waveform-audit.json'), JSON.stringify(analysis, null, 2) + '\n');
console.log(JSON.stringify(evidence.map(({ phase, timestamp_count, known_pair_timestamps, unequal_known_pair_timestamps, examples }) => ({ phase, timestamp_count, known_pair_timestamps, unequal_known_pair_timestamps, examples })), null, 2));
