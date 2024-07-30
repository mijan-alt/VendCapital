import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import Product from '@/models/Product';
import { auth } from '@/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    await connectToMongoDB();
    const product = await Product.findOne({ _id: id });

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
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

    const product = await Product.findByIdAndDelete({ _id: params.id });

    return NextResponse.json(product, { status: 200 });
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

    if (!session.user.id) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('At least one image is required', {
        status: 400
      });
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!category) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    if (!params.id) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    await connectToMongoDB();

    const product = await Product.findByIdAndUpdate(
      { _id: params.id },
      {
        name,
        description,
        price,
        images,
        category,
        quantityInStock,
        brand,
        isActive,
        createdBy: session.user.id
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
