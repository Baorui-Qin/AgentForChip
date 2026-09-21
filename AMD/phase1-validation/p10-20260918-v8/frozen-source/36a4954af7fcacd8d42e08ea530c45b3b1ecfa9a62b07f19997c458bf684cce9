/** Project records with explicit 1.0/1.1 readers and 1.3 verification evidence. @module rtl-tools/phase1/records */
import { validateJsonSchemaValue, type JsonSchemaNode } from '@deepseek-ai/dsh-tools'
import { parseContract, schemas, artifactPath, stages, type ModelResult, type StageResult, type RunResult } from './contracts.ts'
import type { SynthesisResult } from '../synthesis.ts'
import type { ResolvedHDLSource } from '../hdl.ts'
import { categories, type AttributedDiagnostic } from './attribution.ts'

/** Observable termination facts, excluding raw output. */
export interface ProcessFact { exit_code: number | null; signal: string | null; timed_out: boolean; cancelled: boolean; log_truncated: boolean; duration_ms: number }
/** Exact tool request, policy-wrapped launch and retained process evidence. */
export interface Invocation { label: string; executable: string; args: string[]; argv: readonly string[]; launch_argv: readonly string[]; version_matches: boolean | null; systemverilog_mode: boolean | null; sources: ResolvedHDLSource[]; process: ProcessFact; stdout_log: string; stderr_log: string }
/** Stage facts distinguish approved fixtures from OS-confined execution; 1.3 requires invocations. */
export interface StageRecord extends Omit<StageResult, 'schema_version'> {
  schema_version: '1.1' | '1.3'
  invocations?: Invocation[]
  errors: (StageResult['errors'][number] | AttributedDiagnostic)[]
  trust: 'trusted_fixture' | 'confined_candidate' | 'reviewed_candidate'
  processes: ProcessFact[]
  warnings: StageResult['errors']
  diagnostics_omitted: number
  report_path: string | null
  synthesis?: Pick<SynthesisResult, 'synthesizable' | 'resources' | 'timing'> | null
}
/** Transport and cancellation are independent from the assembled text interface. */
export interface ModelRecord extends Omit<ModelResult, 'schema_version' | 'timing' | 'error'> {
  schema_version: '1.1'
  provider: string
  dispatched: boolean
  timing: { request_wall_ms: number; ttft_ms: null; ttft_source: 'not_collected'; transport: 'stream' }
  server_cancellation: 'not_requested' | 'unconfirmed'
  error: { category: 'connection' | 'timeout' | 'authentication' | 'configuration' | 'empty_output' | 'truncated' | 'parse' | 'oom' | 'cancelled' | 'unknown' | 'rate_limit' | 'service'; message: string } | null
}
/** Terminal record references stage evidence from its own verification generation. */
export interface RunRecord extends Omit<RunResult, 'schema_version' | 'stages'> {
  schema_version: '1.1' | '1.3'
  stages: Record<StageResult['stage'], StageRecord | null>
}
/** Released project generations remain readable without altering Harness Sessions. */
export interface RecordTypes { ModelResult: ModelResult | ModelRecord; StageResult: StageResult | StageRecord; RunResult: RunResult | RunRecord }

