import { readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { spawn } from 'node:child_process'

const spec = JSON.parse(await readFile(join(dirname(process.cwd()), 'source.json'), 'utf8'))
const stage = basename(process.argv.at(-1)).startsWith('synthesis') ? 'synthesis' : 'report'
await writeFile('pid.txt', String(process.pid))
if (spec.hang && stage === (spec.hangStage ?? 'synthesis')) {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' })
  await writeFile('child.pid', String(child.pid))
  setInterval(() => {}, 1000)
} else if (stage === 'synthesis') {
  if (spec.noise) process.stdout.write('INFO noise\n'.repeat(5000))
  if (spec.longLine) process.stdout.write('x'.repeat(10000) + '\n')
  if (spec.warning) process.stdout.write('CRITICAL WARNING: [Synth 8-123] latch inferred [D:/rtl/design.sv:8]\n')
  if (spec.environment) process.stderr.write('ERROR: [Common 17-345] A valid license was not found for synthesis\n')
  if (spec.synthError) process.stderr.write('ERROR: [Synth 8-2715] syntax error near ; [D:/rtl/design.sv:2]\n')
  if (!spec.missingArtifact) {
    await writeFile('netlist.v', 'module top; endmodule\n')
    await writeFile('design.dcp', 'fixture checkpoint')
  }
  process.exitCode = spec.exitCode ?? (spec.synthError || spec.environment ? 1 : 0)
} else if (spec.reportError) {
  process.stderr.write('ERROR: [Common 17-69] report command failed\n')
  process.exitCode = 1
} else {
  const utilization = `1. CLB Logic
| Site Type | Used | Fixed | Available |
+-----------+------+-------+-----------+
| CLB LUTs* | 2 | 0 | 70560 |
| CLB Registers | 6 | 0 | 141120 |
| Register as Flip Flop | 4 | 0 | 141120 |
| Register as Latch | 2 | 0 | 141120 |

2. BLOCKRAM
| Site Type | Used | Fixed | Available |
+-----------+------+-------+-----------+
| Block RAM Tile | 0.5 | 0 | 216 |

3. ARITHMETIC
| Site Type | Used | Fixed | Available |
+-----------+------+-------+-----------+
| DSPs | 0 | 0 | 360 |
`
  const timing = `Design Timing Summary
---------------------
    WNS(ns)      TNS(ns)  TNS Failing Endpoints  TNS Total Endpoints
    -------      ------- --------------------- -------------------
    ${spec.wns ?? '-0.125'}        -0.125        1                     4

${spec.timingViolated ? 'Timing constraints are not met.' : ''}
Clock Summary
-------------
`
  if (!spec.missingReport) await writeFile('utilization.rpt', spec.badReport ? 'invalid table' : utilization)
  await writeFile('timing.rpt', spec.badTiming ? 'invalid timing' : timing)
  await writeFile('clocks.count', String(spec.noClocks ? 0 : 1))
  await writeFile('paths.count', String(spec.noPaths || spec.noClocks ? 0 : 1))
}
