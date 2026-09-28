/** Bounded netlist-only verification, separate from legacy four-stage records. @module rtl-tools/phase1/p10-netlist */
import { mkdir, readFile, realpath, readdir } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { runCommand, type CommandResult } from '../process.ts'
import { vivadoArgv } from '../synthesis.ts'
import { VivadoDiagnostics } from '../vivado-parser.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { publish } from './candidates.ts'
import { parseRecord, type RunRecord } from './records.ts'
import type { DoctorSettings } from './doctor.ts'
import { sizeOf, type VerificationLimits } from './verification.ts'
import { SimulationEvidence } from './simulation-evidence.ts'
import { calibratedLibraryFiles, netlistProfile, type NetlistProfile } from './p10-netlist-profiles.ts'
import type { P10Task } from './p10-dataset.ts'

/** This version is mandatory for new P10 scores; old RunRecord.final_verified stays four-stage only. */
export const acceptanceProtocol = 'p10-netlist-1'
export interface NetlistReceipt {
  protocol: typeof acceptanceProtocol; task_id: string; candidate_sha256: string; verification_key: string | null
  original_run: string; original_result_sha256: string; original_artifacts_sha256: string | null; status: string; profile: NetlistProfile | null; profile_sha256: string | null
  netlist_path: string | null; netlist_sha256: string | null; source_path: string | null
  checks: number | null; mismatches: number | null; duration_ms: number
  limits: VerificationLimits & { netlistMs: number }
  environment: { version: string; part: string; library: string; files: Record<string, string> }
  files: Record<string, string>; commands: { label: string; argv: readonly string[]; outcome: CommandResult }[]
}

/** Host entry: checks policy upstream, binds the original run, and never compiles candidate RTL again. */
export async function acceptNetlist(subprocess: SubprocessRuntime, config: DoctorSettings, limits: VerificationLimits & { netlistMs: number },
  task: P10Task, run: string, output: string, signal: AbortSignal): Promise<{ path: string; sha256: string; status: string }> {
  const bytes = await readFile(await checkedFile(await realpath(run), 'result.json'))
  const record = parseRecord('RunResult', JSON.parse(bytes.toString())) as RunRecord
  if (!record.final_verified || record.final_status !== 'PASS' || record.task_id !== task.task_id) throw new Error('NETLIST_INPUT_BINDING_INVALID')
  const receipt = await checkNetlist(subprocess, config, limits, netlistProfile(task), run, record, output, signal)
  return { path: join(output, 'acceptance.json'), sha256: sha256(JSON.stringify(receipt, null, 2)), status: receipt.status }
}

