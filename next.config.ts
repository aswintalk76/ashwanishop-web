import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export only for production builds (Hostinger). Dev allows dynamic routes.
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' as const } : {}),
  // Hostinger/Apache: export categories/index.html so /categories/ does not 403
  trailingSlash: true,

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'ashwanishop-backend.helloashwani.site',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;      