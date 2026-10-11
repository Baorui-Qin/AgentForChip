import { Context, Service } from '@deepseek-ai/cordis'
import type { CredentialRef } from '@deepseek-ai/dsh-credentials'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, expect, it, vi } from 'vitest'
import * as Relay from '../src/reference/relay.ts'

class TestCredentials extends Service {
  constructor(ctx: Context) { super(ctx, 'credentials') }
  async resolve(_ref: CredentialRef) { return { value: 'private-test-key', source: 'test' } }
}
const nativeFetch = globalThis.fetch
const contexts: Context[] = [], roots: string[] = []
afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.unstubAllGlobals()
})
async function setup(overrides: Record<string, unknown> = {}) {
  const root = await mkdtemp(join(tmpdir(), 'rtl relay ')); roots.push(root)
  const socket = createServer()
  await new Promise<void>(resolve => socket.listen(0, '127.0.0.1', resolve))
  const port = (socket.address() as { port: number }).port
  await new Promise<void>(resolve => socket.close(() => resolve()))
  const ctx = new Context(); contexts.push(ctx)
  await ctx.plugin(TestCredentials)
  await ctx.plugin(Relay, { baseURL: 'https://provider.invalid/v1', apiKeyEnv: 'TEST_KEY', model: 'selected', port,
    directory: join(root, 'ledger'), maxCalls: 1, durationMs: 5000, requestTimeoutMs: 2000,
    maxRequestBytes: 4096, maxTokens: 100, maxCny: 1, reserveCnyPerCall: 0.5, ...overrides })
  return { ctx, root, url: `http://127.0.0.1:${port}/v1`, post: (body: string) => nativeFetch(`http://127.0.0.1:${port}/v1/chat/completions`, { method: 'POST', body }) }
}
const body = JSON.stringify({ model: 'selected', messages: [{ role: 'user', content: 'public input' }], max_tokens: 100, temperature: 0, top_p: 1 })

it('adds only authentication, filters actual model metadata, and refuses a second dispatch', async () => {
  const upstream = vi.fn(async (url: string, init: RequestInit) => {
    expect(new Headers(init.headers).get('Authorization')).toBe('Bearer private-test-key')
    return url.endsWith('/models') ? Response.json({ data: [{ id: 'other' }, { id: 'selected', owned_by: 'real-upstream' }] })
      : Response.json({ choices: [{ message: { content: 'module output;' }, finish_reason: 'stop' }] })
  })
  vi.stubGlobal('fetch', upstream)
  const f = await setup()
  expect(await (await nativeFetch(f.url + '/models')).json()).toEqual({ object: 'list', data: [{ id: 'selected', owned_by: 'real-upstream' }] })
  expect((await f.post(body)).status).toBe(200)
  expect(upstream.mock.calls[1]![1].body).toBe(body)
  expect((await f.post(body)).status).toBe(502)
  expect(upstream).toHaveBeenCalledTimes(2)
  expect(await readFile(join(f.root, 'ledger/request-1.json'), 'utf8')).toBe(body)
  expect(await readFile(join(f.root, 'ledger/ledger.jsonl'), 'utf8')).not.toContain('private-test-key')
})
it.each([
  { case_id: 'expired-duration', overrides: () => ({ startedAt: Date.now() - 60000 }) },
  { case_id: 'insufficient-cny', overrides: () => ({ maxCny: 0.1 }) },
  { case_id: 'request-byte-limit', overrides: () => ({ maxRequestBytes: 1 }) },
])('fails closed before dispatch for exhausted bounds $case_id', async ({ overrides }) => {
  const upstream = vi.fn(); vi.stubGlobal('fetch', upstream)
  const f = await setup(overrides())
  expect((await f.post(body)).status).toBe(502)
  expect(upstream).not.toHaveBeenCalled()
})
it('charges failed dispatches and never retries automatically', async () => {
  const upstream = vi.fn(async () => { throw new Error('network failure', { cause: new Error('diagnostic') }) })
  vi.stubGlobal('fetch', upstream)
  const f = await setup()
  expect((await f.post(body)).status).toBe(502)
  expect((await f.post(body)).status).toBe(502)
  expect(upstream).toHaveBeenCalledTimes(1)
})
