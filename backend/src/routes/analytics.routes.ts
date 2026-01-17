import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Generate analytics for a sector
router.post('/generate/:sector', analyticsController.generateSkillAnalytics);

// Get analytics for a sector
router.get('/:sector', analyticsController.getAnalytics);

// Get cross-sector analytics
router.get('/cross-sector/overview', analyticsController.getCrossSectorAnalytics);

export default router;
