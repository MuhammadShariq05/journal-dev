import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  },
});
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjRlYzA3NDg1NDBkNDcxYTdhYzUxZSIsImlhdCI6MTcyNzMyNzIzOSwiZXhwIjoxNzI3NTg2NDM5fQ.-eEV1XNxzlB5CaULBK9-azJRybhrhURV8vzlPjJu3dM
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return  config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);


export default axiosInstance;

