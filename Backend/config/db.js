const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Trying to connect to MongoDB...");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:");
    console.error(error); // 🔥 show FULL error
    process.exit(1);
  }
};

module.exports = connectDB;