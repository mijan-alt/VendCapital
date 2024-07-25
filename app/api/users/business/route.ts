// app/api/users/business/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import User from '@/models/User';
import { Business } from '@/models/Business';
import { auth } from '@/auth';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    console.log('hitting /api/users/business');
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoDB();

    // Ensure both models are registered
    mongoose.model('User');
    mongoose.model('Business');

    const user = await User.findById(session.user.id).populate('business');
    console.log('user before conditional', user);
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
