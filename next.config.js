/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongoose']
  },
  images: {
    domains: ['utfs.io']
  },
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true
    };
  }
};

module.exports = nextConfig;
