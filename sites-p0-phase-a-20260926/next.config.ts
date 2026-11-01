const staticExport=process.env.STATIC_EXPORT==="1"||process.env.GITHUB_PAGES_EXPORT==="1";

const nextConfig = staticExport ? {
  output:"export" as const,
  // Export nested preview routes without a redirect during static prerender.
  trailingSlash:false,
  images:{unoptimized:true},
} : {
  /* Sites / Cloudflare runtime remains unchanged outside GitHub Pages export. */
};

export default nextConfig;
