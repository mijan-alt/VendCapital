/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongoose']
  },
  images: {
    domains: ['utfs.io']
  }
};

module.exports = nextConfig;
