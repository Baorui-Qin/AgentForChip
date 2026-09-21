import { chmod, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { afterEach, expect, it } from 'vitest'
import { extractSource, saveCandidate, readCandidate, publish, candidateSchema, checkInterface } from '../src/phase1/candidates.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { SimulationEvidence } from '../src/phase1/verification.ts'

const source = 'module TopModule(input clk, input reset, output reg [3:0] q); always @(posedge clk) if(reset) q<=0; else q<=q+1; endmodule'
const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
async function temporary() { const root = await mkdtemp(join(tmpdir(), 'rtl-candidates-')); roots.push(root); return root }

it.each([source, '[BEGIN]\n' + source + '\n[DONE]', 'Explanation\n```systemverilog\n' + source + '\n```\nEnd.', '[BEGIN]\r\n```sv\r\n' + source + '\r\n```\r\n[DONE]'])('extracts exact source bytes without repair', text => {
  const result = extractSource(text)
  expect(Buffer.from(text).subarray(result.start_byte, result.end_byte).toString()).toBe(result.source)
  expect(result.source.trim()).toBe(source); expect(result.source_sha256).toBe(sha256(result.source))
})
it.each(['', '[BEGIN]' + source, '[DONE]' + source, '[BEGIN]' + source + '[DONE][BEGIN]' + source + '[DONE]', '```sv\n' + source + '\n```\n```sv\n' + source + '\n```', source + '\0', source + '\ud800', '[BEGIN]' + source + '[DONE]\nmodule other; endmodule'])('rejects empty or ambiguous protocol input %j', text => {
  expect(() => extractSource(text)).toThrow()
})
it('rejects truncation and byte overflow, but does not repair missing endmodule or strip HDL comments', () => {
  expect(() => extractSource(source, true)).toThrow()
  expect(() => extractSource(source, false, 20)).toThrow()
  const broken = source.replace('endmodule', '')
  expect(extractSource(broken).source).toBe(broken)
  expect(extractSource('// module bad; 中文\n' + source).source).toContain('中文')
})
it('checks ANSI and non-ANSI ports without interpreting behavioral HDL', () => {
  checkInterface('module TopModule(clk,reset,q); input clk,reset; output [3:0] q; reg [3:0] q; endmodule')
  for (const text of [source.replace('TopModule', 'counter'), source.replace('[3:0]', '[2:0]'), source + '\nmodule helper; endmodule', source.replace('input reset', 'output reset')]) expect(() => checkInterface(text)).toThrow()
  expect(() => checkInterface(source.replace('[3:0]', '[WIDTH-1:0]'))).toThrow('unsupported')
  expect(() => checkInterface(source.replace('input reset', 'input clk'))).toThrow('Duplicate')
})
it('creates unique immutable versions and rejects source mutation, unknown fields and links', async () => {
  const root = await temporary(), experiment = randomUUID()
  const a = await saveCandidate(root, experiment, 'baseline', source, 'a'.repeat(64)), b = await saveCandidate(root, experiment, 'baseline', source, 'a'.repeat(64))
  expect(a.candidate.revision_id).not.toBe(b.candidate.revision_id); expect(a.candidate.source_sha256).toBe(b.candidate.source_sha256)
  expect(await readCandidate(a.directory)).toMatchObject({ source })
  expect(() => candidateSchema.parse({ ...a.candidate, shell: 'bad' })).toThrow()
  await expect(publish(a.directory, 'candidate.json', '{}')).rejects.toThrow()
  expect((await readdir(a.directory)).some(name => name.endsWith('.tmp'))).toBe(false)
  await chmod(join(a.directory, 'rtl/solution.sv'), 0o600); await writeFile(join(a.directory, 'rtl/solution.sv'), source + ' ')
  await expect(readCandidate(a.directory)).rejects.toThrow('changed')
  await symlink(b.directory, join(root, 'redirect'), process.platform === 'win32' ? 'junction' : 'dir')
  await expect(readCandidate(join(root, 'redirect'))).rejects.toThrow('redirected')
  expect(await readFile(join(b.directory, 'rtl/solution.sv'), 'utf8')).toBe(source)
})
it.each(['Mismatches: 0 in 0 samples', 'Mismatches: 1 in 20 samples', 'Mismatches: 0 in 20 samples\nTIMEOUT', 'Mismatches: 0 in 20 samples\nMismatches: 0 in 20 samples', 'PASS', 'Mismatches: 0 in'])('rejects incomplete or conflicting dataset verdict %j', text => {
  const result = new SimulationEvidence(true); text.split('\n').forEach(line => result.accept(line)); expect(result.passed).toBe(false)
})
it('accepts one nonempty zero-mismatch dataset verdict', () => {
  const result = new SimulationEvidence(true); result.accept('Mismatches: 0 in 420 samples'); expect(result.passed).toBe(true); expect(result.checks).toBe(420)
})
