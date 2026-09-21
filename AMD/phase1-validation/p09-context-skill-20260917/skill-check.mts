import { readFile, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { loadP09Skills, retrieveP09Skills } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-proposal.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
const root = dirname(fileURLToPath(import.meta.url))
const read = async (p: string) => JSON.parse(await readFile(p, 'utf8'))
const settings = await read(root + '/configs/p09-C.json')
const entries = await loadP09Skills(settings), results = []
for (const skill of entries) {
  const validation = await read(join(root, 'skills/evidence', skill.id, 'validation.json'))
  const positive = await retrieveP09Skills(settings, validation.positive_initial)
  const negative = await retrieveP09Skills(settings, validation.negative_initial)
  assert.ok(positive.skills.some(s => s.id === skill.id))
  assert.ok(!negative.skills.some(s => s.id === skill.id))
  assert.ok(validation.positive_final.stages.every(s => s.status === 'PASS' && s.complete && s.process_clean))
  for (const receipt of [validation.positive_initial, validation.positive_final, validation.negative_initial]) {
    assert.equal(sha256(await readFile(join(receipt.original_run, 'result.json'))), receipt.result_sha256)
    for (const input of receipt.inputs) if (input.sha256) assert.equal(sha256(await readFile(join(receipt.original_run, input.path))), input.sha256)
  }
  results.push({ skill: skill.id, status: skill.status, content_hash: skill.content_hash,
    evidence_files_checked: skill.validation_records.length, positive_trigger: true, negative_not_triggered: true,
    archived_real_eda_final_pass: true, eda_rerun_in_this_check: false, validation: join(root, 'skills/evidence', skill.id, 'validation.json'),
    answer_source_in_rule: false, causal_benefit_proven: false })
}
const missing = await read('D:/AMD/phase1-validation/p09-output-budget-20260917/configs/p09-C-2048.json')
let missingCode = ''
try { await loadP09Skills(missing) } catch (error) { missingCode = (error as Error).message }
assert.equal(missingCode, 'SKILL_EVIDENCE_INVALID')
await writeFile(root + '/skill-content-audit.json', JSON.stringify({ results, missing_evidence_fixture_error: missingCode,
  old_selector_change_history: 'UNVERIFIABLE_FROM_RETAINED_EVIDENCE', old_selector_report: 'D:/AMD/phase1-validation/p09-real-loop-20260917/failure-analysis-skill-selector.md',
  limitation: 'Rules are diagnostic guidance, not executable repair procedures; positive/negative rechecks use preserved real EDA evidence, not fresh EDA runs.' }, null, 2), { flag: 'wx' })
console.log(JSON.stringify({ skills: results.length, positive_negative_pairs_passed: results.length, missingCode }))
