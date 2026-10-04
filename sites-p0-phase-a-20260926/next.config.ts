const staticExport=process.env.GITHUB_PAGES_EXPORT==="1";
const basePath=staticExport?(process.env.NEXT_PUBLIC_BASE_PATH??"").replace(/\/$/,""):"";

const nextConfig = staticExport ? {
  output:"export" as const,
  basePath,
  assetPrefix:basePath,
  trailingSlash:true,
  images:{unoptimized:true},
} : {
  /* Sites / Cloudflare runtime remains unchanged outside GitHub Pages export. */
};

export default nextConfig;
