import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@f1-dashboard/tokens",
    "@f1-dashboard/types",
    "@f1-dashboard/api-client",
    "@f1-dashboard/hooks",
  ],
  webpack: (config) => {
    // packages/hooks accepts react ^18 || ^19 (needed so apps/mobile's React
    // 19 is satisfied too), so pnpm can resolve its @tanstack/react-query
    // dependency against either peer variant — and workspace packages don't
    // get duplicated per-consumer the way published packages do. If it
    // resolves to the React-19 build here, that build's QueryClientProvider
    // Context object doesn't match the React-18 build this app's own
    // providers.tsx uses, even though both are the same react-query version.
    // Force this app to always resolve its own copy, so there's one Context.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@tanstack/react-query": path.resolve(
        __dirname,
        "node_modules/@tanstack/react-query",
      ),
    };
    return config;
  },
};

export default nextConfig;
