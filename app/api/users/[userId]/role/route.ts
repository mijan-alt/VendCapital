// app/api/users/[userId]/role/route.ts
import { NextResponse } from 'next/server';
import { connectToMongoDB } from '@/utils/db.js';
import User from '@/models/User';

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  console.log('hitting patch');
  const { role } = await request.json();
  const { userId } = params;

  try {
    await connectToMongoDB();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Role updated successfully',
        user: updatedUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}
