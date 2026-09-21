import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const root='D:/AMD/phase1-validation/p09-real-loop-20260917', file='D:/deepseek-harness/rtl-tools/src/phase1/verification.ts';
const hash=b=>createHash('sha256').update(b).digest('hex');
const freeze=JSON.parse(await readFile(join(root,'ablation-freeze.json'),'utf8'));
const sealed=JSON.parse(await readFile(join(root,'campaign-end-audit.json'),'utf8'));
const before=Object.entries(freeze.files).find(([p])=>p.replaceAll('\\','/')===file)[1];
const bytes=await readFile(file), after=hash(bytes);
if(before===after||!sealed.all_frozen_file_hashes_match) throw new Error('Expected a separate post-campaign fix');
const reproduction=JSON.parse(await readFile(join(root,'scan-race-before.json'),'utf8'));
const regression=JSON.parse(await readFile(join(root,'regression-postfix.json'),'utf8'));
if(reproduction.numFailedTests!==1||regression.numFailedTests!==0) throw new Error('Missing red/green evidence');
await mkdir(join(root,'source-postfix'));
await copyFile(file,join(root,'source-postfix/verification.ts'));
await copyFile('D:/deepseek-harness/rtl-tools/tests/verification-transient.spec.ts',join(root,'source-postfix/verification-transient.spec.ts'));
const documentation=[];
for(const extension of ['md','zh.md','i18n.yaml']) {
  const path='D:/deepseek-harness/.agents/notes/implemented/feature/2026-09-17-p09-autonomous-repair.'+extension;
  const destination='source-postfix/2026-09-17-p09-autonomous-repair.'+extension;
  await copyFile(path,join(root,destination)); documentation.push({source:path,artifact:destination,sha256:hash(await readFile(path))});
}
const value={file,before_sha256:before,after_sha256:after,recorded_at:new Date().toISOString(),campaign_sealed_at:sealed.sealed_at,
  formal_results_use:'frozen pre-fix implementation; no formal cell rerun',main_experiments_rerun:false,model_requests_added:0,
  defect:'live quota scan raced with Vivado deleting a temporary child directory',fix:'ignore ENOENT only for a vanished child directory; keep root, permission, trusted-asset and terminal-manifest checks strict',
  reproduction:{artifact:'scan-race-before.json',passed:reproduction.numPassedTests,failed:reproduction.numFailedTests},
  regression:{artifact:'regression-postfix.json',passed:regression.numPassedTests,failed:regression.numFailedTests,skipped:regression.numPendingTests},
  documentation,real_model_validation_of_postfix:false};
await writeFile(join(root,'post-campaign-fix.json'),JSON.stringify(value,null,2),{flag:'wx'});
console.log(JSON.stringify(value));
