'use server';

import Customer from '@/models/Customer'; // Adjust the path as necessary
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import { auth } from '@/auth';

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return new Response('Unauthenticated', { status: 401 });
    }

    await connectToMongoDB();

    const customers = await Customer.find({ createdBy: session.user.id });

    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response('Error fetching customers', { status: 500 });
  }
};
