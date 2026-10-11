import { execFileSync, spawnSync } from 'node:child_process'
import { lstatSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { renderArchiveManifest, type ArchiveManifest } from './archived-agent-notes.ts'

const roots: string[] = []
const loader = import.meta.resolve('tsx/esm')
const helper = new URL('./archived-agent-notes-git.ts', import.meta.url).href
const first: ArchiveManifest = { version: 1, files: { 'process/2026-01-01-example.md': `sha256:${'a'.repeat(64)}` } }
const second: ArchiveManifest = { version: 1, files: { 'process/2026-01-01-example.md': `sha256:${'b'.repeat(64)}` } }

interface Fixture { owner: string; repository: string; target: string; manifest: string; runner: string; env: NodeJS.ProcessEnv }

afterEach(() => {
  for (const root of roots.splice(0)) {
    const absolute = resolve(root)
    if (dirname(absolute) !== resolve(tmpdir()) || !absolute.startsWith(join(resolve(tmpdir()), 'dsh-archive-baseline-'))
      || lstatSync(absolute).isSymbolicLink()) throw new Error('refusing to remove a non-owned fixture')
    rmSync(absolute, { recursive: true, force: true })
  }
})

function git(fixture: Fixture, args: string[], cwd = fixture.repository): string {
  return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', env: fixture.env }).trim()
}

function fixture(commitManifest = true): Fixture {
  const owner = mkdtempSync(join(tmpdir(), 'dsh-archive-baseline-')); roots.push(owner)
  const repository = join(owner, '仓库 with spaces'), target = join(repository, '工具链 with spaces')
  const manifest = join(target, '.agents/notes/archived/manifest.json'), runner = join(owner, 'read-baseline.mjs')
  mkdirSync(dirname(manifest), { recursive: true })
  const env: NodeJS.ProcessEnv = Object.fromEntries(Object.entries(process.env).filter(([name]) => !/^GIT_/i.test(name)))
  Object.assign(env, { GIT_AUTHOR_NAME: 'Archive Fixture', GIT_AUTHOR_EMAIL: 'archive@example.test',
    GIT_COMMITTER_NAME: 'Archive Fixture', GIT_COMMITTER_EMAIL: 'archive@example.test',
    GIT_CONFIG_GLOBAL: join(owner, 'gitconfig'), GIT_CONFIG_NOSYSTEM: '1', GIT_TERMINAL_PROMPT: '0', GIT_DEFAULT_HASH: 'sha1' })
  writeFileSync(env.GIT_CONFIG_GLOBAL!, '')
  const value = { owner, repository, target, manifest, runner, env }
  git(value, ['init', '--quiet', '--initial-branch=fixture'])
  writeFileSync(join(repository, 'README.md'), 'owned fixture\n')
  if (commitManifest) writeFileSync(manifest, renderArchiveManifest(first.files))
  git(value, ['add', '--all'])
  git(value, ['-c', 'core.hooksPath=disabled-fixture-hooks', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'baseline'])
  writeFileSync(runner, `import { readArchiveBaselineManifest } from ${JSON.stringify(helper)}\n` +
    'try { process.stdout.write(JSON.stringify(readArchiveBaselineManifest(...process.argv.slice(2)))) }\n' +
    'catch (error) { process.stderr.write(error.message); process.exitCode = 1 }\n')
  return value
}

function read(value: Fixture, options: { cwd?: string; target?: string; manifest?: string; ref?: string } = {}) {
  const result = spawnSync(process.execPath, ['--import', loader, value.runner,
    options.target ?? value.target, options.manifest ?? value.manifest, options.ref ?? 'HEAD'], {
    cwd: options.cwd ?? value.repository, encoding: 'utf8', env: value.env,
  })
  expect(result.error).toBeUndefined()
  expect(result.signal).toBeNull()
  return result
}

describe('archive baseline Git objects', () => {
  it.each(['repository root', 'Harness root', 'nested directory'] as const)('reads the same frozen object from %s with Chinese and space paths', (position) => {
    const value = fixture(), nested = join(value.target, 'nested directory')
    mkdirSync(nested)
    const result = read(value, { cwd: position === 'repository root' ? value.repository : position === 'Harness root' ? value.target : nested })
    expect(result.status, result.stderr).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual(first)
  })

  it('uses committed HEAD bytes when the working-tree manifest differs', () => {
    const value = fixture()
    writeFileSync(value.manifest, renderArchiveManifest(second.files))
    const result = read(value)
    expect(result.status, result.stderr).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual(first)
  })

  it('resolves the requested pre-change ref instead of using newer HEAD', () => {
    const value = fixture(), before = git(value, ['rev-parse', 'HEAD'])
    writeFileSync(value.manifest, renderArchiveManifest(second.files))
    git(value, ['add', '--', relative(value.repository, value.manifest).split(sep).join('/')])
    git(value, ['-c', 'core.hooksPath=disabled-fixture-hooks', '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'newer manifest'])
    const result = read(value, { ref: before }), current = read(value)
    expect(result.status, result.stderr).toBe(0)
    expect(current.status, current.stderr).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual(first)
    expect(JSON.parse(current.stdout)).toEqual(second)
  })

  it('fails when the selected ref has no manifest even if working-tree bytes exist', () => {
    const value = fixture(false)
    writeFileSync(value.manifest, renderArchiveManifest(first.files))
    const result = read(value)
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/does not exist|not exist|invalid object|Not a valid object|exists on disk, but not in/i)
    expect(result.stdout).toBe('')
  })

  it('rejects an option-shaped or missing ref without reading working-tree bytes', () => {
    const value = fixture()
    for (const ref of ['--help', 'refs/heads/does-not-exist']) {
      const result = read(value, { ref })
      expect(result.status).toBe(1)
      expect(result.stderr).toMatch(/single revision|unknown revision|bad revision|not a valid|invalid/i)
      expect(result.stdout).toBe('')
    }
  })

  it('rejects a path escaping the target Harness directory', () => {
    const value = fixture(), result = read(value, { manifest: join(value.target, '../outside.json') })
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/outside the target worktree/)
  })

  it('rejects a manifest in a nested non-target Git worktree', () => {
    const value = fixture(), nested = join(value.target, 'other repository'), manifest = join(nested, 'manifest.json')
    mkdirSync(nested)
    git(value, ['init', '--quiet', '--initial-branch=other'], nested)
    writeFileSync(manifest, renderArchiveManifest(first.files))
    const result = read(value, { manifest })
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/another Git worktree/)
  })

  it('rejects a symlink or junction parent before reading a redirected manifest', () => {
    const value = fixture(), outside = join(value.owner, 'outside'), redirect = join(value.target, 'redirect')
    mkdirSync(outside)
    writeFileSync(join(outside, 'manifest.json'), renderArchiveManifest(first.files))
    symlinkSync(outside, redirect, process.platform === 'win32' ? 'junction' : 'dir')
    const result = read(value, { manifest: join(redirect, 'manifest.json') })
    expect(result.status).toBe(1)
    expect(result.stderr).toMatch(/parent must be a regular directory/)
  })
})
