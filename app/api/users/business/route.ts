import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import User from '@/models/User';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    console.log('hitting /api/users/business');
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoDB();

    const user = await User.findById(session.user.id).populate('business');
    console.log('user before condtional', user);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('user', user);

    return NextResponse.json(
      { business: user.business || null },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user business' },
      { status: 500 }
    );
  }
}
