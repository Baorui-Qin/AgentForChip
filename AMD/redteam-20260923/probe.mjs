import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const repo = 'D:/deepseek-harness';
const root = 'D:/AMD/redteam-20260923';
const load = p => import(pathToFileURL(`${repo}/rtl-tools/src/${p}`).href);
const { checkAutoSource, parseAutoAction, autoTools } = await load('phase1/p09-auto-policy.ts');
const { compareRevision } = await load('phase1/p10-revision.ts');
const { decideRepair } = await load('phase1/repair-policy.ts');
const { VivadoDiagnostics } = await load('vivado-parser.ts');
const { attributeDiagnostics } = await load('phase1/attribution.ts');
const { buildContext } = await load('phase1/p09-context.ts');
const { sha256 } = await load('phase1/snapshots.ts');
const { SimulationEvidence } = await load('phase1/simulation-evidence.ts');
const iface = { top: 'TopModule', ports: [{ name: 'in', direction: 'input', width: 1 }, { name: 'out', direction: 'output', width: 1 }] };
const source = `module TopModule(input in, output out);
  assign out = 1'b0
  // synthesis translate_off
    | in
  // synthesis translate_on
  ;
endmodule
`;
await mkdir(root, { recursive: true });
const results = [];
function test(name, fn) { const detail = fn(); results.push({ name, detail }); }
test('synthesis-directives-survive-comment-filter', () => { checkAutoSource(source, iface); return 'ACCEPTED'; });
test('comment-only-edits-bypass-trim-cache', () => {
  const original = 'module TopModule(input in, output out); assign out = ~in; endmodule';
  const variants = Array.from({length: 5}, (_, i) => original + ` // revision ${i}`);
  variants.forEach(v => { checkAutoSource(v, iface); assert.notEqual(v.trim(), original.trim()); });
  assert.equal(new Set(variants.map(sha256)).size, 5);
  return { accepted_by_source_policy: 5, distinct_source_hashes: 5, behavioral_changes: 0 };
});
test('compile-partial-progress-ties', () => compareRevision({ rank: 5, checks: null, mismatches: null }, { rank: 5, checks: null, mismatches: null }));
test('true-regression-is-detected', () => { const v = compareRevision({rank: 2, checks: 100, mismatches: 20}, {rank: 2, checks: 100, mismatches: 80}); assert.equal(v, 'REGRESSION'); return v; });
test('identifier-license-poisons-environment-classification', () => {
  const parser = new VivadoDiagnostics(100, 4096);
  parser.accept("ERROR: [VRFC 10-4982] syntax error near 'license' [D:/AMD/redteam-20260923/solution.sv:2]");
  const diagnostics = attributeDiagnostics(parser.errors, [{path: 'D:/AMD/redteam-20260923/solution.sv', language: 'systemverilog', role: 'dut'}], root, 'compile', true, parser.environmentFailure);
  assert.equal(parser.environmentFailure, true); assert.equal(diagnostics[0].origin, 'tool');
  return diagnostics;
});
const receipt = JSON.parse(await readFile('D:/AMD/p156-0923-v1/compare-Prob106_always_nolatches/feedback-1.json', 'utf8'));
test('real-primary-plus-cascade-blocks-repair', () => {
  const decision = decideRepair(receipt, {calibrated: true, bound: true, attempts: 0, maxAttempts: 15, top: 'TopModule'});
  assert.equal(decision.rule, 'UNCLASSIFIED_FAILURE');
  const noCascade = structuredClone(receipt);
  noCascade.stages[0].diagnostics = noCascade.stages[0].diagnostics.filter(d => d.kind !== 'consequential');
  const withoutCascade = decideRepair(noCascade, {calibrated: true, bound: true, attempts: 0, maxAttempts: 15, top: 'TopModule'});
  assert.equal(withoutCascade.action, 'propose_repair');
  return { original: decision, withoutCascade };
});
test('malformed-tool-json-is-rejected', () => { assert.throws(() => parseAutoAction('edit_dut', '{')); return 'REJECTED'; });
test('pending-revision-exposes-only-verification', () => { const names = autoTools('full', true).map(t => t.name); assert.deepEqual(names, ['verify_rtl']); return names; });
test('duplicate-simulation-markers-are-rejected', () => { const evidence = new SimulationEvidence(true); evidence.accept('Mismatches: 0 in 10 samples'); evidence.accept('Mismatches: 0 in 10 samples'); assert.equal(evidence.passed, false); return 'REJECTED'; });
const current = {revision_id: 'r0', source, source_sha256: sha256(source)};
const entry = {task_id: 'A', sample_id: 'sample', variant_id: 'A', revision_id: 'old', source_sha256: 'a'.repeat(64), verification_key: 'sha256:' + 'b'.repeat(64), stage: 'simulation', status: 'FAIL', checks: 10, mismatches: 3};
const input = {task: {id: 'A', spec: 'A wire.', interface: iface, constraints: 'Single DUT.'}, sample_id: 'sample', variant_id: 'A', current, binding: null, feedback: null, ledger: [entry], purpose: 'repair', tool_mode: true, pending_verification: true, core_only: true, repair_control: {mode: 'normal', compacted: true, best_revision_id: 'r0', best_source_sha256: sha256(source), rejected: []}};
const limits = {window: 131072, output: 16384, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072};
const counter = {quality: 'estimated', identity: {purpose: 'mock-character-count-not-provider-tokens'}, async count(v) { return JSON.stringify(v).length; }};
const view = await buildContext(input, limits, counter, new AbortController().signal);
const parsed = JSON.parse(view.prompt);
assert.equal(parsed.history.length, 0); assert.equal(parsed.repair_ledger.length, 1);
results.push({name: 'A-ablation-core-only-still-contains-full-ledger', detail: {optional_history: parsed.history, mandatory_ledger: parsed.repair_ledger}});
await assert.rejects(buildContext({...input, task: {...input.task, id: 'B'}}, limits, counter, new AbortController().signal), /CONTEXT_BINDING_ERROR/);
results.push({name: 'cross-task-ledger-rejected', detail: 'CONTEXT_BINDING_ERROR'});
await writeFile(join(root, 'probe-results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

if (process.argv.includes('--vivado')) {
  const { Context } = await import(pathToFileURL(`${repo}/vendor/cordis/src/index.ts`).href);
  const { default: LocalSubprocess } = await import(pathToFileURL(`${repo}/packages/subprocess/subprocess-local/src/index.ts`).href);
  const { VerificationRunner } = await load('phase1/verification.ts');
  const { readDoctorConfig } = await load('phase1/doctor.ts');
  const original = JSON.parse(await readFile('D:/AMD/p156-0923-v1/compare-Prob007_wire/result.json', 'utf8'));
  const baseline = original.baseline_run;
  const snapshotName = (await readdir(baseline)).find(p => p.startsWith('snapshot-'));
  const snapshot = join(baseline, snapshotName);
  const manifest = JSON.parse(await readFile(join(snapshot, 'manifest.json'), 'utf8'));
  const assets = {};
  for (const name of Object.keys(manifest.files)) assets[name] = await readFile(join(snapshot, name), 'utf8');
  assets['rtl/solution.sv'] = source;
  await writeFile(join(root, 'attack.sv'), source);
  const { config } = await readDoctorConfig('D:/AMD/p156-0923-v1/eda-settings.yaml');
  config.outputRoot = join(root, 'eda');
  await mkdir(config.outputRoot, {recursive: true});
  config.limits.timeoutMs = 120000;
  const ctx = new Context();
  await ctx.plugin(LocalSubprocess);
  const runner = new VerificationRunner(ctx.subprocess, config, {compileMs: 30000, elaborateMs: 30000, simulationMs: 15000, totalMs: 240000, maxArtifactBytes: 67108864, artifactPollMs: 100, maxEventBytes: 1048576});
  try {
    const id = await runner.registerDataset(assets, manifest.evaluation, {experiment_id: 'redteam', task_id: 'Prob007_wire', sample_id: 0, mode: 'agent'});
    const result = await runner.verify(id, new AbortController().signal, argv => argv);
    await writeFile(join(root, 'vivado-probe-result.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify({real_vivado_result: result.status, stages: result.stages.map(s => ({stage: s.stage, status: s.status})), artifacts: result.artifacts}));
  } finally { await runner.close(); await ctx.fiber.dispose(); }
}
