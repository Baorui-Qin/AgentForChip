import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const root = 'D:/AMD/phase1-validation/p09-real-loop-20260917';
const hash = x => createHash('sha256').update(x).digest('hex');
const source = 'D:/deepseek-harness/rtl-tools/phase1/p09/skills.draft.json';
const bytes = await readFile(source);
const skills = JSON.parse(bytes);
for (const skill of skills) {
  skill.source_cases = ['frozen_generic_draft:' + hash(bytes)];
  const { content_hash, ...body } = skill;
  skill.content_hash = hash(JSON.stringify(body));
}
await mkdir(join(root, 'skills'), { recursive: true });
const draft = JSON.stringify(skills, null, 2);
await writeFile(join(root, 'skills', 'skills.draft-under-test.json'), draft, { flag: 'wx' });
await writeFile(join(root, 'skills', 'draft-source.json'), JSON.stringify({ source, sha256: hash(bytes), status: 'draft', formal_task_sources_used: false }, null, 2), { flag: 'wx' });
const p09 = JSON.parse(await readFile(join(root, 'configs/p09-C.json')));
p09.skillsFile = root + '/skills/skills.draft-under-test.json'; p09.skillsSha256 = hash(draft);
await writeFile(join(root, 'configs/p09-skill-validation.json'), JSON.stringify(p09, null, 2), { flag: 'wx' });
for (const [name, skill] of [['syntax', skills[0]], ['sequential', skills[1]], ['dependency', skills[2]]]) {
  const auto = JSON.parse(await readFile(join(root, 'configs/auto-b-pilot.json')));
  auto.sampleId = 'skill-validation-' + name; auto.validationSkillId = skill.id;
  await writeFile(join(root, 'configs/auto-skill-' + name + '.json'), JSON.stringify(auto, null, 2), { flag: 'wx' });
  const patch = (await readFile(join(root, 'configs/b-pilot.patch.yml'), 'utf8'))
    .replace('p09-B.json', 'p09-skill-validation.json').replace('auto-b-pilot.json', 'auto-skill-' + name + '.json');
  await writeFile(join(root, 'configs/skill-' + name + '.patch.yml'), patch, { flag: 'wx' });
}
console.log('Three independently scoped draft validation configurations prepared; none promoted.');
