import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryBasePath = "/RWE-MCP-Registry";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath: repositoryBasePath,
      assetPrefix: repositoryBasePath,
      trailingSlash: true,
      images: { unoptimized: true },
      turbopack: { root: process.cwd() },
      typescript: { tsconfigPath: "tsconfig.pages.json" },
    }
  : { turbopack: { root: process.cwd() } };

export default nextConfig;
