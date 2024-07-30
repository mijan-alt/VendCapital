import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import Product from '@/models/Product';
import { connectToMongoDB } from '@/utils/db';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      images,
      category,
      quantityInStock,
      brand,
      isActive
    } = body;

    if (
      !name ||
      !description ||
      !price ||
      !images ||
      !category ||
      quantityInStock === undefined
    ) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    await connectToMongoDB();

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      category,
      quantityInStock,
      brand,
      isActive,
      createdBy: session.user.id
    });

    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
