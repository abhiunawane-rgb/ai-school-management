import type { NextConfig } from 'next';

const isStaticExport = process.env.BIGROCK_STATIC === '1';
/** Deploy admin under https://aischoolmanagement.tech/admin/ on BigRock */
const bigrockBasePath = isStaticExport ? '/admin' : '';

const nextConfig: NextConfig = {
  transpilePackages: ['@ai-school/shared'],
  output: isStaticExport ? 'export' : undefined,
  trailingSlash: isStaticExport,
  basePath: bigrockBasePath || undefined,
  assetPrefix: bigrockBasePath || undefined,
  // Slow machines / concurrent export workers can exceed the default 60s
  staticPageGenerationTimeout: 180,
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },
};

export default nextConfig;
