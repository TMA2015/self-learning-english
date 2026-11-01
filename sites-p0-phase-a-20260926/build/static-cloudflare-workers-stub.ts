// GitHub Pages build-only replacement for the Cloudflare runtime module.
// Static export must never read D1, R2 or server secrets.
export const env:Record<string,never>={};
