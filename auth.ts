import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import {
  verifyCredentials,
  getOrCreateGoogleUser,
  getUserByEmail
} from './utils/authUtils';

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    GoogleProvider,
    CredentialProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },

      async authorize(credentials): Promise<any> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password required');
          }
          return await verifyCredentials(
            credentials.email as string,
            credentials.password as string
          );
        } catch (error: any) {
          console.error('Authorization error:', error);
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ profile, account, credentials, user }) {
      console.log(account, credentials, 'signin');
      console.log(user);

      if (account?.provider == 'credentials') {
        return true;
      }

      if (account?.provider == 'google' && profile) {
        try {
          await getOrCreateGoogleUser(profile);
          return true;
        } catch (error) {
          console.log('sign in error', error);
          return '/auth/error';
        }
      }

      return false;
    },
    async jwt({ token, user, account, profile }) {
      try {
        if (user) {
          if (account?.provider === 'google' && profile) {
            const dbUser = await getOrCreateGoogleUser(profile);
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.username = dbUser.username;
          }

          if (account?.provider === 'credentials') {
            const dbUser = await getUserByEmail(user.email);
            if (dbUser) {
              token.id = dbUser._id.toString();
              token.role = user.role;
              token.username = dbUser.username;
              token.firstName = dbUser.firstName;
              token.lastName = dbUser.lastName;
            }
          }
        } else {
          const dbUser = await getUserByEmail(token.email);
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.username = dbUser.username;
          }
        }

        token.name =
          (token.firstName || token.lastName
            ? `${token.firstName || ''} ${token.lastName || ''}`.trim()
            : token.username) || token.name;
      } catch (error) {
        console.error('JWT callback error:', error);
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role,
        name: token.name,
        firstName: token.firstName || '',
        lastName: token.lastName || '',
        username: token.username || ''
      };

      return session;
    }
  }
});
