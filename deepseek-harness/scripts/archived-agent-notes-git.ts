/** Read the archive baseline from the target worktree's frozen Git object. */

import { spawnSync } from 'node:child_process'
import { lstatSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path'
import { parseArchiveManifest, type ArchiveManifest } from './archived-agent-notes.ts'

function runGit(cwd: string, args: string[]): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' })
  if (result.error !== undefined) throw result.error
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git exited with status ${result.status}`)
  return result.stdout
}

function within(root: string, path: string, allowRoot = false): string {
  const value = relative(root, path)
  if ((!allowRoot && value === '') || value === '..' || value.startsWith(`..${sep}`) || isAbsolute(value)) {
    throw new Error('archive manifest path is outside the target worktree')
  }
  return value
}

function gitRoot(cwd: string): string {
  return resolve(runGit(cwd, ['rev-parse', '--show-toplevel']).replace(/\r?\n$/, ''))
}

/**
 * Read a committed manifest without consulting its working-tree contents.
 * @param targetRoot - Harness directory in the intended Git worktree.
 * @param manifestPath - Absolute manifest path inside that directory.
 * @param ref - Trusted baseline commit or ref, resolved once before reading.
 * @returns The manifest parsed from the resolved commit's blob.
 * @throws Error for escaped or redirected paths, another repository, missing refs or blobs, or invalid JSON.
 */
export function readArchiveBaselineManifest(targetRoot: string, manifestPath: string, ref: string): ArchiveManifest {
  const target = resolve(targetRoot)
  const manifest = resolve(manifestPath)
  const targetPath = within(target, manifest)
  let parent = target
  for (const segment of targetPath.split(sep).slice(0, -1)) {
    parent = join(parent, segment)
    const info = lstatSync(parent)
    if (info.isSymbolicLink() || !info.isDirectory()) throw new Error('archive manifest parent must be a regular directory')
  }
  const info = lstatSync(manifest, { throwIfNoEntry: false })
  if (info !== undefined && (info.isSymbolicLink() || !info.isFile())) throw new Error('archive manifest must be a regular file')

  const repository = gitRoot(target)
  within(repository, target, true)
  if (relative(repository, gitRoot(dirname(manifest))) !== '') {
    throw new Error('archive manifest is in another Git worktree')
  }
  const objectPath = within(repository, manifest).split(sep).join('/')
  const commit = runGit(repository, ['rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`]).trim()
  return parseArchiveManifest(runGit(repository, ['cat-file', 'blob', `${commit}:${objectPath}`]))
}
