import axios from "axios";
import { toast } from "../components/hooks/use-toast";
const API_URL = "https://3-104-203-150.nip.io";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    /* 
     Here I am listening response globally and validating user access token.
     If access token is expired, it will redirect user to login
     */
    const statusCode = error.status;
    const err = error.response.data?.messages[0];

    if (statusCode === 401 && err.message === "Token is invalid or expired") {
      toast({
        title: "Your session has expired",
        variant: "destructive",
      });

      window.localStorage.clear();

      setTimeout(() => window.location.reload(), 4000);
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken && config.auth !== false) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;
