import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Generate analytics for a sector
router.post('/generate/:sector', analyticsController.generateSkillAnalytics);

// Get cross-sector analytics
router.get('/cross-sector/overview', analyticsController.getCrossSectorAnalytics);

// Get AI-powered recommendations for a sector (must come before generic /:sector route)
router.get('/:sector/recommendations', analyticsController.getAIRecommendations);

// Get analytics for a sector
router.get('/:sector', analyticsController.getAnalytics);

export default router;
