import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MONGODB_URI is not set. Server is running without a database connection.");
    return null;
  }

  try {
    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
