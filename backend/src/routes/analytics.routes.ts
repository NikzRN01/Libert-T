import { Router } from "express";
import { getAnalyticsOverview } from "../controllers/analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.get("/", getAnalyticsOverview);
