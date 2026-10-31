const mongoose = require("mongoose");

let mongoServer = null;

async function connectDB() {
  const customUri = process.env.MONGO_URI;

  if (customUri) {
    try {
      console.log("Connecting to MongoDB from MONGO_URI...");
      await mongoose.connect(customUri, { serverSelectionTimeoutMS: 5000 });
      console.log("✅ MongoDB connected successfully to MONGO_URI");
      return;
    } catch (err) {
      console.warn("⚠️ Failed to connect using MONGO_URI:", err.message);
    }
  }

  // Fallback to Atlas URI if reachable
  const atlasUri =
    process.env.MONGO_URI ||
    "mongodb+srv://swethag495_db_user:mNigVLwAHOj2xyhH@cluster0.8vfkkyk.mongodb.net/studentmentalhealth?retryWrites=true&w=majority&appName=Cluster0";

  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 4000 });
    console.log("✅ MongoDB connected to Atlas");
    return;
  } catch (err) {
    console.warn("⚠️ Atlas connection failed (" + err.message + ")");
  }

  // Try local MongoDB default
  try {
    console.log("Attempting to connect to local MongoDB (mongodb://127.0.0.1:27017/studentmentalhealth)...");
    await mongoose.connect("mongodb://127.0.0.1:27017/studentmentalhealth", { serverSelectionTimeoutMS: 2000 });
    console.log("✅ Connected to local MongoDB");
    return;
  } catch (err) {
    // Local mongo not running
  }

  // Automatic In-Memory MongoDB Fallback
  console.log("Starting in-memory MongoDB fallback server...");
  const { MongoMemoryServer } = require("mongodb-memory-server");
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  console.log("✅ Connected to in-memory MongoDB at:", uri);
  console.log("ℹ️  Tip: Add MONGO_URI to your .env file to persist data to your own MongoDB cluster.");
}

module.exports = connectDB;
