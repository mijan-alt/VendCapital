import mongoose, { Document, Model } from 'mongoose';

// Define the interface for user document
interface IUser extends Document {
  email: string;
  password?: string;
  username?: string;
  image?: string;
  role?: string;
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
  image: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  }
});

// Define and export the User model
const User: Model<IUser> =
  mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);

export default User;
