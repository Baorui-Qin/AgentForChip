import { writeFile, stat } from 'node:fs/promises'
import { credentialRef } from 'file:///D:/deepseek-harness/packages/credentials/credentials/src/index.ts'
import { launchEnvironmentOf } from 'file:///D:/deepseek-harness/packages/util/launch-environment/src/index.ts'
import { assertUsableApiKey } from 'file:///D:/deepseek-harness/packages/llm/llm/src/index.ts'

export const name = 'repair-config-audit'
export const inject = ['credentials', 'appReady']
export function apply(ctx) {
  const ready = ctx.get('appReady'), exit = ctx.get('appExit')
  ctx.effect(() => ready.onReady(() => {
    void (async () => {
      const ref = credentialRef('DEEPSEEK_API_KEY')
      const info = await ctx.credentials.describe(ref)
      const resolved = await ctx.credentials.resolve(ref)
      let usableFormat = false
      try { if (resolved) { assertUsableApiKey(resolved.value, 'audit', ref); usableFormat = true } } catch {}
      const env = launchEnvironmentOf(ctx)
      const layers = ['process', 'project-env', 'user-env'].map(source => {
        const entry = env.getFrom('DEEPSEEK_API_KEY', [source])
        return { source, present: !!entry?.value, path: entry?.path ?? null }
      })
      const endpoint = env.get('DEEPSEEK_BASE_URL')
      let endpointOrigin = null
      try { endpointOrigin = new URL(endpoint?.value ?? 'https://api.deepseek.com').origin } catch {}
      const files = []
      for (const path of ['C:/Users/qbr/.dsh/.credentials.yaml', 'D:/deepseek-harness/.env', 'D:/AMD/phase1-validation/p07-20260916/dsh-home/.env']) {
        let meta = null
        try { const s = await stat(path); meta = { size: s.size, modified: s.mtime.toISOString() } } catch {}
        files.push({ path, exists: meta !== null, metadata: meta })
      }
      const result = { evidence_kind: 'configuration_audit', api_requests: 0, eda_runs: 0,
        credential: { configured: info.configured, source: info.source ?? null, usable_format: usableFormat, secret_logged: false },
        key_layers: layers, endpoint: { origin: endpointOrigin, source: endpoint?.source ?? 'provider_default' },
        proxy_environment: Object.fromEntries(['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY', 'NODE_USE_ENV_PROXY', 'NODE_EXTRA_CA_CERTS'].map(key => [key, !!env.get(key)?.value])),
        node_version: process.version, files }
      await writeFile('D:/AMD/phase1-validation/p07-20260916/config-audit.json', JSON.stringify(result, null, 2))
      process.stdout.write(JSON.stringify(result) + '\n'); exit(0)
    })().catch(() => { process.stderr.write('Audit failed; no credential content emitted.\n'); exit(1) })
  }))
}
