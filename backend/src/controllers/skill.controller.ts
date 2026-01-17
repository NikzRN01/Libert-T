import { Request, Response } from 'express';
import * as skillService from '../services/skill.service';

// Define types locally
type Sector = 'HEALTHCARE' | 'AGRICULTURE' | 'URBAN';
type SkillCategory = string;

/**
 * Get all skills for current user
 * GET /api/skills
 */
export async function listSkills(req: Request, res: Response): Promise<void> {
    try {
        if (!(req as any).user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        const { sector, category, search } = req.query;

        const filters: any = {};

        if (sector) {
            filters.sector = sector as Sector;
        }

        if (category) {
            filters.category = category as SkillCategory;
        }

        if (search) {
            filters.search = search as string;
        }

        const skills = await skillService.getUserSkills((req as any).user.userId, filters);

        res.status(200).json({
            skills,
            count: skills.length,
        });
    } catch (error) {
        console.error('List skills error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch skills',
        });
    }
}

/**
 * Add a new skill
 * POST /api/skills
 */
export async function addSkill(req: Request, res: Response): Promise<void> {
    try {
        if (!(req as any).user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        const {
            name,
            category,
            sector,
            proficiencyLevel,
            tags,
            description,
            yearsOfExperience,
            lastUsed,
        } = req.body;

        // Validate required fields
        if (!name || !category || !sector || proficiencyLevel === undefined) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Name, category, sector, and proficiency level are required',
            });
            return;
        }

        // Validate proficiency level
        if (proficiencyLevel < 1 || proficiencyLevel > 5) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Proficiency level must be between 1 and 5',
            });
            return;
        }

        const skill = await skillService.createSkill((req as any).user.userId, {
            name,
            category,
            sector,
            proficiencyLevel,
            tags,
            description,
            yearsOfExperience,
            lastUsed: lastUsed ? new Date(lastUsed) : undefined,
        });

        res.status(201).json({
            message: 'Skill added successfully',
            skill,
        });
    } catch (error) {
        console.error('Add skill error:', error);

        if (error instanceof Error && error.message.includes('Proficiency level')) {
            res.status(400).json({
                error: 'Validation Error',
                message: error.message,
            });
            return;
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to add skill',
        });
    }
}

/**
 * Update a skill
 * PUT /api/skills/:id
 */
export async function updateSkill(req: Request, res: Response): Promise<void> {
    try {
        if (!(req as any).user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        const { id } = req.params;
        const {
            name,
            category,
            sector,
            proficiencyLevel,
            tags,
            description,
            yearsOfExperience,
            lastUsed,
        } = req.body;

        // Validate proficiency level if provided
        if (proficiencyLevel !== undefined) {
            if (proficiencyLevel < 1 || proficiencyLevel > 5) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: 'Proficiency level must be between 1 and 5',
                });
                return;
            }
        }

        const updatedSkill = await skillService.updateSkill(id, (req as any).user.userId, {
            name,
            category,
            sector,
            proficiencyLevel,
            tags,
            description,
            yearsOfExperience,
            lastUsed: lastUsed ? new Date(lastUsed) : undefined,
        });

        res.status(200).json({
            message: 'Skill updated successfully',
            skill: updatedSkill,
        });
    } catch (error) {
        console.error('Update skill error:', error);

        if (error instanceof Error) {
            if (error.message === 'Skill not found') {
                res.status(404).json({
                    error: 'Not Found',
                    message: error.message,
                });
                return;
            }

            if (error.message === 'Unauthorized to update this skill') {
                res.status(403).json({
                    error: 'Forbidden',
                    message: error.message,
                });
                return;
            }

            if (error.message.includes('Proficiency level')) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: error.message,
                });
                return;
            }
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update skill',
        });
    }
}

/**
 * Delete a skill
 * DELETE /api/skills/:id
 */
export async function deleteSkill(req: Request, res: Response): Promise<void> {
    try {
        if (!(req as any).user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }

        const { id } = req.params;

        await skillService.deleteSkill(id, (req as any).user.userId);

        res.status(200).json({
            message: 'Skill deleted successfully',
        });
    } catch (error) {
        console.error('Delete skill error:', error);

        if (error instanceof Error) {
            if (error.message === 'Skill not found') {
                res.status(404).json({
                    error: 'Not Found',
                    message: error.message,
                });
                return;
            }

            if (error.message === 'Unauthorized to delete this skill') {
                res.status(403).json({
                    error: 'Forbidden',
                    message: error.message,
                });
                return;
            }
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete skill',
        });
    }
}

/**
 * Get skill categories by sector
 * GET /api/skills/categories
 */
export async function getCategories(req: Request, res: Response): Promise<void> {
    try {
        const { sector } = req.query;

        if (sector) {
            // Validate sector
            const validSectors = ['HEALTHCARE', 'AGRICULTURE', 'URBAN'];
            if (!validSectors.includes(sector as string)) {
                res.status(400).json({
                    error: 'Validation Error',
                    message: 'Invalid sector',
                });
                return;
            }

            const categories = skillService.getSkillCategoriesBySector(
                sector as Sector
            );

            res.status(200).json({
                sector,
                categories,
            });
        } else {
            const categories = skillService.getAllSkillCategories();

            res.status(200).json({
                categories,
            });
        }
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch categories',
        });
    }
}
