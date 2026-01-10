import { store } from "@/lib/store";
import axios from "axios";

export const api = axios.create({
  baseURL: "https://6412a77d597c.ngrok-free.app/", // Use your actual production URL
  timeout: 15000, // Increased to 15s because Render cold starts are slow
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420", // Any value works here
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
