import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./library/db.js";

// create Express app and Http server

const app = express();
const server = http.createServer(app);

// Middleware

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.get("/api/status", (req, res) => res.send("Server is live"));

// connect to mongodb

await connectDB();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`Server is running on : http://localhost:${PORT}`)
);
