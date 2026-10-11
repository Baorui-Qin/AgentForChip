/** A target-local readiness wait with the caller's original poll interval and deadline. */
export async function waitForBoundTarget(check: () => Promise<boolean>, subscribeTerminal: (listener: (code: number) => void) => () => void,
  start: () => void, timeout: number, interval: number): Promise<void> {
  const result = Promise.withResolvers<void>()
  let finished = false, polling = false, pending: Promise<void> = Promise.resolve()
  let timer: ReturnType<typeof setTimeout> | undefined, poll: ReturnType<typeof setInterval> | undefined
  const finish = (error?: Error) => {
    if (finished) return
    finished = true; clearTimeout(timer); clearInterval(poll); unsubscribe()
    void pending.then(() => { if (error) result.reject(error); else result.resolve() })
  }
  const unsubscribe = subscribeTerminal(code => finish(new Error(`Bound target terminated before readiness: exit=${code}`)))
  const inspect = () => {
    if (finished || polling) return
    polling = true
    pending = (async () => {
      try { if (await check()) finish() }
      catch (error) { finish(error instanceof Error ? error : new Error(String(error))) }
      finally { polling = false }
    })()
  }
  try {
    start()
    if (!finished) {
      timer = setTimeout(() => finish(new Error('Bound target not ready at original deadline')), timeout)
      poll = setInterval(inspect, interval)
      inspect()
    }
    await result.promise
  }
  finally { finished = true; clearTimeout(timer); clearInterval(poll); unsubscribe(); await pending }
}
