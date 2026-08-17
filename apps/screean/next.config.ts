import type { NextConfig } from 'next';

// `@tesyl/screean` and `@tesyl/screean-components` publish ESM with a
// blanket `'use client'` banner. They are browser-only (WebGL / WebGPU /
// `document` at construction time), so every module that touches them sits
// behind a client boundary — see app/components/grid.tsx.
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
