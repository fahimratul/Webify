import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "backend/.env") });

console.log("🔍 Testing MongoDB Connection...");
console.log("📍 MongoDB URI exists:", !!process.env.MONGODB_URI);
console.log(
  "📍 MongoDB URI:",
  process.env.MONGODB_URI
    ? "mongodb+srv://***:***@" + process.env.MONGODB_URI.split("@")[1]
    : "NOT FOUND",
);

async function testConnection() {
  try {
    console.log("\n⏳ Attempting to connect...");
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    console.log("✅ MongoDB connection successful!");
    console.log("📊 Connected to:", mongoose.connection.name);
    console.log("🏠 Host:", mongoose.connection.host);
    await mongoose.connection.close();
    console.log("👋 Connection closed gracefully");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ MongoDB connection failed!");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (
      error.message.includes("ECONNREFUSED") ||
      error.message.includes("querySrv")
    ) {
      console.log("\n💡 Possible solutions:");
      console.log("   1. Check your internet connection");
      console.log("   2. Verify MongoDB Atlas cluster is running (not paused)");
      console.log(
        "   3. Check if your IP address is whitelisted in MongoDB Atlas",
      );
      console.log("   4. Verify the connection string is correct");
      console.log(
        "   5. Try using a different network (some firewalls block MongoDB)",
      );
    }

    process.exit(1);
  }
}

testConnection();
