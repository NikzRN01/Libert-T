import { Router } from 'express';
import * as urbanController from '../controllers/urban.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Urban skills
router.get('/skills', urbanController.getUrbanSkills);

// Urban certifications
router.get('/certifications', urbanController.getUrbanCertifications);

// Urban projects
router.get('/projects', urbanController.getUrbanProjects);

// Urban transformation readiness assessment
router.get('/assessment', urbanController.getUrbanAssessment);

// Urban career pathways
router.get('/career-pathways', urbanController.getUrbanCareerPathways);

export default router;
