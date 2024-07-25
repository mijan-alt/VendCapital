// app/api/expenses/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import { Expense } from '@/models/Expense';
import { auth } from '@/auth';
import { EventEmitter } from 'events';

// Create a global event emitter
const eventEmitter = new EventEmitter();

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

    // Emit an event when a new expense is added
    eventEmitter.emit('newExpense', savedExpense);

    return NextResponse.json(savedExpense, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json(
      { error: 'Failed to add expense' },
      { status: 500 }
    );
  }
}

// SSE endpoint for real-time updates
export async function GET(req: NextRequest) {
  const response = new NextResponse(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        const sendEvent = (data: any) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        };

        // Send initial data
        sendEvent({ type: 'init' });

        // Listen for new expenses
        const newExpenseListener = (expense: any) => {
          sendEvent({ type: 'newExpense', expense });
        };

        eventEmitter.on('newExpense', newExpenseListener);

        // Clean up the listener when the client disconnects
        req.signal.addEventListener('abort', () => {
          eventEmitter.off('newExpense', newExpenseListener);
        });
      }
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      }
    }
  );

  return response;
}
