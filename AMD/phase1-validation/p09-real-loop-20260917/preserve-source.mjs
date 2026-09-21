import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
const root='D:/AMD/phase1-validation/p09-real-loop-20260917', repo='D:/deepseek-harness';
const hash = b => createHash('sha256').update(b).digest('hex');
const deployed=JSON.parse((await readFile('D:/AMD/p09-real-change/deployed.json','utf8')).replace(/^\uFEFF/,''));
const paths=Object.keys(deployed).map(p=>p.startsWith('.agents/')?p:'rtl-tools/'+p);
paths.push('rtl-tools/phase1/p09/README.i18n.yaml','.agents/notes/implemented/feature/2026-09-17-p09-autonomous-repair.i18n.yaml');
const changes=[];
for(const path of paths) {
  const source=join(repo,path), destination=join(root,'source-after',path), bytes=await readFile(source);
  const deployKey=path.startsWith('rtl-tools/')?path.slice('rtl-tools/'.length):path;
  if(deployed[deployKey] && hash(bytes)!==deployed[deployKey].toLowerCase()) throw new Error('Changed deployment file: '+path);
  await mkdir(dirname(destination),{recursive:true}); await copyFile(source,destination);
  let before=null;
  if(path.startsWith('rtl-tools/')) {
    try { before=hash(await readFile(join(root,'source-before',path.slice('rtl-tools/'.length)))); }
    catch(error) { if(error.code!=='ENOENT') throw error; }
  }
  changes.push({path,before_sha256:before,after_sha256:hash(bytes),change:before?'modified':'added'});
}
await writeFile(join(root,'source-change-manifest.json'),JSON.stringify({repository:repo,unrelated_existing_changes_preserved:true,files:changes},null,2),{flag:'wx'});
console.log(JSON.stringify({scoped_files:changes.length,source_archive:'source-after'}));
