import Customer from '@/models/Customer'; // Adjust the path as necessary

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { connectToMongoDB } from '@/utils/db';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page: number = parseInt(searchParams.get('page') as string);
    const limit: number = parseInt(searchParams.get('perPage') as string);

    await connectToMongoDB();

    const count = await Customer.countDocuments();

    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;
    const customers = await Customer.find().skip(skip).limit(limit);
    console.log(customers);

    return NextResponse.json(
      {
        customer: [...customers],
        totalPages,
        currentPage: page,
        count
      },
      { status: 200 }
    );
  } catch (error) {
    return new Response('Error adding customer', { status: 500 });
  }
};
