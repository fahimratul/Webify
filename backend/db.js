import mongoose from "mongoose";
import dotenv from "dotenv";

// loads the .env file contents into process.env
dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("\n📋 Troubleshooting steps:");
    console.error("1. Check your internet connection");
    console.error(
      "2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)",
    );
    console.error("3. Check username/password in .env file");
    console.error("4. Ensure your cluster is running on Atlas\n");

    // Don't exit - let server run without DB for testing
    console.warn("⚠️  Server will continue without database connection");
  }
};

export default connectDB;
