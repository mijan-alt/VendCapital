// app/api/upload/route.ts

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const email: string | null = data.get('email') as string;

  if (!file || !email) {
    return NextResponse.json(
      { error: 'No file uploaded or email not provided' },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    await connectToMongoDB();

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          image: {
            data: buffer,
            contentType: file.type
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Image uploaded successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading to MongoDB:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
