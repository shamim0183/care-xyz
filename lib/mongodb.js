/**
 * MongoDB Connection Module
 * 
 * This module handles the connection to MongoDB Atlas database.
 * It uses a singleton pattern to ensure only one connection is created
 * and reused across the application, which is important for serverless
 * environments like Vercel where functions are stateless.
 * 
 * Environment Variables Required:
 * - MONGODB_URI: MongoDB connection string from Atlas
 */

import mongoose from "mongoose";

/**
 * Global variable to store the cached connection
 * This prevents creating multiple connections in development
 * where hot reloading can cause multiple instances
 */
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cache for MongoDB connection
 * In development, this prevents connections from growing exponentially
 * during API Route hot reloading in Next.js
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB database
 * 
 * This function:
 * 1. Checks if there's an existing connection
 * 2. If not, creates a new connection
 * 3. Caches the connection for reuse
 * 4. Returns the Mongoose instance
 * 
 * @returns {Promise<Mongoose>} - Mongoose connection instance
 * 
 * Usage:
 * import connectDB from "@/lib/mongodb";
 * await connectDB();
 */
async function connectDB() {
  // If already connected, return existing connection
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  // If no promise exists, create new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering
    };

    console.log("🔄 Creating new MongoDB connection...");
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    });
  }

  // Wait for connection to complete
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
