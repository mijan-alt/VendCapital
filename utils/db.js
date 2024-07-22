'use server';
import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'Vendcapital'
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
  }
};
