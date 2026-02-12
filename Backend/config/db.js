const mongoose = require("mongoose");
const dns = require("dns");

let connectAttempt = 0;
const MAX_RETRIES = 5;

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
    connectAttempt++;
    console.log(`[Attempt ${connectAttempt}/${MAX_RETRIES}] Trying to connect to MongoDB...`);
    console.log("MONGO_URL:", process.env.MONGO_URL ? "✓ Set" : "✗ NOT SET - Check Render environment variables!");

    ensureWorkingDnsForSrv();

    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is not set");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: "majority",
      family: 4,
    });

    console.log("✅ MongoDB Connected Successfully!");
    connectAttempt = 0; // Reset on successful connection
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);

    if (connectAttempt < MAX_RETRIES) {
      console.log(`Retrying in 3 seconds... (${connectAttempt}/${MAX_RETRIES})`);
      setTimeout(connectDB, 3000);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
};

module.exports = connectDB;