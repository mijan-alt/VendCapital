// app/api/getUser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    await connectToMongoDB();
    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
