import { writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

const scenario = process.argv[2]
const args = process.argv.slice(3)
if (args.includes('-version')) {
  process.stdout.write(`Vivado v${scenario === 'version-mismatch' ? '2025.2' : '2026.1'} (fixture)\n`)
  process.exitCode = 1
} else if (args.includes('rev-parse')) {
  process.stdout.write('a'.repeat(40) + '\n')
} else if (args.includes('status')) {
  process.stdout.write('?? rtl-tools/\n')
} else if (args.includes('-Command')) {
  process.stdout.write('{"Name":"Fixture GPU","DriverVersion":"fixture"}\n')
} else if (basename(args.at(-1)) === 'part.tcl') {
  if (scenario === 'missing-part') { process.stderr.write('Target unavailable\n'); process.exitCode = 1 }
  else await writeFile('part.txt', 'xczu3eg-sbva484-1-e\n')
} else {
  await writeFile(join(dirname(process.cwd()), 'source.json'), JSON.stringify(scenario === 'missing-netlist' ? { missingArtifact: true } : {}))
  await import('./fake-vivado.mjs')
}
