# SLE Writing AI — Free-first Provider Spike R0

- Packet: `SLE-WRITING-AI-FREE-FIRST-INFRA-R0-20261116`
- Date: 2026-11-16
- Source baseline: `main` at `4e727310cecd2ae5107134f08a804f64c10c42db`
- Scope: **infrastructure experiment only**, not a Week 2 teaching-content or production release
- Status: **synthetic/mock QA pending CI**; live provider quality/cost/privacy NOT YET TESTED
- SLE is a **general-audience** English learning platform. Useful personalized Writing feedback is a core goal.

## Research conclusion

Cloudflare Workers AI is a plausible **free-first**, server-side inference option for SLE, whose current application source already uses Cloudflare Workers and D1. It is not the same as Gemini Developer API or the existing OpenAI paid API path.

Per official documentation (verified November 16, 2026):

- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/): Workers Free includes 10,000 Neurons/day, reset daily UTC; exceeding that free allocation rejects further inferences on Free, rather than billing without a Paid plan.
- [Workers AI data handling](https://developers.cloudflare.com/workers-ai/platform/data-usage/): standard stateless inferences have a zero-data-retention commitment and customer content is not used for model training. Logging, caching, storage integrations and other selected stateful features are exceptions requiring separate review.
- [Workers AI binding](https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/): a server-side `AI` binding exposes `env.AI.run()`; no exposed browser API key is necessary.
- [JSON Mode](https://developers.cloudflare.com/workers-ai/features/json-mode/): structured JSON responses are supported by selected models, but response conformance is not guaranteed.
- [Llama 3.3 70B FP8 model](https://developers.cloudflare.com/workers-ai/models/llama-3.3-70b-instruct-fp8-fast/): selected candidate supports text generation; license, inference capacity, answer quality and actual quota use must still be checked.

## Implemented on this isolated Draft branch

1. `infrastructure/ai/workers-ai-provider.ts` — reusable `AITutorProvider` adapter; pinned candidate model `@cf/meta/llama-3.3-70b-instruct-fp8-fast`; constrained request sizes and output tokens; JSON-only parsing; safe null fallback for malformed responses, out-of-quota or inference errors; no prompt/response logging.
2. `infrastructure/ai/runtime.ts` — server-only explicit switch:
   - If `SLE_WRITING_AI_PROVIDER=cloudflare-workers-ai`, use `env.AI`; if absent, **unavailable**, with **no automatic paid OpenAI fallback**.
   - If the switch is unset, preserve the prior OpenAI API provider behavior. This avoids silent migration of live evaluations.
3. `tests/workers-ai-provider-spike.cjs` — synthetic response shape, tutor contract validation, malformed output, oversized input, unavailable binding, server selector and no-cost-fallback tests. No real model inference or actual learner data.

## Explicitly NOT implemented

- No `AI` binding in Wrangler or production environments. **No Cloudflare inference, deployment, provider activation or charges.**
- No Week 2 React/UI changes, no autonomous grading, no completion-score alterations or changes to immutable MCQs, canonical storage, history or Weeks 3–12.
- No provider switch in the production environment.
- No implicit age classification, no assertion that Gemini Developer API is approved for SLE. Provider-specific terms still apply.
- No assumption that Workers AI feedback quality meets Writing rubric standards: JSON validity is NOT evidence of pedagogical correctness.

## Required gates before any activation

**Engineering:** live synthetic Cloudflare Workers AI quality/cost pilot (with explicit Owner authorization), model and provider terms review, latency and error/quota handling, budget safeguards, authenticated-Sites storage/revision workflow, no client secrets, rate limiting, and all exact-HEAD CI.

**Academic:** independent NotebookLM review of an *optional AI semantic-feedback teaching delta*; AI suggestions clearly separated from self-check, automatic completion and formal CEFR/IELTS assessment. Week 2 R2 must keep its stage names and canonical four-field record contract.

**Privacy:** access/age handling and provider suitability for general-audience SLE, avoid direct personal data in prompts, appropriate retention settings, consent/notice and safeguards for minors where applicable. Verify the license of any selected model.

**Owner:** separate approval for costs/provider enablement and another explicit merge/deploy decision.

## Pilot acceptance targets (synthetic writing only)

- Correctly identify a relevant vs off-topic brainstormed idea without fabricating rejection.
- Suggest how to strengthen a vague reason and one grounded example; avoid doing the student's assignment.
- Do not hallucinate objective “correct answers” for open-ended planning.
- No false CEFR/IELTS grades from short planning notes.
- For requests above quota or malformed JSON, show neutral feedback-unavailable state while keeping saved work intact.
- Report answer quality against a small NotebookLM-reviewed synthetic benchmark before selecting a provider or model.

## Dependency / release safety

This spike targets `main` independently of Week 2 Draft PR #158; it is designed for optional integration **after** review. No merge/deploy may be inferred from CI PASS. PR #158 remains frozen for pedagogical content pending separate Owner release approval.
