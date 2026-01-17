import { Router } from 'express';
import * as agricultureController from '../controllers/agriculture.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Agriculture skills
router.get('/skills', agricultureController.getAgricultureSkills);

// Agriculture certifications
router.get('/certifications', agricultureController.getAgricultureCertifications);

// Agriculture projects
router.get('/projects', agricultureController.getAgricultureProjects);

// Agriculture innovation readiness assessment
router.get('/assessment', agricultureController.getAgricultureAssessment);

// Agriculture career pathways
router.get('/career-pathways', agricultureController.getAgricultureCareerPathways);

export default router;
