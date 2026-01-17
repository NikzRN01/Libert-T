import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { agricultureRouter } from "./routes/agriculture.routes";
import { analyticsRouter } from "./routes/analytics.routes";
import { healthcareRouter } from "./routes/healthcare.routes";
import { skillRouter } from "./routes/skill.routes";
import { urbanRouter } from "./routes/urban.routes";
import { userRouter } from "./routes/user.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/agriculture", agricultureRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/healthcare", healthcareRouter);
app.use("/api/skills", skillRouter);
app.use("/api/urban", urbanRouter);
app.use("/api/users", userRouter);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on :${env.PORT}`);
});
