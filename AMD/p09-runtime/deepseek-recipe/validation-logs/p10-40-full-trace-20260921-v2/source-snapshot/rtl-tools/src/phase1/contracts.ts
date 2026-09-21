/** Versioned project JSON, independent of released Harness sessions. @module rtl-tools/phase1/contracts */
import { posix, win32 } from 'node:path'
import type { Branded } from '@deepseek-ai/dsh-brand'
import { validateJsonSchemaValue, type JsonSchemaNode } from '@deepseek-ai/dsh-tools'

/** Domain identifiers are validated when reading external JSON. */
export type PhaseId = Branded<'rtl-phase1-id'>
/** Stage order is host-owned; a skipped stage is not evidence of success. */
export const stages = ['compile', 'elaborate', 'simulation', 'synthesis'] as const
/** Terminal stage facts, not workflow commands. */
export type StageStatus = 'PASS' | 'FAIL' | 'SKIPPED' | 'TIMEOUT' | 'TOOL_ERROR' | 'INCONCLUSIVE'
/** Public task input contains neither reference RTL nor evaluator assets. */
export interface TaskSpec {
  schema_version: '1.0'
  task_id: PhaseId
  track: 'rtl' | 'hls'
  public_spec: string
  interface: { dut_top: string; language: 'systemverilog' | 'verilog' | 'cpp'; clock_ports: string[] }
  evaluation_profile_id: PhaseId
  dataset_revision: string
}
/** Non-streaming measurements retain unknown usage and TTFT as null. */
export interface ModelResult {
  schema_version: '1.0'
  call_id: PhaseId
  model_id: string
  content: string
  finish_reason: 'stop' | 'length' | 'error' | 'cancelled' | 'unknown'
  truncated: boolean
  tool_calls: []
  usage: { prompt_tokens: number | null; completion_tokens: number | null; source: 'provider' | 'unavailable' }
  timing: { request_wall_ms: number; ttft_ms: null; ttft_source: 'not_observed_non_streaming' }
  error: { category: 'connection' | 'timeout' | 'authentication' | 'configuration' | 'empty_output' | 'truncated' | 'parse' | 'oom' | 'cancelled' | 'unknown'; message: string } | null
}
/** A diagnostic preserves observations, not a guessed root cause. */
export interface StageDiagnostic {
  category: string
  message_id: string | null
  file: string | null
  line: number | null
  message: string
}
/** Structured evidence belongs to one immutable candidate verification. */
export interface StageResult {
  schema_version: '1.0'
  snapshot_id: PhaseId
  verification_key: string
  stage: typeof stages[number]
  status: StageStatus
  failure_domain: 'environment' | 'resource' | 'policy' | 'design' | 'unknown' | null
  exit_code: number | null
  duration_ms: number
  errors: StageDiagnostic[]
  evidence: { test_completed: boolean | null; checks_executed: number | null; mismatch_count: number | null; evaluator_id: string | null }
  raw_log_path: string | null
  diagnostic_excerpt_truncated: boolean
}
/** One independent sample, distinct from its internal revisions and calls. */
export interface RunIdentity {
  experiment_id: PhaseId
  task_id: PhaseId
  sample_id: number
  mode: 'agent' | 'baseline'
}
/** Final accounting; PASS additionally requires complete matching stage evidence. */
export interface RunResult extends RunIdentity {
  schema_version: '1.0'
  final_status: StageStatus | 'INVALID_OUTPUT' | 'BUDGET_EXCEEDED' | 'ABORTED' | 'UNSUPPORTED_TRACK' | 'NO_PROGRESS'
  final_revision_id: PhaseId | null
  final_source_sha256: string | null
  verification_key: string | null
  final_verified: boolean
  stages: Record<typeof stages[number], StageResult | null>
  semantic_repairs: number
  model_requests_total: number
  transport_retries: number
  stop_reason: string
  artifact_manifest: string[]
}
/** Names and outputs accepted by the durable/file validation entry point. */
export interface Contracts { TaskSpec: TaskSpec; ModelResult: ModelResult; StageResult: StageResult; RunResult: RunResult }

