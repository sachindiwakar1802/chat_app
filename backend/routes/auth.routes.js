import express from "express";
import { login, logout, signUp, googleAuth } from "../controllers/auth.controllers.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/google-auth", googleAuth); // This should match what frontend calls

export default authRouter;