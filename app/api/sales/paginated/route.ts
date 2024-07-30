// app/api/sales/paginated/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Sales from '@/models/Sales';
import { connectToMongoDB } from '@/utils/db';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    await connectToMongoDB();

    const searchParams = request.nextUrl.searchParams;
    const page: number = parseInt(searchParams.get('page') || '1');
    const limit: number = parseInt(searchParams.get('perPage') || '10');

    const sales = await Sales.find({ createdBy: session.user.id })
      .populate('customer', 'name email phone')
      .populate(
        'product',
        'name description price category quantityInStock brand'
      )
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalSales = await Sales.countDocuments({
      createdBy: session.user.id
    });

    return NextResponse.json(
      {
        sales,
        totalPages: Math.ceil(totalSales / limit),
        currentPage: page,
        count: totalSales
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching paginated sales:', error);
    return NextResponse.json(
      { message: 'Error fetching paginated sales' },
      { status: 500 }
    );
  }
}
