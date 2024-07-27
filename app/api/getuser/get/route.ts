// app/api/user/get/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    await connectToMongoDB();
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
