/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@f1-dashboard/tokens",
    "@f1-dashboard/types",
    "@f1-dashboard/api-client",
    "@f1-dashboard/hooks",
  ],
};

export default nextConfig;
