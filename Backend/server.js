const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Database connection
const connectDB = require("./config/db.js");


// Import routes
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },
});
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Socket.IO connection handling
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle user connection
  socket.on("user_connected", (userId) => {
    connectedUsers.set(userId, socket.id);
    io.emit("user_status_change", { userId, status: "online" });
  });

  // Handle private messages
  socket.on("private_message", async (data) => {
    const { senderId, receiverId, message } = data;
    const receiverSocketId = connectedUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("private_message", {
        senderId,
        message,
        timestamp: new Date(),
      });
    }

    // Save message to database
    try {
      const Message = require("./models/messageModel.js");
      const newMessage = new Message({
        sender: senderId,
        receiver: receiverId,
        content: message,
      });
      await newMessage.save();
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle typing status
  socket.on("typing", ({ senderId, receiverId, isTyping }) => {
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId, isTyping });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    let disconnectedUserId;
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        break;
      }
    }

    if (disconnectedUserId) {
      connectedUsers.delete(disconnectedUserId);
      io.emit("user_status_change", {
        userId: disconnectedUserId,
        status: "offline",
      });
    }
    console.log("Client disconnected:", socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