const str: JsonSchemaNode = { type: 'string' }
const bool: JsonSchemaNode = { type: 'boolean' }
const integer: JsonSchemaNode = { type: 'integer' }
const nil: JsonSchemaNode = { type: 'null' }
const nullable = (value: JsonSchemaNode): JsonSchemaNode => ({ oneOf: [value, nil] })
const enumeration = (...values: string[]): JsonSchemaNode => ({ type: 'string', enum: values })
const object = (properties: Record<string, JsonSchemaNode>): JsonSchemaNode => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false })
function extend(base: JsonSchemaNode, properties: Record<string, JsonSchemaNode>): JsonSchemaNode {
  return object({ ...structuredClone(base.properties), schema_version: { type: 'string', const: '1.1' }, ...properties })
}
const stageSchema = extend(schemas.StageResult, {
  trust: enumeration('trusted_fixture', 'confined_candidate', 'reviewed_candidate'),
  processes: { type: 'array', items: object({ exit_code: nullable(integer), signal: nullable(str), timed_out: bool, cancelled: bool, log_truncated: bool, duration_ms: integer }) },
  warnings: schemas.StageResult.properties!.errors!, diagnostics_omitted: integer, report_path: nullable(str),
  synthesis: nullable(object({ synthesizable: nullable(bool), resources: object({ lut: nullable(integer), ff: nullable(integer), bram: nullable({ type: 'number' }), dsp: nullable(integer) }),
    timing: object({ wns: nullable({ type: 'number' }), unit: enumeration('ns'), stage: enumeration('post_synthesis'), reason: nullable(str) }) })),
})
stageSchema.required = stageSchema.required!.filter(key => key !== 'synthesis')
/** New structural schemas; parseRecord additionally enforces cross-field semantics. */
export const recordSchemas = {
  StageResult: stageSchema,
  ModelResult: extend(schemas.ModelResult, {
    provider: str, dispatched: bool,
    timing: object({ request_wall_ms: integer, ttft_ms: nil, ttft_source: enumeration('not_collected'), transport: enumeration('stream') }),
    server_cancellation: enumeration('not_requested', 'unconfirmed'),
    error: nullable(object({ category: enumeration('connection', 'timeout', 'authentication', 'configuration', 'empty_output', 'truncated', 'parse', 'oom', 'cancelled', 'unknown', 'rate_limit', 'service'), message: str })),
  }),
  RunResult: extend(schemas.RunResult, { stages: object(Object.fromEntries(stages.map(stage => [stage, nullable(stageSchema)]))) }),
} satisfies Record<keyof RecordTypes, JsonSchemaNode>

const attributedSchema = object({ ...schemas.StageResult.properties!.errors!.items!.properties,
  severity: enumeration('ERROR', 'WARNING', 'CRITICAL WARNING'), origin: enumeration('dut', 'testbench', 'reference', 'harness', 'tool', 'unknown'),
  attribution: enumeration(...categories), repairable_by_model: bool })
const processSchema = stageSchema.properties!.processes!.items!
const sourceSchema = object({ path: str, language: enumeration('verilog', 'systemverilog'), role: enumeration('dut', 'testbench', 'reference'), language_origin: enumeration('task', 'file', 'extension') })
const invocationSchema = object({ label: str, executable: str, args: { type: 'array', items: str }, argv: { type: 'array', items: str }, launch_argv: { type: 'array', items: str },
  version_matches: nullable(bool), systemverilog_mode: nullable(bool), sources: { type: 'array', items: sourceSchema }, process: processSchema, stdout_log: str, stderr_log: str })
const stage13 = object({ ...stageSchema.properties, schema_version: { const: '1.3', type: 'string' }, errors: { type: 'array', items: attributedSchema }, warnings: { type: 'array', items: attributedSchema }, invocations: { type: 'array', items: invocationSchema } })
stage13.required = stage13.required!.filter(key => key !== 'synthesis')
/** Explicit successor schemas; older records are validated by their original schemas. */
export const verificationRecordSchemas = {
  StageResult: stage13,
  RunResult: object({ ...recordSchemas.RunResult.properties, schema_version: { const: '1.3', type: 'string' }, stages: object(Object.fromEntries(stages.map(stage => [stage, nullable(stage13)]))) }),
}

function legacyStage(record: StageRecord): StageRecord {
  const { invocations: _invocations, ...base } = record
  const strip = (value: StageResult['errors'][number]) => ({ category: value.category, message_id: value.message_id, file: value.file, line: value.line, message: value.message })
  // Valid version banners can exit 1; they are probes, not design executions.
  const processes = record.invocations ? record.invocations.filter(invocation => invocation.version_matches !== true).map(invocation => invocation.process) : base.processes
  return { ...base, processes, schema_version: '1.1', errors: base.errors.map(strip), warnings: base.warnings.map(strip) }
}