/** Host-only checker also serves calibration fixtures; this function is not registered as an Agent tool. */
export async function checkNetlist(subprocess: SubprocessRuntime, config: DoctorSettings, limits: VerificationLimits & { netlistMs: number },
  profile: NetlistProfile | null, originalRun: string, record: RunRecord, output: string, caller: AbortSignal): Promise<NetlistReceipt> {
  await mkdir(output)
  const root = await realpath(output), run = await realpath(originalRun), start = performance.now()
  const originalResultHash = sha256(await readFile(await checkedFile(run, 'result.json')))
  const deadline = new AbortController(), quota = new AbortController()
  const timer = setTimeout(() => deadline.abort(), limits.netlistMs)
  const signal = AbortSignal.any([caller, deadline.signal, quota.signal])
  let poll = Promise.resolve(), polling = false
  const auditSize = async () => { if (await sizeOf(root) > limits.maxArtifactBytes) quota.abort() }
  const watcher = setInterval(() => {
    if (polling) return
    polling = true
    poll = auditSize().catch(() => quota.abort()).finally(() => { polling = false })
  }, limits.artifactPollMs)
  const receipt: NetlistReceipt = { protocol: acceptanceProtocol, task_id: record.task_id, candidate_sha256: record.final_source_sha256!,
    verification_key: record.verification_key, original_run: run, original_result_sha256: originalResultHash, original_artifacts_sha256: null,
    status: 'NETLIST_NOT_CALIBRATED', profile, profile_sha256: profile ? sha256(JSON.stringify(profile)) : null,
    netlist_path: null, netlist_sha256: null, source_path: null, checks: null, mismatches: null, duration_ms: 0,
    limits: { compileMs: limits.compileMs, elaborateMs: limits.elaborateMs, simulationMs: limits.simulationMs, totalMs: limits.totalMs,
      netlistMs: limits.netlistMs, maxArtifactBytes: limits.maxArtifactBytes, artifactPollMs: limits.artifactPollMs, maxEventBytes: limits.maxEventBytes },
    environment: { version: config.expectedVivadoVersion, part: config.part, library: 'unisims_ver', files: {} }, files: {}, commands: [] }
  try {
    signal.throwIfAborted()
    if (!profile) return receipt
    const manifests = record.artifact_manifest.filter(name => /^snapshot-[^/]+\/manifest\.json$/.test(name))
    if (manifests.length !== 1) throw new Error('NETLIST_INPUT_BINDING_INVALID')
    const manifest = JSON.parse(await readFile(await checkedFile(run, manifests[0]!), 'utf8'))
    const dut = manifest.sources.filter((source: { role: string }) => source.role === 'dut')
    if (dut.length !== 1 || manifest.part !== config.part || manifest.tool_version !== config.expectedVivadoVersion) throw new Error('NETLIST_INPUT_BINDING_INVALID')
    receipt.source_path = dirname(manifests[0]!).replace(/\\/g, '/') + '/' + dut[0].path
    if (sha256(await readFile(await checkedFile(run, receipt.source_path))) !== receipt.candidate_sha256 || manifest.files[dut[0].path] !== receipt.candidate_sha256) throw new Error('NETLIST_INPUT_BINDING_INVALID')
    const report = record.stages.synthesis?.report_path
    if (!report) throw new Error('NETLIST_INPUT_BINDING_INVALID')
    const synthesis = JSON.parse(await readFile(await checkedFile(run, report), 'utf8'))
    if (synthesis.success !== true) throw new Error('NETLIST_INPUT_BINDING_INVALID')
    receipt.netlist_path = dirname(report).replace(/\\/g, '/') + '/netlist.v'
    const netlist = await readFile(await checkedFile(run, receipt.netlist_path))
    receipt.netlist_sha256 = sha256(netlist)
    const artifactBytes = await readFile(await checkedFile(run, 'artifacts.json'))
    receipt.original_artifacts_sha256 = sha256(artifactBytes)
    const artifacts = JSON.parse(artifactBytes.toString())
    for (const [path, hash] of [[receipt.netlist_path, receipt.netlist_sha256], [receipt.source_path, receipt.candidate_sha256], ['result.json', receipt.original_result_sha256]]) {
      const entries = artifacts.files.filter((entry: { path: string }) => entry.path === path)
      if (entries.length !== 1 || entries[0].sha256 !== hash) throw new Error('NETLIST_INPUT_BINDING_INVALID')
    }
    await publish(root, 'netlist.v', netlist.toString())
    await publish(root, 'tb.sv', profile.testbench)
    await publish(root, 'simulate.tcl', 'run all\nquit\n')
    for (const name of ['netlist.v', 'tb.sv', 'simulate.tcl']) receipt.files[name] = sha256(await readFile(join(root, name)))
    const executable = await subprocess.resolveExecutable(config.tools.xelab, undefined, signal)
    const install = dirname(dirname(executable))
    const library = await realpath(join(install, 'data/xsim/verilog/unisims_ver'))
    for (const name of (await readdir(library)).sort()) {
      const file = await checkedFile(library, name)
      receipt.environment.files[file] = sha256(await readFile(file))
      if (receipt.environment.files[file] !== calibratedLibraryFiles[name]) throw new Error('NETLIST_ENVIRONMENT_NOT_CALIBRATED')
    }
    if (Object.keys(receipt.environment.files).length !== Object.keys(calibratedLibraryFiles).length) throw new Error('NETLIST_LIBRARY_MISSING')
    await publish(root, 'xsim.ini', `unisims_ver=${library.replace(/\\/g, '/')}\n`)
    receipt.files['xsim.ini'] = sha256(await readFile(join(root, 'xsim.ini')))
    const evidence = new SimulationEvidence()
    let outputUnobserved = false
    const commands: [string, string, string[], number][] = [
      ['compile', config.tools.xvlog, ['-sv', 'netlist.v', 'tb.sv'], limits.compileMs],
      ['elaborate', config.tools.xelab, ['netlist_tb', 'glbl', '-L', 'unisims_ver', '-s', 'netlist_sim', '-mt', String(config.limits.threads)], limits.elaborateMs],
      ['simulation', config.tools.xsim, ['netlist_sim', '-tclbatch', 'simulate.tcl', '-sv_seed', '1'], limits.simulationMs],
    ]
    receipt.status = 'NETLIST_TOOL_ERROR'
    for (const [label, tool, args, timeoutMs] of commands) {
      signal.throwIfAborted()
      const path = await subprocess.resolveExecutable(tool, undefined, signal)
      receipt.environment.files[path] = sha256(await readFile(path))
      const cmd = process.platform === 'win32' && /\.(bat|cmd)$/i.test(path) ? await subprocess.resolveExecutable('cmd.exe', undefined, signal) : undefined
      const argv = vivadoArgv(path, args, process.platform, cmd)
      const diagnostics = new VivadoDiagnostics(config.limits.maxDiagnostics, config.limits.maxLineChars)
      const outcome = await runCommand(subprocess, { ...config.limits, timeoutMs, stopOnLogLimit: true }, argv, root, label, signal,
        { accept(line, truncated) {
          diagnostics.accept(line, truncated)
          if (label === 'simulation') { evidence.accept(line); outputUnobserved ||= line.includes('NETLIST_OUTPUT_UNOBSERVED:') }
        } })
      receipt.commands.push({ label, argv, outcome })
      if (outcome.timedOut) { receipt.status = 'NETLIST_TIMEOUT'; break }
      if (outcome.logTruncated || diagnostics.lineTruncated) { receipt.status = 'NETLIST_TRUNCATED'; break }
      if (outcome.aborted || outcome.signal || outcome.exitCode !== 0 || diagnostics.errorSeen) break
      if (label === 'simulation') {
        receipt.checks = evidence.checks; receipt.mismatches = evidence.mismatches
        receipt.status = outputUnobserved || !evidence.completed || evidence.checks !== profile.checks ? 'NETLIST_EVIDENCE_MISSING' : evidence.passed ? 'PASS' : 'NETLIST_MISMATCH'
      }
    }
    if (sha256(await readFile(await checkedFile(run, receipt.netlist_path))) !== receipt.netlist_sha256 ||
      sha256(await readFile(await checkedFile(run, receipt.source_path))) !== receipt.candidate_sha256 ||
      sha256(await readFile(join(run, 'result.json'))) !== receipt.original_result_sha256 ||
      sha256(await readFile(join(run, 'artifacts.json'))) !== receipt.original_artifacts_sha256) throw new Error('NETLIST_INPUT_BINDING_INVALID')
    for (const [path, hash] of Object.entries(receipt.environment.files)) if (sha256(await readFile(path)) !== hash) throw new Error('NETLIST_ENVIRONMENT_CHANGED')
  } catch (error) {
    receipt.status = error instanceof Error && /^NETLIST_[A-Z_]+$/.test(error.message) ? error.message : 'NETLIST_TOOL_ERROR'
  } finally {
    clearInterval(watcher); await poll
    await auditSize().catch(() => quota.abort())
    if (caller.aborted) receipt.status = 'NETLIST_CANCELLED'
    else if (deadline.signal.aborted) receipt.status = 'NETLIST_TIMEOUT'
    else if (quota.signal.aborted) receipt.status = 'NETLIST_ARTIFACT_LIMIT'
    clearTimeout(timer)
    for (const name of ['netlist.v', 'tb.sv', 'xsim.ini', 'simulate.tcl', ...receipt.commands.flatMap(command => [relative(root, command.outcome.stdoutLog), relative(root, command.outcome.stderrLog)])]) {
      const bytes = await readFile(join(root, name)).catch(error => { if (error.code === 'ENOENT') return null; throw error })
      const key = name.replace(/\\/g, '/')
      if (receipt.files[key] && (!bytes || receipt.files[key] !== sha256(bytes))) receipt.status = 'NETLIST_INPUT_BINDING_INVALID'
      else if (bytes) receipt.files[key] = sha256(bytes)
    }
    receipt.duration_ms = Math.round(performance.now() - start)
    await publish(root, 'acceptance.json', JSON.stringify(receipt, null, 2))
  }
  return receipt
}
