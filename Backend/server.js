require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

connectDB();

app.use(express.json());

// app.use(cors({
//   origin: process.env.FRONTEND_URL
// }));

app.use(cors({
  origin: 'http://localhost:5173', // Allow your local frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

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