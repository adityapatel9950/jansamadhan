import { Router } from 'express';
import { challengeController } from '../controllers/challengeController.js';
import { authenticateJwt } from '../middleware/authMiddleware.js';
import { requireRoles } from '../middleware/roleMiddleware.js';

const router = Router();

// Publicly readable or authenticated filtering
router.get('/', (req, res) => challengeController.getChallenges(req, res));

// Authenticated citizen: view own challenges
router.get('/my/submissions', authenticateJwt, (req, res) =>
  challengeController.getMyChallenges(req, res)
);

// Get single challenge by ID
router.get('/:id', (req, res) => challengeController.getChallengeById(req, res));

// Submitting challenges (Citizens, Government officials, University faculty, Students, Industry)
router.post('/', authenticateJwt, (req, res) =>
  challengeController.createChallenge(req, res)
);

// Edit challenge before verification (Owner or Admin)
router.put('/:id', authenticateJwt, (req, res) =>
  challengeController.updateChallenge(req, res)
);
router.patch('/:id', authenticateJwt, (req, res) =>
  challengeController.updateChallenge(req, res)
);

// Upload supporting files (images/documents)
router.post('/upload', authenticateJwt, (req, res) =>
  challengeController.uploadSupportingFile(req, res)
);

// Reviewing and Updating challenge status (Restricted to Government officials and Admins)
router.patch(
  '/:id/status',
  authenticateJwt,
  requireRoles('GOVERNMENT', 'ADMIN'),
  (req, res) => challengeController.updateChallengeStatus(req, res)
);

export default router;
