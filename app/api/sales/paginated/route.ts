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

    await connectToMongoDB();

    const searchParams = request.nextUrl.searchParams;
    const page: number = parseInt(searchParams.get('page') || '1');
    const limit: number = parseInt(searchParams.get('perPage') || '10');
    const statusFilter = searchParams.get('statusFilter') || 'all';

    let sales;
    let totalSales;

    if (statusFilter === 'all') {
      sales = await Sales.find({
        createdBy: session.user.id
      })
        .populate('customer')
        .populate('product')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      totalSales = await Sales.countDocuments({
        createdBy: session.user.id
      });
    } else {
      sales = await Sales.find({
        createdBy: session.user.id,
        status: statusFilter
      })
        .populate('customer')
        .populate('product')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      totalSales = await Sales.countDocuments({
        createdBy: session.user.id,
        status: statusFilter
      });
    }

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
