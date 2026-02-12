require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

connectDB();

app.use(express.json());

// CORS configuration - allow any localhost port for development
app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost on any port for development
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
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