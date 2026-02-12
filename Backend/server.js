require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

connectDB();

app.use(express.json());

// CORS configuration for development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'https://updated-social.vercel.app/', // For production
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow localhost on any port for development
    if (origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    
    // Allow production URL from environment
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use((req, res, next) => {
  req.userId = req.headers.userid;
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});