import { Router } from 'express';
import { industryRepository } from '../repositories/industryRepository.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

const router = Router();

router.get('/partners', async (req, res) => {
  try {
    const filters = {
      sector: req.query.sector as string,
      district: req.query.district as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };
    const result = await industryRepository.findAll(filters);
    return paginatedResponse(res, result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query industry partners';
    return errorResponse(res, msg, 500);
  }
});

router.get('/partners/:id', async (req, res) => {
  try {
    const partner = await industryRepository.findById(req.params.id);
    if (!partner) return errorResponse(res, 'Industry partner not found', 404);
    return successResponse(res, partner);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve partner';
    return errorResponse(res, msg, 500);
  }
});

router.get('/partnerships/project/:projectId', async (req, res) => {
  try {
    const partnerships = await industryRepository.getPartnershipsForProject(req.params.projectId);
    return successResponse(res, partnerships);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve partnerships';
    return errorResponse(res, msg, 500);
  }
});

export default router;
