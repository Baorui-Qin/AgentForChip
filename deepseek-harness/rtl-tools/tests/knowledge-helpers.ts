import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { loadKnowledge, type KnowledgeManifest } from '../src/knowledge/knowledge-loader.ts'
import type { DiagnosticFeatures } from '../src/knowledge/diagnostic-features.ts'

export const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url))
export const bundleFile = fileURLToPath(new URL('../knowledge/diagnostic/bundle.json', import.meta.url))
export async function bundle() {
  const manifest = JSON.parse(await readFile(bundleFile, 'utf8')) as KnowledgeManifest
  return loadKnowledge(bundleFile, repositoryRoot, manifest.bundle_sha256)
}
export function query(kind = 'syntax', stage = 'compile'): DiagnosticFeatures {
  return { tool: 'vivado', toolVersion: '2026.1', stage, features: ['complete_evidence', 'dut_attributed'],
    diagnostics: [{ kind, messageId: null, severity: 'ERROR', origin: 'dut', file: 'rtl/solution.sv', line: 1 }], mismatchCount: null, firstFailureTime: null, signals: [] }
}
