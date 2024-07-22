'use server';
import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: 'Vendcapital'
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
  }
};
