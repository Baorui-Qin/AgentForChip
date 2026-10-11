/** Profile-owned optional engineering knowledge and draft procedures. @module rtl-tools/phase1/agent-guidance */
import { readFile, stat } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { checkedFile, sha256 } from './snapshots.ts'
import { recordValidator } from './record-validation.ts'
import { loadEngineeringKnowledge, type EngineeringContextOptions } from '../knowledge/engineering-knowledge.ts'
import { loadMultiSkills, type MultiSkillOptions } from './multi-skill.ts'

/** The raw profile digest binds its bundle paths, source roots and optional budgets. */
export interface AgentGuidanceSettings { file: string; sha256: string }
interface AssetProfile { file: string; evidence_root: string; bundle_sha256: string; top_k: number; max_tokens: number }
/** Null disables an individual input without opening its bundle or evidence directory. */
export interface AgentGuidanceProfile {
  schema_version: 'agent-guidance-1'
  engineering_knowledge: AssetProfile | null
  multi_skill: (AssetProfile & { system_prompt_v2: boolean }) | null
}
/** Resolved inputs are forwarded to the existing action consumer; they grant no dispatch authority. */
export interface AgentGuidanceOptions { engineeringKnowledge?: EngineeringContextOptions; multiSkill?: MultiSkillOptions }
const assetFields = {
  file: { type: 'string' as const }, evidence_root: { type: 'string' as const }, bundle_sha256: { type: 'string' as const },
  top_k: { type: 'integer' as const }, max_tokens: { type: 'integer' as const },
}
const profileParser = recordValidator<AgentGuidanceProfile>({
  schema_version: { type: 'string', const: 'agent-guidance-1' },
  engineering_knowledge: { oneOf: [{ type: 'null' }, { type: 'object', properties: assetFields, required: Object.keys(assetFields), additionalProperties: false }] },
  multi_skill: { oneOf: [{ type: 'null' }, { type: 'object', properties: { ...assetFields, system_prompt_v2: { type: 'boolean' } }, required: [...Object.keys(assetFields), 'system_prompt_v2'], additionalProperties: false }] },
})

/** Reject partial profile settings without reading files. @param file - explicit host profile, or empty. @param hash - raw SHA-256, or empty. @returns enabled settings, or undefined with no new input. */
export function agentGuidanceSettings(file: string, hash: string): AgentGuidanceSettings | undefined {
  if (!file && !hash) return undefined
  if (!file || !/^[a-f0-9]{64}$/.test(hash)) throw new Error('INVALID_AGENT_GUIDANCE_CONFIGURATION')
  return { file, sha256: hash }
}

/** Load pinned bounded assets before tools and each logical request. Expiry and applicability remain selector decisions. @param settings - absent means no reads. @param toolVersion - current configured EDA version. @param signal - original caller cancellation. @returns options at actual Host time; malformed or changed bytes reject. */
export async function loadAgentGuidance(settings: AgentGuidanceSettings | undefined, toolVersion: string, signal?: AbortSignal): Promise<AgentGuidanceOptions> {
  signal?.throwIfAborted()
  if (!settings) return {}
  agentGuidanceSettings(settings.file, settings.sha256)
  const base = resolve(dirname(settings.file)), file = await checkedFile(base, basename(settings.file))
  if ((await stat(file)).size > 65536) throw new Error('AGENT_GUIDANCE_PROFILE_OVERSIZED')
  const bytes = await readFile(file, { signal })
  if (bytes.length > 65536) throw new Error('AGENT_GUIDANCE_PROFILE_OVERSIZED')
  if (sha256(bytes) !== settings.sha256) throw new Error('AGENT_GUIDANCE_PROFILE_CHANGED')
  const profile = profileParser.parse(JSON.parse(bytes.toString('utf8')))
  for (const asset of [profile.engineering_knowledge, profile.multi_skill]) {
    if (asset && (!asset.file || !asset.evidence_root || !/^[a-f0-9]{64}$/.test(asset.bundle_sha256) ||
      !Number.isSafeInteger(asset.top_k) || asset.top_k < 1 || asset.top_k > 2 ||
      !Number.isSafeInteger(asset.max_tokens) || asset.max_tokens < 1 || asset.max_tokens > 768)) throw new Error('INVALID_AGENT_GUIDANCE_PROFILE')
  }
  const options: AgentGuidanceOptions = {}, at = new Date().toISOString()
  if (profile.engineering_knowledge) {
    const asset = profile.engineering_knowledge
    options.engineeringKnowledge = { bundle: await loadEngineeringKnowledge(resolve(base, asset.file), resolve(base, asset.evidence_root), asset.bundle_sha256, signal),
      toolVersion, at, topK: asset.top_k, maxTokens: asset.max_tokens }
  }
  if (profile.multi_skill) {
    const asset = profile.multi_skill
    options.multiSkill = { bundle: await loadMultiSkills(resolve(base, asset.file), resolve(base, asset.evidence_root), asset.bundle_sha256, signal),
      toolVersion, at, topK: asset.top_k, maxTokens: asset.max_tokens, systemPromptV2: asset.system_prompt_v2 }
  }
  signal?.throwIfAborted()
  return options
}
