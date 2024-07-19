import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import User from './models/User';
import { z } from 'zod';
import { connectToMongoDB } from '@/utils/connect';

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      }
      // async authorize(credentials) {
      //   const { email, password } = credentials;

      //   let user;
      //   user = await User.findOne({ email });

      //   if (!user) {
      //     const hashedPassword = bcrypt.hashSync(password as string, 10);
      //     user = await User.create({
      //       email: email,
      //       password: hashedPassword,
      //       role: 'user'
      //     });
      //     return user;
      //   } else {
      //     let isPasswordCorrect = bcrypt.compareSync(
      //       password as string,
      //       user.password as string
      //     );
      //     if (isPasswordCorrect) {
      //       return user;
      //     } else {
      //       return null;
      //     }
      //   }
      // }
    })
  ],

  pages: {
    signIn: '/', // Sign-in page
    error: '/'
  },
  callbacks: {
    async signIn({ profile, account }) {
      if (!profile) {
        return false;
      }

      if (account?.provider === 'google') {
        try {
          // CHECK IF A USER ALREADY EXISTS
          const userExists = await User.findOne({
            email: profile.email
          });

          // IF NOT, CREATE A USER
          if (!userExists) {
            await User.create({
              email: profile.email,
              username: profile.name?.replace(/\s/g, '').toLowerCase(),
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
    async jwt({ token, account, profile }) {
      console.log(profile, 'my profile');
      console.log(token);

      if (account && profile) {
        let user = await User.findOne({ email: profile.email });

        if (!user) {
          // Create a new user if one doesn't exist
          user = new User({ email: profile.email, role: 'user' });
        }
        // Check if the email matches the admin email
        if (profile.email === process.env.ADMIN_EMAIL) {
          user.role = 'admin';
          token.role = 'admin';
        } else {
          token.role = user.role;
        }

        await user.save();
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token?.role;

      console.log('session', session);
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
