/** Conservative diagnostic ownership, separate from root-cause inference. @module rtl-tools/phase1/attribution */
import { isAbsolute, resolve } from 'node:path'
import type { ResolvedHDLSource } from '../hdl.ts'
import type { VivadoDiagnostic } from '../vivado-parser.ts'
import type { StageDiagnostic } from './contracts.ts'

/** Stable attribution labels for downstream repair policy. */
export const categories = ['language_mode_error', 'DUT_COMPILE_ERROR', 'DUT_SYNTHESIS_ERROR', 'TESTBENCH_COMPATIBILITY', 'REFERENCE_COMPATIBILITY', 'HARNESS_CONFIGURATION', 'TOOL_ENVIRONMENT', 'UNKNOWN'] as const
/** A location identifies ownership, not necessarily the underlying defect. */
export interface AttributedDiagnostic extends StageDiagnostic {
  severity: 'ERROR' | 'WARNING' | 'CRITICAL WARNING'
  origin: 'dut' | 'testbench' | 'reference' | 'harness' | 'tool' | 'unknown'
  attribution: typeof categories[number]
  repairable_by_model: boolean
}
/** Map exact canonical source paths; bare basenames and foreign paths stay unknown. @param values - observed messages. @param sources - absolute trusted source manifest. @param cwd - process working directory. @param stage - current phase. @param complete - all diagnostic and process evidence retained. @param environment - tool environmental error seen. @returns bounded facts with conservative repair eligibility. */
export function attributeDiagnostics(values: VivadoDiagnostic[], sources: ResolvedHDLSource[], cwd: string, stage: string, complete: boolean, environment: boolean): AttributedDiagnostic[] {
  const key = (path: string) => {
    const normalized = resolve(path).replace(/\\/g, '/')
    return process.platform === 'win32' ? normalized.toLowerCase() : normalized
  }
  const roles = new Map(sources.map(source => [key(source.path), source.role]))
  const result: AttributedDiagnostic[] = values.map(value => {
    const origin = value.file ? roles.get(key(isAbsolute(value.file) ? value.file : resolve(cwd, value.file))) ?? 'unknown' : 'unknown'
    const attribution = environment ? 'TOOL_ENVIRONMENT' : origin === 'testbench' && ['compile', 'elaborate'].includes(stage) ? 'TESTBENCH_COMPATIBILITY' : origin === 'reference' && ['compile', 'elaborate'].includes(stage) ? 'REFERENCE_COMPATIBILITY'
      : origin === 'dut' && ['compile', 'elaborate'].includes(stage) ? 'DUT_COMPILE_ERROR' : origin === 'dut' && stage === 'synthesis' ? 'DUT_SYNTHESIS_ERROR' : 'UNKNOWN'
    return { category: value.type, message_id: value.code ?? null, file: value.file ?? null, line: value.line ?? null,
      message: value.message, severity: value.severity, origin: environment ? 'tool' : origin, attribution, repairable_by_model: false }
  })
  const errors = result.filter(value => value.severity === 'ERROR')
  const eligible = complete && !environment && errors.length > 0 && errors.every(value => value.origin === 'dut' && value.attribution !== 'UNKNOWN')
  for (const value of errors) value.repairable_by_model = eligible
  return result
}

/** Host failures are not candidate repair instructions. @param message - bounded host failure. @returns explicit non-repairable diagnostic. */
export function hostIssue(message: string): AttributedDiagnostic {
  const attribution = message.startsWith('language_mode_error:') ? 'language_mode_error' : message.startsWith('Environment:') ? 'TOOL_ENVIRONMENT'
    : /^(?:Configuration:|Invalid configuration:)/.test(message) ? 'HARNESS_CONFIGURATION' : 'UNKNOWN'
  return { category: 'verification', message_id: null, file: null, line: null, message, severity: 'ERROR', origin: attribution === 'TOOL_ENVIRONMENT' ? 'tool' : 'harness', attribution, repairable_by_model: false }
}
