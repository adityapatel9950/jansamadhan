import { createApp } from "../server/app.js";
import {
  errorHandler,
  notFoundHandler,
} from "../server/middleware/errorMiddleware.js";
import { checkDatabaseHealth, isDbConnected } from "../server/config/db.js";
import { config } from "../server/config/env.js";
import type { Request, Response } from "express";

const app = createApp();
app.use(notFoundHandler);
app.use(errorHandler);

export default async function handler(req: Request, res: Response) {
  const isHealthCheck =
    new URL(req.url ?? "/", "http://localhost").pathname === "/api/health";

  if (config.nodeEnv === "production" && !isDbConnected()) {
    const databaseAvailable = await checkDatabaseHealth();
    if (!databaseAvailable && !isHealthCheck) {
      return res.status(503).json({
        success: false,
        message: "PostgreSQL is unavailable.",
        error: "Database unavailable",
      });
    }
  }

  return app(req, res);
}
