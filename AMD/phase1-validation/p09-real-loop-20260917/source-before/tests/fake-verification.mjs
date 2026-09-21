import { readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { spawn } from 'node:child_process'

const options = JSON.parse(process.argv[2])
const args = process.argv.slice(3)
if (args.includes('-version')) { console.log('Vivado Simulator v2025.2'); process.exit(options.versionExit ?? 0) }
const synthesis = args.includes('-mode')
const stage = synthesis ? basename(args.at(-1)).startsWith('synthesis') ? 'synthesis' : 'report'
  : args.some(arg => /\.(sv|v)$/.test(arg)) ? 'compile' : args.includes('-s') ? 'elaborate' : 'simulation'
let build = process.cwd()
while (basename(build) !== 'build') build = dirname(build)
const root = dirname(build)
const snapshot = join(root, (await readdir(root)).find(name => name.startsWith('snapshot-')))
const manifest = JSON.parse(await readFile(join(snapshot, 'manifest.json'), 'utf8'))
let compileGroup = 0
if (stage === 'compile') {
  compileGroup = Number(await readFile(join(root, 'compile-count'), 'utf8').catch(() => '0')) + 1
  await writeFile(join(root, 'compile-count'), String(compileGroup))
  if (options.compileDelay) await new Promise(resolve => setTimeout(resolve, options.compileDelay))
}
await writeFile(join(root, 'last-stage'), stage)
if (options.hang === stage || options.hangGroup === compileGroup && stage === 'compile') {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' })
  await writeFile(join(root, 'child.pid'), String(child.pid))
  setInterval(() => {}, 1000)
} else if (options.noise === stage) {
  process.stdout.write('INFO noise\n'.repeat(100000))
  setInterval(() => {}, 1000)
} else if (options.artifact === stage) {
  await writeFile(join(root, 'overflow.bin'), Buffer.alloc(200000))
  setInterval(() => {}, 1000)
} else {
  if (options.tamper === stage) await writeFile(join(snapshot, 'trusted/tb.sv'), 'changed')
  if (options.repairDiagnostics && stage === 'synthesis' && manifest.fixture === 'synthesis-only') {
    console.error(`ERROR: [Synth 8-439] module 'missing_synthesis_cell' not found [${join(snapshot, 'rtl/solution.sv')}:4]`)
    console.error(`ERROR: [Synth 8-6156] failed synthesizing module 'counter' [${join(snapshot, 'rtl/solution.sv')}:1]`)
    console.error('ERROR: [Common 17-69] Command failed: Synthesis failed - please see the console or run log file for details')
    process.exit(1)
  }
  if (stage === 'compile' && (manifest.fixture === 'syntax' || manifest.fixture.startsWith('controlled_') || options.errorGroup === compileGroup) || stage === 'elaborate' && manifest.fixture === 'missing-module' || stage === 'synthesis' && manifest.fixture === 'synthesis-only' || options.error === stage) {
    console.error(`ERROR: [VRFC 10-123] ${options.repairDiagnostics ? 'syntax error' : 'injected development error'} [${join(snapshot, options.trustedError ? 'trusted/tb.sv' : 'rtl/solution.sv')}:2]`)
    process.exit(options.zeroError ? 0 : 1)
  }
  if (stage === 'simulation') {
    if (options.p09) {
      const source = await readFile(join(snapshot, 'rtl/solution.sv'), 'utf8')
      console.log('Mismatches: ' + (source.includes('q+2') ? 19 : 0) + ' in 20 samples')
      process.exit(0)
    }
    const mismatch = options.repairDiagnostics ? (await readFile(join(snapshot, 'rtl/solution.sv'), 'utf8')).includes('count + 2') : manifest.fixture === 'functional'
    console.log(options.verdict ?? `PHASE1_COMPLETE checks=20 mismatches=${mismatch ? 19 : 0}`)
  }
  if (stage === 'synthesis' && !options.missingNetlist) {
    await writeFile('netlist.v', 'module counter; endmodule\n')
    await writeFile('design.dcp', 'mock checkpoint')
  }
  if (stage === 'report') {
    await writeFile('utilization.rpt', '| Site Type | Used | Available |\n| CLB LUTs* | 2 | 100 |\n| CLB Registers | 6 | 100 |\n| Register as Flip Flop | 4 | 100 |\n| Register as Latch | 2 | 100 |\n| Block RAM Tile | 0.5 | 100 |\n| DSPs | 0 | 100 |\n')
    await writeFile('timing.rpt', 'Design Timing Summary\n WNS(ns) TNS(ns)\n ------- -------\n 4.405 0.000\n')
    await writeFile('clocks.count', '1'); await writeFile('paths.count', '1')
  }
}
