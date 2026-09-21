/** Offline official-tokenizer process. There is no estimated fallback. @module rtl-tools/phase1/p09-tokenizer */
import { mkdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createUserMessage, type PreparedLlmCall } from '@deepseek-ai/dsh-llm'
import { serializeRequest } from '@deepseek-ai/dsh-llm-deepseek/src/serialize.ts'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { runCommand } from '../process.ts'
import { publish } from './candidates.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { ContextError, type TextView, type TokenCounter } from './p09-context.ts'

/** Frozen external runtime; no startup installation, network download, or local model. */
export interface TokenizerSettings { python: string; root: string; manifestSha256: string; timeoutMs: number }
/** Text-only serializer shared with the actual official provider. @param prepared - resolved provider configuration. @param view - bounded message text. @returns credential-free request body. */
export function textWire(prepared: PreparedLlmCall, view: TextView) {
  return serializeRequest({ ...prepared.config, system: view.system, tools: [],
    messages: [createUserMessage({ content: [{ type: 'text', text: view.prompt }], source: { kind: 'user' } })] })
}
/** Create a request-scoped exact counter. @param settings - pinned installed runtime. @param subprocess - managed lifecycle. @param directory - private model call directory. @param prepared - resolved configuration. @returns counter rejecting unavailable/mismatched assets. */
export async function officialCounter(settings: TokenizerSettings, subprocess: SubprocessRuntime, directory: string, prepared: PreparedLlmCall): Promise<TokenCounter> {
  const root = resolve(settings.root)
  const bytes = await readFile(await checkedFile(root, 'manifest.json'))
  if (sha256(bytes) !== settings.manifestSha256) throw new ContextError('TOKENIZER_UNAVAILABLE')
  const manifest = JSON.parse(bytes.toString('utf8')) as { revision: string; package_version: string; tokenizer: string; tokenizer_sha256: string; template_sha256: string; package_files: Record<string, string> }
  if (!/^[a-f0-9]{40}$/.test(manifest.revision) || !/^[a-f0-9]{64}$/.test(manifest.template_sha256) || !Object.keys(manifest.package_files).length) throw new ContextError('TOKENIZER_UNAVAILABLE')
  for (const [file, hash] of Object.entries({ [manifest.tokenizer]: manifest.tokenizer_sha256, ...manifest.package_files })) {
    if (sha256(await readFile(await checkedFile(root, file))) !== hash) throw new ContextError('TOKENIZER_UNAVAILABLE')
  }
  const helper = fileURLToPath(new URL('../../phase1/p09/count_tokens.py', import.meta.url))
  const identity = { implementation: 'deepseek-recipe', revision: manifest.revision, package_version: manifest.package_version,
    tokenizer_sha256: manifest.tokenizer_sha256, template_sha256: manifest.template_sha256, helper_sha256: sha256(await readFile(helper)), cloud_equivalence: 'unconfirmed' }
  let seq = 0
  const cache = new Map<string, number>()
  return { quality: 'exact_local', identity, async count(view, signal) {
    const wire = textWire(prepared, view), key = sha256(JSON.stringify(wire))
    const cached = cache.get(key); if (cached !== undefined) return cached
    const run = join(directory, 'token-' + ++seq); await mkdir(run)
    await publish(run, 'input.json', JSON.stringify({ wire, runtime: settings.root, manifest_sha256: settings.manifestSha256 }))
    const process = await runCommand(subprocess, { timeoutMs: settings.timeoutMs, graceMs: 1000, maxLogBytes: 8192, maxLineChars: 8192, stopOnLogLimit: true },
      [settings.python, '-I', helper, join(run, 'input.json')], run, 'counter', signal, { accept() {} })
    if (process.exitCode !== 0 || process.signal || process.timedOut || process.aborted || process.logTruncated) throw new ContextError('TOKENIZER_UNAVAILABLE')
    const output = JSON.parse(await readFile(process.stdoutLog, 'utf8')) as { tokens: number; package_version: string }
    if (!Number.isSafeInteger(output.tokens) || output.tokens < 0 || output.package_version !== manifest.package_version) throw new ContextError('TOKENIZER_UNAVAILABLE')
    cache.set(key, output.tokens); return output.tokens
  } }
}
