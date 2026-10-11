/** Thin executable/importable entry for the provider-private runner core. */

import { consumeRunnerSelection, WINDOWS_RUNNER_SELECTION } from './runner-target.ts'
import { reportSpawnRunnerFailure, runSpawnRunner } from './spawn-runner.ts'

/**
 * Run a selector already removed by a packaging bootstrap.
 * The private Windows process exits after the core settles its protocol and
 * native ownership; unrelated referenced handles cannot prolong its lifetime.
 * @param selection - private runner selector or Linux launch-request locator.
 */
export async function runSelectedSubprocessRunner(selection: string): Promise<void> {
  try {
    await runSpawnRunner(selection, process.argv.slice(2))
  } catch (error) {
    await reportSpawnRunnerFailure(selection, error)
  }
  if (selection === WINDOWS_RUNNER_SELECTION) process.exit(process.exitCode ?? 127)
}

if (import.meta.main) {
  const selection = consumeRunnerSelection()
  if (selection === undefined) {
    process.exitCode = 127
  } else {
    void runSelectedSubprocessRunner(selection)
  }
}
