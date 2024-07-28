// utils/authUtils.ts
'use server';

import bcrypt from 'bcryptjs';
import User from '../models/User';
import { connectToMongoDB } from './db';

export async function verifyCredentials(email: string, password: string) {
  await connectToMongoDB();
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
}

export async function getOrCreateGoogleUser(profile: any) {
  await connectToMongoDB();
  let user = await User.findOne({ email: profile.email });
  if (!user) {
    user = await User.create({
      email: profile.email,
      username: profile.name,
      firstName: profile.given_name,
      lastName: profile.family_name,
      image: profile.picture,
      role: profile.email === process.env.ADMIN_EMAIL ? 'Admin' : 'user'
    });
  }
  return user;
}

export async function getUserByEmail(email: string) {
  await connectToMongoDB();
  return await User.findOne({ email });
}
