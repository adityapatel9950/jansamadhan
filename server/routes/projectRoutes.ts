import { Router } from 'express';
import { projectRepository } from '../repositories/projectRepository.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { ProjectStage } from '../types/project.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const filters = {
      challengeId: req.query.challengeId as string,
      universityId: req.query.universityId as string,
      stage: req.query.stage as ProjectStage,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };
    const result = await projectRepository.findAll(filters);
    return paginatedResponse(res, result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to query projects';
    return errorResponse(res, msg, 500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await projectRepository.findById(req.params.id);
    if (!project) return errorResponse(res, 'Project not found', 404);
    return successResponse(res, project);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve project';
    return errorResponse(res, msg, 500);
  }
});

router.get('/:id/milestones', async (req, res) => {
  try {
    const milestones = await projectRepository.getMilestones(req.params.id);
    return successResponse(res, milestones);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve milestones';
    return errorResponse(res, msg, 500);
  }
});

router.post('/:id/milestones', authenticateJwt, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return errorResponse(res, 'Milestone title is required', 400);
    const milestone = await projectRepository.addMilestone({
      projectId: req.params.id,
      title,
      description,
      dueDate,
    });
    return successResponse(res, milestone, 'Milestone added successfully', 201);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to add milestone';
    return errorResponse(res, msg, 500);
  }
});

// Proposals for challenge
router.get('/challenge/:challengeId/proposals', async (req, res) => {
  try {
    const proposals = await projectRepository.getProposalsForChallenge(req.params.challengeId);
    return successResponse(res, proposals);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve proposals';
    return errorResponse(res, msg, 500);
  }
});

export default router;
