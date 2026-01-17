import { Router } from "express";
import { getMe } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/me", getMe);
