const mongoose = require('mongoose');

const FALLBACK_MONGODB_URI = 'mongodb+srv://deepthibolla07_db_user:PathNova2026Secure@cluster0.o3dlk7r.mongodb.net/pathnova_db?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;

  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('[Database] Connected to MongoDB Cloud Atlas successfully!');
  } catch (err) {
    console.warn(`[Database] Primary MongoDB connection attempt failed: ${err.message}`);
    if (!process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const inMemoryUri = mongoServer.getUri();
        await mongoose.connect(inMemoryUri);
        console.log(`[Database] Connected to Local In-Memory MongoDB Server at: ${inMemoryUri}`);
      } catch (memErr) {
        console.warn(`[Database] In-memory fallback skipped: ${memErr.message}`);
      }
    }
  }
};

module.exports = connectDB;
