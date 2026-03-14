import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mindgymbook.ductfabrication.in',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    // We use the URL from .env, but Axios will call the relative /api/v1 path to trigger this proxy.
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://mindgymbook.ductfabrication.in/api/v1";
    return [
      {
        source: '/proxy/api/v1/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
