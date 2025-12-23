import axios from "axios";

// 1. Create the instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/", // Your Django API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add an Interceptor
// Before every request, check if we have a token in localStorage and attach it.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;