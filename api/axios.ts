import { store } from "@/lib/store";
import axios from "axios";

// production-url - https://deporta.onrender.com/
// test-url - https://deporta-development.onrender.com

// test - pro - https://7ae75e4c4a22.ngrok-free.app
export const api = axios.create({
  baseURL: "https://thalia-diachronic-lisette.ngrok-free.dev", // Use your actual production URL
  timeout: 15000, // Increased to 15s because Render cold starts are slow
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": true,
  },
});

// Interceptor to inject the Bearer token automatically
api.interceptors.request.use(async (config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
