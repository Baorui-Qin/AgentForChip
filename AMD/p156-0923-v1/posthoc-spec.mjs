import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const root = process.argv[2], dataset = 'D:/AMD/verilog-eval/dataset_spec-to-rtl';
const files = [];
async function source(path) {
  const bytes = await readFile(path); files.push({ path, sha256: createHash('sha256').update(bytes).digest('hex') });
  return bytes.toString('utf8');
}
const prompt = await source(join(dataset, 'Prob093_ece241_2014_q3_prompt.txt'));
const reference = await source(join(dataset, 'Prob093_ece241_2014_q3_ref.sv'));
const baseline = await source(join(root, 'generate-Prob093_ece241_2014_q3', 'initial.sv'));
assert.match(reference, /assign mux_in\[2\] = ~d;/);
assert.match(baseline, /assign mux_in\[2\] = c \| ~d;/);
const mapRows = [...prompt.matchAll(/^\s*(00|01|11|10)\s*\|\s*([01])\s*\|\s*([01])\s*\|\s*([01])\s*\|\s*([01])\s*\|/gm)];
assert.equal(mapRows.length, 4);
const kmap = mapRows.map(row => {
  const c = Number(row[1][0]), d = Number(row[1][1]);
  return { c, d, public_ab10: Number(row[5]), reference_mux_in2: d ^ 1, baseline_mux_in2: c | (d ^ 1) };
});
assert.ok(kmap.every(row => row.public_ab10 === row.baseline_mux_in2));
assert.equal(kmap.filter(row => row.public_ab10 !== row.reference_mux_in2).length, 1);
const waterPrompt = await source(join(dataset, 'Prob149_ece241_2013_q4_prompt.txt'));
const waterRef = await source(join(dataset, 'Prob149_ece241_2013_q4_ref.sv'));
assert.match(waterPrompt.replace(/\s+/g, ' '), /previous level was lower than the current level, the flow rate should be increased by opening the Supplemental flow valve/);
assert.match(waterRef, /A2: next = s\[0\] \? B1 : A2;/);
assert.match(waterRef, /B1: fr = 4'b0110;/);
assert.match(waterRef, /D1: next = s\[2\] \? D1 : C2;/);
assert.match(waterRef, /C2: fr = 4'b0011;/);
const water = [
  { transition: 'A2 -> B1 with sensors 001 after low reset state', direction: 'rising', public_dfr: 1, reference_dfr: 0 },
  { transition: 'D1 -> C2 with sensors 011 after highest state', direction: 'falling', reference_dfr: 1 },
];
const evidence = { purpose: 'Host-only post-hoc static specification audit. Manual translation of the displayed RTL formulas, not a new simulator run or reference sent to the model.',
  files, Prob093: { mapping: 'ab=10 selects mux_in[2]; Gray-code display order is not numeric array order.', kmap },
  Prob149: { observations: water, conclusion: 'The stated rising-level supplemental-flow rule conflicts with the reference transition/output table.' } };
await writeFile(join(root, 'report', 'spec-consistency-audit.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
