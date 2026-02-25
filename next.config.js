/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ideogram.ai',
        pathname: '/api/images/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  transpilePackages: ['@supabase/auth-js', '@supabase/supabase-js', '@supabase/ssr', '@supabase/functions-js', '@supabase/postgrest-js', '@supabase/storage-js', '@supabase/realtime-js'],
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: '/blog.html',
      },
      {
        source: '/blog/:slug',
        destination: '/blog/:slug.html',
      },
      {
        source: '/videos',
        destination: '/videos.html',
      },
    ];
  },
};

module.exports = nextConfig;
