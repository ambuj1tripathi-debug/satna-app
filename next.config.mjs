/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  // GitHub Pages serves the site from /satna-app/
  basePath: isPages ? "/satna-app" : "",
  assetPrefix: isPages ? "/satna-app/" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
