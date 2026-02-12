require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");

const app = express();

app.use(express.json());

const normalizeOrigin = (origin) => origin.replace(/\/$/, "");

const isVercelAppOrigin = (origin) => {
  try {
    const url = new URL(origin);
    return url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

const localhostOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
].map(normalizeOrigin);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      // If explicitly configured, only allow those.
      if (envAllowedOrigins.length) {
        if (envAllowedOrigins.includes(normalizedOrigin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      }

      // Default: allow localhost during dev + any Vercel preview/prod domain.
      if (localhostOrigins.includes(normalizedOrigin) || isVercelAppOrigin(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  req.userId = req.headers.userid;
  next();
});

// Ensure DB is connected before handling API routes.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/posts", postRoutes);
app.use("/api/posts", likeRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", {
    method: req.method,
    path: req.originalUrl,
    origin: req.headers.origin,
    userId: req.headers.userid,
    message: err?.message,
  });

  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: err.message });
  }

  if (err && err.message && err.message.includes("MONGO_URL")) {
    return res.status(500).json({
      message: "Server misconfigured: missing database env vars",
      error: err.message,
    });
  }

  return res.status(500).json({
    message: "Server Error",
    error: err?.message || "Unknown error",
  });
});

module.exports = app;
