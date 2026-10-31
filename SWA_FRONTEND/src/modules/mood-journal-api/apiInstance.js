import axios from "axios";
import { API_BASE_URL } from "../student-core/utils/api";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;