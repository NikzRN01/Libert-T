import type { Request, Response } from "express";

export function getAnalyticsOverview(_req: Request, res: Response) {
  res.json({ module: "analytics", status: "ok" });
}
