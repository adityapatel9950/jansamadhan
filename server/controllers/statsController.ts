import { Request, Response } from 'express';
import { challengeService } from '../services/challengeService.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class StatsController {
  async getDashboardStats(_req: Request, res: Response) {
    try {
      const stats = await challengeService.getStats();
      return successResponse(res, stats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to compile statistics.';
      return errorResponse(res, msg, 500);
    }
  }
}

export const statsController = new StatsController();
