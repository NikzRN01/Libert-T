import type { Request, Response } from "express";

export function listSkills(_req: Request, res: Response) {
  res.json({ skills: [] });
}
