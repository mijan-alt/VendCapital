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

    const searchParams = request.nextUrl.searchParams;
    const page: number = parseInt(searchParams.get('page') || '1');
    const limit: number = parseInt(searchParams.get('perPage') || '10');

    await connectToMongoDB();

    const count = await Customer.countDocuments({ createdBy: session.user.id });

    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;
    const customers = await Customer.find({ createdBy: session.user.id })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        customers: customers,
        totalPages,
        currentPage: page,
        count
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching customers:', error);
    return new Response('Error fetching customers', { status: 500 });
  }
};
