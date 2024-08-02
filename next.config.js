/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_AUTH_URL:
      process.env.NEXT_PUBLIC_AUTH_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000')
  },
  experimental: {
    esmExternals: 'loose', // <-- add this
    serverComponentsExternalPackages: ['mongoose'] // <-- and this
  },
  images: {
    domains: ['utfs.io', 'media.istockphoto.com']
  }
};

module.exports = nextConfig;
