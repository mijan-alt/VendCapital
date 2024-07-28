import type { NextAuthConfig } from 'next-auth';
const productionUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.AUTH_URL;

export const authConfig = {
  providers: [],
  callbacks: {},
  pages: {
    signIn: '/signin',
    error: '/signin'
  }
} satisfies NextAuthConfig;

export default authConfig;
