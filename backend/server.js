import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"

dotenv.config()

const app = express()

const port = process.env.PORT || 5000

app.use("/api/auth",authRouter)

app.listen(port,()=>{
  connectDb()
  console.log(`Server running on port ${port}`)
})