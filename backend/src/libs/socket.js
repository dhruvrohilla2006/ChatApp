import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
const server = http.createServer(app);

export const getReciverSocketId = (userId) => {
  return userSocketMap[userId]
}

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});
const userSocketMap = {} // use to store user socket id and user id

io.on("connection", (socket) => {
 


  const userId = socket.handshake.query.userId;
   // Debug log

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
   
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export { io, app, server };
