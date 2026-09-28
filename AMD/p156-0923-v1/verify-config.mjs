import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('D:/deepseek-harness/package.json');
const yaml = require('js-yaml');
const root = process.argv[2];
const json = async name => JSON.parse(await readFile(join(root, name), 'utf8'));
const patch = yaml.load(await readFile(join(root, 'model.patch.yml'), 'utf8')).find(entry => entry.id === 'p10-model').config;
const eda = yaml.load(await readFile(patch.settingsFile, 'utf8'));
const auto = await json('auto.json'), stability = await json('stability.json'), freeze = await json('campaign-freeze.json');
assert.equal(patch.selectedTaskCount, 156); assert.equal(patch.maxRepairRounds, 15); assert.equal(patch.maxAgentRequests, 120);
assert.equal(patch.maxGenerationResumes, 0); assert.equal(stability.maxGenerationResumes, 0);
assert.equal(patch.maxCandidateRecoveryAttempts, 2); assert.equal(patch.maxTransportRetries, 2);
assert.equal(patch.campaignMaxDispatches, 20124); assert.equal(auto.campaignDispatchLimit, 20124); assert.equal(auto.maxDispatches, 20124);
assert.equal(auto.maxToolSteps, 60); assert.equal(patch.totalMs, 900000); assert.equal(eda.limits.timeoutMs, 600000);
assert.equal(patch.activeMs, 28800000); assert.equal(patch.timeoutMs, 120000);
assert.equal(freeze.protocol.synthesis_timeout_ms, 600000);
console.log(JSON.stringify({ configuration_check: 'PASS', tasks: 156, synthesis_ms: eda.limits.timeoutMs, verification_total_ms: patch.totalMs,
  rtl_edits: patch.maxRepairRounds, repair_requests: patch.maxAgentRequests, tools: auto.maxToolSteps, max_dispatches: auto.maxDispatches,
  candidate_corrections: patch.maxCandidateRecoveryAttempts, generation_resumes: patch.maxGenerationResumes }, null, 2));
