/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose', // <-- add this
    serverComponentsExternalPackages: ['mongoose'] // <-- and this
  },
  images: {
    domains: ['utfs.io', 'media.istockphoto.com']
  }
};

module.exports = nextConfig;
