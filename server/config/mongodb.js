import mongoose from 'mongoose';

const connectDB = async () => {
  // Remove existing listeners (to prevent duplicates in dev with hot reload)
  mongoose.connection.removeAllListeners('connected');

  // Log successful connection
  mongoose.connection.on('connected', () => {
    console.log('✅ Database Access Granted');
  });

  // Log if disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB Disconnected');
  });

  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`🌐 Connected to MongoDB`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Optional: Stop app if DB fails
  }
};

export default connectDB;


