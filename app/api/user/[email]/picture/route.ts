// app/api/user/[email]/picture/route.ts

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const { email } = params;

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await connectToMongoDB();
    const user = await User.findOne({ email });

    if (!user || !user.image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const response = new NextResponse(user.image.data);
    response.headers.set('Content-Type', user.image.contentType);
    return response;
  } catch (error) {
    console.error('Failed to fetch user image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user image' },
      { status: 500 }
    );
  }
}
