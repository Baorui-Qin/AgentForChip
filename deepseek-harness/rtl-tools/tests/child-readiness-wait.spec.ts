import { expect, it, vi } from 'vitest'
import { waitForChildReadiness } from './helpers/child-readiness-wait.ts'

function terminal() {
  const listeners = new Set<(code: number) => void>()
  return { listeners, subscribe(listener: (code: number) => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    send(code: number) { for (const listener of listeners) listener(code) } }
}
it('subscribes before triggering a native child operation and stops an unready terminal', async () => {
  const events = terminal(), check = vi.fn(async () => false)
  await expect(waitForChildReadiness(check, events.subscribe, () => { expect(events.listeners.size).toBe(1); events.send(1) }, 10000, 30)).rejects.toThrow('before readiness: exit=1')
  expect(check).toHaveBeenCalled(); expect(events.listeners.size).toBe(0)
})
it('checks a real ready receipt when the terminal notification wins polling', async () => {
  const events = terminal()
  await expect(waitForChildReadiness(async () => true, events.subscribe, () => events.send(1), 10000, 30)).resolves.toBeUndefined()
  expect(events.listeners.size).toBe(0)
})
it('rechecks readiness published while an earlier read is pending at terminal', async () => {
  const events = terminal(), entered = Promise.withResolvers<void>(), release = Promise.withResolvers<boolean>()
  let reads = 0
  const waiting = waitForChildReadiness(async () => { if (++reads === 1) { entered.resolve(); return release.promise } return true }, events.subscribe, () => {}, 10000, 30)
  await entered.promise; events.send(1); release.resolve(false)
  await waiting; expect(reads).toBe(2); expect(events.listeners.size).toBe(0)
})
it('joins the losing readiness read before exposing a terminal failure', async () => {
  const events = terminal(), entered = Promise.withResolvers<void>(), release = Promise.withResolvers<boolean>()
  let complete = false
  const waiting = waitForChildReadiness(async () => { entered.resolve(); await release.promise; complete = true; return false }, events.subscribe, () => {}, 10000, 30)
  const rejected = expect(waiting).rejects.toThrow('before readiness')
  await entered.promise; events.send(1); expect(complete).toBe(false); release.resolve(false)
  await rejected; expect(complete).toBe(true); expect(events.listeners.size).toBe(0)
})
it('fails at the supplied readiness deadline without a terminal and detaches polling', async () => {
  const events = terminal()
  await expect(waitForChildReadiness(async () => false, events.subscribe, () => {}, 20, 5)).rejects.toThrow('original deadline')
  expect(events.listeners.size).toBe(0)
})
it('preserves the readiness reader error and closes its terminal listener', async () => {
  const events = terminal(), error = new Error('exact run readiness read failed')
  await expect(waitForChildReadiness(async () => { throw error }, events.subscribe, () => {}, 10000, 30)).rejects.toBe(error)
  expect(events.listeners.size).toBe(0)
})
it('preserves a failed trigger without leaving terminal or polling branches active', async () => {
  const events = terminal(), check = vi.fn(async () => false), error = new Error('native trigger failed')
  await expect(waitForChildReadiness(check, events.subscribe, () => { throw error }, 10000, 30)).rejects.toBe(error)
  expect(check).not.toHaveBeenCalled(); expect(events.listeners.size).toBe(0)
})
