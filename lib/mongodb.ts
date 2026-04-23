// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "CRITICAL: MONGODB_URI is missing from .env.local. We cannot fight blind.",
  );
}

// Extend the NodeJS global type to prevent multiple connections in dev
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  // Return the existing connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is currently being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if the connection drops
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("🔗 Database connected. The archive is online.");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
