// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import User from '@/models/User';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  console.log(params.email);
  const { email } = params;
  //   if (!email) {
  //     return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  //   }

  console.log('email', email);
  try {
    await connectToMongoDB();
    const user = await User.findOne({ email });

    console.log('email', email);

    if (!user) {
      console.log('email', email);
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
        business: user.business,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const { email } = params;
  const body = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await connectToMongoDB();
    const user = await User.findOneAndUpdate(
      { email },
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