const string: JsonSchemaNode = { type: 'string' }
const integer: JsonSchemaNode = { type: 'integer' }
const boolean: JsonSchemaNode = { type: 'boolean' }
const nil: JsonSchemaNode = { type: 'null' }
const nullable = (schema: JsonSchemaNode): JsonSchemaNode => ({ oneOf: [schema, nil] })
const enumeration = (values: readonly string[]): JsonSchemaNode => ({ type: 'string', enum: [...values] })
const array = (items: JsonSchemaNode): JsonSchemaNode => ({ type: 'array', items })
const object = (properties: Record<string, JsonSchemaNode>): JsonSchemaNode => ({ type: 'object', additionalProperties: false, properties, required: Object.keys(properties) })
const version: JsonSchemaNode = { type: 'string', const: '1.0' }
const status = ['PASS', 'FAIL', 'SKIPPED', 'TIMEOUT', 'TOOL_ERROR', 'INCONCLUSIVE']
const stageSchema = object({
  schema_version: version, snapshot_id: string, verification_key: string,
  stage: enumeration(stages), status: enumeration(status),
  failure_domain: nullable(enumeration(['environment', 'resource', 'policy', 'design', 'unknown'])),
  exit_code: nullable(integer), duration_ms: integer,
  errors: array(object({ category: string, message_id: nullable(string), file: nullable(string), line: nullable(integer), message: string })),
  evidence: object({ test_completed: nullable(boolean), checks_executed: nullable(integer), mismatch_count: nullable(integer), evaluator_id: nullable(string) }),
  raw_log_path: nullable(string), diagnostic_excerpt_truncated: boolean,
})

/** Structural schemas use the existing Harness validator; semantic checks follow in parseContract. */
export const schemas: Record<keyof Contracts, JsonSchemaNode> = {
  TaskSpec: object({ schema_version: version, task_id: string, track: enumeration(['rtl', 'hls']), public_spec: string,
    interface: object({ dut_top: string, language: enumeration(['systemverilog', 'verilog', 'cpp']), clock_ports: array(string) }),
    evaluation_profile_id: string, dataset_revision: string }),
  ModelResult: object({ schema_version: version, call_id: string, model_id: string, content: string,
    finish_reason: enumeration(['stop', 'length', 'error', 'cancelled', 'unknown']), truncated: boolean,
    tool_calls: array(nil), usage: object({ prompt_tokens: nullable(integer), completion_tokens: nullable(integer), source: enumeration(['provider', 'unavailable']) }),
    timing: object({ request_wall_ms: integer, ttft_ms: nil, ttft_source: { type: 'string', const: 'not_observed_non_streaming' } }),
    error: nullable(object({ category: enumeration(['connection', 'timeout', 'authentication', 'configuration', 'empty_output', 'truncated', 'parse', 'oom', 'cancelled', 'unknown']), message: string })) }),
  StageResult: stageSchema,
  RunResult: object({ schema_version: version, experiment_id: string, task_id: string, sample_id: integer, mode: enumeration(['agent', 'baseline']),
    final_status: enumeration([...status, 'INVALID_OUTPUT', 'BUDGET_EXCEEDED', 'ABORTED', 'UNSUPPORTED_TRACK', 'NO_PROGRESS']),
    final_revision_id: nullable(string), final_source_sha256: nullable(string), verification_key: nullable(string), final_verified: boolean,
    stages: object(Object.fromEntries(stages.map(stage => [stage, nullable(stageSchema)]))),
    semantic_repairs: integer, model_requests_total: integer, transport_retries: integer, stop_reason: string, artifact_manifest: array(string) }),
}

/**
 * Reject non-portable artifact references, including Windows streams and reserved names.
 * @param value - JSON artifact path relative to its run directory.
 * @returns the unmodified relative reference; this is not filesystem sandbox enforcement.
 */
export function artifactPath(value: string): string {
  if (!value || posix.isAbsolute(value) || win32.isAbsolute(value) || /[\\:\x00-\x1f<>"|?*]/.test(value)
    || value.split('/').some(part => !part || part === '.' || part === '..' || /[. ]$/.test(part) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part))) {
    throw new Error('Invalid relative artifact path')
  }
  return value
}

