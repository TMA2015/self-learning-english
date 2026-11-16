/**
 * SLE Issue #114: learner-facing third-party generative AI policy gate.
 *
 * CLOSED by default AND at source. The Firebase browser config (which may be
 * populated) and App Check do not constitute provider-policy approval for a
 * product likely accessed by minors. Parental consent alone is not an
 * authorization to use the Gemini Developer API.
 *
 * To re-enable in the future: separate provider/legal review, explicit owner
 * approval, code review of this constant, and a separately approved deployment.
 * A runtime environment variable or localStorage toggle MUST NOT bypass it.
 * No learner text may leave through this client/provider path while closed.
 */
const PROVIDER_POLICY_APPROVED_FOR_MINOR_ACCESS = false;
export const LEARNER_EXTERNAL_AI_GATE_REASON =
  'External AI is unavailable for learner accounts while provider-policy review is open. Your learning activities and saved work remain available.';
export function learnerExternalAiEnabled():boolean{
  return PROVIDER_POLICY_APPROVED_FOR_MINOR_ACCESS;
}
