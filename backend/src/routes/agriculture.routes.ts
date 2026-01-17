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
router.post('/certifications', agricultureController.addAgricultureCertification);
router.put('/certifications/:id', agricultureController.updateAgricultureCertification);
router.delete('/certifications/:id', agricultureController.deleteAgricultureCertification);

// Agriculture projects
router.get('/projects', agricultureController.getAgricultureProjects);
router.post('/projects', agricultureController.addAgricultureProject);
router.put('/projects/:id', agricultureController.updateAgricultureProject);
router.delete('/projects/:id', agricultureController.deleteAgricultureProject);

// Agriculture innovation readiness assessment
router.get('/assessment', agricultureController.getAgricultureAssessment);

// Agriculture career pathways
router.get('/career-pathways', agricultureController.getAgricultureCareerPathways);

export default router;
