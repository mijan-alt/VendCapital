import User from '@/models/User'; // Adjust the path as necessary
import { connectToMongoDB } from '@/utils/db';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page: number = parseInt(searchParams.get('page') as string);
    const limit: number = parseInt(searchParams.get('perPage') as string);

    await connectToMongoDB();

    const count = await User.countDocuments();

    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit);

    return NextResponse.json(
      {
        user: [...users],
        totalPages,
        currentPage: page,
        count
      },
      { status: 200 }
    );
  } catch (error) {
    return new Response('Error fetching users', { status: 500 });
  }
};
