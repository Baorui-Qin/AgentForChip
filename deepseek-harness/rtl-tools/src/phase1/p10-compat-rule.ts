/** Conservative, byte-preserving Host-only VerilogEval portability rule. @module rtl-tools/phase1/p10-compat-rule */
import { sha256 } from './snapshots.ts'

/** Protocol identity, distinct from the historical eleven-hash campaign. */
export const compatibilityVersion = 'vivado2025.2-compat-v1'
/** First rule; only complete declaration lines may move. */
export const rule = { id: 'VIVADO_COMPAT_001', version: 1, name: 'move_tb_match_declaration_before_first_use' } as const
/** Static inspection outcomes, never substitute for EDA verdicts. */
export type ScanStatus = 'MATCH_VIVADO_COMPAT_001' | 'NO_KNOWN_COMPAT_ISSUE' | 'UNKNOWN_TEMPLATE' | 'MULTIPLE_MATCH' | 'STATIC_ANALYSIS_ERROR'

/** Preserve offsets while excluding comments and quoted strings. @param text - Verilog source. @returns masked source for bounded template recognition. */
export function mask(text: string): string {
  let out = '', i = 0
  while (i < text.length) {
    const start = i
    if (text.startsWith('//', i)) {
      i = text.indexOf('\n', i); if (i < 0) i = text.length
    } else if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2)
      if (end < 0) throw new Error('UNTERMINATED_COMMENT')
      i = end + 2
    } else if (text[i] === '"') {
      i++
      while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++ }
      if (i >= text.length) throw new Error('UNTERMINATED_STRING')
      i++
    } else { out += text[i++]; continue }
    out += text.slice(start, i).replace(/[^\r\n]/g, ' ')
  }
  return out
}

