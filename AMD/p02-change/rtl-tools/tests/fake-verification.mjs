import { readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { spawn } from 'node:child_process'

const options = JSON.parse(process.argv[2])
const args = process.argv.slice(3)
if (args.includes('-version')) { console.log('Vivado Simulator v2025.2'); process.exit(0) }
const synthesis = args.includes('-mode')
const stage = synthesis ? basename(args.at(-1)).startsWith('synthesis') ? 'synthesis' : 'report'
  : args.includes('-sv') ? 'compile' : args.includes('-s') ? 'elaborate' : 'simulation'
let build = process.cwd()
while (basename(build) !== 'build') build = dirname(build)
const root = dirname(build)
const snapshot = join(root, (await readdir(root)).find(name => name.startsWith('snapshot-')))
const manifest = JSON.parse(await readFile(join(snapshot, 'manifest.json'), 'utf8'))
await writeFile(join(root, 'last-stage'), stage)
if (options.hang === stage) {
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
  if (stage === 'compile' && manifest.fixture === 'syntax' || stage === 'elaborate' && manifest.fixture === 'missing-module' || stage === 'synthesis' && manifest.fixture === 'synthesis-only' || options.error === stage) {
    console.error(`ERROR: [VRFC 10-123] injected development error [D:/rtl/solution.sv:2]`)
    process.exit(options.zeroError ? 0 : 1)
  }
  if (stage === 'simulation') console.log(options.verdict ?? `PHASE1_COMPLETE checks=20 mismatches=${manifest.fixture === 'functional' ? 19 : 0}`)
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
