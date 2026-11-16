/**
 * Issue #114 — Gemini Developer API specific provider eligibility hold.
 *
 * This does NOT govern OpenAI or future AI providers. SLE is a general-audience
 * English platform and AI feedback is a core Writing capability.
 *
 * The Gemini Developer API's age rule prohibits use in API clients likely
 * accessed by people under 18. No owner assertion about overall audience
 * replaces the separate provider approval. We therefore hold only this
 * particular Gemini-browser route until a compliant arrangement is confirmed.
 *
 * OpenAI server Writing can operate using the owner's server-only API key,
 * subject to its own provider guidance, privacy/age controls, and cost policy
 * BEFORE production activation. No client-side secrets are used.
 */
const GEMINI_DEVELOPER_API_APPROVED_FOR_SLE = false;
export const LEARNER_EXTERNAL_AI_GATE_REASON =
  'Gemini feedback is unavailable pending provider eligibility review. Other Writing activities remain available.';
/** Historical function name retained for browser-only call sites. */
export function learnerExternalAiEnabled():boolean{
  return GEMINI_DEVELOPER_API_APPROVED_FOR_SLE;
}
