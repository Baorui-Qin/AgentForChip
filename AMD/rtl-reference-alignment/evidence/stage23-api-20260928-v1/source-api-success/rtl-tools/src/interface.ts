/** Constant-width DUT interface validation; no task assets or filesystem access. @module rtl-tools/interface */
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
