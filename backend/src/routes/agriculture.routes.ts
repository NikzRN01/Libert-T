import { Router } from "express";
import { getAgricultureOverview } from "../controllers/agriculture.controller";

export const agricultureRouter = Router();

agricultureRouter.get("/", getAgricultureOverview);
