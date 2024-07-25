// app/api/expenses/route.ts

import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import { Expense } from '@/models/Expense';
import { auth } from '@/auth';

export async function POST(request: Request) {
  try {
    // Connect to the database
    await connectToMongoDB();

    // Get the current user session (if using authentication)
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { description, amount, category } = await request.json();

    // Validate the input
    if (!description || !amount || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the new expense
    const newExpense = await Expense.create({
      description,
      amount,
      category,
      createdBy: session.user.id // Assuming the user ID is available in the session
    });

    // Return the created expense
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
