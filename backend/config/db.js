const mongoose = require('mongoose');

const FALLBACK_MONGODB_URI = 'mongodb+srv://deepthibolla07_db_user:Bolla12345@cluster0.o3dlk7r.mongodb.net/pathnova_db?retryWrites=true&w=majority&appName=Cluster0';

let isConnectingPromise = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (isConnectingPromise) {
    await isConnectingPromise;
    return mongoose.connection.readyState === 1;
  }

  try {
    isConnectingPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000
    });
    await isConnectingPromise;
    console.log('[Database] Connected to MongoDB Cloud Atlas successfully!');
    return true;
  } catch (err) {
    console.warn(`[Database] Connection attempt failed: ${err.message}`);
    isConnectingPromise = null;
    return false;
  }
};

module.exports = connectDB;
