import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/signin',
    error: '/signin'
  }
} satisfies NextAuthConfig;

export default authConfig;
