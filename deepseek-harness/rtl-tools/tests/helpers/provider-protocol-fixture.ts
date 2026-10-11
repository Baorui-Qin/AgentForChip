import { Context } from '@deepseek-ai/cordis'
import LlmRuntime from '@deepseek-ai/dsh-llm'
import { DeepSeekAdapter, resolveAdapterOptions } from '@deepseek-ai/dsh-llm-deepseek'
import type { AnonymousUserId } from '@deepseek-ai/dsh-anonymous-user-id'
import { expect, vi } from 'vitest'

/** Encode public offline SSE payloads without implementing parsing or accounting. @param payloads - fixture data including an optional real protocol terminator. @returns response bytes. */
export function protocolBody(...payloads: (string | object)[]): string {
  return payloads.map(payload => `data: ${typeof payload === 'string' ? payload : JSON.stringify(payload)}\n\n`).join('')
}

/** Run the shipping adapter and Runtime with only fetch replaced for this fixture. @param body - public SSE body, or no response body. @param use - real consumer under test. @returns the consumer result after adapter disposal. */
export async function withOfflineProtocolProvider<T>(body: string | null, use: (runtime: LlmRuntime) => Promise<T>): Promise<T> {
  const ctx = new Context(), fiber = await ctx.plugin(LlmRuntime)
  const connection = resolveAdapterOptions({ baseURL: 'https://offline.invalid', thinking: 'disabled',
    defaultContextWindow: 131072, retryPolicy: { mode: 'normal', maxRetries: 0 } })
  const adapter = new DeepSeekAdapter({ options: () => connection,
    resolveApiKey: () => Promise.resolve('offline-fixture-key'),
    resolveUserId: () => '00000000-0000-4000-8000-000000000001' as AnonymousUserId,
    prepareExtensions: () => Promise.resolve({ fields: {}, accept: () => Promise.resolve() }) })
  const unregister = ctx.llm.registerAdapter(['deepseek-official'], adapter)
  const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
    if (input !== 'https://offline.invalid/chat/completions' || init?.method !== 'POST' || !init.signal) throw new Error('Unexpected offline provider request')
    return new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } })
  })
  try { return await use(ctx.llm) }
  finally {
    try { expect(fetchMock).toHaveBeenCalledTimes(1) }
    finally { fetchMock.mockRestore(); unregister(); await fiber.dispose() }
  }
}
