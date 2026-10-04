const mongoose = require('mongoose');

// Disable command buffering so queries fail/fallback instantly instead of hanging for 10 seconds
mongoose.set('bufferCommands', false);

const FALLBACK_MONGODB_URI = 'mongodb+srv://pathnova_demo:PathNova2026Secure@cluster0.y8x1q.mongodb.net/pathnova_db?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    console.log('[Database] Connected to MongoDB Cloud Atlas successfully!');
  } catch (err) {
    console.warn(`[Database] Primary MongoDB connection attempt failed: ${err.message}`);
    if (!process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const inMemoryUri = mongoServer.getUri();
        await mongoose.connect(inMemoryUri, { bufferCommands: false });
        console.log(`[Database] Connected to Local In-Memory MongoDB Server at: ${inMemoryUri}`);
      } catch (memErr) {
        console.warn(`[Database] In-memory fallback skipped: ${memErr.message}`);
      }
    }
  }
};

module.exports = connectDB;
