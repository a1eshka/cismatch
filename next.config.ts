import type { NextConfig } from 'next';

const allowedProtocols = ['http', 'https'] as const;
type Protocol = (typeof allowedProtocols)[number];

const imageProtocol = (process.env.NEXT_PUBLIC_IMAGE_PROTOCOL ?? 'http') as Protocol;

const nextConfig: NextConfig = {
  images: {
    domains: ['api.cismatch.ru'],
    remotePatterns: [
      {
        protocol: imageProtocol,
        hostname: process.env.NEXT_PUBLIC_IMAGE_HOST || 'localhost',
        port: process.env.NEXT_PUBLIC_IMAGE_PORT || '8000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
