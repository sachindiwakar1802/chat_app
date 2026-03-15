import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

const port = process.env.PORT || 5000

// ✅ middleware
app.use(express.json())       // read JSON body
app.use(cookieParser())       // read cookies

// routes
app.use("/api/auth", authRouter)

// start server
app.listen(port, () => {
  connectDb()
  console.log(`Server running on port ${port}`)
})