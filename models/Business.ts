// businessModel.ts

import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for business document
export interface IBusiness extends Document {
  logo?: string;
  address: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
}

// Define the Business schema
const BusinessSchema = new Schema<IBusiness>({
  logo: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  accountName: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  }
});

// Define and export the Business model
export const Business =
  mongoose.models?.Business ||
  mongoose.model<IBusiness>('Business', BusinessSchema);
