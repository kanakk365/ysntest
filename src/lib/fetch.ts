import axios from "axios";
import { useAuthStore } from "./auth-store";

const fetch = axios.create({
  baseURL: "https://beta.ysn.tv/api",
});

fetch.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState(); 
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default fetch;