// app/api/sales/route.js

import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import Sales from '@/models/Sales';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    const session = await auth();

    if (!session.user) return;

    const { customer, product, quantity, unitPrice, status, totalPrice } =
      await request.json();

    if (
      !customer ||
      !product ||
      quantity === undefined ||
      unitPrice === undefined ||
      !status
    ) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const sale = new Sales({
      customer,
      product,
      quantity,
      unitPrice,
      totalPrice,
      status,
      createdBy: session.user.id
    });

    await sale.save();

    return NextResponse.json(
      { message: 'Sale recorded successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error recording sale:', error);
    return NextResponse.json(
      { message: 'Error recording sale' },
      { status: 500 }
    );
  }
}
