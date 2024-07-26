// app/api/users/business/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import { Business } from '@/models/Business';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    console.log('hitting /api/users/business');
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoDB();

    // // Ensure both models are registered
    // mongoose.model('User');
    // mongoose.model('Business');

    const business = await Business.findOne({ user: session.user.id });

    if (!business) {
      return NextResponse.json({ message: 'No business yet' }, { status: 404 });
    }

    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error('Error fetching user business:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        error: 'Failed to fetch user business',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
