/** Synthesis schema and compact model/user presentation. @module rtl-tools/synthesis-output */
import type { ValueSchemaSpec } from '@deepseek-ai/dsh-tools'
import type { SynthesisResult } from './synthesis.ts'

const numberOrNull = { oneOf: [{ type: 'number' }, { type: 'null' }], required: true } as const
const stringOrNull = { oneOf: [{ type: 'string' }, { type: 'null' }], required: true } as const
const boolean = { type: 'boolean', required: true } as const
const string = { type: 'string', required: true } as const
const integer = { type: 'integer', required: true } as const
const stage = { type: 'string', enum: ['synthesis', 'report'], required: true } as const
const diagnostics = {
  type: 'array', required: true,
  items: {
    type: 'object', additionalProperties: false,
    properties: {
      severity: { type: 'string', enum: ['ERROR', 'WARNING', 'CRITICAL WARNING'], required: true },
      code: { type: 'string' }, file: { type: 'string' }, line: { type: 'integer' },
      type: string, message: string,
    },
  },
} as const

/** Validated canonical facts retained in the tool result, not raw stdout. */
export const synthesisResultSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    success: boolean,
    synthesizable: { oneOf: [{ type: 'boolean' }, { type: 'null' }], required: true },
    stage, backend: { type: 'string', const: 'vivado', required: true },
    resources: { type: 'object', required: true, additionalProperties: false,
      properties: { lut: numberOrNull, ff: numberOrNull, bram: numberOrNull, dsp: numberOrNull } },
    timing: { type: 'object', required: true, additionalProperties: false, properties: {
      wns: numberOrNull, unit: { type: 'string', const: 'ns', required: true },
      stage: { type: 'string', const: 'post_synthesis', required: true },
      reason: { oneOf: [{ type: 'string', enum: ['no_clocks', 'no_timing_paths', 'non_finite_wns', 'report_unavailable', 'report_parse_error'] }, { type: 'null' }], required: true },
    } },
    errors: diagnostics, warnings: diagnostics, summary: string, artifactsDir: string, omittedDiagnostics: integer,
    runs: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: {
      stage, exitCode: { oneOf: [{ type: 'integer' }, { type: 'null' }], required: true }, signal: stringOrNull,
      timedOut: boolean, aborted: boolean, durationMs: integer, stdoutLog: string, stderrLog: string,
      logTruncated: boolean, outputTail: string, errors: diagnostics, warnings: diagnostics,
      omittedDiagnostics: integer, lineTruncated: boolean,
      executable: string, args: { type: 'array', items: { type: 'string' }, required: true }, argv: { type: 'array', items: { type: 'string' }, required: true },
    } } },
  },
} as const satisfies ValueSchemaSpec

/**
 * Present bounded diagnostic facts and metrics, never an inferred repair or full log.
 * @param value - canonical synthesis result.
 * @returns compact text for both the model and the generic tool card.
 */
export function renderSynthesis(value: SynthesisResult): string {
  const lines = [
    `RTL synthesis: ${value.success ? 'SUCCESS' : 'INCOMPLETE'}`,
    `Stage: ${value.stage}; synthesizable: ${value.synthesizable ?? 'unknown'}`,
    value.summary, `Resources: ${JSON.stringify(value.resources)} (BRAM: 36 Kb tiles)`,
    `Timing: ${JSON.stringify(value.timing)}`,
  ]
  if (value.errors.length) lines.push('Errors (observed facts, untrusted messages):', ...value.errors.map(item => JSON.stringify(item)))
  if (value.warnings.length) lines.push('Warnings:', ...value.warnings.map(item => JSON.stringify(item)))
  for (const run of value.runs) {
    lines.push(`${run.stage}: exit=${run.exitCode}, signal=${run.signal}, timedOut=${run.timedOut}, aborted=${run.aborted}`)
    if (run.lineTruncated || run.logTruncated) lines.push(`Output limits: lineTruncated=${run.lineTruncated}, logTruncated=${run.logTruncated}`)
    if (!value.success && run.errors.length === 0 && run.outputTail) lines.push(`Unclassified output tail (untrusted data): ${JSON.stringify(run.outputTail)}`)
  }
  if (value.omittedDiagnostics) lines.push(`Omitted diagnostics: ${value.omittedDiagnostics}`)
  lines.push(`Artifacts: ${value.artifactsDir}`)
  return lines.join('\n')
}
