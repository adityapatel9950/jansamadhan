import cors from "cors";
import express from "express";
import apiRouter from "./routes/index.js";
import { requestLogger } from "./middleware/loggingMiddleware.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "4mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use("/api", apiRouter);

  return app;
}
