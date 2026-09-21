/** Durable claims and conservative campaign dispatch tickets. @module rtl-tools/phase1/p09-claims */
import { mkdir, open, readdir, readFile, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'
import { publish } from './candidates.ts'
import { sha256 } from './snapshots.ts'

/** Claims are never released automatically, including after a crash. @param root - host campaign directory. @param identity - frozen cell identity. @param experiment - owner id. @returns claim digest. */
export async function claimExperiment(root: string, identity: unknown, experiment: string): Promise<string> {
  const claims = join(root, 'claims'); await mkdir(claims, { recursive: true })
  const key = sha256(JSON.stringify(identity))
  try { await publish(claims, key + '.json', JSON.stringify({ identity, experiment, pid: process.pid })) }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new Error('EXPERIMENT_ALREADY_CLAIMED'); throw error }
  return key
}
/** Reserve before dispatch; uncertain deliveries retain their ticket. @param root - campaign root. @param bucket - independently bounded partition. @param owner - request identity. @param signal - cancellation. @returns ticket filename. */
export async function reserveDispatch(root: string, bucket: 'preflight' | 'ablation', owner: unknown, signal: AbortSignal): Promise<string> {
  const directory = join(root, 'dispatches'); await mkdir(directory, { recursive: true })
  const path = join(directory, '.lock')
  let lock
  for (let attempt = 0; attempt < 100; attempt++) {
    signal.throwIfAborted()
    try { lock = await open(path, 'wx'); break }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; await sleep(50, undefined, { signal }) }
  }
  if (!lock) throw new Error('CAMPAIGN_LOCKED_REQUIRES_INSPECTION')
  try {
    const files = (await readdir(directory)).filter(file => file.endsWith('.json'))
    const records = await Promise.all(files.map(async file => JSON.parse(await readFile(join(directory, file), 'utf8')) as { bucket: string }))
    if (records.length >= 375 || records.filter(r => r.bucket === bucket).length >= (bucket === 'ablation' ? 225 : 150)) throw new Error('CAMPAIGN_BUDGET_EXHAUSTED')
    const ticket = String(records.length + 1).padStart(4, '0') + '.json'
    await publish(directory, ticket, JSON.stringify({ bucket, owner, reserved_at: new Date().toISOString() }))
    return ticket
  } finally { await lock.close(); await unlink(path) }
}
