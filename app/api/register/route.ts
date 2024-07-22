import User from '@/models/User';
import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import bcrypt from 'bcryptjs';

export const POST = async (request: Request) => {
  try {
    console.log('hitting the register route');
    const { email, password, username } = await request.json();

    await connectToMongoDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response('User is already in use', { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 5); // Added await here

    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      role: email === process.env.ADMIN_EMAIL ? 'Super Admin' : 'user'
    });

    console.log(newUser);

    return NextResponse.json(
      { message: 'Sign up successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error registering:', error);
    return new Response('Error registering', { status: 500 });
  }
};
