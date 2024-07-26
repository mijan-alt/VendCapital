'use server';
import { NextResponse } from 'next/server';
import Customer from '@/models/Customer'; // Adjust the path as necessary
import { connectToMongoDB } from '@/utils/db.js';
import { auth } from '@/auth';

export const POST = async (request: Request) => {
  try {
    const session = await auth();

    if (!session || !session.user.id) {
      return new Response('unauthorized');
    }

    await connectToMongoDB();

    const data = await request.json();

    const newCustomer = new Customer({
      ...data,
      createdBy: session.user.id
    });
    console.log(newCustomer);
    await newCustomer.save();
    return new Response('Customer added succesfully', { status: 200 });
  } catch (error) {
    return new Response('Error adding customer', { status: 500 });
  }
};
