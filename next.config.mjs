import { createMDX } from 'fumadocs-mdx/next';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const withMDX = createMDX({
  // configPath: 'source.config.ts',
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  turbopack: {
    root: projectRoot,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  // assetPrefix: './',
};

export default withMDX(config);
