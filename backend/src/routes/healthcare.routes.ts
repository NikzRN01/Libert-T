import { Router } from "express";
import { getHealthcareOverview } from "../controllers/healthcare.controller";

export const healthcareRouter = Router();

healthcareRouter.get("/", getHealthcareOverview);
