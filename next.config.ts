import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias.canvas = false;
      config.resolve.alias.encoding = false;
      config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    }
    return config;
  },
  // External packages that should not be bundled by webpack
  serverExternalPackages: ['pdf-parse', 'pdfjs-dist'],
};

export default nextConfig;
