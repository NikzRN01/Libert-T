import { Router } from "express";
import { getUrbanOverview } from "../controllers/urban.controller";

export const urbanRouter = Router();

urbanRouter.get("/", getUrbanOverview);
