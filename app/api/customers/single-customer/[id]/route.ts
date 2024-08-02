import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import Customer from '@/models/Customer';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: 'customer id is required' },
      { status: 400 }
    );
  }

  try {
    await connectToMongoDB();
    const customer = await Customer.findOne({ _id: id });

    if (!customer) {
      return NextResponse.json(
        { message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error', error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session.user.id) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.id) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    await connectToMongoDB();

    const customer = await Customer.findByIdAndDelete({ _id: params.id });

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const body = await req.json();

    const { name, email, phone } = body;

    if (!session.user.id) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!email) {
      return new NextResponse('Email is required', { status: 400 });
    }

    if (!phone) {
      return new NextResponse('Phone is required', { status: 400 });
    }

    await connectToMongoDB();

    const customer = await Customer.findByIdAndUpdate(
      { _id: params.id },
      {
        name,
        email,
        phone,
        createdBy: session.user.id
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return new NextResponse('Customer not found', { status: 404 });
    }

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
