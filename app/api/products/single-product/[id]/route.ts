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
