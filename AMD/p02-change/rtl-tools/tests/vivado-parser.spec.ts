import { expect, it } from 'vitest'
import { LineScanner } from '../src/diagnostics.ts'
import { parseTiming, parseUtilization, VivadoDiagnostics } from '../src/vivado-parser.ts'

const utilization = `| Site Type | Used | Fixed |
+---+---+---+
| CLB LUTs* | 0 | 10 |
| CLB Registers | 10 | 1 |
| Register as Flip Flop | 8 | 0 |
| Register as Latch | 2 | 0 |
| Block RAM Tile | 0.5 | 0 |
| DSPs | 0 | 3 |`

it('retains the vendor message id when a Tcl catch repeats the ERROR prefix', () => {
  const diagnostics = new VivadoDiagnostics(5, 400)
  diagnostics.accept('ERROR: ERROR: [Common 17-69] Command failed: Synthesis failed')
  expect(diagnostics.errors).toEqual([{ severity: 'ERROR', code: 'Common 17-69', type: 'error', message: 'Command failed: Synthesis failed' }])
})

it('uses Used columns, flip-flops excluding latches and fractional BRAM tiles', () => {
  expect(parseUtilization(utilization)).toEqual({ lut: 0, ff: 8, bram: 0.5, dsp: 0 })
  expect(parseUtilization(utilization.replace('| Used | Fixed |', '| Fixed | Used |'))).toEqual({ lut: 10, ff: 0, bram: 0, dsp: 3 })
  expect(parseUtilization('INFO LUTs: 300')).toEqual({ lut: null, ff: null, bram: null, dsp: null })
  expect(parseUtilization(utilization.replace('0.5', '0.7')).bram).toBeNull()
  expect(parseUtilization(utilization.replace('| 8 |', '| N/A |')).ff).toBeNull()
  expect(parseUtilization(utilization + '\n| DSPs | 9 | 0 |').dsp).toBeNull()
})

it.each([1.72, -0.125, 0])('parses post-synthesis WNS %s without a pass/fail threshold', wns => {
  const report = `Design Timing Summary\n WNS(ns) TNS(ns)\n ------- -------\n ${wns} 0\nClock Summary\n other text`
  expect(parseTiming(report, 1, 1)).toEqual({ wns, unit: 'ns', stage: 'post_synthesis', reason: null })
  expect(parseTiming(report, 0, 0)).toMatchObject({ wns: null, reason: 'no_clocks' })
  expect(parseTiming(report, 1, 0)).toMatchObject({ wns: null, reason: 'no_timing_paths' })
  expect(parseTiming(report, null, 1)).toMatchObject({ wns: null, reason: 'report_parse_error' })
  expect(parseTiming(null, 0, 0)).toMatchObject({ wns: null, reason: 'report_unavailable' })
  expect(parseTiming('INFO WNS=1.72', 1, 1)).toMatchObject({ wns: null, reason: 'report_parse_error' })
})

it('preserves Vivado codes, severities and Windows paths while bounding noise and duplicates', () => {
  const diagnostics = new VivadoDiagnostics(2, 150)
  const scanner = new LineScanner(diagnostics, 150)
  scanner.push('INFO noise\n'.repeat(5000))
  scanner.push('ERROR: [Synth 8-2715] syntax error [C:/path with spaces/rtl.sv:27]\n'.repeat(2))
  scanner.push('WARNING: [Synth 8-1] warning message\nCRITICAL WARNING: [Synth 8-2] latch\n')
  scanner.push('ERROR: [Synth 8-3] ' + 'x'.repeat(20000) + '\n')
  scanner.push('ERROR: [Synth 8-4] omitted\n')
  scanner.flush()
  expect(diagnostics.errors).toHaveLength(2)
  expect(diagnostics.errors[0]).toMatchObject({ code: 'Synth 8-2715', severity: 'ERROR', file: 'C:/path with spaces/rtl.sv', line: 27, type: 'syntax_error' })
  expect(diagnostics.warnings.map(item => item.severity)).toEqual(['WARNING', 'CRITICAL WARNING'])
  expect(diagnostics).toMatchObject({ lineTruncated: true, errorSeen: true, omitted: 1 })
  expect(diagnostics.errors[1]!.message.length).toBeLessThanOrEqual(150)
})
