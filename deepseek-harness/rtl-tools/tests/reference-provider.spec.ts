import { Context } from '@deepseek-ai/cordis'
import LlmRuntime, { createUserMessage, type StreamChunk } from '@deepseek-ai/dsh-llm'
import { PiAiAdapter } from '@deepseek-ai/dsh-llm-pi-ai'
import { afterEach, expect, it } from 'vitest'
import { resolveProfiles } from '../../packages/llm/llm-pi-ai/src/config.ts'
import { memoryAuth } from '../../packages/llm/llm-pi-ai/tests/auth-double.ts'
import { mockServer, closeMockServers, textEvents } from '../../packages/llm/llm-pi-ai/tests/mock-server.ts'
import { guardStream } from '../src/reference/stream-guard.ts'

const contexts: Context[] = []
afterEach(async () => { for (const ctx of contexts.splice(0)) await ctx.fiber.dispose(); await closeMockServers() })
function toolEvents(args: string, finish = 'tool_calls') {
  return [JSON.stringify({ choices: [{ index: 0, delta: { role: 'assistant', tool_calls: [{ index: 0, id: 'call-a', type: 'function', function: { name: 'check_rtl', arguments: args } }] }, finish_reason: null }] }),
    JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: finish }], usage: { prompt_tokens: 10, completion_tokens: 4 } }), '[DONE]']
}
async function run(script: Parameters<typeof mockServer>[0], signal?: AbortSignal) {
  const server = await mockServer(script)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LlmRuntime)
  ctx.llm.registerAdapter(['local-qwen-fixture'], new PiAiAdapter({
    profiles: () => resolveProfiles({ 'local-qwen-fixture': { api: 'openai-completions', baseURL: server.url,
      retryPolicy: { mode: 'normal', maxRetries: 0 },
      compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: false, maxTokensField: 'max_tokens' },
      models: [{ id: 'qwen-fixture', contextWindow: 32768, maxTokens: 8192, reasoningEfforts: false }] } }),
    resolveApiKey: async () => 'fixture-key', auth: memoryAuth(),
  }))
  const prepared = await ctx.llm.prepareCall({ provider: 'local-qwen-fixture', model: 'qwen-fixture', maxTokens: 8192, temperature: 0 }, signal)
  const input = prepared.stream({ ...prepared.config, messages: [createUserMessage({ content: [{ type: 'text', text: 'Public specification' }], source: { kind: 'user' } })],
    tools: [{ name: 'check_rtl', description: 'Check DUT only', parameters: { type: 'object', properties: { source: { type: 'string' } }, required: ['source'] } }], ...signal ? { signal } : {} })
  const chunks: StreamChunk[] = []
  for await (const chunk of guardStream(input, 65536, async () => {})) chunks.push(chunk)
  return { chunks, server }
}
it('uses the registered OpenAI-compatible provider for text without DeepSeek wire fields', async () => {
  const { chunks, server } = await run([{ events: textEvents }])
  expect(chunks.at(-1)).toMatchObject({ type: 'finish', reason: { kind: 'stop' } })
  expect(server.requests).toHaveLength(1)
  expect(server.requests[0]).toMatchObject({ model: 'qwen-fixture', max_tokens: 8192 })
  expect(JSON.stringify(server.requests)).not.toMatch(/reasoning_effort|thinking|reasoning_content/)
})
it('admits complete streaming tool JSON through pi-ai', async () => {
  const { chunks } = await run([{ events: toolEvents('{"source":"module Fresh; endmodule"}') }])
  expect(chunks.at(-1)).toMatchObject({ type: 'finish', reason: { kind: 'tool-calls' } })
  expect(chunks.some(chunk => chunk.type === 'block-end' && chunk.block.type === 'tool-call')).toBe(true)
})
it.each([
  { events: toolEvents('{"source":"unfinished', 'length') },
  { events: toolEvents('{"source":"repaired"', 'tool_calls') },
  { events: toolEvents('{"source":"complete"}').slice(0, 1) },
  { status: 400, body: '{"error":{"message":"maximum context length exceeded","type":"invalid_request_error"}}' },
  { status: 503, body: '{"error":{"message":"server unavailable"}}' },
])('refuses truncated, repaired, incomplete, or failed HTTP responses %#', async behavior => {
  const { chunks, server } = await run([behavior])
  expect(chunks.some(chunk => chunk.type === 'block-end' && chunk.block.type === 'tool-call')).toBe(false)
  expect(chunks.at(-1)?.type).toBe('finish')
  expect(server.requests).toHaveLength(1)
})
