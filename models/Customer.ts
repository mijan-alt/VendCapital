import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the Customer type
export type Customer = {
  name: string;
  email: string;
  phone: string;
};

// Define the Mongoose schema
interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
}

const CustomerSchema = new mongoose.Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
});

const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
