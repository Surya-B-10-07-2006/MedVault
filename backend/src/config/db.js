const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();
  if (!uri) {
    console.error('MongoDB connection error: MONGO_URI is not set.');
    process.exit(1);
  }
  try {
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '// $1:****@');
    console.log('Attempting to connect to MongoDB with URI:', maskedUri);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('CRITICAL: MongoDB connection error!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
