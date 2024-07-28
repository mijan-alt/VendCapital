import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import User from '@/models/User';
import { type NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return;
  }

  try {
    await connectToMongoDB();
    const user = await User.findOne({ _id: session.user.id });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isFirstNameAndLastName = user.firstName && user.lastName;
    const usernames = `${user.firstName} ${user.lastName}`;

    return NextResponse.json(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        username: isFirstNameAndLastName ? usernames : user.username,
        email: user.email,
        image: user.image,
        role: user.role
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return;
  }
  const body = await request.json();

  try {
    await connectToMongoDB();
    const user = await User.findOneAndUpdate(
      { _id: session.user.id },
      { $set: body },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Failed to update user data:', error);
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    );
  }
}
