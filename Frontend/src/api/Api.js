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

// Use local backend during development, production Render URL in production
const getBaseURL = () => {
  if (import.meta.env.MODE === 'development') {
    return "http://localhost:5000/api";
  }
  return "https://updatedsocial.onrender.com/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "userid": getUserId()
  }
});

export default API;