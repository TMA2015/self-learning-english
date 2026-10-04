const staticExport=process.env.GITHUB_PAGES_EXPORT==="1";

const nextConfig = staticExport ? {
  output:"export" as const,
  trailingSlash:true,
  images:{unoptimized:true},
} : {
  /* Sites / Cloudflare runtime remains unchanged outside GitHub Pages export. */
};

export default nextConfig;
