/** Final manifests exclude themselves and reject linked artifacts. @module rtl-tools/phase1/artifact-manifest */
import { readdir, lstat, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from './snapshots.ts'
import { atomicJson } from './recorder.ts'

/** Inspect all terminal files without changing evidence. @param root - completed run. @returns sorted content index excluding its manifest. */
export async function artifactFiles(root: string) {
  const files: { path: string; bytes: number; sha256: string }[] = []
  async function visit(relative: string): Promise<void> {
    for (const name of (await readdir(join(root, relative))).sort()) {
      const path = relative ? relative + '/' + name : name
      if (path === 'artifacts.json') continue
      const info = await lstat(join(root, path))
      if (info.isSymbolicLink()) throw new Error('Linked artifact refused')
      if (info.isDirectory()) await visit(path)
      else if (info.isFile()) { const bytes = await readFile(join(root, path)); files.push({ path, bytes: bytes.length, sha256: sha256(bytes) }) }
    }
  }
  await visit('')
  return files
}

/** Call only after terminal writes and closing the recorder. @param root - completed run. @returns final immutable-content index. */
export async function finalArtifactManifest(root: string) {
  const manifest = { schema_version: '1.7', scope: 'terminal_files_excluding_manifest', excluded: ['artifacts.json'], files: await artifactFiles(root) }
  await atomicJson(root, 'artifacts.json', manifest)
  return manifest
}
