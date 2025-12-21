// 7. Import dotenv
require("dotenv").config();

// 1. Import express
const express = require("express");

// 5. Import cors
const cors = require("cors");

// 8. Import router
const router = require("./router");

// 11. Connect db
require("./db/connection");

// Import path to handle file paths
const path = require("path");

// 🔹 ADD: http & socket.io
const http = require("http");
const { Server } = require("socket.io");

// 2. Create express app
const GamersConnect = express();

// 🔹 CREATE HTTP SERVER (IMPORTANT)
const server = http.createServer(GamersConnect);

// 🔹 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 6. Tell server to use cors
GamersConnect.use(cors());

// 10. Parse incoming JSON requests
GamersConnect.use(express.json());

// Serve static files from the uploads folder
GamersConnect.use(
  "/imguploads",
  express.static(path.join(__dirname, "imguploads"))
);

// 9. Tell server to use router
GamersConnect.use(router);

// 🔥 SOCKET LOGIC (REAL-TIME CHAT)
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    const roomId = [data.senderId, data.receiverId].sort().join("-");
    io.to(roomId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// 3. Create port
const PORT = 3000;

// 4. Start server (⚠️ USE server.listen, not app.listen)
server.listen(PORT, () => {
  console.log(`🚀 GamersConnect server running successfully at ${PORT}`);
});