function semanticFields(value: unknown, key = ''): void {
  if (typeof value === 'number' && (!Number.isSafeInteger(value) || (key !== 'exit_code' && value < 0))) throw new Error(`Invalid integer: ${key}`)
  if (typeof value === 'string') {
    if (['experiment_id', 'task_id', 'call_id', 'snapshot_id', 'final_revision_id', 'evaluation_profile_id'].includes(key)
      && !/^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/.test(value)) throw new Error(`Invalid identifier: ${key}`)
    if ((key === 'verification_key' && !/^sha256:[a-f0-9]{64}$/.test(value))
      || (key === 'final_source_sha256' && !/^[a-f0-9]{64}$/.test(value))) throw new Error(`Invalid digest: ${key}`)
    if (key === 'raw_log_path') artifactPath(value)
  }
  if (Array.isArray(value)) value.forEach(item => semanticFields(item, key))
  else if (value !== null && typeof value === 'object') Object.entries(value).forEach(([name, item]) => semanticFields(item, name))
}

function checkStage(value: StageResult): void {
  if (value.status === 'PASS' && (value.failure_domain !== null || value.exit_code !== 0 || value.errors.length || value.diagnostic_excerpt_truncated)) throw new Error('PASS has conflicting failure evidence')
  if (value.stage === 'simulation' && value.status === 'PASS'
    && (value.evidence.test_completed !== true || !value.evidence.checks_executed || value.evidence.mismatch_count !== 0 || !value.evidence.evaluator_id)) throw new Error('Simulation PASS requires trusted evaluator evidence')
}

/**
 * Validate untrusted JSON without defaults, coercion, or unknown-enum fallback.
 * @param kind - versioned message family.
 * @param value - parsed external JSON.
 * @returns a detached validated value; no filesystem or verification is performed.
 */
export function parseContract<K extends keyof Contracts>(kind: K, value: unknown): Contracts[K] {
  const errors = validateJsonSchemaValue(schemas[kind], value)
  if (errors.length) throw new Error(`${kind}: ${errors.slice(0, 5).join('; ')}`)
  semanticFields(value)
  if (kind === 'TaskSpec') {
    const task = value as TaskSpec
    if (!task.public_spec.trim() || !task.dataset_revision.trim()) throw new Error('Task text and dataset revision are required')
    if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(task.interface.dut_top) || task.interface.clock_ports.some(port => !/^[A-Za-z_][A-Za-z0-9_$]*$/.test(port))) throw new Error('Invalid HDL interface identifier')
    if ((task.track === 'hls') !== (task.interface.language === 'cpp')) throw new Error('Track and language disagree')
  } else if (kind === 'ModelResult') {
    const result = value as ModelResult
    if (result.tool_calls.length) throw new Error('Text-only v1 does not accept tool calls')
    if (result.usage.source === 'unavailable' && (result.usage.prompt_tokens !== null || result.usage.completion_tokens !== null)) throw new Error('Unavailable usage must be null')
    if (result.finish_reason === 'length' && !result.truncated) throw new Error('Length stop must mark truncation')
  } else if (kind === 'StageResult') checkStage(value as StageResult)
  else if (kind === 'RunResult') {
    const result = value as RunResult
    result.artifact_manifest.forEach(artifactPath)
    for (const name of stages) {
      const stage = result.stages[name]
      if (stage) { checkStage(stage); if (stage.stage !== name) throw new Error('Stage stored under wrong name') }
    }
    if (result.final_verified !== (result.final_status === 'PASS')) throw new Error('Final status and verification disagree')
    if (result.final_verified && (!result.final_revision_id || !result.final_source_sha256 || !result.verification_key
      || stages.some(stage => result.stages[stage]?.status !== 'PASS' || result.stages[stage]?.verification_key !== result.verification_key)
      || new Set(stages.map(stage => result.stages[stage]?.snapshot_id)).size !== 1)) throw new Error('Final PASS requires all stages for the same verification')
  }
  return structuredClone(value) as Contracts[K]
}
