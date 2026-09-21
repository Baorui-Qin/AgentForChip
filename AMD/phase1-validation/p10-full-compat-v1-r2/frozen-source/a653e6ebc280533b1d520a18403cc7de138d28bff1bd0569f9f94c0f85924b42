/** Trusted HDL language resolution shared by Vivado simulation and synthesis. @module rtl-tools/hdl */
import { extname } from 'node:path'
import z from '@deepseek-ai/schemastery'

/** Supported Vivado source languages. */
export type HDLLanguage = 'verilog' | 'systemverilog'
/** Ownership determines attribution, not correctness. */
export type HDLRole = 'dut' | 'testbench' | 'reference'
/** Trusted source configuration; string entries remain supported. */
export interface HDLSource { path: string; language?: HDLLanguage | undefined; role?: HDLRole | undefined }
/** Effective language and its provenance, persisted with the snapshot. */
export interface ResolvedHDLSource { path: string; language: HDLLanguage; role: HDLRole; language_origin: 'task' | 'file' | 'extension' }
/** One contiguous compilation unit; source order is never sorted. */
export interface HDLGroup { language: HDLLanguage; sources: ResolvedHDLSource[] }
/** Configuration parser; arbitrary flags are not supported. */
export const languageConfig = z.union([z.const(undefined), z.const('verilog'), z.const('systemverilog')])
/** Compatible trusted source parser. */
const sourceObject = z.object({ path: z.string().required(), language: languageConfig, role: z.union([z.const(undefined), z.const('dut'), z.const('testbench'), z.const('reference')]) })
/** String shorthand and explicit source metadata share one resolver. */
export const sourceConfig = z.union([z.string(), sourceObject])

/** Resolve all source types before launching any tools. @param sources - ordered trusted inputs. @param language - optional task-wide mode. @returns detached effective inputs. */
export function resolveHDLSources(sources: readonly (string | HDLSource)[], language?: HDLLanguage): ResolvedHDLSource[] {
  if (!sources.length) throw new Error('language_mode_error: source list is empty')
  return sources.map(input => {
    const source = typeof input === 'string' ? { path: input } : input
    if (!source.path.trim() || /[\0\r\n]/.test(source.path)) throw new Error('language_mode_error: invalid source path')
    if (language && source.language && language !== source.language) throw new Error('language_mode_error: task and file languages conflict')
    const extension = extname(source.path).toLowerCase()
    const resolved = language ?? source.language ?? (extension === '.sv' ? 'systemverilog' : extension === '.v' ? 'verilog' : undefined)
    if (!resolved || (extension === '.sv' && resolved === 'verilog')) throw new Error('language_mode_error: unknown extension or .sv forced to Verilog')
    return { path: source.path, language: resolved, role: source.role ?? 'dut', language_origin: language ? 'task' : source.language ? 'file' : 'extension' }
  })
}

/** Group adjacent languages without reordering files. @param sources - resolved inputs. @returns compilation groups. */
export function groupHDLSources(sources: readonly ResolvedHDLSource[]): HDLGroup[] {
  const groups: HDLGroup[] = []
  for (const source of sources) {
    let group = groups.at(-1)
    if (!group || group.language !== source.language) { group = { language: source.language, sources: [] }; groups.push(group) }
    group.sources.push({ ...source })
  }
  return groups
}

/** Reject drift between the resolved unit and the actual compiler arguments. @param group - trusted unit. @param args - proposed xvlog args. */
export function assertCompileMode(group: HDLGroup, args: readonly string[]): void {
  const expected = [...(group.language === 'systemverilog' ? ['-sv'] : []), ...group.sources.map(source => source.path)]
  if (JSON.stringify(expected) !== JSON.stringify(args)) throw new Error('language_mode_error: compiler arguments disagree with trusted unit')
}
