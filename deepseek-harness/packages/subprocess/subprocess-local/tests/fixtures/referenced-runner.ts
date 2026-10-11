import { MessageChannel } from 'node:worker_threads'
import { runSelectedSubprocessRunner } from '../../src/bin.ts'
import { consumeRunnerSelection } from '../../src/runner-launch.ts'

const barrier = new MessageChannel()
barrier.port1.on('message', () => { barrier.port1.close(); barrier.port2.close() })
const selection = consumeRunnerSelection()
if (selection === undefined) throw new Error('Private runner selection missing')
await runSelectedSubprocessRunner(selection)
