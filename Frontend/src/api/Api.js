import axios from "axios";

const API = axios.create({
  baseURL: "https://social-app-zyuf.onrender.com/api"
});

export default API;