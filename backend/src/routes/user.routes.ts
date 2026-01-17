import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { avatarUpload } from '../middleware/upload.middleware';

const router = Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/profile', requireAuth, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/profile', requireAuth, userController.updateProfile);

/**
 * @route   PATCH /api/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
router.patch('/avatar', requireAuth, avatarUpload.single('avatar'), userController.uploadAvatar);

/**
 * @route   PATCH /api/users/basic-info
 * @desc    Update user basic info (name)
 * @access  Private
 */
router.patch('/basic-info', requireAuth, userController.updateBasicInfo);

/**
 * @route   GET /api/users/:id
 * @desc    Get public profile of a user
 * @access  Public
 */
router.get('/:id', userController.getPublicProfile);

export default router;
