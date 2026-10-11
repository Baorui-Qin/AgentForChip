import { expect, it } from 'vitest'
import { checkAutoSource, RtlDirectiveError } from '../src/phase1/p09-auto-policy.ts'
import type { DUTInterface } from '../src/phase1/candidates.ts'

const iface: DUTInterface = { top: 'TopModule', ports: [{ name: 'in', direction: 'input', width: 1, signed: false }, { name: 'out', direction: 'output', width: 1, signed: false }] }
const wrap = (comment: string) => `module TopModule(input in, output out);\n${comment}\nassign out=in; endmodule`
it.each(['synthesis', 'synopsys', 'pragma', 'xilinx'].flatMap(prefix => ['translate_off', 'translate_on', 'off', 'on', 'full_case', 'parallel_case'].flatMap(directive =>
  [`// ${prefix} ${directive}`, `/* ${prefix}\n ${directive} */`, `// ${prefix.toUpperCase()} ${directive.toUpperCase()}`])))('rejects a meta comment without rewriting: %s', comment => {
  const source = wrap(comment)
  expect(() => checkAutoSource(source, iface)).toThrow(RtlDirectiveError)
  try { checkAutoSource(source, iface) } catch (error) { expect(error).toMatchObject({ line: 2, message: 'RTL_SYNTHESIS_DIRECTIVE_REJECTED' }) }
})
it.each(['translate_off', 'translate_on', 'full_case', 'parallel_case'])('rejects bare directives: %s', directive => {
  expect(() => checkAutoSource(wrap('// ' + directive), iface)).toThrow('RTL_SYNTHESIS_DIRECTIVE_REJECTED')
})
it.each(['// This explanation mentions synthesis translate_off.', '/* ordinary translate_off and parallel_case names */', '// synthesis timing discussion', '// signal synthesis_translate_off'])('keeps normal comments: %s', comment => {
  expect(() => checkAutoSource(wrap(comment), iface)).not.toThrow()
})
it('keeps legal initialization and directive-like identifiers', () => {
  expect(() => checkAutoSource('module TopModule(input in, output out); reg synthesis_translate_off=0; assign out=in | synthesis_translate_off; endmodule', iface)).not.toThrow()
})
it('rejects the exact RT-01 arithmetic split', () => {
  expect(() => checkAutoSource("module TopModule(input in, output out);\nassign out=1'b0\n// synthesis translate_off\n| in\n// synthesis translate_on\n; endmodule", iface)).toThrow('RTL_SYNTHESIS_DIRECTIVE_REJECTED')
})