/** Read either project generation without modifying released Harness sessions. @param kind - record family. @param input - parsed JSON. @returns validated detached record. */
export function parseRecord<K extends keyof RecordTypes>(kind: K, input: unknown): RecordTypes[K] {
  if ((input as { schema_version?: unknown } | null)?.schema_version === '1.3' && kind !== 'ModelResult') {
    const errors = validateJsonSchemaValue(kind === 'StageResult' ? verificationRecordSchemas.StageResult : verificationRecordSchemas.RunResult, input)
    if (errors.length) throw new Error(errors.slice(0, 5).join('; '))
    const value = structuredClone(input) as StageRecord | RunRecord
    if (kind === 'StageResult') {
      const stage = value as StageRecord
      parseRecord('StageResult', legacyStage(stage))
      for (const invocation of stage.invocations!) {
        artifactPath(invocation.stdout_log); artifactPath(invocation.stderr_log)
        const process = invocation.process
        if (invocation.version_matches === true && (JSON.stringify(invocation.args) !== '["-version"]' || invocation.sources.length || ![0, 1].includes(process.exit_code!) || process.signal || process.cancelled || process.timed_out || process.log_truncated)) throw new Error('Invalid version probe evidence')
        if (invocation.systemverilog_mode !== null && (invocation.systemverilog_mode !== invocation.args.includes('-sv') || !invocation.sources.length || invocation.sources.some(source => (source.language === 'systemverilog') !== invocation.systemverilog_mode))) throw new Error('Invocation language mode disagrees')
      }
      if (JSON.stringify(stage.processes) !== JSON.stringify(stage.invocations!.map(invocation => invocation.process))) throw new Error('Invocation/process facts disagree')
      for (const error of stage.errors as AttributedDiagnostic[]) {
        if (error.repairable_by_model && (!['compile', 'elaborate', 'synthesis'].includes(stage.stage) || !['DUT_COMPILE_ERROR', 'DUT_SYNTHESIS_ERROR'].includes(error.attribution) || error.origin !== 'dut' || error.severity !== 'ERROR' || (stage.errors as AttributedDiagnostic[]).some(other => other.origin !== 'dut' || other.attribution === 'UNKNOWN') || stage.diagnostic_excerpt_truncated || stage.diagnostics_omitted > 0 || stage.processes.some(process => process.cancelled || process.timed_out || process.log_truncated || process.signal))) throw new Error('Invalid repair eligibility')
      }
    } else {
      const run = value as RunRecord
      for (const stage of Object.values(run.stages)) if (stage) parseRecord('StageResult', stage)
      parseRecord('RunResult', { ...run, schema_version: '1.1', stages: Object.fromEntries(stages.map(stage => [stage, run.stages[stage] ? legacyStage(run.stages[stage]!) : null])) })
    }
    return value as RecordTypes[K]
  }
  if ((input as { schema_version?: unknown } | null)?.schema_version !== '1.1') return parseContract(kind, input)
  const errors = validateJsonSchemaValue(recordSchemas[kind], input)
  if (errors.length) throw new Error(errors.slice(0, 5).join('; '))
  const value = structuredClone(input) as ModelRecord | StageRecord | RunRecord
  if (kind === 'StageResult') {
    const { trust: _trust, processes, warnings: _warnings, diagnostics_omitted, report_path, synthesis: _synthesis, ...base } = value as StageRecord
    parseContract('StageResult', { ...base, schema_version: '1.0' })
    if (report_path !== null) artifactPath(report_path)
    if (!Number.isSafeInteger(diagnostics_omitted) || diagnostics_omitted < 0) throw new Error('Invalid omitted count')
    for (const process of processes) {
      if (!Number.isSafeInteger(process.duration_ms) || process.duration_ms < 0) throw new Error('Invalid process duration')
      if (base.status === 'PASS' && (process.exit_code !== 0 || process.signal || process.timed_out || process.cancelled || process.log_truncated)) throw new Error('PASS conflicts with process facts')
    }
    if (base.status === 'PASS' && !processes.length) throw new Error('PASS requires process evidence')
  } else if (kind === 'ModelResult') {
    const { provider: _provider, dispatched: _dispatched, server_cancellation: _cancellation, ...base } = value as ModelRecord
    parseContract('ModelResult', { ...base, schema_version: '1.0', timing: { request_wall_ms: base.timing.request_wall_ms, ttft_ms: null, ttft_source: 'not_observed_non_streaming' },
      error: base.error ? { ...base.error, category: ['rate_limit', 'service'].includes(base.error.category) ? 'unknown' : base.error.category } : null })
  } else {
    const run = value as RunRecord
    const oldStages = Object.fromEntries(stages.map(stage => {
      const record = run.stages[stage]
      if (!record) return [stage, null]
      parseRecord('StageResult', record)
      const { trust: _trust, processes: _processes, warnings: _warnings, diagnostics_omitted: _omitted, report_path: _report, synthesis: _synthesis, ...base } = record
      return [stage, { ...base, schema_version: '1.0' }]
    }))
    parseContract('RunResult', { ...run, schema_version: '1.0', stages: oldStages })
  }
  return value as RecordTypes[K]
}
