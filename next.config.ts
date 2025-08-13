import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'beta.ysn.tv',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'beta.ysn.tv',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'beta.ysn.tv',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'beta.ysn.tv',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'ysn-new.tv',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'ysn-new.tv',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: 'ysn-new.tv',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'ysn-new.tv',
        port: '',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
