import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import * as mentorController from '../controllers/mentor.controller';

const router = Router();

// Mentors list (students can use to pick a reviewer)
router.get('/approved', requireAuth, mentorController.listApprovedMentors);

// Mentor self-profile
router.get('/me', requireAuth, requireRole('EDUCATOR', 'ADMIN'), mentorController.getMyMentorProfile);
router.put('/me', requireAuth, requireRole('EDUCATOR', 'ADMIN'), mentorController.upsertMyMentorProfile);

// Admin approval
router.post('/:userId/approve', requireAuth, requireRole('ADMIN'), mentorController.approveMentor);

export default router;
