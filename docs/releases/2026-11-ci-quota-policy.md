# CI quota safety policy — Self-Learning English (November 2026)

Context: In October, ordinary English PRs launched up to 12 overlapping jobs,
each repeating package installation and builds. The included private GitHub
Actions compute quota was exhausted.

## Root-cause correction now in the release path

- Default branch is deliberately limited to manual-only workflows.
- Use a SINGLE bounded job when a release QA run is explicitly requested.
- Do not auto-trigger on push, pull_request, workflow_run, or schedule.
- Never run routine development checks on GitHub-hosted Actions.
- Consolidated pnpm qa:release runs in one job, with frozen dependency install once.
- Workflow timeout: maximum 25 minutes. Concurrency cancels superseded requests.
- The manual workflow is restricted to release/nov2026-content-v1.18.0,
  and requires confirm=RUN. Zero Actions minutes on commits/PRs.
- scripts/verify-actions-policy.cjs blocks automated triggers and >3 workflow files.
- Before merging ANY old academic or feature branch, check its .github/workflows
  diff and reject auto-triggering workflows. Old PR #48 is superseded by #51.
- No approval to exceed GitHub Free included quota; no paid runners.

## Limitations / verification

Repository-wide Actions settings/billing cut-off are account controls, not
modifiable by this source-only policy. The GitHub Billing screenshots from
2026-11-01 show compute $0 used of $12 included (with $0.09 included discount),
but future usage should still be monitored.

The current main branch does not yet include the full application source. Thus,
the manually invoked release QA workflow must NOT be run on main; first finish
and validate the complete release branch, then select that branch in Actions.

Do not merge the release PR or deploy until all QA and provenance gates pass.
