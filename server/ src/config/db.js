// server/src/config/db.js
// ---------------------------------------------------
// MongoDB connection using Mongoose (Atlas-ready)
// ---------------------------------------------------

import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDB() {
  if (!env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Server will run, but DB ops will fail.');
    return;
  }

  if (isConnected) return; // avoid duplicate connects on hot-reload

  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10s
      maxPoolSize: 10,                 // good default for MVP
    });

    isConnected = true;
    const { host, name } = mongoose.connection;
    console.log(`✅ MongoDB connected: ${host}/${name}`);

    // connection signals
    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      console.log('🔄 MongoDB reconnected');
    });

    // graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed (SIGINT)');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('🛑 MongoDB connection closed (SIGTERM)');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    // don’t hard exit in dev; fail fast in prod if you prefer
    process.exit(1);
  }
}
