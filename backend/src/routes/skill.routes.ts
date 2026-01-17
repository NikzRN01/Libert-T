import { Router } from 'express';
import * as skillController from '../controllers/skill.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/skills
 * @desc    Get all skills for current user (with optional filters)
 * @access  Private
 * @query   sector, category, search
 */
router.get('/', requireAuth, skillController.listSkills);

/**
 * @route   POST /api/skills
 * @desc    Add a new skill
 * @access  Private
 */
router.post('/', requireAuth, skillController.addSkill);

/**
 * @route   PUT /api/skills/:id
 * @desc    Update a skill
 * @access  Private
 */
router.put('/:id', requireAuth, skillController.updateSkill);

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill
 * @access  Private
 */
router.delete('/:id', requireAuth, skillController.deleteSkill);

/**
 * @route   GET /api/skills/categories
 * @desc    Get skill categories (optionally filtered by sector)
 * @access  Public
 * @query   sector (optional)
 */
router.get('/categories', skillController.getCategories);

export default router;
