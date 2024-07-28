import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import CredentialProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import GoogleProvider from 'next-auth/providers/google';

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
        const { email, password } = credentials;
        try {
          const response = await fetch(`${process.env.AUTH_URL}api/getuser`, {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: { 'Content-Type': 'application/json' }
          });
          if (!response.ok) throw new Error('Failed to fetch user');
          const user = await response.json();
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              password as string,
              user.password as string
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (error: any) {
          console.error('Authorization error:', error);
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async signIn({ profile, account, credentials, user }) {
      console.log(account, credentials, 'signin');
      console.log(user);

      if (account?.provider == 'credentials') {
        return true;
      }

      if (account?.provider == 'google' && profile) {
        try {
          const response = await fetch(
            `${process.env.AUTH_URL}api/getuser/google-signin`,
            {
              method: 'POST',
              body: JSON.stringify({
                email: profile.email,
                name: profile.name,
                given_name: profile.given_name,
                family_name: profile.family_name,
                picture: profile.picture
              }),
              headers: { 'Content-Type': 'application/json' }
            }
          );
          if (!response.ok) throw new Error('Failed to process Google sign-in');
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
            const response = await fetch(
              `${process.env.AUTH_URL}api/getuser/get-or-create`,
              {
                method: 'POST',
                body: JSON.stringify({ email: profile.email }),
                headers: { 'Content-Type': 'application/json' }
              }
            );
            if (!response.ok) throw new Error('Failed to get or create user');
            const dbUser = await response.json();

            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.username = dbUser.username;
          }

          if (account?.provider === 'credentials') {
            const response = await fetch(
              `${process.env.AUTH_URL}api/getuser/get`,
              {
                method: 'POST',
                body: JSON.stringify({ email: user.email }),
                headers: { 'Content-Type': 'application/json' }
              }
            );
            if (!response.ok) throw new Error('Failed to get user');
            const dbUser = await response.json();

            token.id = dbUser._id.toString();
            token.role = user.role;
            token.username = dbUser.username;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
          }
        } else {
          const response = await fetch(
            `${process.env.AUTH_URL}api/getuser/get`,
            {
              method: 'POST',
              body: JSON.stringify({ email: token.email }),
              headers: { 'Content-Type': 'application/json' }
            }
          );
          if (response.ok) {
            const dbUser = await response.json();
            token.id = dbUser._id.toString();
            token.role = dbUser.role;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.username = dbUser.username;
          }
        }

        // Set name based on firstName and lastName, or fallback to username
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
