import { Request, Response } from "express";
import { authService } from "../services/authService.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../validators/authValidator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const validation = validateRegisterInput(req.body);
      if (!validation.isValid) {
        return errorResponse(
          res,
          validation.error || "Invalid registration data.",
          400,
        );
      }

      const result = await authService.register(req.body);
      return successResponse(
        res,
        result,
        "Registration successful. Welcome to JanSamadhan.",
        201,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      return errorResponse(res, msg, 400);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validation = validateLoginInput(req.body);
      if (!validation.isValid) {
        return errorResponse(
          res,
          validation.error || "Invalid login credentials.",
          400,
        );
      }

      const result = await authService.login(req.body);
      return successResponse(res, result, "Authentication successful.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      return errorResponse(res, msg, 401);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(res, "Unauthorized", 401);
      }

      const user = await authService.getCurrentUser(req.user.userId);
      if (!user) {
        return errorResponse(res, "User record not found.", 404);
      }

      return successResponse(res, user);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to retrieve profile.";
      return errorResponse(res, msg, 500);
    }
  }

  async getDemoAccounts(_req: Request, res: Response) {
    try {
      const accounts = await authService.getDemoAccounts();
      return successResponse(res, accounts);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to retrieve demo accounts.";
      return errorResponse(res, msg, 500);
    }
  }
}

export const authController = new AuthController();
