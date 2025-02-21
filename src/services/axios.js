import axios from "axios";

const API_URL = "https://3-104-203-150.nip.io";
const accessToken = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  // If the request does NOT explicitly set `auth: false`, add Authorization header
  if (accessToken && config.auth !== false) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;
