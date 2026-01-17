import type { Request, Response } from "express";

export function getHealthcareOverview(_req: Request, res: Response) {
  res.json({ module: "healthcare", status: "ok" });
}
