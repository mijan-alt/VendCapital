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
      .sort({ createdAt: -1 })
      .limit(5) // Limit to 5 most recent sales
      .populate('customer', 'name email');

    const allSales = await Sales.find(query).sort({ createdAt: 1 });

    const totalSales = allSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    // Calculate the duration of the current period
    const currentPeriodEnd = endDate ? new Date(endDate) : new Date();
    const currentPeriodStart = startDate
      ? new Date(startDate)
      : new Date(currentPeriodEnd);
    currentPeriodStart.setDate(currentPeriodStart.getDate() - 30); // Default to 30 days if no start date

    const periodDuration =
      (currentPeriodEnd.getTime() - currentPeriodStart.getTime()) /
      (1000 * 60 * 60 * 24);

    // Calculate the previous period
    const previousPeriodEnd = new Date(currentPeriodStart);
    const previousPeriodStart = new Date(previousPeriodEnd);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDuration);

    const previousPeriodQuery: any = {
      createdBy: session.user.id,
      createdAt: {
        $gte: previousPeriodStart,
        $lt: previousPeriodEnd
      }
    };

    // Fetch sales for the previous period
    const previousPeriodSales = await Sales.find(previousPeriodQuery);

    // Calculate total sales for the previous period
    const previousTotalSales = previousPeriodSales.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0
    );

    // Calculate percentage change
    const percentageChange =
      previousTotalSales !== 0
        ? ((totalSales - previousTotalSales) / previousTotalSales) * 100
        : totalSales > 0
        ? 100
        : 0;

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
    const recentSales = sales.map((sale) => ({
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
