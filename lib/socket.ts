import { io, Socket } from "socket.io-client";
import { api } from "@/api/axios";
import { store } from "@/lib/store";

let socket: Socket | null = null;

// Single shared connection to the backend, authenticated with the admin token.
export const getSocket = (): Socket => {
  if (socket) return socket;

  const token = store.getState().auth.token;

  socket = io(api.defaults.baseURL as string, {
    auth: { token },
    extraHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
      "ngrok-skip-browser-warning": "true",
    },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () =>
    console.log("[socket] connected", socket?.id),
  );
  socket.on("disconnect", (reason) =>
    console.log("[socket] disconnected", reason),
  );
  socket.on("connect_error", (err) =>
    console.error("[socket] connect_error", err.message, err),
  );
  // Log every event the server sends so we can see the payload shapes.
  socket.onAny((event, ...args) =>
    console.log(`[socket] <- ${event}`, ...args),
  );

  return socket;
};
