import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./library/db.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import { Server } from "socket.io";
import { log } from "console";

// create Express app and Http server

const app = express();
const server = http.createServer(app);
// initialize socket.io server

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// store online users

export const userSocketMap = {}; // {userid:socketId}

//socket.id connection handler

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user Connectd", userId);

  if (userId) userSocketMap[userId] = socket.id;
  // emit onl ine users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("user disconnected", userId);
    delete userSocketMap[userId];
    io.emit("getonlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is live"));

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
// connect to mongodb

await connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on : http://localhost:${PORT}`)
);
