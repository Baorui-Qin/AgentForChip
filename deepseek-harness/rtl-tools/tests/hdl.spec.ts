import { join, resolve } from 'node:path'
import { expect, it } from 'vitest'
import { resolveHDLSources, groupHDLSources, assertCompileMode, sourceConfig } from '../src/hdl.ts'
import { attributeDiagnostics, hostIssue } from '../src/phase1/attribution.ts'
import { VivadoDiagnostics } from '../src/vivado-parser.ts'

it('resolves string compatibility, explicit language and provenance without changing source order', () => {
  expect(resolveHDLSources(['a.v', 'b.SV']).map(source => [source.language, source.language_origin])).toEqual([['verilog', 'extension'], ['systemverilog', 'extension']])
  expect(resolveHDLSources([{ path: 'a.v', language: 'systemverilog' }])[0]).toMatchObject({ language: 'systemverilog', language_origin: 'file' })
  expect(resolveHDLSources(['a.v', 'b.hdl'], 'systemverilog').every(source => source.language_origin === 'task')).toBe(true)
  expect(sourceConfig({ path: 'dut.v', language: 'systemverilog', role: 'dut' })).toMatchObject({ path: 'dut.v', language: 'systemverilog' })
  expect(sourceConfig('dut.sv')).toBe('dut.sv')
  expect(() => sourceConfig(JSON.parse('{"path":"dut.v","language":"cpp"}'))).toThrow()
})

it('rejects unknown extensions, conflicting overrides, empty lists and unsafe paths before spawn', () => {
  for (const sources of [[], ['a.hdl'], ['bad\0.v'], [{ path: 'a.sv', language: 'verilog' as const }]]) expect(() => resolveHDLSources(sources)).toThrow('language_mode_error')
  expect(() => resolveHDLSources([{ path: 'a.v', language: 'verilog' }], 'systemverilog')).toThrow('conflict')
  expect(() => resolveHDLSources(['a.sv'], 'verilog')).toThrow()
})

it('keeps contiguous compilation groups and rejects missing or surplus sv flags', () => {
  const groups = groupHDLSources(resolveHDLSources(['a.v', 'b.sv', 'c.sv', 'd.v']))
  expect(groups.map(group => group.sources.map(source => source.path))).toEqual([['a.v'], ['b.sv', 'c.sv'], ['d.v']])
  assertCompileMode(groups[1]!, ['-sv', 'b.sv', 'c.sv'])
  expect(() => assertCompileMode(groups[1]!, ['b.sv', 'c.sv'])).toThrow('language_mode_error')
  expect(() => assertCompileMode(groups[0]!, ['-sv', 'a.v'])).toThrow()
  expect(() => assertCompileMode(groups[1]!, ['-sv', 'c.sv', 'b.sv'])).toThrow()
})

const cwd = resolve('build'), root = resolve('snapshot')
const sources = resolveHDLSources([
  { path: join(root, 'solution.sv'), role: 'dut' }, { path: join(root, 'tb.sv'), role: 'testbench' }, { path: join(root, 'ref.sv'), role: 'reference' },
])
it.each([['solution.sv', 'dut', 'DUT_COMPILE_ERROR', true], ['tb.sv', 'testbench', 'TESTBENCH_COMPATIBILITY', false], ['ref.sv', 'reference', 'REFERENCE_COMPATIBILITY', false], ['alien.sv', 'unknown', 'UNKNOWN', false]])('attributes %s using exact manifest ownership', (file, origin, attribution, repairable) => {
  const parser = new VivadoDiagnostics(5, 400)
  const line = `ERROR: [VRFC 10-3380] used before declaration [${join(root, file)}:97]`
  parser.accept(line); parser.accept(line)
  const result = attributeDiagnostics(parser.errors, sources, cwd, 'compile', true, false)
  expect(result).toHaveLength(1)
  expect(result[0]).toMatchObject({ origin, attribution, repairable_by_model: repairable, severity: 'ERROR', message_id: 'VRFC 10-3380', line: 97 })
})

it('never grants repair eligibility to mixed, incomplete, environmental or location-free diagnostics', () => {
  const dut = { severity: 'ERROR' as const, type: 'syntax_error', message: 'syntax error', file: sources[0]!.path }
  const tb = { ...dut, file: sources[1]!.path }
  for (const [values, complete, environment] of [[[dut, tb], true, false], [[dut], false, false], [[dut], true, true], [[{ ...dut, file: 'solution.sv' }], true, false]] as const) {
    expect(attributeDiagnostics([...values], sources, cwd, 'compile', complete, environment).every(value => !value.repairable_by_model)).toBe(true)
  }
  expect(hostIssue('language_mode_error: missing -sv')).toMatchObject({ attribution: 'language_mode_error', repairable_by_model: false })
  expect(attributeDiagnostics([{ ...dut, severity: 'CRITICAL WARNING' }], sources, cwd, 'compile', true, false)[0]).toMatchObject({ severity: 'CRITICAL WARNING', repairable_by_model: false })
})
