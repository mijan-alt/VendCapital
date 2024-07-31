// utils/db.ts
import { registerModels } from './registerModels';
import mongoose from 'mongoose';

let isConnected = false;

export async function connectToMongoDB() {
  if (isConnected) {
    console.log('Using existing database connection');
    registerModels();
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Vendcapital'
    });
    isConnected = true;
    registerModels();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
