import { Router } from "express";
import { listSkills } from "../controllers/skill.controller";

export const skillRouter = Router();

skillRouter.get("/", listSkills);
