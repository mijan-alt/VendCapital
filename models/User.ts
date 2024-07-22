import mongoose, { Document, Model } from 'mongoose';

// Define the interface for user document
interface IUser extends Document {
  email: string;
  password?: string;
  username?: string;
  image?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  business?: string;
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
    type: String
  },
  image: {
    data: Buffer,
    contentType: String
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'Admin', 'Super Admin', 'Business Manager']
  }
});

// Define and export the User model
const User = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;
