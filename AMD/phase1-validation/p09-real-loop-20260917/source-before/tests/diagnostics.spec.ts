import { describe, expect, it } from 'vitest'
import { Diagnostics, LineScanner } from '../src/diagnostics.ts'

const config = { maxDiagnostics: 2, maxLineChars: 120, passMarker: 'PASS', failMarker: 'FAIL' }

describe('streaming Icarus facts', () => {
  it('keeps the first diagnostics through INFO floods and deduplicates repeated errors', () => {
    const result = new Diagnostics(config)
    const scanner = new LineScanner(result, config.maxLineChars)
    scanner.push('fifo.sv:27: syntax error\n'.repeat(3))
    scanner.push('INFO all normal\n'.repeat(2000))
    scanner.push('fifo.sv:31: error: invalid module item\nfifo.sv:32: syntax error\n')
    expect(result.errors).toEqual([
      { file: 'fifo.sv', line: 27, type: 'syntax_error', message: 'syntax error' },
      { file: 'fifo.sv', line: 31, type: 'invalid_module_item', message: 'error: invalid module item' },
    ])
    expect(result.omitted).toBe(1)
  })

  it('handles Windows paths, ANSI, runtime FATAL, CRLF and unterminated final lines', () => {
    const result = new Diagnostics(config)
    const scanner = new LineScanner(result, config.maxLineChars)
    scanner.push('\u001b[31mC:\\my rtl\\fifo.sv:27: syntax er')
    scanner.push('ror\u001b[0m\r\nFATAL: C:/tb/fifo_tb.sv:42: mismatch\n')
    scanner.push('C:/rtl/fifo.sv:8: warning: width mismatch')
    scanner.flush()
    expect(result.errors[0]).toMatchObject({ file: 'C:\\my rtl\\fifo.sv', line: 27 })
    expect(result.errors[1]).toMatchObject({ file: 'C:/tb/fifo_tb.sv', line: 42, type: 'fatal', message: 'mismatch' })
    expect(result.warnings).toHaveLength(1)
  })

  it('requires whole-line PASS, preserves failure after PASS and bounds oversized lines', () => {
    const result = new Diagnostics(config)
    const scanner = new LineScanner(result, config.maxLineChars)
    scanner.push('NOT PASS\nINFO PASS\nPASS'.padEnd(10000, ' ') + '\n')
    expect(result.passSeen).toBe(false)
    expect(result.lineTruncated).toBe(true)
    scanner.push('PASS\nFAIL\n')
    expect(result.passSeen).toBe(true)
    expect(result.failSeen).toBe(true)
  })
})
