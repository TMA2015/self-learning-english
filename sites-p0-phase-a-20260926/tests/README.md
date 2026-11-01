# Checks

Run from the repository root:

```sh
node tests/run.cjs
node node_modules/typescript/bin/tsc --noEmit
```

`run.cjs` compiles domain/application/provider contracts into ignored local test output
and runs adaptive simulations and portability contracts without the Sites runtime.
See `VALIDATION.md` for real API/D1 integration results and limitations, and
`PORTABILITY.md` for storage, authentication, provider and export/import boundaries.

Administrator tools: Parent View → Administrator / developer tools.
Missing `ADMIN_EMAILS` grants no administrator access. The production owner is
configured separately in server environment settings; no role is granted by UI state.
