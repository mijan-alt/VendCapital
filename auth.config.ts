import type { NextAuthConfig } from 'next-auth';
const productionUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.AUTH_URL;

export const authConfig = {
  providers: [],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin'
  }
} satisfies NextAuthConfig;

export default authConfig;
