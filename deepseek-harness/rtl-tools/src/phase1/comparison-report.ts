/** Comparison is reconstructed from evidence, never from model verdicts. @module rtl-tools/phase1/comparison-report */
import { readFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { checkedFile } from './snapshots.ts'
import { atomicJson } from './recorder.ts'
import { variants } from './protocol.ts'
import { loadExperiment, type ExperimentSettings } from './experiment.ts'

async function optional(dir: string, file: string): Promise<any> {
  try { return JSON.parse(await readFile(await checkedFile(await realpath(dir), file), 'utf8')) }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error }
}
/** Generate a read-only factual comparison; failures and incomplete routes stay visible. @param config - host paths. @param id - experiment. @returns report. */
export async function comparisonReport(config: ExperimentSettings, id: string) {
  const experiment = await loadExperiment(config, id)
  const preflight = await optional(experiment.directory, 'preflight.json')
  if (preflight && preflight.evaluation_sha256 !== experiment.manifest.evaluation_sha256) throw new Error('Preflight evidence belongs to different scoring settings')
  const rows = []
  for (const variant of variants) {
    const dir = join(experiment.directory, variant), generation = await optional(dir, 'generation.json'), verification = await optional(dir, 'verification.json'), feedback = await optional(dir, 'feedback.json'), exported = await optional(dir, 'export.json'), approval = await optional(dir, 'approval.json')
    const generationClaim = await optional(dir, 'generation-claimed.json'), feedbackClaim = await optional(dir, 'feedback-claimed.json')
    const synth = verification?.stages?.find((stage: any) => stage.stage === 'synthesis'), simulation = verification?.stages?.find((stage: any) => stage.stage === 'simulation')
    rows.push({ variant_id: variant, generation: generation?.status ?? (generationClaim ? 'INCOMPLETE' : 'NOT_RUN'), extraction_error: generation?.error ?? null,
      approval: approval ? approval.approved ? 'APPROVED' : 'REJECTED' : 'PENDING', verification: verification?.status ?? 'NOT_RUN',
      stages: Object.fromEntries(['compile', 'elaborate', 'simulation', 'synthesis'].map(stage => [stage, verification?.stages?.find((s: any) => s.stage === stage)?.status ?? 'NOT_RUN'])),
      checks: simulation?.evidence?.checks_executed ?? null, mismatches: simulation?.evidence?.mismatch_count ?? null,
      resources: synth?.synthesis?.resources ?? null, timing: synth?.synthesis?.timing ?? null, warnings: synth?.warnings ?? [],
      revision_id: generation?.candidate?.candidate?.revision_id ?? null, source_sha256: generation?.candidate?.candidate?.source_sha256 ?? null,
      verification_key: verification?.stages?.[0]?.verification_key ?? null, exported_sha256: exported?.source_sha256 ?? null, final_verified: exported?.final_verified ?? false,
      interpretation: variant === 'baseline' ? 'NOT_APPLICABLE' : feedback ? feedback.value.error ? 'FAILED' : 'COMPLETE' : feedbackClaim ? 'INCOMPLETE' : 'NOT_RUN',
      calls: { generation: generationClaim ? 1 : 0, interpretation: feedbackClaim ? 1 : 0, retries: 0 },
      tokens: { generation: generation?.model?.value?.usage ?? null, interpretation: feedback?.value?.usage ?? null },
      wall_ms: { generation: generation?.model?.value?.timing?.request_wall_ms ?? null, evaluation: verification?.wall_ms ?? null, interpretation: feedback?.value?.timing?.request_wall_ms ?? null, review_wait: verification?.review_wait_ms ?? null },
      cost: null, ttft_ms: null, evidence: { generation: generation?.model?.run ?? null, verification: verification?.artifacts ?? null, interpretation: feedback?.run ?? null } })
  }
  const result = { schema_version: '1.2', experiment_id: id, task_id: experiment.manifest.task_id, comparison_kind: 'single-task development observation, not statistical gain',
    baseline_protocol: 'VerilogEval zero-shot; not contest prompt-only baseline', evaluation_preflight: preflight,
    execution_blocked: preflight?.status === 'FAIL' ? 'Original evaluator preflight failed; no generation is authorized' : null,
    full_os_isolation_verified: false, repairs: 0, rows }
  await atomicJson(experiment.directory, 'comparison.json', result)
  const csvCell = (value: unknown) => '"' + (value === null || value === undefined ? 'null' : typeof value === 'object' ? JSON.stringify(value) : String(value)).replaceAll('"', '""') + '"'
  const csv = ['variant,generation,approval,compile,elaborate,simulation,synthesis,interpretation,final_verified,generation_calls,interpretation_calls,source_sha256,verification_key,checks,mismatches,lut,ff,bram,dsp,wns_ns,generation_usage,interpretation_usage,generation_ms,evaluation_ms,interpretation_ms,review_wait_ms,cost,ttft_ms',
    ...rows.map(r => [r.variant_id, r.generation, r.approval, ...Object.values(r.stages), r.interpretation, r.final_verified, r.calls.generation, r.calls.interpretation,
      r.source_sha256, r.verification_key, r.checks, r.mismatches, r.resources?.lut, r.resources?.ff, r.resources?.bram, r.resources?.dsp, r.timing?.wns,
      r.tokens.generation, r.tokens.interpretation, r.wall_ms.generation, r.wall_ms.evaluation, r.wall_ms.interpretation, r.wall_ms.review_wait, r.cost, r.ttft_ms].map(csvCell).join(','))].join('\n') + '\n'
  const markdown = ['# Three-Route RTL Comparison', '', 'Development observation only. No automatic repair, no statistical gain claim, no full OS isolation.', '',
    `Evaluator preflight: ${preflight?.status ?? 'not attached'}. ${result.execution_blocked ?? 'See evaluator evidence before generation.'}`, '',
    '| Route | Generation | Compile | Elaborate | Simulation | Synthesis | Interpretation | Verified export |', '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map(r => `| ${r.variant_id} | ${r.generation} | ${Object.values(r.stages).join(' | ')} | ${r.interpretation} | ${r.final_verified} |`), '',
    'Baseline uses the frozen VerilogEval zero-shot wrapper without optional rules or examples. It has no Agent/EDA services; its external scoring is charged separately.',
    'Agent-Base uses the same initial request. Agent-Domain adds only the frozen five-rule system block. Neither interpretation can change RTL or the evaluator verdict.',
    'Differences in one independently generated sample can be sampling variation. Prompt changes and workflow changes are not proof of a correctness gain.',
    'This uses DeepSeek official streaming API and Windows Vivado, not the original paper environment. top_p is not sent; its effective value is unknown. Price and TTFT are unavailable, not zero.',
    'The testbench retains its 10 ps simulation clock; the independent synthesis XDC is 5 ns. Positive post-synthesis WNS does not establish all timing constraints or post-route closure.', '',
    '## Cost and Metrics', '',
    'Call counts are project attempts, not confirmed HTTP delivery. Null means unavailable. Review wait is separate from execution.', '',
    ...rows.map(r => `- ${r.variant_id}: calls ${JSON.stringify(r.calls)}; tokens ${JSON.stringify(r.tokens)}; wall ms ${JSON.stringify(r.wall_ms)}; resources ${JSON.stringify(r.resources)}; timing ${JSON.stringify(r.timing)}; cost null; TTFT null.`), '',
    '## Evidence', '', ...rows.map(r => `- ${r.variant_id}: source ${r.source_sha256 ?? 'unavailable'}; checks ${r.checks ?? 'unavailable'}; mismatches ${r.mismatches ?? 'unavailable'}; warnings ${JSON.stringify(r.warnings)}; paths ${JSON.stringify(r.evidence)}`), '',
    '## Sources', '', '[VerilogEval v2](https://arxiv.org/html/2408.11053v2): generation protocol and separate scoring. [AutoChip](https://arxiv.org/html/2411.11856v3): feedback and cost accounting, not its search loop. [RTLFixer](https://arxiv.org/html/2311.16543v3): error categories, not its rule-based fixer.', ''].join('\n')
  // Reports are refreshable views. Historical route records remain exclusive and immutable.
  const { writeFile } = await import('node:fs/promises')
  await writeFile(join(experiment.directory, 'comparison.csv'), csv)
  await writeFile(join(experiment.directory, 'comparison.md'), markdown)
  return result
}
