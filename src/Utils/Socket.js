import { io } from "socket.io-client";

// ✅ Use your deployed backend URL
const socket = io("https://yochat-backend-1.onrender.com", {
  transports: ["websocket"], // ✅ Force WebSocket
  withCredentials: true,     // ✅ Include if your backend uses credentials (cookies, etc.)
});

export default socket;
