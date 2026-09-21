/** Host-owned fixture snapshots; path checks detect escapes but are not an OS sandbox. @module rtl-tools/phase1/snapshots */
import { createHash, randomUUID } from 'node:crypto'
import { lstat, mkdir, mkdtemp, readFile, realpath, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { artifactPath, type PhaseId } from './contracts.ts'
import { fixtureFiles, type FixtureId } from './fixtures.ts'
import { atomicJson } from './recorder.ts'

/** Immutable in-memory authority, paired with an auditable on-disk manifest. */
export interface Snapshot { id: PhaseId; directory: string; fixture: FixtureId; trust: 'trusted_fixture' | 'reviewed_candidate'; files: Record<string, string>; manifest: string; sourceHash: string; evaluation?: Evaluation }
/** Host-only evaluator configuration; it is never taken from tool arguments. */
export interface Evaluation { top: string; tbTop: string; sources: string[]; evaluatorId: string; seed: number; datasetRevision: string }
/** Content SHA-256, without a synthetic verification claim. @param data - exact bytes. @returns lowercase digest. */
export function sha256(data: string | Buffer): string { return createHash('sha256').update(data).digest('hex') }

/**
 * Resolve an existing regular file without links, junctions, hardlink aliases or traversal.
 * @param root - host-owned canonical snapshot root.
 * @param name - portable relative reference.
 * @returns the checked absolute file path; callers still need OS isolation against concurrent hostile writes.
 */
export async function checkedFile(root: string, name: string): Promise<string> {
  artifactPath(name)
  let path = root
  if ((await lstat(root)).isSymbolicLink() || await realpath(root) !== root) throw new Error('Snapshot root was redirected')
  for (const part of name.split('/')) {
    path = join(path, part)
    const info = await lstat(path)
    if (info.isSymbolicLink() || (info.isFile() && info.nlink !== 1)) throw new Error('Linked snapshot asset refused')
  }
  const canonical = await realpath(path)
  if (relative(root, canonical).startsWith('..') || !(await lstat(path)).isFile()) throw new Error('Asset escaped snapshot')
  return path
}

/** Allocate a fixed fixture snapshot under a private run directory. @param parent - host-owned parent. @param fixture - fixed fixture id. @returns pinned snapshot authority. */
export async function createSnapshot(parent: string, fixture: FixtureId): Promise<Snapshot> {
  return materializeSnapshot(parent, fixture, fixtureFiles(fixture), 'trusted_fixture')
}

/**
 * Bind exactly one host-reviewed model counter to the unchanged counter evaluator.
 * @param parent - private host artifact directory.
 * @param source - reviewed DUT bytes; this function does not review HDL.
 * @param reviewedSha256 - explicit host approval digest, never supplied by model arguments.
 * @returns separately labelled snapshot; no general execution authorization is granted.
 */
export async function createReviewedCounterSnapshot(parent: string, source: string, reviewedSha256: string): Promise<Snapshot> {
  if (!/^[a-f0-9]{64}$/.test(reviewedSha256) || sha256(source) !== reviewedSha256) throw new Error('Reviewed source hash mismatch')
  return materializeSnapshot(parent, 'counter', { ...fixtureFiles('counter'), 'rtl/solution.sv': source }, 'reviewed_candidate')
}

/** Bind a reviewed DUT to a host-owned dataset evaluator. @param parent - private run directory. @param assets - pinned trusted bytes. @param evaluation - fixed host configuration. @returns fresh authority. */
export async function createDatasetSnapshot(parent: string, assets: Record<string, string>, evaluation: Evaluation): Promise<Snapshot> {
  return materializeSnapshot(parent, 'counter', assets, 'reviewed_candidate', evaluation)
}

async function materializeSnapshot(parent: string, fixture: FixtureId, assets: Record<string, string>, trust: Snapshot['trust'], evaluation?: Evaluation): Promise<Snapshot> {
  const directory = await realpath(await mkdtemp(join(parent, 'snapshot-')))
  const id = randomUUID() as PhaseId
  const files: Record<string, string> = {}
  for (const [name, bytes] of Object.entries(assets)) {
    artifactPath(name)
    await mkdir(dirname(join(directory, name)), { recursive: true })
    await writeFile(join(directory, name), bytes, { flag: 'wx', mode: 0o600 })
    files[name] = sha256(bytes)
  }
  const manifest = { schema_version: '1.1', snapshot_id: id, trust, fixture, top: evaluation?.top ?? 'counter', tb_top: evaluation?.tbTop ?? 'phase1_tb',
    part: 'xczu3eg-sbva484-1-e', tool_version: '2025.2', clock_period_ns: 5, files, ...(evaluation ? { evaluation } : {}) }
  await atomicJson(directory, 'manifest.json', manifest)
  return { id, directory, fixture, trust, files, manifest: JSON.stringify(manifest), sourceHash: files['rtl/solution.sv']!, ...(evaluation ? { evaluation: structuredClone(evaluation) } : {}) }
}

/** Verify manifest and every fixed asset against the host-owned authority. @param snapshot - immutable host registration. */
export async function checkSnapshot(snapshot: Snapshot): Promise<void> {
  const manifest = JSON.parse(await readFile(await checkedFile(snapshot.directory, 'manifest.json'), 'utf8'))
  if (JSON.stringify(manifest) !== snapshot.manifest) throw new Error('Snapshot manifest changed')
  for (const [name, hash] of Object.entries(snapshot.files)) {
    if (sha256(await readFile(await checkedFile(snapshot.directory, name))) !== hash) throw new Error('Snapshot asset changed: ' + name)
  }
}
