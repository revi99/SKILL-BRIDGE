const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collab_portal';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    // Auto-seed initial demo dataset if MongoDB database has 0 users
    const { autoSeedIfEmpty } = require('../scripts/seed');
    await autoSeedIfEmpty();
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('[Render Config Hint] Make sure MONGODB_URI is set in your Render environment variables.');
      console.error('[Render Config Hint] In MongoDB Atlas: Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0).');
    }
  }
};

module.exports = connectDB;
