// app/api/sales/paginated/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Sales from '@/models/Sales';
import { connectToMongoDB } from '@/utils/db';
import { auth } from '@/auth';
import Customer from '@/models/Customer';
import Product from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return;
    }

    await connectToMongoDB();

    const sales = await Sales.find({ createdBy: session.user.id })
      .populate('customer')
      .populate('product');

    return NextResponse.json(sales, { status: 200 });
  } catch (error) {
    console.error('Error fetching paginated sales:', error);
    return NextResponse.json(
      { message: 'Error fetching paginated sales' },
      { status: 500 }
    );
  }
}
