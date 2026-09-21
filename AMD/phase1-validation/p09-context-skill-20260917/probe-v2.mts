import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import { createUserMessage, createToolResultMessage } from 'file:///D:/deepseek-harness/packages/llm/llm/src/index.ts'
import { callAction } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-action-call.ts'
import { loadP09Skills, retrieveP09Skills } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-proposal.ts'
import { parseAutoAction } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-auto-policy.ts'
import { claimExperiment } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-claims.ts'
import { finalArtifactManifest } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/artifact-manifest.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
export const name = 'p09-skill-diagnostic'
export const inject = ['llm', 'subprocess', 'appReady', 'cmdlineArgs']
export function apply(ctx: Context, config: { root: string }) {
  const exit = ctx.get('appExit')!
  const controller = new AbortController()
  let pending: Promise<void> | undefined
  ctx.effect(() => async () => { controller.abort(); await pending })
  ctx.effect(() => ctx.appReady.onReady(() => {
    pending = (async () => {
      const read = async (path: string) => JSON.parse(await readFile(path, 'utf8'))
      const root = config.root, p09 = await read(join(root, 'configs/p09-C.json')), auto = await read(join(root, 'configs/auto.json'))
      const model = { model: 'deepseek-flash', maxTokens: 8192, temperature: 0, timeoutMs: 60000, maxResponseBytes: 65536 }
      const probes = await read(join(root, 'probes.json')), results = []
      for (const probe of probes) {
        const input = await read(join(root, 'inputs', probe.skill + '.json'))
        const id = randomUUID(), directory = join(root, 'native-probe-' + id)
        await claimExperiment(root, { task: probe.skill, variant: 'C', config_hash: sha256(JSON.stringify({ p09, auto, model })), sample: 'native-retrieval-2' }, id)
        await mkdir(directory)
        await mkdir(join(directory, 'models'))
        const observation = await retrieveP09Skills(p09, input.feedback)
        const result = { skill: probe.skill, directory, prompted_diagnostic_not_autonomous_selection: true,
          archived_eda_input: probe.model_run, host_selected: observation.skills.map(s => s.id), retrieved: false, round_trip: false, errors: [] as string[], model_runs: [] as string[] }
        const first = await callAction({ root: directory, experiment: id, sequence: 1, input,
          history: [createUserMessage({ content: [{ type: 'text', text: 'This is an explicit tool-call diagnostic, not a repair attempt. Call retrieve_skill once now. Do not edit, verify or finish yet.' }], source: { kind: 'user' } })],
          auto, p09, model, runtime: ctx.llm, subprocess: ctx.subprocess, maxEventBytes: 1048576, signal: controller.signal,
          loadSkills: () => loadP09Skills(p09), claim: async directory => { result.model_runs.push(directory) }, expectedRequestHash: null })
        const calls = first.message?.content.filter(b => b.type === 'tool-call') ?? []
        if (first.error_code || calls.length !== 1 || calls[0].name !== 'retrieve_skill') result.errors.push(first.error_code ?? 'EXPECTED_RETRIEVE_SKILL')
        else {
          parseAutoAction(calls[0].name, calls[0].arguments)
          const actual = await retrieveP09Skills(p09, input.feedback)
          if (!actual.skills.some(s => s.id === probe.skill)) result.errors.push('EXPECTED_SKILL_NOT_SELECTED')
          else result.retrieved = true
          const tool = createToolResultMessage({ callId: calls[0].id, content: [{ type: 'text', text: JSON.stringify(actual) }], isError: false })
          await writeFile(join(directory, 'tool-result.json'), JSON.stringify({ tool_call_id: calls[0].id, observation: actual, tool_message: tool }, null, 2), { flag: 'wx' })
          const second = await callAction({ root: directory, experiment: id, sequence: 2, input,
            history: [first.message!, tool, createUserMessage({ content: [{ type: 'text', text: 'The requested retrieval result is above. End this diagnostic with the finish tool. Do not edit or verify RTL.' }], source: { kind: 'user' } })],
            auto, p09, model, runtime: ctx.llm, subprocess: ctx.subprocess, maxEventBytes: 1048576, signal: controller.signal,
            loadSkills: () => loadP09Skills(p09), claim: async directory => { result.model_runs.push(directory) }, expectedRequestHash: null })
          const finish = second.message?.content.filter(b => b.type === 'tool-call') ?? []
          if (second.error_code || finish.length !== 1 || finish[0].name !== 'finish') result.errors.push(second.error_code ?? 'EXPECTED_FINISH')
          else { parseAutoAction(finish[0].name, finish[0].arguments); result.round_trip = true }
        }
        await writeFile(join(directory, 'probe-result.json'), JSON.stringify(result, null, 2), { flag: 'wx' })
        await finalArtifactManifest(directory)
        results.push(result)
      }
      await writeFile(join(root, 'native-skill-probes.json'), JSON.stringify(results, null, 2), { flag: 'wx' })
      process.stdout.write(JSON.stringify(results.map(r => ({ skill: r.skill, retrieved: r.retrieved, round_trip: r.round_trip, errors: r.errors }))) + '\n')
      exit(results.every(r => r.retrieved && r.round_trip && !r.errors.length) ? 0 : 1)
    })().catch(error => { process.stderr.write('Diagnostic failed: ' + (error instanceof Error ? error.name : 'unknown') + '; inspect retained artifacts.\n'); exit(1) })
  }))
}
