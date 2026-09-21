import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const root='D:/AMD/phase1-validation/p09-real-loop-20260917';
const hash = b => createHash('sha256').update(b).digest('hex');
const freeze=JSON.parse(await readFile(join(root,'ablation-freeze.json'),'utf8'));
for(const [path, expected] of Object.entries(freeze.files)) if(hash(await readFile(path))!==expected) throw new Error('Campaign source changed: '+path);
const states=[];
for(const name of await readdir(join(root,'experiments'))) {
  const path=join(root,'experiments',name), bytes=await readFile(join(path,'state.json'));
  const state=JSON.parse(bytes), config=JSON.parse(await readFile(join(path,'configuration.json')));
  if(state.phase!=='TERMINAL') throw new Error('Experiment still running');
  if(config.auto?.bucket==='ablation') states.push({experiment:state.experiment_id,task:state.fixture,variant:state.p09.variant_id,status:state.outcome,state_sha256:hash(bytes)});
}
if(states.length!==15) throw new Error('Expected exactly 15 formal cells');
await writeFile(join(root,'campaign-end-audit.json'),JSON.stringify({sealed_at:new Date().toISOString(),all_frozen_file_hashes_match:true,formal_cells:states},null,2),{flag:'wx'});
console.log('All 15 terminal cells sealed against the unchanged frozen implementation.');
