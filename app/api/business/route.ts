// app/api/business/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db';
import { Business } from '@/models/Business';
import User from '@/models/User'; // Make sure to import the User model
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to the database
    await connectToMongoDB();

    // Parse the request body
    const body = await req.json();

    const isBusinessExisting = await Business.findOne({
      user: session.user.id
    });
    if (isBusinessExisting) {
      return NextResponse.json(
        {
          message: 'A business is already associated with this account'
        },
        { status: 409 }
      );
    }

    // Create a new business document
    const newBusiness = new Business({
      logo: body.logo,
      address: body.address,
      accountNumber: body.accountNumber,
      accountName: body.accountName,
      bankName: body.bankName,
      user: session.user.id
    });

    // Save the new business to the database
    const savedBusiness = await newBusiness.save();

    // Update the user document to include the new business
    await User.findOneAndUpdate(
      { _id: session.user.id },
      { $set: { business: savedBusiness._id } },
      { new: true }
    );

    // Return the saved business data
    return NextResponse.json(savedBusiness, { status: 201 });
  } catch (error) {
    console.error('Error adding business:', error);
    return NextResponse.json(
      { error: 'Failed to add business' },
      { status: 500 }
    );
  }
}
