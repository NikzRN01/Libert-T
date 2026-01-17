import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { supabaseAdmin } from '../config/supabase';
import { config } from '../config';

async function ensureAvatarBucketExists(bucket: string) {
    const existing = await supabaseAdmin.storage.getBucket(bucket);
    if (!existing.error) return;

    const msg = existing.error.message || '';
    if (!msg.toLowerCase().includes('bucket not found')) {
        throw new Error(existing.error.message);
    }

    const created = await supabaseAdmin.storage.createBucket(bucket, {
        public: true,
    });

    if (created.error) {
        // If another request created it concurrently, ignore.
        const createMsg = created.error.message || '';
        if (!createMsg.toLowerCase().includes('already exists')) {
            throw new Error(created.error.message);
        }
    }
}

/**
 * Get current user's profile
 * GET /api/users/profile
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        const profile = await userService.getUserProfile(req.user.userId);

        res.status(200).json({
            profile,
        });
    } catch (error) {
        console.error('Get profile error:', error);

        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({
                error: 'Not Found',
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch profile',
        });
    }
}

/**
 * Update current user's profile
 * PUT /api/users/profile
 */
export async function updateProfile(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        const {
            bio,
            phone,
            location,
            linkedIn,
            github,
            portfolio,
            dateOfBirth,
            education,
            experience,
            interests,
            targetSectors,
            careerGoals,
            preferredLearningStyle,
            availableHoursPerWeek,
        } = req.body;

        // Validate target sectors if provided
        if (targetSectors && Array.isArray(targetSectors)) {
            const validSectors = ['HEALTHCARE', 'AGRICULTURE', 'URBAN'];
            const invalidSectors = targetSectors.filter(
                (sector: string) => !validSectors.includes(sector)
            );

            if (invalidSectors.length > 0) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: `Invalid sectors: ${invalidSectors.join(', ')}`,
                });
                return;
            }
        }

        const updatedProfile = await userService.updateUserProfile(req.user.userId, {
            bio,
            phone,
            location,
            linkedIn,
            github,
            portfolio,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            education,
            experience,
            interests,
            targetSectors,
            careerGoals,
            preferredLearningStyle,
            availableHoursPerWeek,
        });

        res.status(200).json({
            message: 'Profile updated successfully',
            profile: updatedProfile,
        });
    } catch (error) {
        console.error('Update profile error:', error);

        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({
                error: 'Not Found',
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update profile',
        });
    }
}

/**
 * Update user avatar
 * PATCH /api/users/avatar
 */
export async function uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        let finalAvatarUrl: string | undefined;

        // Option 1: multipart file upload
        if (req.file && req.file.buffer) {
            const bucket = config.supabase.avatarBucket;
            const extension = req.file.originalname.split('.').pop() || 'png';
            const objectPath = `users/${req.user.userId}/${Date.now()}.${extension}`;

            // Avoid failing with "Bucket not found" (common during fresh setup)
            await ensureAvatarBucketExists(bucket);

            let uploadResult = await supabaseAdmin.storage
                .from(bucket)
                .upload(objectPath, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: true,
                });

            // Retry once if the bucket was missing and got created by another request
            if (uploadResult.error && uploadResult.error.message.toLowerCase().includes('bucket not found')) {
                await ensureAvatarBucketExists(bucket);
                uploadResult = await supabaseAdmin.storage
                    .from(bucket)
                    .upload(objectPath, req.file.buffer, {
                        contentType: req.file.mimetype,
                        upsert: true,
                    });
            }

            if (uploadResult.error) {
                res.status(500).json({
                    error: 'Upload Error',
                    message:
                        uploadResult.error.message.includes('Bucket not found')
                            ? `Supabase Storage bucket "${bucket}" not found. Create it in Supabase Storage or set SUPABASE_AVATAR_BUCKET to an existing bucket.`
                            : uploadResult.error.message,
                });
                return;
            }

            const publicUrl = supabaseAdmin.storage
                .from(bucket)
                .getPublicUrl(objectPath).data.publicUrl;

            finalAvatarUrl = publicUrl;
        }

        // Option 2: direct URL update (e.g., uploaded from client)
        if (!finalAvatarUrl) {
            const { avatarUrl } = req.body as { avatarUrl?: string };
            if (!avatarUrl) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: 'Provide an avatar file (field "avatar") or an avatarUrl',
                });
                return;
            }
            finalAvatarUrl = avatarUrl;
        }

        const updatedUser = await userService.uploadUserAvatar(req.user.userId, finalAvatarUrl);

        res.status(200).json({
            message: 'Avatar updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        const message = error instanceof Error ? error.message : 'Failed to upload avatar';
        res.status(500).json({
            error: 'Internal Server Error',
            message,
        });
    }
}

/**
 * Get public profile of a user
 * GET /api/users/:id
 */
export async function getPublicProfile(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'User ID is required',
            });
            return;
        }

        const profile = await userService.getPublicProfile(id);

        res.status(200).json({
            profile,
        });
    } catch (error) {
        console.error('Get public profile error:', error);

        if (error instanceof Error && error.message === 'User not found') {
            res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
            });
            return;
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch profile',
        });
    }
}

/**
 * Update user basic info (name)
 * PATCH /api/users/basic-info
 */
export async function updateBasicInfo(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Name is required',
            });
            return;
        }

        const updatedUser = await userService.updateUserBasicInfo(req.user.userId, {
            name: name.trim(),
        });

        res.status(200).json({
            message: 'User info updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Update basic info error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update user info',
        });
    }
}