/** Recognize one reviewed template, not arbitrary SystemVerilog. Static matches are not tool results. @param bytes - exact source bytes. @returns classification and complete-line move coordinates. */
export function scanTB(bytes: Buffer): { status: ScanStatus; reason: string; declaration?: number; initial?: number } {
  try {
    const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes)
    if (!Buffer.from(text).equals(bytes) || /\r(?!\n)/.test(text)) throw new Error('UNSUPPORTED_ENCODING')
    const clean = mask(text), lines = text.match(/[^\n]*\n|[^\n]+$/g) ?? [], masked = clean.match(/[^\n]*\n|[^\n]+$/g) ?? []
    const matches = [...clean.matchAll(/\bwire\s+tb_match\b/g)], mismatches = [...clean.matchAll(/\bwire\s+tb_mismatch\b/g)]
    const modules = [...clean.matchAll(/\b(module|endmodule)\b/g)]
    const dumps = [...clean.matchAll(/\$dumpvars\s*\(/g)]
    if (matches.length > 1 || mismatches.length > 1 || dumps.length > 1) return { status: 'MULTIPLE_MATCH', reason: 'non_unique_declaration_or_waveform' }
    if (!matches.length && !mismatches.length && !/\btb_(?:match|mismatch)\b/.test(clean)) return { status: 'NO_KNOWN_COMPAT_ISSUE', reason: 'no_rule_001_identifiers' }
    const unknown = { status: 'UNKNOWN_TEMPLATE' as const, reason: 'COMPAT_RULE_NOT_APPLICABLE' }
    if (matches.length !== 1 || mismatches.length !== 1 || dumps.length !== 1 || modules.length !== 4 ||
      modules.map(m => m[1]).join(',') !== 'module,endmodule,module,endmodule') return unknown
    const tbStart = modules[2]!.index!, tbEnd = modules[3]!.index!
    if (!/^module\s+tb\(\);/.test(clean.slice(tbStart)) || matches[0]!.index! < tbStart || mismatches[0]!.index! > tbEnd) return unknown
    // Macro-controlled declarations and nonstandard preprocessing require separate review.
    for (const line of masked.filter(l => /^\s*`/.test(l))) {
      if (!/^\s*`(?:timescale\s+1\s*ps\s*\/\s*1\s*ps|define\s+OK\s+12|define\s+INCORRECT\s+13|default_nettype\s+none)\s*$/.test(line)) return unknown
    }
    const decl = masked.findIndex(l => /^\s*wire\s+tb_match\s*;\s*$/.test(l))
    const dump = masked.findIndex(l => /\$dumpvars\s*\(/.test(l)), initial = dump - 2
    if (decl < 0 || initial < 0 || !/^\s*wire\s+tb_mismatch\s*=\s*~\s*tb_match\s*;\s*$/.test(masked[decl + 1] ?? '') ||
      !/^\s*initial\s+begin\s*$/.test(masked[initial]!) || !/^\s*\$dumpfile\("wave\.vcd"\);\s*$/.test(lines[initial + 1]!) ||
      !/^\s*\$dumpvars\(1,\s*stim1\.clk,\s*tb_mismatch\s*,[\w\s,]+\);\s*$/.test(masked[dump]!) ||
      !/^\s*end\s*$/.test(masked[dump + 1] ?? '')) return unknown
    const waveOffset = masked.slice(0, initial).join('').length
    if (waveOffset < tbStart || waveOffset >= tbEnd) return unknown
    if (decl < initial) return { status: 'NO_KNOWN_COMPAT_ISSUE', reason: 'declarations_already_before_waveform_no_transform' }
    if (masked.slice(dump + 2, decl).some(l => l.trim())) return unknown
    // This complete prefix grammar proves the waveform and declarations are at module scope.
    const prefix = clean.slice(tbStart, waveOffset).replace(/\s+/g, ' ').trim()
    if (!/^module tb\(\); typedef struct packed \{ (?:int \w+; )+\} stats; stats stats1; wire\[511:0\] wavedrom_title; wire wavedrom_enable; int wavedrom_hide_after_time; reg clk=0; initial forever #5 clk = ~clk; (?:logic\s*(?:\[[\d:]+\]\s*)?\w+; ?)+$/.test(prefix)) return unknown
    if (/\btb_(?:match|mismatch)\b/.test(prefix)) return unknown
    if (!lines[decl]!.endsWith('\n') || !lines[decl + 1]!.endsWith('\n')) return unknown
    return { status: 'MATCH_VIVADO_COMPAT_001', reason: 'matching_known_pattern', declaration: decl, initial }
  } catch (error) {
    return { status: 'STATIC_ANALYSIS_ERROR', reason: error instanceof Error ? error.message : 'STATIC_ANALYSIS_ERROR' }
  }
}

/** Move two existing lines only; never infer the expected input digest. @param taskId - provenance identity. @param bytes - original bytes. @param expectedSha256 - independently pinned catalog digest. @returns exact permutation, reversible line map and unified diff. */
export function convertTB(taskId: string, bytes: Buffer, expectedSha256: string) {
  if (sha256(bytes) !== expectedSha256) throw new Error('COMPAT_INPUT_SHA_MISMATCH')
  const scan = scanTB(bytes)
  if (scan.status !== 'MATCH_VIVADO_COMPAT_001') throw new Error('COMPAT_RULE_NOT_APPLICABLE: ' + scan.status)
  const lines = bytes.toString('utf8').match(/[^\n]*\n|[^\n]+$/g)!, decl = scan.declaration!, initial = scan.initial!
  const order = lines.map((_, i) => i), moved = order.splice(decl, 2)
  order.splice(initial, 0, ...moved)
  const effective = Buffer.from(order.map(i => lines[i]).join(''))
  const sourceMap = { version: 1, new_to_original_line: order.map(i => i + 1) }
  const patch = `--- original/${taskId}_test.sv\n+++ derived/${taskId}_test.sv\n@@ -${initial + 1},${decl + 2 - initial} +${initial + 1},${decl + 2 - initial} @@\n` +
    lines.slice(decl, decl + 2).map(l => '+' + l).join('') + lines.slice(initial, decl).map(l => ' ' + l).join('') + lines.slice(decl, decl + 2).map(l => '-' + l).join('')
  return { effective, sourceMap, patch }
}
