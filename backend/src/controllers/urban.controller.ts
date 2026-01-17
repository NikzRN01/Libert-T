import type { Request, Response } from "express";

export function getUrbanOverview(_req: Request, res: Response) {
  res.json({ module: "urban", status: "ok" });
}
