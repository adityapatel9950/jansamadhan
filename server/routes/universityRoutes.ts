import { Router } from 'express';
import { universityRepository } from '../repositories/universityRepository.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const filters = {
      district: req.query.district as string,
      institutionType: req.query.institutionType as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };
    const result = await universityRepository.findAll(filters);
    return paginatedResponse(res, result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query universities';
    return errorResponse(res, msg, 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const uni = await universityRepository.findById(req.params.id);
    if (!uni) return errorResponse(res, 'University not found', 404);
    return successResponse(res, uni);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve university';
    return errorResponse(res, msg, 500);
  }
});

router.get('/:id/faculty', async (req, res) => {
  try {
    const faculty = await universityRepository.findFacultyByUniversity(req.params.id);
    return successResponse(res, faculty);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve faculty';
    return errorResponse(res, msg, 500);
  }
});

router.get('/:id/teams', async (req, res) => {
  try {
    const teams = await universityRepository.findTeamsByUniversity(req.params.id);
    return successResponse(res, teams);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve student teams';
    return errorResponse(res, msg, 500);
  }
});

export default router;
