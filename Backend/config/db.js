const mongoose = require("mongoose");
const dns = require("dns");

let cached = global.__MONGOOSE_CONN;
if (!cached) {
  cached = global.__MONGOOSE_CONN = { conn: null, promise: null };
}

const parseDnsServers = () => {
  const raw = process.env.DNS_SERVERS;
  if (!raw) return null;
  const servers = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return servers.length ? servers : null;
};

const ensureWorkingDnsForSrv = () => {
  const current = dns.getServers();

  // On some Windows setups Node ends up with localhost DNS (127.0.0.1 / ::1).
  // If no local DNS proxy is listening, SRV lookups (Atlas) fail with ECONNREFUSED.
  const looksLikeLocalOnly =
    current.length > 0 &&
    current.every((s) => s === "127.0.0.1" || s === "::1");

  const desired = parseDnsServers();
  if (desired) {
    dns.setServers(desired);
    console.log("DNS servers (override):", dns.getServers());
    return;
  }

  if (looksLikeLocalOnly) {
    // Sensible defaults; can be overridden via DNS_SERVERS in environment.
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log("DNS servers (auto-fix):", dns.getServers());
  } else {
    console.log("DNS servers:", current);
  }
};

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1 && cached.conn) {
      return cached.conn;
    }

    console.log("Trying to connect to MongoDB...");
    console.log("MONGO_URL:", process.env.MONGO_URL ? "✓ Set" : "✗ NOT SET");

    ensureWorkingDnsForSrv();

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set");
    }

    if (!cached.promise) {
      cached.promise = mongoose
        .connect(process.env.MONGO_URL, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          retryWrites: true,
          w: "majority",
          family: 4,
        })
        .then((m) => m);
    }

    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected Successfully!");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;