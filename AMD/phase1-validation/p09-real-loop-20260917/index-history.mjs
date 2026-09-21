import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root='D:/AMD/phase1-validation/p09-real-loop-20260917';
const prior='D:/AMD/phase1-validation/p09-20260917-development';
const p07='D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb';
const records=[];
for(const path of [...['p09-acceptance.json','p09-acceptance.md','source-freeze.json','components.json','context-final.json','real-calibration-index.json'].map(name=>prior+'/'+name),p07+'/state.json',p07+'/repair-result.json']) {
  const bytes=await readFile(path);
  records.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),operation:'read_only_index',upgraded_in_place:false});
}
await writeFile(root+'/historical-record-index.json',JSON.stringify({records,old_records_retained_at_original_paths:true,old_results_counted_as_new_successes:false},null,2),{flag:'wx'});
console.log('Indexed historical reports without modifying them.');
