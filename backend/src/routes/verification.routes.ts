import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as verificationController from '../controllers/verification.controller';

const router = Router();

// Create request (student)
router.post('/skills/:skillId/requests', requireAuth, verificationController.createRequest);

// List requests
router.get('/requests/sent', requireAuth, verificationController.listSent);
router.get('/requests/received', requireAuth, requireRole('EDUCATOR', 'ADMIN'), verificationController.listReceived);

// Lifecycle actions
router.post('/requests/:requestId/cancel', requireAuth, verificationController.cancel);
router.post('/requests/:requestId/decision', requireAuth, requireRole('EDUCATOR', 'ADMIN'), verificationController.decide);

export default router;
