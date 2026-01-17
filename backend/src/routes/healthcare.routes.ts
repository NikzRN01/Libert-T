import { Router } from 'express';
import * as healthcareController from '../controllers/healthcare.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(requireAuth);

// Healthcare skills
router.get('/skills', healthcareController.getHealthcareSkills);

// Healthcare certifications
router.get('/certifications', healthcareController.getHealthcareCertifications);
router.post('/certifications', healthcareController.addHealthcareCertification);
router.put('/certifications/:id', healthcareController.updateHealthcareCertification);
router.delete('/certifications/:id', healthcareController.deleteHealthcareCertification);

// Healthcare projects
router.get('/projects', healthcareController.getHealthcareProjects);
router.post('/projects', healthcareController.addHealthcareProject);
router.put('/projects/:id', healthcareController.updateHealthcareProject);
router.delete('/projects/:id', healthcareController.deleteHealthcareProject);

// Healthcare competency assessment
router.get('/assessment', healthcareController.getHealthcareCompetencyAssessment);

// Healthcare career pathways
router.get('/career-pathways', healthcareController.getHealthcareCareerPathways);

export default router;
