import axios from "axios";

const API_URL = "https://3-104-203-150.nip.io"; 
const accessToken = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: accessToken,
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
