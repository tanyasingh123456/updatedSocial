import axios from "axios";

// Generate or retrieve a user ID for this session
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
  }
  return userId;
};

// Configurable API base URL via Vite env.
// Set `VITE_API_URL` (e.g. http://localhost:5000/api).
// If not set, defaults to localhost in dev and same-origin `/api` in prod.
const getBaseURL = () => {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv && typeof fromEnv === "string") return fromEnv;

  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000/api";
  }

  return "/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "userid": getUserId()
  }
});

export default API;