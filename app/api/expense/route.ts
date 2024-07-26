import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import { Expense } from '@/models/Expense';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToMongoDB();
    const body = await req.json();
    const newExpense = new Expense({
      description: body.description,
      amount: body.amount,
      category: body.category,
      createdBy: session.user.id
    });
    const savedExpense = await newExpense.save();

    // Instead of emitting an event, we'll return the saved expense
    // The client will handle emitting this to the socket
    return NextResponse.json(savedExpense, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}
