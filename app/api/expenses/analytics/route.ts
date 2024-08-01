import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import { Expense } from '@/models/Expense';
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

    let query = { createdBy: session.user.id };

    if (startDate && endDate) {
      query['createdAt'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query).sort({ createdAt: 1 });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

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

    const previousPeriodExpenses = await Expense.find({
      createdBy: session.user.id,
      createdAt: {
        $gte: previousPeriodStart,
        $lt: startDate ? new Date(startDate) : currentPeriod
      }
    });

    const previousTotalExpense = previousPeriodExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const percentageChange =
      previousTotalExpense !== 0
        ? ((totalExpense - previousTotalExpense) / previousTotalExpense) * 100
        : 100;

    // Group expenses by date for the chart
    const expensesByDate = expenses.reduce((acc, expense) => {
      const date = expense.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    }, {});

    const expensesForChart = Object.entries(expensesByDate).map(
      ([date, amount]) => ({
        date,
        amount
      })
    );

    return NextResponse.json(
      {
        totalExpense,
        expensesCount: expenses.length,
        percentageChange: percentageChange.toFixed(2),
        expensesByDate: expensesForChart
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching expense analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expense analytics' },
      { status: 500 }
    );
  }
}
