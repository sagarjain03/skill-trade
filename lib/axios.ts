import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Base URL for your API routes
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;