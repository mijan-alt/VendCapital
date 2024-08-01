// app/api/sales/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import Sales from '@/models/Sales';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToMongoDB();

    const searchParams = req.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query: any = { createdBy: session.user.id };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sales = await Sales.find(query)
      .sort({ createdAt: 1 })
      .populate('customer', 'name email');

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    // Calculate previous period for comparison
    const currentPeriod = endDate ? new Date(endDate) : new Date();
    const previousPeriodStart = new Date(currentPeriod);
    previousPeriodStart.setDate(
      previousPeriodStart.getDate() -
        (startDate
          ? (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
          : 30)
    );

    const previousPeriodQuery: any = {
      createdBy: session.user.id,
      createdAt: {
        $gte: previousPeriodStart,
        $lt: startDate ? new Date(startDate) : currentPeriod
      }
    };

    const previousPeriodSales = await Sales.find(previousPeriodQuery);

    const previousTotalSales = previousPeriodSales.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0
    );

    const percentageChange =
      previousTotalSales !== 0
        ? ((totalSales - previousTotalSales) / previousTotalSales) * 100
        : 100;

    // Group sales by date for the chart
    const salesByDate = sales.reduce(
      (acc, sale) => {
        const date = sale.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + sale.totalPrice;
        return acc;
      },
      {} as Record<string, number>
    );

    const salesForChart = Object.entries(salesByDate).map(([date, amount]) => ({
      date,
      amount
    }));

    // Get recent sales
    const recentSales = sales.slice(0, 5).map((sale) => ({
      _id: sale._id,
      customer: {
        name: sale.customer.name,
        email: sale.customer.email
      },
      totalPrice: sale.totalPrice,
      createdAt: sale.createdAt
    }));

    return NextResponse.json(
      {
        totalSales,
        salesCount: sales.length,
        percentageChange: percentageChange.toFixed(2),
        salesByDate: salesForChart,
        recentSales
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales analytics' },
      { status: 500 }
    );
  }
}
