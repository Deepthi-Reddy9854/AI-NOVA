const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pathnova_db';

  try {
    // Attempt standard connection with 3 sec timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
  } catch (err) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${uri}. Initializing MongoMemoryServer...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB Server at: ${inMemoryUri}`);
    } catch (memErr) {
      console.error(`[Database] Failed to initialize in-memory database:`, memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
