import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import Product from '@/models/Product';
import { connectToMongoDB } from '@/utils/db';

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectToMongoDB();

    // Fetch products created by the authenticated user
    const products = await Product.find({ createdBy: session.user.id });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
