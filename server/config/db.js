import mongoose from "mongoose";

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set. Create server/.env before starting the API.");
  }

  const connection = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  await connection.connection.db.collection("products").findOne({});
  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}
