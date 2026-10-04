// Static-export-only shim. GitHub Pages has no Worker bindings.
// Browser learning never uses D1/OpenAI server bindings; server-only routes are skipped.
export const env:Record<string,never>={};
