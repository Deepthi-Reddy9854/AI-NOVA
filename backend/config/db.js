const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[Database] No MONGODB_URI provided in environment. Attempting local connection...');
  }

  try {
    const targetUri = uri || 'mongodb://127.0.0.1:27017/pathnova_db';
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`[Database] Connected to MongoDB at: ${targetUri}`);
  } catch (err) {
    console.warn(`[Database] MongoDB connection skipped or unavailable: ${err.message}`);
    if (!process.env.VERCEL) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const inMemoryUri = mongoServer.getUri();
        await mongoose.connect(inMemoryUri);
        console.log(`[Database] Connected to In-Memory MongoDB Server at: ${inMemoryUri}`);
      } catch (memErr) {
        console.warn(`[Database] In-memory fallback skipped: ${memErr.message}`);
      }
    }
  }
};

module.exports = connectDB;
