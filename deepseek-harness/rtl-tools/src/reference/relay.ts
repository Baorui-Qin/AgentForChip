/** Loopback-only, budgeted authentication relay for the unmodified baseline. @module rtl-tools/reference/relay */
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { appendFile, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { once } from 'node:events'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { credentialRef } from '@deepseek-ai/dsh-credentials'

export const name = 'rtl-reference-relay'
export const inject = ['credentials']
export const Config = z.object({
  baseURL: z.string().required(), model: z.string().required(), apiKeyEnv: z.string().required(),
  port: z.natural().min(1024).max(65535).required(), directory: z.string().required(),
  maxCalls: z.natural().min(1).required(), durationMs: z.natural().min(1).required(),
  startedAt: z.number().min(0).default(0),
  requestTimeoutMs: z.natural().min(1).required(), maxRequestBytes: z.natural().min(1).required(),
  maxTokens: z.natural().min(1).required(), maxCny: z.number().min(0.01).required(),
  reserveCnyPerCall: z.number().min(0.01).required(),
})

/** Validate the relay's restricted JSON protocol before charging a request slot.
 * @param body - Raw HTTP request body; forwarded unchanged if admitted.
 * @param model - Only configured model this relay serves.
 * @param maxTokens - Frozen output cap, including provider reasoning tokens.
 * @returns Validated request object for auditing.
 */
export function relayRequest(body: string, model: string, maxTokens: number): Record<string, unknown> {
  const value: unknown = JSON.parse(body)
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected request object')
  const request = value as Record<string, unknown>
  if (request.model !== model || !Number.isSafeInteger(request.max_tokens) || Number(request.max_tokens) < 1
    || Number(request.max_tokens) > maxTokens || !Array.isArray(request.messages) || !request.messages.length) throw new Error('Model, messages or token budget mismatch')
  if (request.n !== undefined && request.n !== 1) throw new Error('Multiple choices are not permitted')
  if (request.stream !== undefined && typeof request.stream !== 'boolean') throw new Error('Invalid stream flag')
  for (const message of request.messages) {
    if (!message || typeof message !== 'object' || !['system', 'user', 'assistant', 'tool'].includes(message.role)
      || (message.content !== null && message.content !== undefined && typeof message.content !== 'string')) throw new Error('Only text messages are permitted')
  }
  return request
}

/** Start one authenticated relay; shutdown aborts and joins every active upstream request.
 * @param ctx - Credential service and profile lifecycle.
 * @param config - Frozen model endpoint, ledger directory and authorization budget.
 */
export async function apply(ctx: Context, config: ReturnType<typeof Config>): Promise<void> {
  const base = new URL(config.baseURL)
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) throw new Error('Relay requires a credential-free HTTPS upstream URL')
  const credential = await ctx.credentials.resolve(credentialRef(config.apiKeyEnv))
  if (!credential) throw new Error('Configured API credential is unavailable')
  await mkdir(config.directory)
  const lifetime = new AbortController()
  const active = new Set<Promise<void>>()
  let calls = 0, firstCall = config.startedAt, busy = false
  const ledger = (row: Record<string, unknown>) => appendFile(join(config.directory, 'ledger.jsonl'), JSON.stringify({ at: new Date().toISOString(), ...row }) + '\n')
  await writeFile(join(config.directory, 'budget.json'), JSON.stringify(config, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
  async function serve(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const abort = new AbortController()
    const disconnect = () => { if (!res.writableEnded) abort.abort() }
    res.once('close', disconnect)
    const signal = AbortSignal.any([abort.signal, lifetime.signal, AbortSignal.timeout(config.requestTimeoutMs)])
    const headers = { Authorization: `Bearer ${credential!.value}`, 'Content-Type': 'application/json' }
    let counted = 0
    try {
      if (req.method === 'GET' && req.url === '/v1/models') {
        const upstream = await fetch(config.baseURL.replace(/\/$/, '') + '/models', { headers, signal, redirect: 'error' })
        if (!upstream.ok) throw new Error(`Upstream models status ${upstream.status}`)
        const value = await upstream.json() as { data?: { id: string }[] }
        const model = value.data?.find(item => item.id === config.model)
        if (!model) throw new Error('Configured model absent from upstream models')
        await ledger({ kind: 'models', upstream_status: upstream.status, selected: model })
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ object: 'list', data: [model] })); return
      }
      if (req.method !== 'POST' || req.url !== '/v1/chat/completions') { res.writeHead(404); res.end(); return }
      const parts: Buffer[] = []
      let length = 0
      for await (const bytes of req) {
        const part = Buffer.from(bytes)
        length += part.length
        if (length > config.maxRequestBytes) throw new Error('Request byte cap exceeded')
        parts.push(part)
      }
      const body = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(parts))
      const request = relayRequest(body, config.model, config.maxTokens)
      if (busy || calls >= config.maxCalls || (calls + 1) * config.reserveCnyPerCall > config.maxCny
        || (firstCall !== 0 && Date.now() - firstCall >= config.durationMs)) throw new Error('Experiment budget exhausted or another request is active')
      firstCall ||= Date.now()
      calls++; counted = calls; busy = true
      const totalSignal = AbortSignal.any([signal, AbortSignal.timeout(Math.max(1, config.durationMs - (Date.now() - firstCall)))])
      await writeFile(join(config.directory, `request-${counted}.json`), body, { flag: 'wx', mode: 0o600 })
      await ledger({ kind: 'request', call: counted, model: request.model, stream: request.stream ?? false,
        bytes: Buffer.byteLength(body), sha256: createHash('sha256').update(body).digest('hex'), reserved_cny: calls * config.reserveCnyPerCall })
      // Only Authorization is added. Prompts, model selection and sampling bytes are not rewritten.
      const upstream = await fetch(config.baseURL.replace(/\/$/, '') + '/chat/completions', { method: 'POST', headers, body, signal: totalSignal, redirect: 'error' })
      res.writeHead(upstream.status, { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' })
      if (!upstream.body) throw new Error('Upstream response body is missing')
      for await (const bytes of upstream.body) {
        await appendFile(join(config.directory, `response-${counted}.txt`), bytes)
        if (!res.write(bytes)) await once(res, 'drain', { signal: totalSignal })
      }
      await ledger({ kind: 'response', call: counted, status: upstream.status })
      res.end()
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const cause = error instanceof Error ? error.cause : undefined
      await ledger({ kind: 'error', call: counted || null, message,
        cause: cause instanceof Error ? { message: cause.message, code: (cause as NodeJS.ErrnoException).code } : null })
      if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: { message, type: 'relay_error' } }))
    } finally { if (counted) busy = false; res.off('close', disconnect) }
  }
  const server = createServer((req, res) => {
    const job = serve(req, res).catch(() => { res.destroy() })
    active.add(job); void job.finally(() => active.delete(job))
  })
  ctx.effect(() => async () => {
    lifetime.abort()
    server.closeAllConnections()
    await new Promise<void>(resolve => server.close(() => resolve()))
    await Promise.allSettled([...active])
  })
  server.listen(config.port, '127.0.0.1')
  await once(server, 'listening')
  await writeFile(join(config.directory, 'ready.json'), JSON.stringify({ url: `http://127.0.0.1:${config.port}/v1`, model: config.model }) + '\n', { flag: 'wx' })
}
