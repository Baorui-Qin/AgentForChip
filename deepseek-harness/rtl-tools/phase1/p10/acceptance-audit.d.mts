export interface AcceptanceReference { path: string; sha256: string; status: string }
export function assertAcceptance(reference: AcceptanceReference | undefined, expected: { task: string; source: string; run: string }): Promise<unknown>
export function auditComparison(result: Record<string, unknown>, frozenProtocol?: string): Promise<string>
