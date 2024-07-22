'use server';
import { NextResponse } from 'next/server';

import Customer from '@/models/Customer'; // Adjust the path as necessary
import { connectToMongoDB } from '@/utils/db.js';

export const POST = async (request: Request) => {
  const data = await request.json();

  console.log(data);

  try {
    console.log('in the try block');
    await connectToMongoDB();

    // Check if a customer with the same email or id already exists
    const existingCustomer = await Customer.findOne({
      email: data.email
    });
    if (existingCustomer) {
      return new Response('already existing', { status: 400 });
    }

    const newCustomer = new Customer({
      ...data
    });

    await newCustomer.save();
    return new Response('Customer added succesfully', { status: 200 });
  } catch (error) {
    return new Response('Error adding customer', { status: 500 });
  }
};
