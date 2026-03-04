import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://buhrec-backend-1djd.onrender.com/api",
  withCredentials: true, // To ensures cookies are sent and received
});

export default axiosInstance;
