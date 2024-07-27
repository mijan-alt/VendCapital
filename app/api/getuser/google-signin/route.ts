// app/api/user/google-signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToMongoDB } from '@/utils/db';

export async function POST(request: NextRequest) {
  const { email, name, given_name, family_name, picture } =
    await request.json();

  try {
    await connectToMongoDB();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username: name,
        firstName: given_name,
        lastName: family_name,
        image: picture,
        role: 'user'
      });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Google sign-in error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
