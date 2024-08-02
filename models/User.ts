import mongoose, { Document, Model, Schema } from 'mongoose';
import { IBusiness } from './Business';
import { ICustomer } from './Customer';
import { IExpense } from './Expense';

// Define the interface for user document
interface IUser extends Document {
  email: string;
  password?: string;
  username?: string;
  image?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  business?: mongoose.Types.ObjectId;
  customers?: mongoose.Types.ObjectId[] | ICustomer[];
  expenses?: mongoose.Types.ObjectId[] | IExpense[];
}

// Define the schema
const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  username: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  image: {
    type: String
  },
  role: {
    type: String,
    default: 'user',
    enum: ['Admin', 'Super Admin', 'Business Manager']
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  },
  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    }
  ],
  expenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Expense'
    }
  ]
});

// Define and export the User model
const User = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;
