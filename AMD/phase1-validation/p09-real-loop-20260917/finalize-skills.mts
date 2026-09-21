import { readFile, readdir, mkdir, writeFile, copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
import { skillHash, selectSkills, type SkillEntry } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-context.ts'
import { readDiagnostics } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/repair-diagnostics.ts'
const root = 'D:/AMD/phase1-validation/p09-real-loop-20260917'
const skills: SkillEntry[] = JSON.parse(await readFile(join(root, 'skills/skills.draft-under-test.json'), 'utf8'))
const cases = []
for (const name of await readdir(join(root, 'experiments'))) {
  const path = join(root, 'experiments', name)
  const state = JSON.parse(await readFile(join(path, 'state.json'), 'utf8'))
  const config = JSON.parse(await readFile(join(path, 'configuration.json'), 'utf8'))
  if (config.auto?.validationSkillId) cases.push({ path, state, config })
}
if (cases.length !== 3) throw new Error('Exactly three independent validation experiments required')
const results = []
for (const skill of skills) {
  const positive = cases.find(c => c.config.auto.validationSkillId === skill.id)
  if (!positive || positive.state.outcome !== 'VERIFIED' || positive.state.attempts < 1) throw new Error('Positive validation missing: ' + skill.id)
  const initial = await readDiagnostics(positive.state.verification_runs[0], 'live_verification')
  const final = await readDiagnostics(positive.state.verification_run, 'live_verification')
  const tags = initial.receipt.stages.flatMap(s => s.diagnostics.map(d => d.kind))
  if (!skill.trigger_tags.some(tag => tags.includes(tag))) throw new Error('Positive diagnostic did not trigger')
  if (!final.record.final_verified || final.record.final_source_sha256 !== positive.state.current.source_sha256) throw new Error('Positive verification is not bound')
  const modelRun = positive.state.model_runs[0]
  const audit = JSON.parse(await readFile(join(modelRun, 'context-audit.json'), 'utf8'))
  const model = JSON.parse(await readFile(join(modelRun, 'model.json'), 'utf8'))
  if (audit.skill_validation_status !== 'draft_under_test' || !audit.selected_skills.includes(skill.id) || !model.dispatched) throw new Error('Missing actual guidance dispatch')
  const negative = cases.find(c => c !== positive && c.state.fixture === (skill.id === 'rtl.sequential_specification' ? 'syntax' : 'functional'))!
  const counter = await readDiagnostics(negative.state.verification_runs[0], 'live_verification')
  const negativeTags = counter.receipt.stages.flatMap(s => s.diagnostics.map(d => d.kind))
  const directory = join(root, 'skills/evidence', skill.id); await mkdir(directory, { recursive: true })
  const evidence = {
    skill_id: skill.id, positive_experiment: positive.state.experiment_id, negative_experiment: negative.state.experiment_id,
    applicable_tags: tags, nonapplicable_tags: negativeTags,
    positive_initial: initial.receipt, positive_final: final.receipt, negative_initial: counter.receipt,
    current_source_sha256: positive.state.current.source_sha256, verification_key: final.record.verification_key,
    model_guidance_supplied: true, model_candidate_eda_pass: true, causal_benefit_proven: false,
    validation_scope: 'diagnostic applicability and real model repair on independent counter fixtures; not strategy efficacy',
    formal_five_task_answers_used: false,
  }
  const artifacts: [string, string][] = [
    ['model-context-audit.json', join(modelRun, 'context-audit.json')],
    ['model-request.json', join(modelRun, 'prompt-final.txt')],
    ['model-response.json', join(modelRun, 'model.json')],
    ['positive-result.json', join(positive.state.verification_run, 'result.json')],
  ]
  const records = []
  for (const [name, path] of artifacts) {
    await copyFile(path, join(directory, name))
    records.push({ path: 'evidence/' + skill.id + '/' + name, sha256: sha256(await readFile(path)) })
  }
  const bytes = JSON.stringify(evidence, null, 2)
  await writeFile(join(directory, 'validation.json'), bytes, { flag: 'wx' })
  records.push({ path: 'evidence/' + skill.id + '/validation.json', sha256: sha256(bytes) })
  skill.status = 'validated'; skill.version = '0.1.1'
  skill.source_cases.push(positive.state.experiment_id, negative.state.experiment_id)
  skill.validation_records = records; skill.content_hash = skillHash(skill)
  if (selectSkills([skill], tags).length !== 1 || selectSkills([skill], negativeTags).length !== 0) throw new Error('Applicability check failed')
  results.push({ id: skill.id, status: 'validated', positive: positive.state.experiment_id, negative: negative.state.experiment_id, rule_hash: skill.content_hash, causal_benefit_proven: false })
}
const frozen = JSON.stringify(skills, null, 2)
await writeFile(join(root, 'skills/skills.validated.json'), frozen, { flag: 'wx' })
await writeFile(join(root, 'skill-validation.json'), JSON.stringify(results, null, 2), { flag: 'wx' })
await writeFile(join(root, 'skill-validation.md'), '# P09 Skill Validation\n\n三条规则分别使用独立于正式五题的 counter 夹具。正例均包含真实模型指导派发、模型候选和四阶段 EDA PASS；反例检验诊断标签不适用时不会选中规则。该验证不证明规则带来了因果收益，也不覆盖全部语义适用范围。\n\n| Skill | Status | Positive | Negative |\n| --- | --- | --- | --- |\n' + results.map(r => `| ${r.id} | ${r.status} | ${r.positive} | ${r.negative} |`).join('\n') + '\n', { flag: 'wx' })
const configPath = join(root, 'configs/p09-C.json')
const config = JSON.parse(await readFile(configPath, 'utf8'))
config.skillsFile = root + '/skills/skills.validated.json'; config.skillsSha256 = sha256(frozen)
await writeFile(configPath, JSON.stringify(config, null, 2))
console.log(JSON.stringify(results))
