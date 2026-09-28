import { Request, Response } from "express";
import { challengeService } from "../services/challengeService.js";
import { storageService } from "../services/storageService.js";
import {
  validateCreateChallengeInput,
  validateUpdateChallengeInput,
  validateStatusUpdate,
} from "../validators/challengeValidator.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { ChallengeQueryFilters, ChallengeStatus } from "../types/challenge.js";

export class ChallengeController {
  async getChallenges(req: Request, res: Response) {
    try {
      const filters: ChallengeQueryFilters = {
        status: req.query.status as ChallengeStatus,
        category: req.query.category as string,
        district: req.query.district as string,
        block: req.query.block as string,
        departmentId: req.query.departmentId as string,
        submittedByUserId: req.query.submittedByUserId as string,
        submittedBy: (req.query.submittedBy ||
          req.query.submittedByUserId) as string,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const result = await challengeService.getChallenges(filters);
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const totalPages = Math.ceil(result.total / limit) || 1;

      return paginatedResponse(res, {
        items: result.items,
        total: result.total,
        page,
        limit,
        totalPages,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to query challenges.";
      return errorResponse(res, msg, 500);
    }
  }

  async getMyChallenges(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(
          res,
          "Authentication required to view your challenges.",
          401,
        );
      }

      const filters: ChallengeQueryFilters = {
        submittedBy: req.user.userId,
        submittedByUserId: req.user.userId,
        status: req.query.status as ChallengeStatus,
        category: req.query.category as string,
        district: req.query.district as string,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      const result = await challengeService.getChallenges(filters);
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const totalPages = Math.ceil(result.total / limit) || 1;

      return paginatedResponse(res, {
        items: result.items,
        total: result.total,
        page,
        limit,
        totalPages,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to retrieve your challenges.";
      return errorResponse(res, msg, 500);
    }
  }

  async getChallengeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const challenge = await challengeService.getChallengeById(id);
      if (!challenge) {
        return errorResponse(
          res,
          `Challenge with ID "${id}" was not found.`,
          404,
        );
      }
      return successResponse(res, challenge);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to retrieve challenge details.";
      return errorResponse(res, msg, 500);
    }
  }

  async createChallenge(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(
          res,
          "Authentication required to post a challenge.",
          401,
        );
      }

      const validation = validateCreateChallengeInput(req.body);
      if (!validation.isValid) {
        return errorResponse(
          res,
          validation.error || "Invalid challenge parameters.",
          400,
        );
      }

      const challenge = await challengeService.createChallenge(req.body, {
        id: req.user.userId,
        name: req.user.name,
        role: req.user.role,
      });

      return successResponse(
        res,
        challenge,
        "Societal challenge registered successfully.",
        201,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit challenge.";
      return errorResponse(res, msg, 500);
    }
  }

  async updateChallenge(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(
          res,
          "Authentication required to edit a challenge.",
          401,
        );
      }

      const { id } = req.params;
      const validation = validateUpdateChallengeInput(req.body);
      if (!validation.isValid) {
        return errorResponse(
          res,
          validation.error || "Invalid parameters.",
          400,
        );
      }

      const updated = await challengeService.updateChallenge(id, req.body, {
        id: req.user.userId,
        role: req.user.role,
      });

      return successResponse(res, updated, "Challenge successfully updated.");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update challenge.";
      const status = msg.startsWith("Forbidden")
        ? 403
        : msg.includes("cannot be edited")
          ? 400
          : 500;
      return errorResponse(res, msg, status);
    }
  }

  async updateChallengeStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validation = validateStatusUpdate(status);
      if (!validation.isValid) {
        return errorResponse(
          res,
          validation.error || "Invalid status parameter.",
          400,
        );
      }

      const verifier = req.user
        ? { id: req.user.userId, name: req.user.name }
        : undefined;
      const updated = await challengeService.updateChallengeStatus(
        id,
        status as ChallengeStatus,
        verifier,
      );
      return successResponse(
        res,
        updated,
        `Challenge status updated to "${status}".`,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to update challenge status.";
      return errorResponse(res, msg, 400);
    }
  }

  async uploadSupportingFile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return errorResponse(
          res,
          "Authentication required to upload media.",
          401,
        );
      }

      const { fileName, mimeType, fileData, type } = req.body;
      if (!fileName || !fileData || !mimeType) {
        return errorResponse(
          res,
          "Missing required file payload (fileName, mimeType, fileData).",
          400,
        );
      }

      if (typeof fileData === "string" && fileData.length > 4 * 1024 * 1024) {
        return errorResponse(
          res,
          "File payload exceeds the 4MB request limit.",
          400,
        );
      }

      const folder = type === "DOCUMENT" ? "documents" : "images";
      const uploaded = await storageService.uploadFile(
        fileData,
        fileName,
        mimeType,
        folder,
      );

      return successResponse(
        res,
        {
          url: uploaded.url,
          fileName: uploaded.fileName,
          sizeBytes: uploaded.sizeBytes,
          mimeType: uploaded.mimeType,
        },
        "File successfully processed and stored.",
        201,
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to process file upload.";
      return errorResponse(res, msg, 500);
    }
  }
}

export const challengeController = new ChallengeController();
