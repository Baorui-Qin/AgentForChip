import { readFile, lstat, realpath } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, join, resolve, relative, isAbsolute } from 'node:path'

const hash = value => createHash('sha256').update(value).digest('hex')
const invalid = () => { throw new Error('P10_ACCEPTANCE_INVALID') }
async function checked(root, name) {
  if (typeof name !== 'string' || isAbsolute(name) || name.includes('\\') || name.split('/').some(x => !x || x === '.' || x === '..')) invalid()
  const canonical = await realpath(root)
  let path = canonical
  for (const part of name.split('/')) {
    path = join(path, part)
    const stat = await lstat(path)
    if (stat.isSymbolicLink() || stat.isFile() && stat.nlink !== 1) invalid()
  }
  if (relative(canonical, await realpath(path)).startsWith('..')) invalid()
  return readFile(path)
}

/** Rehash success evidence independently of status strings, before export or reporting. */
export async function assertAcceptance(reference, expected) {
  if (!reference || reference.status !== 'PASS' || !/^[a-f0-9]{64}$/.test(reference.sha256)) invalid()
  const bytes = await checked(dirname(reference.path), 'acceptance.json')
  if (resolve(reference.path) !== resolve(dirname(reference.path), 'acceptance.json') || hash(bytes) !== reference.sha256) invalid()
  const receipt = JSON.parse(bytes)
  if (receipt.protocol !== 'p10-netlist-1' || receipt.status !== 'PASS' || receipt.task_id !== expected.task ||
      receipt.candidate_sha256 !== expected.source || resolve(receipt.original_run) !== resolve(expected.run) ||
      receipt.profile_sha256 !== hash(JSON.stringify(receipt.profile)) || !Number.isSafeInteger(receipt.profile?.checks) || receipt.profile.checks <= 0 ||
      receipt.checks !== receipt.profile.checks || receipt.mismatches !== 0 || receipt.environment?.version !== '2025.2' ||
      receipt.environment?.part !== 'xczu3eg-sbva484-1-e' || receipt.environment.library !== 'unisims_ver') invalid()
  const originalBytes = await checked(receipt.original_run, 'result.json'), original = JSON.parse(originalBytes)
  if (hash(originalBytes) !== receipt.original_result_sha256 || original.final_verified !== true || original.final_status !== 'PASS' ||
      original.task_id !== expected.task || original.final_source_sha256 !== expected.source || original.verification_key !== receipt.verification_key ||
      !['compile', 'elaborate', 'simulation', 'synthesis'].every(stage => original.stages?.[stage]?.status === 'PASS')) invalid()
  if (hash(await checked(receipt.original_run, receipt.source_path)) !== expected.source ||
      hash(await checked(receipt.original_run, receipt.netlist_path)) !== receipt.netlist_sha256) invalid()
  if (receipt.netlist_path !== dirname(original.stages.synthesis.report_path).replaceAll('\\', '/') + '/netlist.v') invalid()
  const artifactsBytes = await checked(receipt.original_run, 'artifacts.json')
  if (hash(artifactsBytes) !== receipt.original_artifacts_sha256) invalid()
  const artifacts = JSON.parse(artifactsBytes)
  for (const [path, sha] of [[receipt.source_path, expected.source], [receipt.netlist_path, receipt.netlist_sha256], ['result.json', receipt.original_result_sha256]]) {
    const entries = artifacts.files.filter(entry => entry.path === path)
    if (entries.length !== 1 || entries[0].sha256 !== sha) invalid()
  }
  const root = dirname(reference.path)
  const required = ['netlist.v', 'tb.sv', 'xsim.ini', 'simulate.tcl', ...['compile', 'elaborate', 'simulation'].flatMap(s => [s + '.stdout.log', s + '.stderr.log'])]
  for (const name of required) if (!/^[a-f0-9]{64}$/.test(receipt.files?.[name] ?? '')) invalid()
  for (const [name, sha] of Object.entries(receipt.files)) if (hash(await checked(root, name)) !== sha) invalid()
  if (receipt.files['netlist.v'] !== receipt.netlist_sha256 || receipt.files['tb.sv'] !== hash(receipt.profile.testbench)) invalid()
  if (Object.keys(receipt.environment.files ?? {}).length < 4) invalid()
  for (const [path, sha] of Object.entries(receipt.environment.files)) if (hash(await readFile(path)) !== sha) invalid()
  if (JSON.stringify(receipt.commands?.map(c => c.label)) !== JSON.stringify(['compile', 'elaborate', 'simulation'])) invalid()
  for (const { outcome } of receipt.commands) if (outcome.exitCode !== 0 || outcome.signal || outcome.timedOut || outcome.aborted || outcome.logTruncated) invalid()
  const log = (await checked(root, 'simulation.stdout.log')).toString() + (await checked(root, 'simulation.stderr.log')).toString()
  const matches = [...log.matchAll(/PHASE1_COMPLETE checks=(\d+) mismatches=(\d+)/g)]
  if (matches.length !== 1 || Number(matches[0][1]) !== receipt.checks || Number(matches[0][2]) !== 0 || /(?:Fatal:|FATAL:|TIMEOUT|NETLIST_OUTPUT_UNOBSERVED:)/.test(log)) invalid()
  return receipt
}

/** New freezes cannot silently downgrade missing protocol fields to historical four-stage scoring. */
export async function auditComparison(result, frozenProtocol) {
  const protocol = result.acceptance_protocol ?? frozenProtocol
  if (!protocol) return 'legacy-four-stage-unvalidated'
  if (protocol !== 'p10-netlist-1' || result.acceptance_protocol !== protocol) invalid()
  const refs = result.acceptance_results ?? []
  if (result.initial_status === 'PASS') await assertAcceptance(refs.find(r => resolve(r.run) === resolve(result.baseline_run)),
    { task: result.task_id, source: result.shared_initial_sha256, run: result.baseline_run })
  if (result.status === 'VERIFIED') {
    const reference = refs.find(r => resolve(r.run) === resolve(result.final_verification_run))
    await assertAcceptance(reference,
      { task: result.task_id, source: result.current_source_sha256, run: result.final_verification_run })
    if (result.final_exported_sha256 !== result.current_source_sha256 || result.verified_source_sha256 !== result.current_source_sha256) invalid()
    if (hash(await checked(dirname(dirname(reference.path)), 'final.sv')) !== result.final_exported_sha256) invalid()
  }
  if (result.recovered_by_agent && (result.status !== 'VERIFIED' || result.initial_status === 'PASS')) invalid()
  return protocol
}
