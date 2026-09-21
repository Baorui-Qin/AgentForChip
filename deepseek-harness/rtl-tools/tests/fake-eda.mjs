// External CLI fixture, not a Harness application entrypoint.
import { readFileSync, writeFileSync } from 'node:fs'
const args = process.argv.slice(2)
const compiling = args.includes('-g2012')
const input = args.at(-1)
const spec = JSON.parse(readFileSync(input, 'utf8'))
if (compiling) {
  if (spec.compileError) {
    process.stderr.write('fifo.sv:27: syntax error\n' + 'INFO noise\n'.repeat(4000))
    process.exitCode = 2
  } else {
    writeFileSync(args[args.indexOf('-o') + 1], JSON.stringify(spec))
    if (spec.warning) process.stderr.write('fifo.sv:8: warning: truncated expression\n')
  }
} else if (spec.hang) {
  process.stdout.write('waiting\n')
  setInterval(() => {}, 1000)
} else {
  process.stdout.write(spec.output ?? 'PASS\n')
  process.stderr.write(spec.stderr ?? '')
  process.exitCode = spec.exitCode ?? 0
}
