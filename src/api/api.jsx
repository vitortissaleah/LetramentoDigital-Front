import axios from "axios";

const api = axios.create({
  baseURL: "http://3.145.57.39:80", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;