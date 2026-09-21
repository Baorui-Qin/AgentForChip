import { readFile, writeFile, readdir, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
const runtime = 'D:/AMD/p09-runtime';
const output = 'D:/AMD/phase1-validation/p09-real-loop-20260917';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const files = {};
async function collect(path) {
  for (const entry of await readdir(join(runtime, path), { withFileTypes: true })) {
    const file = path + '/' + entry.name;
    if (entry.isDirectory()) await collect(file);
    else files[file] = hash(await readFile(join(runtime, file)));
  }
}
for (const path of ['deepseek-recipe/deepseek-recipe/src','deepseek-recipe/deepseek-recipe-core/src','deepseek-recipe/deepseek-recipe-encoding/src']) await collect(path);
await mkdir(join(runtime,'bin'),{recursive:true});
await copyFile(join(runtime,'counter/target/release/p09-official-counter.exe'),join(runtime,'bin/p09-official-counter.exe'));
const executable = 'bin/p09-official-counter.exe';
const tokenizer = 'deepseek-recipe/static/tokenizers/v41/tokenizer.json';
for (const path of [executable, tokenizer, 'counter/Cargo.toml','counter/Cargo.lock','counter/src/main.rs','deepseek-recipe/Cargo.lock','deepseek-recipe/rust-toolchain.toml']) files[path] = hash(await readFile(join(runtime, path)));
const revision = execFileSync('git', ['rev-parse','HEAD'], { cwd: join(runtime,'deepseek-recipe'), encoding:'utf8' }).trim();
const env = { ...process.env, CARGO_HOME: join(runtime,'cargo'), RUSTUP_HOME: join(runtime,'rustup') };
const compiler = execFileSync(join(runtime,'cargo/bin/rustc.exe'), ['--version'], { env, encoding:'utf8' }).trim();
const manifest = { revision, compiler, executable, tokenizer, files, official_python_binding_installed: false, cloud_equivalence: 'unconfirmed' };
const manifestBytes = JSON.stringify(manifest,null,2);
await mkdir(join(output,'runtime-manifests'),{recursive:true});
try { const previous=await readFile(join(runtime,'manifest.json')); await writeFile(join(output,'runtime-manifests',hash(previous)+'.json'),previous); } catch(error) { if(error.code!=='ENOENT') throw error; }
await writeFile(join(runtime,'manifest.json'),manifestBytes);
const manifestHash = hash(manifestBytes);
await writeFile(join(output,'runtime-manifests',manifestHash+'.json'),manifestBytes);
const smokeRoot = join(output,'tokenizer-smoke'); await mkdir(smokeRoot,{recursive:true});
const cases = { english:'Explain a rising edge.', chinese:'检测上升沿，同步高电平复位。', systemverilog:'module x(input clk, output reg q); always @(posedge clk) q <= ~q; endmodule', json:JSON.stringify({stage:'simulation',checks:128,mismatches:53}), repair:'Repair the current DUT according to the public specification. Return a complete module.' };
const tools = [{type:'function',function:{name:'read_current_rtl',description:'Read current RTL',parameters:{type:'object',properties:{},additionalProperties:false}}}];
const results=[];
for (const [name,content] of Object.entries(cases)) {
  const wire={model:'deepseek-flash',messages:[{role:'system',content:'Only use registered tools.'},{role:'user',content}],thinking:{type:'enabled'},reasoning_effort:'high',max_tokens:2048};
  const path=join(smokeRoot,name+'.json'); await writeFile(path,JSON.stringify(wire));
  const counted=JSON.parse(execFileSync(join(runtime,executable),[path,join(runtime,tokenizer)],{encoding:'utf8'}));
  results.push({name,...counted,request_sha256:hash(JSON.stringify(wire))});
}
const wire={model:'deepseek-flash',tools,thinking:{type:'enabled'},reasoning_effort:'high',messages:[{role:'user',content:'Read the current revision.'},{role:'assistant',content:'',reasoning_content:'Read current source before editing.',tool_calls:[{id:'smoke-call',type:'function',function:{name:'read_current_rtl',arguments:'{}'}}]},{role:'tool',tool_call_id:'smoke-call',content:JSON.stringify({revision_id:'r0',source:cases.systemverilog})}]};
const path=join(smokeRoot,'tool-roundtrip.json'); await writeFile(path,JSON.stringify(wire));
results.push({name:'tool_roundtrip',...JSON.parse(execFileSync(join(runtime,executable),[path,join(runtime,tokenizer)],{encoding:'utf8'})),request_sha256:hash(JSON.stringify(wire))});
await writeFile(join(output,'tokenizer-provenance.json'),JSON.stringify({manifest_sha256:manifestHash,manifest,official_rust_components_installed:true,real_exact_count_verified:true,provider_equivalence_verified:false,results},null,2));
await writeFile(join(output,'profile-provenance.json'),JSON.stringify({dsh_home:'D:/AMD/phase1-validation/p09-20260917-development/dsh-home',profile:'rtl-p09',reuse:'read-only base profile plus new explicit overlays'},null,2));
await mkdir(join(output,'configs'),{recursive:true});
const settings=await readFile('D:/AMD/phase1-validation/p09-20260917-development/p09-v2-settings.yaml','utf8');
await writeFile(join(output,'settings.yaml'),settings.replace(/outputRoot: .*/,`outputRoot: '${output}/experiments'`));
await mkdir(join(output,'experiments'),{recursive:true});
for(const variant of ['A','B','C']) {
  const p09=JSON.parse(await readFile('D:/deepseek-harness/rtl-tools/phase1/p09/config.example.json','utf8'));
  p09.variant=variant;
  await writeFile(join(output,'configs',`p09-${variant}.json`),JSON.stringify(p09,null,2));
}
for(const [name,registry,bucket,sampleId,variant] of [['smoke','minimal','preflight','smoke-rising-edge-v3-pinned-executable','A'],['synthesis','minimal','preflight','synthesis-p09','A'],['multi','minimal','preflight','controlled-multi','A'],['b-pilot','full','preflight','b-pilot','B'],['ablation-A','full','ablation','main-1','A'],['ablation-B','full','ablation','main-1','B'],['ablation-C','full','ablation','main-1','C']]) {
  const auto={registry,campaignRoot:output,bucket,sampleId,runtimeRoot:runtime,runtimeManifestSha256:manifestHash,maxToolSteps:15};
  await writeFile(join(output,'configs',`auto-${name}.json`),JSON.stringify(auto,null,2));
  const patch=await readFile('D:/AMD/phase1-validation/p09-20260917-development/p09-v2-calibration.patch.yml','utf8');
  await writeFile(join(output,'configs',`${name}.patch.yml`),patch.replaceAll('D:/AMD/phase1-validation/p09-20260917-development/p09-v2',output+'/experiments')
    .replace(/    configFile: .*/,`    configFile: '${output}/settings.yaml'`)
    .replace(/    p09ConfigFile: .*/,`    p09ConfigFile: '${output}/configs/p09-${variant}.json'\n    autoConfigFile: '${output}/configs/auto-${name}.json'\n    allowUnisolatedAutomatic: true`)
    + '\n- id: llm-deepseek\n  config:\n    retryPolicy:\n      mode: normal\n      maxRetries: 0\n');
}
console.log(JSON.stringify({runtime_manifest_sha256:manifestHash,smoke_results:results}));
