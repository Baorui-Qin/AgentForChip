import { mkdtemp, mkdir, writeFile, rm, access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { afterEach, expect, it } from 'vitest'
import { sha256 } from '../src/phase1/snapshots.ts'

const roots: string[] = []
const publisher = fileURLToPath(new URL('../phase1/p10/publish-netlist-profiles.mjs', import.meta.url))
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })

it.each(['unfinished', 'empty', 'changed-profile', 'missing-receipt'])('does not publish %s calibration evidence', async kind => {
  const root = await mkdtemp(join(tmpdir(), 'netlist-publish-')); roots.push(root)
  const profile = { id: 'test', spec_sha256: 'a'.repeat(64), testbench: 'not a calibrated oracle', checks: 1 }
  const rows = kind === 'empty' ? [] : [{ task_id: 'test', status: 'CALIBRATED', profile_sha256: kind === 'changed-profile' ? 'b'.repeat(64) : sha256(JSON.stringify(profile)), original_run: join(root, 'missing') }]
  await writeFile(join(root, 'results.json'), JSON.stringify({ model_calls: 0, freeze_verified: kind !== 'unfinished', rows }))
  await mkdir(join(root, 'test')); await writeFile(join(root, 'test/profile.json'), JSON.stringify(profile))
  const output = join(root, 'profiles.ts'), result = spawnSync(process.execPath, [publisher, output, root], { encoding: 'utf8', timeout: 10000, windowsHide: true })
  expect(result.error).toBeUndefined()
  expect(result.status).not.toBe(0)
  await expect(access(output)).rejects.toThrow()
})
