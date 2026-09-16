import mongoose from 'mongoose';

export async function connectDatabase(uri, dbName) {
  if (!uri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(uri, {
    dbName,
    maxPoolSize: 20,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });
  console.log(`[MongoDB] Connected to ${dbName}`);
}

export async function closeDatabase() {
  await mongoose.disconnect();
}
