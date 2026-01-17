import type { Request, Response } from "express";

export function getAgricultureOverview(_req: Request, res: Response) {
  res.json({ module: "agriculture", status: "ok" });
}
