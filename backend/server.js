import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

dotenv.config()

const app = express()

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

const port = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // for form data
app.use(cookieParser())

// Routes
app.use("/api/auth", authRouter)

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...')
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// Start server
app.listen(port, () => {
  connectDb()
  console.log(`Server running on port ${port}`)
})