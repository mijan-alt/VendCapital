// expenseModel.ts

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExpense extends Document {
  description: string;
  amount: number;
  category: string;
  createdBy: mongoose.Types.ObjectId;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true } // This option adds createdAt and updatedAt fields
);

export const Expense =
  mongoose.models?.Expense ||
  mongoose.model<IExpense>('Expense', ExpenseSchema);
