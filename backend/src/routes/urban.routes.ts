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
router.post('/certifications', urbanController.addUrbanCertification);
router.put('/certifications/:id', urbanController.updateUrbanCertification);
router.delete('/certifications/:id', urbanController.deleteUrbanCertification);

// Urban projects
router.get('/projects', urbanController.getUrbanProjects);
router.post('/projects', urbanController.addUrbanProject);
router.put('/projects/:id', urbanController.updateUrbanProject);
router.delete('/projects/:id', urbanController.deleteUrbanProject);

// Urban transformation readiness assessment
router.get('/assessment', urbanController.getUrbanAssessment);

// Urban career pathways
router.get('/career-pathways', urbanController.getUrbanCareerPathways);

export default router;
