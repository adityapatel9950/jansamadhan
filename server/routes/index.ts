import { Router } from "express";
import authRoutes from "./authRoutes.js";
import challengeRoutes from "./challengeRoutes.js";
import departmentRoutes from "./departmentRoutes.js";
import statsRoutes from "./statsRoutes.js";
import universityRoutes from "./universityRoutes.js";
import projectRoutes from "./projectRoutes.js";
import industryRoutes from "./industryRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import { isDbConnected } from "../config/db.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/challenges", challengeRoutes);
apiRouter.use("/departments", departmentRoutes);
apiRouter.use("/stats", statsRoutes);
apiRouter.use("/universities", universityRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/industry", industryRoutes);
apiRouter.use("/notifications", notificationRoutes);

apiRouter.get("/health", (_req, res) => {
  res.json({
    status: "HEALTHY",
    platform: "JanSamadhan SIH 2026 Phase 2",
    timestamp: new Date().toISOString(),
    postgresConnected: isDbConnected(),
  });
});

export default apiRouter;
