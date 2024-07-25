import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import { Business } from '@/models/Business';
import { auth } from '@/auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await connectToMongoDB();

    // Get the business ID from the URL params
    const { id } = params;

    // Parse the request body
    const body = await req.json();

    // Find the business and update it
    const updatedBusiness = await Business.findOneAndUpdate(
      { _id: id, user: session.user.id },
      {
        logo: body.logo,
        address: body.address,
        accountNumber: body.accountNumber,
        accountName: body.accountName,
        bankName: body.bankName
      },
      { new: true, runValidators: true }
    );

    if (!updatedBusiness) {
      return NextResponse.json(
        {
          error: 'Business not found or you do not have permission to edit it'
        },
        { status: 404 }
      );
    }

    // Return the updated business data
    return NextResponse.json(updatedBusiness, { status: 200 });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json(
      { error: 'Failed to update business' },
      { status: 500 }
    );
  }
}
