'use server';
import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import User from './models/User';
import { connectToMongoDB } from '@/utils/db.js';

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
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
          await connectToMongoDB();
          let user = await User.findOne({ email });

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

  pages: {
    signIn: '/signin', // Sign-in page
    error: '/signin'
  },

  callbacks: {
    async signIn({ profile, account, credentials, user }) {
      console.log(account, credentials, 'signin');
      console.log(user);

      if (account?.provider == 'credentials') {
        return true;
      }

      if (account?.provider === 'google' && profile) {
        try {
          await connectToMongoDB();
          // CHECK IF A USER ALREADY EXISTS
          const userExists = await User.findOne({
            email: profile.email
          });

          // IF NOT, CREATE A USER
          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name,
              firstName: profile.given_name,
              lastName: profile.family_name,
              image: profile.picture,
              role: 'user'
            });
          }
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
          // If using Google sign-in and first sign-in
          if (account?.provider === 'google' && profile) {
            await connectToMongoDB();
            let dbUser = await User.findOne({ email: profile.email });

            if (!dbUser) {
              dbUser = new User({
                email: profile.email,
                username: profile.name,
                firstName: profile.given_name,
                lastName: profile.family_name,
                image: profile.picture,
                role:
                  profile.email === process.env.ADMIN_EMAIL ? 'admin' : 'user'
              });
              await dbUser.save();
            }

            token.role = dbUser.role;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.username = dbUser.username;
          }

          // For credentials sign-in
          if (account?.provider === 'credentials') {
            await connectToMongoDB();
            let dbUser = await User.findOne({ email: user.email });
            token.role = user.role;
            token.username = dbUser.username;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
          }
        } else {
          // Subsequent requests
          await connectToMongoDB();
          const dbUser = await User.findOne({ email: token.email });

          if (dbUser) {
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
        role: token.role,
        name: token.name,
        firstName: token.firstName || '',
        lastName: token.lastName || '',
        username: token.username || ''
      };

      return session;
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
