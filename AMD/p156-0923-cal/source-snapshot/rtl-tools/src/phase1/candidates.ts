/** Extraction and immutable publication; never repair HDL. @module rtl-tools/phase1/candidates */
import { chmod, mkdir, readFile, realpath, open, link, unlink } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { recordValidator, uuidSchema } from './record-validation.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { variants, type Variant } from './protocol.ts'

/** Expected format failures are data, not compiler failures. */
export class OutputError extends Error {
  constructor(readonly category: 'INVALID_OUTPUT' | 'UNSUPPORTED_INTERFACE', message: string) { super(message) }
}
function invalid(message: string): never { throw new OutputError('INVALID_OUTPUT', message) }
function unsupported(): never { throw new OutputError('UNSUPPORTED_INTERFACE', 'Interface uses unsupported declaration syntax') }
/** Host-owned constant-width ports; no parameter evaluation or model-selected names. */
export interface DUTInterface { top: string; ports: { name: string; direction: 'input' | 'output'; width: number; signed?: boolean }[] }
/** Parse one constant-width module interface; behavioral syntax is left to Vivado. @param source - unchanged single module. @param top - required public module name. @returns declared ports, without inferring fixes to buggy declarations. */
export function declaredInterface(source: string, top: string): DUTInterface {
  const clean = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"/g, ' ')
  const modules = [...clean.matchAll(/\bmodule\s+([A-Za-z_$][\w$]*)/g)]
  if (modules.length !== 1 || modules[0]?.[1] !== top) invalid('Expected one ' + top)
  const head = /\bmodule\s+[A-Za-z_$][\w$]*\s*\(([^;]*?)\)\s*;/.exec(clean)
  if (!head) unsupported()
  const ports = new Map<string, { direction: string; width: number; signed: boolean }>()
  function declarations(text: string, ansi: boolean) {
    let direction = '', width = 1, signed = false
    for (const part of text.split(',')) {
      let item = part.trim()
      const kind = /^(input|output|inout)\b/.exec(item)
      if (kind) { direction = kind[1]!; width = 1; signed = false; item = item.slice(kind[0].length).trim() }
      else if (!ansi || !direction) unsupported()
      const qualifiers = /^(?:(?:wire|reg|logic|signed|unsigned)\s+)*/.exec(item)![0]
      if (/\bsigned\b/.test(qualifiers)) signed = true
      if (/\bunsigned\b/.test(qualifiers)) signed = false
      item = item.slice(qualifiers.length)
      const range = /^\[\s*(\d+)\s*:\s*(\d+)\s*\]\s*/.exec(item)
      if (range) { width = Math.abs(Number(range[1]) - Number(range[2])) + 1; item = item.slice(range[0].length) }
      if (!/^[A-Za-z_$][\w$]*$/.test(item)) unsupported()
      if (ports.has(item)) invalid('Duplicate port: ' + item)
      ports.set(item, { direction, width, signed })
    }
  }
  if (/\b(input|output|inout)\b/.test(head[1]!)) declarations(head[1]!, true)
  else {
    const names = head[1]!.split(',').map(name => name.trim())
    if (names.some(name => !/^[A-Za-z_$][\w$]*$/.test(name)) || new Set(names).size !== names.length) unsupported()
    const body = clean.slice(head.index + head[0].length)
    for (const match of body.matchAll(/\b(input|output|inout)\b([^;]*);/g)) declarations(match[0].slice(0, -1), true)
    if (ports.size !== names.length || names.some(name => !ports.has(name))) invalid('Port declarations disagree with module header')
  }
  if ([...ports.values()].some(port => !['input', 'output'].includes(port.direction))) unsupported()
  return { top, ports: [...ports].map(([name, port]) => ({ name, ...port, direction: port.direction as 'input' | 'output' })) }
}
/** Check a fixed-width declaration against the trusted interface. @param source - unchanged single DUT. @param expected - trusted module/reset/output names; defaults to the P05 interface. */
export function checkInterface(source: string, expected: DUTInterface | { top: string; reset: string; output: string } = { top: 'TopModule', reset: 'reset', output: 'q' }): void {
  const ports = new Map(declaredInterface(source, expected.top).ports.map(port => [port.name, port]))
  if ('ports' in expected) {
    if (ports.size !== expected.ports.length || expected.ports.some(port => {
      const actual = ports.get(port.name)
      return !actual || actual.direction !== port.direction || actual.width !== port.width || actual.signed !== (port.signed ?? false)
    })) invalid('Ports disagree with trusted task interface')
  } else if (ports.size !== 3 || ports.get('clk')?.direction !== 'input' || ports.get('clk')?.width !== 1 || ports.get(expected.reset)?.direction !== 'input' || ports.get(expected.reset)?.width !== 1 || ports.get(expected.output)?.direction !== 'output' || ports.get(expected.output)?.width !== 4) invalid(`Expected clk/${expected.reset} inputs and four-bit ${expected.output} output`)
}
/** Extracted bytes and their original UTF-8 range. */
export interface Extracted { source: string; method: string; start_byte: number; end_byte: number; response_sha256: string; source_sha256: string }
/** Extract only a unique delimited source, preserving its exact contents. @param text - model response. @param truncated - transport fact. @param maxBytes - byte cap. @param expected - trusted interface, never model-selected. @returns unchanged source slice and hashes. */
export function extractSource(text: string, truncated = false, maxBytes = 65536, expected?: Parameters<typeof checkInterface>[1]): Extracted {
  if (truncated || !text.trim() || Buffer.byteLength(text) > maxBytes || /\u0000|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(text)) invalid('Empty, truncated, oversized or invalid Unicode response')
  let start = 0, end = text.length, method = 'raw'
  const begins = [...text.matchAll(/\[BEGIN\]/g)], dones = [...text.matchAll(/\[DONE\]/g)]
  if (begins.length || dones.length) {
    if (begins.length !== 1 || dones.length !== 1 || begins[0]!.index! >= dones[0]!.index!) invalid('Ambiguous or incomplete protocol markers')
    start = begins[0]!.index! + 7; end = dones[0]!.index!; method = 'markers'
    if (/```|\bmodule\b/.test(text.slice(0, start - 7) + text.slice(end + 6))) invalid('Additional candidate outside markers')
  }
  const section = text.slice(start, end), fences = [...section.matchAll(/```/g)]
  if (fences.length) {
    if (fences.length !== 2) invalid('Ambiguous code fences')
    const match = /```(?:verilog|systemverilog|sv)[ \t]*\r?\n([\s\S]*?)```/i.exec(section)
    if (!match) invalid('Expected an explicitly labelled HDL block')
    const before = section.slice(0, match.index), after = section.slice(match.index + match[0].length)
    if (method === 'markers' ? !!(before.trim() || after.trim()) : /\bmodule\b|\bendmodule\b/.test(before + after)) invalid('Conflicting source outside code block')
    start += match.index + match[0].indexOf('\n') + 1; end = start + match[1]!.length; method += '+fence'
  }
  const source = text.slice(start, end)
  if (!source.trim()) invalid('Empty HDL')
  checkInterface(source, expected)
  return { source, method, start_byte: Buffer.byteLength(text.slice(0, start)), end_byte: Buffer.byteLength(text.slice(0, end)), response_sha256: sha256(text), source_sha256: sha256(source) }
}
const digest = { type: 'string', pattern: '^[a-f0-9]{64}$' } as const
/** Strict on-disk candidate identity, independent from upstream Session records. */
export const candidateSchema = recordValidator<Candidate>({ schema_version: { const: '1.2' }, experiment_id: uuidSchema, variant_id: { enum: [...variants] }, revision_id: uuidSchema, source_sha256: digest, response_sha256: digest, evaluation_sha256: digest, method: { type: 'string' }, start_byte: { type: 'integer', minimum: 0 }, end_byte: { type: 'integer', minimum: 0 } })
/** Validated candidate identity. */
export interface Candidate { schema_version: '1.2'; experiment_id: string; variant_id: Variant; revision_id: string; source_sha256: string; response_sha256: string; evaluation_sha256: string; method: string; start_byte: number; end_byte: number }
/** Publish exclusively, with no overwriting of a previous terminal file. @param directory - private directory. @param name - host filename. @param bytes - content. */
export async function publish(directory: string, name: string, bytes: string): Promise<void> {
  if (await realpath(directory) !== resolve(directory)) throw new Error('Publication directory redirected')
  const temp = join(directory, '.' + randomUUID() + '.tmp')
  const handle = await open(temp, 'wx', 0o600)
  try {
    try { await handle.writeFile(bytes); await handle.sync() } finally { await handle.close() }
    await link(temp, join(directory, name))
  } finally { await unlink(temp) }
}
/** Save a new revision without mutating earlier candidates. @param directory - private route directory. @param experiment - id. @param variant - route. @param text - response. @param evaluationHash - frozen scoring identity. @returns metadata and path. */
export async function saveCandidate(directory: string, experiment: string, variant: Variant, text: string, evaluationHash: string): Promise<{ candidate: Candidate; directory: string }> {
  const extracted = extractSource(text), revision = randomUUID(), target = join(directory, 'revisions', revision)
  await mkdir(join(target, 'rtl'), { recursive: true })
  await publish(join(target, 'rtl'), 'solution.sv', extracted.source)
  const { source: _source, ...facts } = extracted
  const candidate = candidateSchema.parse({ schema_version: '1.2', experiment_id: experiment, variant_id: variant, revision_id: revision, evaluation_sha256: evaluationHash, ...facts })
  await publish(target, 'candidate.json', JSON.stringify(candidate, null, 2) + '\n')
  await chmod(join(target, 'rtl/solution.sv'), 0o444)
  return { candidate, directory: target }
}
/** Recheck source against a strictly validated manifest. @param directory - host revision directory. @returns pinned candidate bytes. */
export async function readCandidate(directory: string): Promise<{ candidate: Candidate; source: string }> {
  const root = await realpath(directory)
  if (root !== resolve(directory)) throw new Error('Revision directory redirected')
  const candidate = candidateSchema.parse(JSON.parse(await readFile(await checkedFile(root, 'candidate.json'), 'utf8')))
  const bytes = await readFile(await checkedFile(root, 'rtl/solution.sv'))
  if (bytes.length > 65536 || sha256(bytes) !== candidate.source_sha256) throw new Error('Candidate source changed')
  return { candidate, source: new TextDecoder('utf-8', { fatal: true }).decode(bytes) }
}
