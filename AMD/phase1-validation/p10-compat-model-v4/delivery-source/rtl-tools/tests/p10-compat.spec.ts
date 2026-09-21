import { readFile } from 'node:fs/promises'
import { expect, it } from 'vitest'
import { adaptTB, reviewedTBs, negativeControl } from '../src/phase1/p10-compat.ts'
import { checkAutoSource } from '../src/phase1/p09-auto-policy.ts'

it('moves exactly two whole lines and reverses every byte including CRLF', async () => {
  for (const id of Object.keys(reviewedTBs)) {
    const bytes = await readFile(new URL(`./fixtures/p10/${id}_test.sv`, import.meta.url))
    const result = adaptTB(id, bytes)
    const original = bytes.toString().match(/[^\n]*\n|[^\n]+$/g)!
    const effective = result.effective.toString().match(/[^\n]*\n|[^\n]+$/g)!
    const map = JSON.parse(result.sourceMap).new_to_original_line as number[]
    const restored: string[] = []
    map.forEach((old, index) => { restored[old - 1] = effective[index]! })
    expect(Buffer.from(restored.join(''))).toEqual(bytes)
    expect(effective.length).toBe(original.length)
    expect(result.effective.indexOf('wire tb_match')).toBeLessThan(result.effective.indexOf('$dumpvars'))
    expect(result.patch.split('\n').filter(l => l.startsWith('+') && !l.startsWith('+++'))).toHaveLength(2)
    for (const changed of [Buffer.from(bytes.toString().replace('module tb()', 'module other()')), Buffer.concat([bytes, Buffer.from('\nwire tb_match;\n')]), Buffer.from(bytes.toString().replace(/\r\n/g, '\n'))]) {
      expect(() => adaptTB(id, changed)).toThrow('COMPAT_RULE_UNSUPPORTED')
    }
  }
  expect(() => adaptTB('unknown', Buffer.from(''))).toThrow('COMPAT_RULE_UNSUPPORTED')
})
it('rejects borrowing reference by positional instantiation as well as hierarchy', () => {
  const ports = { top: 'TopModule', ports: [{ name: 'in', direction: 'input' as const, width: 1 }, { name: 'out', direction: 'output' as const, width: 1 }] }
  expect(() => checkAutoSource('module TopModule(input in, output out); RefModule borrowed(in,out); endmodule', ports)).toThrow('RTL_REFERENCE_DEPENDENCY_REJECTED')
  expect(() => checkAutoSource('module TopModule(input in, output out); assign out = ~in; endmodule', ports)).not.toThrow()
  expect(() => negativeControl({ task_id: 'unknown' } as never)).toThrow('COMPAT_RULE_UNSUPPORTED')
})
