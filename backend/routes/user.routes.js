import express from "express";
import { getCurrentUser } from "../controllers/user.contollers.js";
import {isAuth} from "../middlwares/isAuth"
const userRouter = express.Router();

userRouter.get("/currentUser",isAuth,getCurrentUser);

export default userRouter;