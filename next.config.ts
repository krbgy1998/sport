
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'site.web.api.espn.com', // Added for potential images from the new tennis API
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'iili.io', // Added for new sports category icons
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
