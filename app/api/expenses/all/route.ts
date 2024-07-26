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
    const page: number = parseInt(searchParams.get('page') || '1');
    const limit: number = parseInt(searchParams.get('perPage') || '10');

    const count = await Expense.countDocuments({ createdBy: session.user.id });

    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;
    const expenses = await Expense.find({ createdBy: session.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        expenses: expenses,
        totalPages,
        currentPage: page,
        count
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}
