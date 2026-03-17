import express from "express";            // Import Express framework
import dotenv from "dotenv";              // Load environment variables from .env file
import connectDb from "./config/db.js";   // Function to connect MongoDB
import authRouter from "./routes/auth.routes.js"; // Auth routes (login, signup)
import cookieParser from "cookie-parser"; // Middleware to parse cookies
import cors from "cors";                  // Middleware to handle CORS
import userRouter from "./routes/user.routes.js"; // User-related routes

// Load environment variables
dotenv.config();

const app = express(); // Create Express app

// ---------------- CORS Configuration ----------------
// Allow frontend to communicate with backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allowed frontend URL
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Set port (from .env or default 5000)
const port = process.env.PORT || 5000;

// ---------------- Middlewares ----------------

// Parse incoming JSON data (req.body)
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse cookies from request
app.use(cookieParser());

// ---------------- Routes ----------------

// Auth routes → /api/auth/login, /api/auth/signup
app.use("/api/auth", authRouter);

// User routes → /api/user/...
app.use("/api/user", userRouter);

// ---------------- Health Check ----------------

// Simple route to check if server is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ---------------- Error Handling ----------------

// Global error handler (catches errors)
app.use((err, req, res, next) => {
  console.error(err.stack); // Print error in console

  res.status(500).json({
    message: "Something went wrong!",
  });
});

// ---------------- Start Server ----------------

// Start server and connect to database
app.listen(port, () => {
  connectDb(); // Connect MongoDB
  console.log(`Server running on port ${port}`);
});