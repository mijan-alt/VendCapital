import mongoose, { Document, Model, Schema } from 'mongoose';
import { IBusiness } from './Business';
import { ICustomer } from './Customer';

// Define the interface for user document
interface IUser extends Document {
  email: string;
  password?: string;
  username?: string;
  image?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  business?: mongoose.Types.ObjectId | IBusiness;
  customers?: mongoose.Types.ObjectId[] | ICustomer[];
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
  business: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  },
  image: {
    type: String
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'Admin', 'Super Admin', 'Business Manager']
  },
  customers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    }
  ]
});

// Define and export the User model
const User = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;
