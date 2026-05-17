import type { NextConfig } from 'next';

const isStaticExport = process.env.BIGROCK_STATIC === '1';

const nextConfig: NextConfig = {
  transpilePackages: ['@ai-school/shared'],
  output: isStaticExport ? 'export' : undefined,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [],
  },
  trailingSlash: isStaticExport,
};

export default nextConfig;
