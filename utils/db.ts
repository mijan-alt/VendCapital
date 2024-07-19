// Importing mongoose library
import mongoose from 'mongoose';

// Function to establish a connection to MongoDB
export async function connectToMongoDB() {
  try {
    console.log('Creating new db connection');
    const opts = {
      bufferCommands: false
    };

    // Establish a new connection to MongoDB
    const cnx = await mongoose.connect(process.env.MONGO_URI as string, opts);
    // Log message indicating a new MongoDB connection is established
    console.log('New mongodb connection established');
    // Return the newly established connection
    return cnx.connection;
  } catch (error) {
    // If an error occurs during connection, log the error and throw it
    console.log(error);
    throw error;
  }
}
