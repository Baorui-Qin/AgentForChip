/**
 * Join readiness inspection before returning; a terminal first rechecks this exact target.
 * @param check - reads and validates the owned target's physical readiness evidence.
 * @param subscribeTerminal - registers before start and returns its listener disposer.
 * @param start - triggers the single owned operation after terminal subscription.
 * @param timeout - caller's unchanged readiness deadline in milliseconds.
 * @param interval - caller's unchanged poll interval in milliseconds.
 * @returns once readiness is proven; rejects an unready terminal, deadline or read failure.
 */
export async function waitForChildReadiness(check: () => Promise<boolean>, subscribeTerminal: (listener: (code: number) => void) => () => void,
  start: () => void, timeout: number, interval: number): Promise<void> {
  const result = Promise.withResolvers<void>()
  let finished = false, checking = false, recheck = false, terminal: number | undefined
  let pending: Promise<void> = Promise.resolve(), unsubscribe = () => {}
  let timer: ReturnType<typeof setTimeout> | undefined, poll: ReturnType<typeof setInterval> | undefined
  const finish = (error?: Error) => {
    if (finished) return
    finished = true; clearTimeout(timer); clearInterval(poll); unsubscribe()
    if (error) result.reject(error); else result.resolve()
  }
  const inspect = () => {
    if (finished) return
    if (checking) { recheck = true; return }
    checking = true
    pending = (async () => {
      do {
        recheck = false
        if (await check()) { finish(); return }
        if (terminal !== undefined && !recheck) { finish(new Error(`Native child target terminated before readiness: exit=${terminal}`)); return }
      } while (recheck && !finished)
    })().catch((error: unknown) => finish(error instanceof Error ? error : new Error(String(error)))).finally(() => { checking = false })
  }
  unsubscribe = subscribeTerminal(code => { terminal ??= code; inspect() })
  try {
    start()
    if (!finished) {
      timer = setTimeout(() => finish(new Error('Native child target not ready at original deadline')), timeout)
      poll = setInterval(inspect, interval)
      inspect()
    }
    await result.promise
  } finally { finished = true; clearTimeout(timer); clearInterval(poll); unsubscribe(); await pending }
}
