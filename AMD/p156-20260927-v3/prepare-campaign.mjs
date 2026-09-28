import assert from 'node:assert/strict';
import { readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join } from 'node:path';
const repo = 'D:/deepseek-harness', prior = 'D:/AMD/p156-20260927-v2';
const root = 'D:/AMD/p156-20260927-v3', cal = 'D:/AMD/p156-20260927-settled-cal';
const hash = b => createHash('sha256').update(b).digest('hex');
const json = async p => JSON.parse(await readFile(p, 'utf8'));
const put = (p, v) => writeFile(p, JSON.stringify(v, null, 2) + '\n');
const run = (command, args) => execFileSync(command, args, { cwd: repo, encoding: 'utf8', windowsHide: true });
const yaml = createRequire(repo + '/package.json')('js-yaml');
assert.equal(run('git', ['status', '--porcelain']).trim(), '');
const previous = await json(join(prior, 'campaign-freeze.json'));
for (const [path, sha] of Object.entries(previous.files)) assert.equal(hash(await readFile(path)), sha, path);
const audit = await json(join(prior, 'report/evidence-audit.json'));
assert.equal(audit.integrity_audit, 'PASS'); assert.equal(audit.state, 'INFRA_PAUSED');
assert.equal(audit.summary.physical_dispatches, 13); assert.equal(audit.summary.compared, 0);
const claims = (await readdir(join(prior, 'dispatches'))).filter(n => n.endsWith('.json'));
assert.equal(claims.length, 13);
const cap = 20124 - claims.length;
process.stdout.write(run('pwsh', ['-NoProfile', '-File', join(repo, 'rtl-tools/phase1/p10/prepare-stability.ps1'), '-AllTasks', '-CampaignRoot', root,
  '-PreflightRoot', cal, '-FullManifestSha256', hash(await readFile(join(cal, 'manifest-156.json'))), '-MaxDispatches', String(cap), '-SettingsFile', join(prior, 'eda-settings.yaml')]));
for (const name of ['archive-inputs.ps1', 'final-integrity.mjs', 'known-spec-conflicts.json']) await copyFile(join(prior, name), join(root, name), 1);
for (const [source, target] of [
  ['D:/AMD/p156-20260927-v3-analyze.mjs', 'analyze.mjs'], ['D:/AMD/p156-20260927-v3-run-power.ps1', 'run-power.ps1'],
  ['D:/AMD/prepare-p156-20260927-v3.mjs', 'prepare-campaign.mjs'], [join(prior, 'authorization-confirmation.json'), 'authorization-confirmation.json'],
]) await copyFile(source, join(root, target), 1);
const patchPath = join(root, 'model.patch.yml'), patch = yaml.load(await readFile(patchPath, 'utf8'));
patch.find(p => p.id === 'p10-model').config.simulationMs = 120000;
await writeFile(patchPath, yaml.dump(patch, { noRefs: true, lineWidth: -1 }));
await put(join(root, 'restart-decision.json'), { prior_campaign: prior, reason: 'Three consecutive zero-output ECONNRESET responses exhausted the frozen transport window.',
  prior_dispatches: claims.length, combined_authorized_cap: 20124, this_campaign_cap: cap, candidates_reused: false, all_tasks_regenerated: true,
  network_change: 'NO_PROXY gains only api.deepseek.com in the campaign process; no system setting or TLS validation changes.',
  evidence: { proxied_head: '3/5 ECONNRESET; 2/5 HTTP 401', direct_head: '5/5 HTTP 401', model_request_stability_not_proven_by_head: true },
  model_settings_unchanged: true, evaluator_unchanged: true, budgets_reset: false });
const freezePath = join(root, 'campaign-freeze.json'), freeze = await json(freezePath);
Object.assign(freeze.protocol, { rtl_evaluator: 'p10-settled-rtl-1', simulation_ms: 120000, synthesis_timeout_ms: 600000,
  known_spec_conflicts: previous.protocol.known_spec_conflicts, prior_campaign_dispatches: 13, combined_max_dispatches: 20124,
  network_direct_host: 'api.deepseek.com' });
for (const name of ['model.patch.yml', 'analyze.mjs', 'final-integrity.mjs', 'prepare-campaign.mjs', 'run-power.ps1', 'archive-inputs.ps1', 'authorization-confirmation.json', 'known-spec-conflicts.json', 'restart-decision.json']) {
  const path = join(root, name); freeze.files[path] = hash(await readFile(path));
}
for (const path of [join(cal, 'results.json'), join(cal, 'freeze.json'), join(cal, 'calibration-evidence.json'),
  join(prior, 'report/evidence-audit.json'), join(prior, 'campaign-freeze.json'), join(prior, 'report/network-proxy-probe.log')]) freeze.files[path] = hash(await readFile(path));
freeze.files = Object.fromEntries(Object.entries(freeze.files).map(([p, sha]) => [p.replaceAll('\\', '/'), sha]));
await put(freezePath, freeze);
for (const [p, sha] of Object.entries(freeze.files)) assert.equal(hash(await readFile(p)), sha, p);
process.stdout.write(run('pwsh', ['-NoProfile', '-File', join(root, 'archive-inputs.ps1'), '-Root', root, '-FreezeFile', freezePath]));
await put(join(root, 'configuration-check.json'), { status: 'PASS', git_commit: freeze.git_commit, frozen_files: Object.keys(freeze.files).length,
  freeze_sha256: hash(await readFile(freezePath)), tasks: 156, calibration_ready: 156, prior_dispatches: 13, this_campaign_cap: cap, combined_cap: 20124 });
console.log('Prepared new independent campaign: ' + root);
