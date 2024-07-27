// app/api/getuser/get-or-create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    await connectToMongoDB();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, role: 'user' });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Get or create user error:', error);
    return NextResponse.json(
      { error: 'Failed to get or create user' },
      { status: 500 }
    );
  }
}
