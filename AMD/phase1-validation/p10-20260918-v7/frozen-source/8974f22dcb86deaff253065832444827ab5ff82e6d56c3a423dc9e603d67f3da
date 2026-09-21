/** Restricted development actions; these checks are not an OS sandbox. @module rtl-tools/phase1/p09-auto-policy */
import { checkInterface, type DUTInterface } from './candidates.ts'
import type { ToolSchema } from '@deepseek-ai/dsh-llm'

/** The host owns every path, test asset, command and budget. */
export type AutoAction = { name: 'read_current_rtl' | 'retrieve_skill' | 'finish' } |
  { name: 'edit_dut'; expected_revision_id: string; source: string } |
  { name: 'verify_rtl'; revision_id: string; test_suite_id: string }
/** Decode one complete model call, rejecting extra fields. @param name - provider tool name. @param text - complete JSON arguments. @returns validated action. */
export function parseAutoAction(name: string, text: string): AutoAction {
  const value: unknown = JSON.parse(text)
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('INVALID_ACTION')
  const args = value as Record<string, unknown>
  const keys = Object.keys(args).sort().join(',')
  if (['read_current_rtl', 'retrieve_skill', 'finish'].includes(name) && keys === '') return { name } as AutoAction
  if (name === 'edit_dut' && keys === 'expected_revision_id,source' && typeof args.expected_revision_id === 'string' && typeof args.source === 'string') return { name, expected_revision_id: args.expected_revision_id, source: args.source }
  if (name === 'verify_rtl' && keys === 'revision_id,test_suite_id' && typeof args.revision_id === 'string' && typeof args.test_suite_id === 'string') return { name, revision_id: args.revision_id, test_suite_id: args.test_suite_id }
  throw new Error('INVALID_ACTION')
}
/** Reject unsupported effects without rewriting any RTL bytes. @param source - single DUT. @param expected - frozen public interface. */
export function checkAutoSource(source: string, expected: DUTInterface): void {
  if (!source.trim() || Buffer.byteLength(source) > 65536 || /[^\x09\x0a\x0d\x20-\x7e]/.test(source)) throw new Error('UNSUPPORTED_RTL_BYTES')
  // Strings and escaped identifiers are unnecessary for this fixed development suite.
  const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g, ' ')
  if (/"|\\|`/.test(code) || /\b(import|export|bind|force|release|class|program|interface|package)\b/.test(code)) throw new Error('RTL_POLICY_REJECTED')
  for (const match of code.matchAll(/\$[A-Za-z_][\w$]*/g)) if (!['$clog2', '$bits', '$signed', '$unsigned'].includes(match[0])) throw new Error('RTL_POLICY_REJECTED')
  if (code.includes('.')) throw new Error('RTL_HIERARCHY_REJECTED')
  checkInterface(source, expected)
}
/** Fixed tool definitions, identical across A/B/C. @param registry - smoke or complete registry. @returns provider-neutral schemas. */
export function autoTools(registry: 'minimal' | 'full'): ToolSchema[] {
  const definition = (name: string, description: string, properties: Record<string, unknown>): ToolSchema => ({ name, description,
    parameters: { type: 'object', properties, required: Object.keys(properties), additionalProperties: false } })
  const string = { type: 'string' }
  const tools = [definition('edit_dut', 'Replace only the current single DUT. Supply its expected revision. Does not run verification.', { expected_revision_id: string, source: string }),
    definition('verify_rtl', 'Verify the current revision with its registered test suite through compilation, elaboration, simulation and synthesis.', { revision_id: string, test_suite_id: string })]
  if (registry === 'full') tools.push(definition('read_current_rtl', 'Read the current DUT and verification state.', {}),
    definition('retrieve_skill', 'Retrieve at most two applicable validated rules. Disabled in groups A and B.', {}), definition('finish', 'Stop without claiming an unverified design passed.', {}))
  return tools
}
