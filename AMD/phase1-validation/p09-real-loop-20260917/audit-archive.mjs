import { readdir, lstat, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const root = 'D:/AMD/phase1-validation/p09-real-loop-20260917';
const hash = b => createHash('sha256').update(b).digest('hex');
const files = [];
async function visit(relative = '') {
  for (const name of (await readdir(join(root,relative))).sort()) {
    const path = relative ? relative+'/'+name : name;
    if (path === 'campaign-artifact-manifest.json') continue;
    const stat = await lstat(join(root,path));
    if (stat.isSymbolicLink()) throw new Error('Linked archive asset: '+path);
    if (stat.isDirectory()) await visit(path);
    else if (stat.isFile()) { const bytes=await readFile(join(root,path)); files.push({path,bytes:bytes.length,sha256:hash(bytes)}); }
  }
}
await visit();
for (const entry of files) { const bytes=await readFile(join(root,entry.path)); if(bytes.length!==entry.bytes||hash(bytes)!==entry.sha256) throw new Error('Changed archive asset: '+entry.path); }
await writeFile(join(root,'campaign-artifact-manifest.json'),JSON.stringify({schema_version:'1.7',excluded:['campaign-artifact-manifest.json'],second_read_verified:true,files},null,2),{flag:'wx'});
console.log(JSON.stringify({files:files.length,bytes:files.reduce((n,f)=>n+f.bytes,0),second_read_verified:true}));
