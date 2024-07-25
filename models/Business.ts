// models/Business.ts

import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IBusiness extends Document {
  logo?: string;
  address: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  user: mongoose.Types.ObjectId;
}

const BusinessSchema: Schema = new Schema({
  logo: { type: String },
  address: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const Business: Model<IBusiness> =
  mongoose.models.Business ||
  mongoose.model<IBusiness>('Business', BusinessSchema);
