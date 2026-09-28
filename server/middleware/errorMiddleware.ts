import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/response.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(`[Unhandled Error] ${req.method} ${req.url}:`, err);
  if ((err as Error & { type?: string }).type === "entity.too.large") {
    return errorResponse(res, "Request body exceeds the 4MB limit.", 413);
  }
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error. Please try again later."
      : err.message || "Internal server error";
  return errorResponse(res, message, 500);
};

export const notFoundHandler = (req: Request, res: Response) => {
  if (req.originalUrl.startsWith("/api")) {
    return errorResponse(
      res,
      `API route not found: ${req.method} ${req.originalUrl}`,
      404,
    );
  }
};
