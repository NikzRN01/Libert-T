import { Request, Response } from 'express';
import prisma from '../config/database';

// Type definitions for Prisma models
interface Skill {
    id: string;
    userId: string;
    name: string;
    category: string;
    sector: string;
    proficiencyLevel: number;
    verified: boolean;
    verificationSource: string | null;
    tags: string | null;
    description: string | null;
    yearsOfExperience: number | null;
    lastUsed: Date | null;
    endorsements: number;
    createdAt: Date;
    updatedAt: Date;
}

interface Certification {
    id: string;
    userId: string;
    name: string;
    issuingOrg: string;
    sector: string;
    credentialId: string | null;
    credentialUrl: string | null;
    issueDate: Date;
    expiryDate: Date | null;
    neverExpires: boolean;
    skills: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface Project {
    id: string;
    userId: string;
    title: string;
    description: string;
    sector: string;
    category: string;
    skillsUsed: string | null;
    technologies: string | null;
    outcomes: string;
    impact: string | null;
    metrics: string | null;
    startDate: Date;
    endDate: Date | null;
    status: string;
    teamSize: number | null;
    role: string | null;
    attachments: string | null;
    repositoryUrl: string | null;
    liveUrl: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}
// Agriculture-specific skill categories
const AGRICULTURE_CATEGORIES = [
    'PRECISION_AGRICULTURE',
    'FARM_MANAGEMENT_SOFTWARE',
    'AGRICULTURAL_IOT',
    'CROP_MONITORING',
    'SOIL_ANALYSIS',
    'SUSTAINABLE_FARMING',
    'AGRIBUSINESS',
];

// Get all agriculture skills for a user
export const getAgricultureSkills = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const skills = await prisma.skill.findMany({
            where: {
                userId,
                sector: 'AGRICULTURE',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: skills.map((s: Skill) => ({ ...s, tags: s.tags ? JSON.parse(s.tags) : [] })),
            count: skills.length,
        });
    } catch (error) {
        console.error('Error fetching agriculture skills:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch agriculture skills',
        });
    }
};

// Get agriculture certifications
export const getAgricultureCertifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const certifications = await prisma.certification.findMany({
            where: {
                userId,
                sector: 'AGRICULTURE',
            },
            orderBy: {
                issueDate: 'desc',
            },
        });

        res.json({
            success: true,
            data: certifications.map((c: Certification) => ({ ...c, skills: c.skills ? JSON.parse(c.skills) : [] })),
            count: certifications.length,
        });
    } catch (error) {
        console.error('Error fetching agriculture certifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch agriculture certifications',
        });
    }
};

// Get agriculture projects
export const getAgricultureProjects = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const projects = await prisma.project.findMany({
            where: {
                userId,
                sector: 'AGRICULTURE',
            },
            orderBy: {
                startDate: 'desc',
            },
        });

        res.json({
            success: true,
            data: projects.map((p: Project) => ({
                ...p,
                skillsUsed: p.skillsUsed ? JSON.parse(p.skillsUsed) : [],
                technologies: p.technologies ? JSON.parse(p.technologies) : [],
                metrics: p.metrics ? JSON.parse(p.metrics) : null,
                attachments: p.attachments ? JSON.parse(p.attachments) : null
            })),
            count: projects.length,
        });
    } catch (error) {
        console.error('Error fetching agriculture projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch agriculture projects',
        });
    }
};

// Agriculture innovation readiness assessment
export const getAgricultureAssessment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const skills = await prisma.skill.findMany({
            where: { userId, sector: 'AGRICULTURE' },
        });

        const certifications = await prisma.certification.findMany({
            where: { userId, sector: 'AGRICULTURE' },
        });

        const projects = await prisma.project.findMany({
            where: { userId, sector: 'AGRICULTURE' },
        });

        // Calculate innovation readiness score
        const totalSkills = skills.length;
        const avgProficiency = skills.length > 0
            ? skills.reduce((sum: number, skill: Skill) => sum + skill.proficiencyLevel, 0) / skills.length
            : 0;

        const innovationScore = Math.min(100, Math.round(
            (avgProficiency / 5) * 40 + // 40% from skill proficiency
            Math.min(certifications.length * 15, 30) + // 30% from certifications
            Math.min(projects.filter((p: Project) => p.status === 'COMPLETED').length * 6, 30) // 30% from projects
        ));

        res.json({
            success: true,
            data: {
                innovationScore,
                totalSkills,
                certifications: certifications.length,
                completedProjects: projects.filter((p: Project) => p.status === 'COMPLETED').length,
                averageProficiency: avgProficiency.toFixed(2),
            },
        });
    } catch (error) {
        console.error('Error calculating agriculture assessment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate agriculture assessment',
        });
    }
};

// Agriculture career pathways
export const getAgricultureCareerPathways = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const skills = await prisma.skill.findMany({
            where: { userId, sector: 'AGRICULTURE' },
        });

        const pathways = [
            {
                role: 'Precision Agriculture Specialist',
                description: 'Implement technology-driven farming solutions',
                requiredSkills: ['PRECISION_AGRICULTURE', 'AGRICULTURAL_IOT'],
                matchScore: calculateMatchScore(skills, ['PRECISION_AGRICULTURE', 'AGRICULTURAL_IOT']),
                salaryRange: '$55,000 - $85,000',
                demand: 'High',
            },
            {
                role: 'AgriTech Data Analyst',
                description: 'Analyze agricultural data for optimization',
                requiredSkills: ['CROP_MONITORING', 'SOIL_ANALYSIS'],
                matchScore: calculateMatchScore(skills, ['CROP_MONITORING', 'SOIL_ANALYSIS']),
                salaryRange: '$50,000 - $75,000',
                demand: 'Growing',
            },
            {
                role: 'Sustainable Farming Consultant',
                description: 'Advise on sustainable agricultural practices',
                requiredSkills: ['SUSTAINABLE_FARMING', 'AGRIBUSINESS'],
                matchScore: calculateMatchScore(skills, ['SUSTAINABLE_FARMING', 'AGRIBUSINESS']),
                salaryRange: '$60,000 - $90,000',
                demand: 'Very High',
            },
        ].sort((a, b) => b.matchScore - a.matchScore);

        res.json({
            success: true,
            data: { pathways, currentSkills: skills.length },
        });
    } catch (error) {
        console.error('Error fetching agriculture career pathways:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch agriculture career pathways',
        });
    }
};

// Add agriculture certification
export const addAgricultureCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { name, issuingOrg, credentialId, credentialUrl, issueDate, expiryDate, neverExpires, skills } = req.body;

        const certification = await prisma.certification.create({
            data: {
                userId,
                name,
                issuingOrg,
                sector: 'AGRICULTURE',
                credentialId,
                credentialUrl,
                issueDate: new Date(issueDate),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                neverExpires: neverExpires || false,
                skills: skills ? JSON.stringify(skills) : "[]",
            },
        });

        res.status(201).json({
            success: true,
            data: certification,
            message: 'Agriculture certification added successfully',
        });
    } catch (error) {
        console.error('Error adding agriculture certification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add agriculture certification',
        });
    }
};

// Update agriculture certification
export const updateAgricultureCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        const { name, issuingOrg, credentialId, credentialUrl, issueDate, expiryDate, neverExpires, skills } = req.body;

        const existing = await prisma.certification.findFirst({
            where: { id, userId, sector: 'AGRICULTURE' },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Certification not found',
            });
        }

        const certification = await prisma.certification.update({
            where: { id },
            data: {
                name: name || existing.name,
                issuingOrg: issuingOrg || existing.issuingOrg,
                credentialId,
                credentialUrl,
                issueDate: issueDate ? new Date(issueDate) : existing.issueDate,
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                neverExpires: neverExpires !== undefined ? neverExpires : existing.neverExpires,
                skills: skills ? JSON.stringify(skills) : existing.skills,
            },
        });

        return res.json({
            success: true,
            data: certification,
            message: 'Agriculture certification updated successfully',
        });
    } catch (error) {
        console.error('Error updating agriculture certification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update agriculture certification',
        });
    }
};

// Delete agriculture certification
export const deleteAgricultureCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const existing = await prisma.certification.findFirst({
            where: { id, userId, sector: 'AGRICULTURE' },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Certification not found',
            });
        }

        await prisma.certification.delete({
            where: { id },
        });

        return res.json({
            success: true,
            message: 'Agriculture certification deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting agriculture certification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete agriculture certification',
        });
    }
};

// Add agriculture project
export const addAgricultureProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const {
            title,
            description,
            category,
            skillsUsed,
            technologies,
            outcomes,
            impact,
            metrics,
            startDate,
            endDate,
            status,
            teamSize,
            role,
            repositoryUrl,
            liveUrl,
            isPublic,
        } = req.body;

        if (!title || !description || !category || !outcomes || !startDate) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, category, outcomes, and start date are required',
            });
        }

        const project = await prisma.project.create({
            data: {
                userId,
                title,
                description,
                sector: 'AGRICULTURE',
                category,
                skillsUsed: skillsUsed ? JSON.stringify(skillsUsed) : "[]",
                technologies: technologies ? JSON.stringify(technologies) : "[]",
                outcomes,
                impact,
                metrics: metrics ? JSON.stringify(metrics) : null,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                status: status || 'IN_PROGRESS',
                teamSize,
                role,
                repositoryUrl,
                liveUrl,
                isPublic: isPublic !== undefined ? isPublic : true,
            },
        });

        return res.status(201).json({
            success: true,
            data: project,
            message: 'Agriculture project added successfully',
        });
    } catch (error) {
        console.error('Error adding agriculture project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add agriculture project',
        });
    }
};

// Update agriculture project
export const updateAgricultureProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        const {
            title,
            description,
            category,
            skillsUsed,
            technologies,
            outcomes,
            impact,
            metrics,
            startDate,
            endDate,
            status,
            teamSize,
            role,
            repositoryUrl,
            liveUrl,
            isPublic,
        } = req.body;

        const existing = await prisma.project.findFirst({
            where: { id, userId, sector: 'AGRICULTURE' },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                title: title || existing.title,
                description: description || existing.description,
                category: category || existing.category,
                skillsUsed: skillsUsed ? JSON.stringify(skillsUsed) : existing.skillsUsed,
                technologies: technologies ? JSON.stringify(technologies) : existing.technologies,
                outcomes: outcomes || existing.outcomes,
                impact: impact !== undefined ? impact : existing.impact,
                metrics: metrics ? JSON.stringify(metrics) : existing.metrics,
                startDate: startDate ? new Date(startDate) : existing.startDate,
                endDate: endDate ? new Date(endDate) : existing.endDate,
                status: status || existing.status,
                teamSize: teamSize !== undefined ? teamSize : existing.teamSize,
                role: role !== undefined ? role : existing.role,
                repositoryUrl: repositoryUrl !== undefined ? repositoryUrl : existing.repositoryUrl,
                liveUrl: liveUrl !== undefined ? liveUrl : existing.liveUrl,
                isPublic: isPublic !== undefined ? isPublic : existing.isPublic,
            },
        });

        return res.json({
            success: true,
            data: project,
            message: 'Agriculture project updated successfully',
        });
    } catch (error) {
        console.error('Error updating agriculture project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update agriculture project',
        });
    }
};

// Delete agriculture project
export const deleteAgricultureProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const existing = await prisma.project.findFirst({
            where: { id, userId, sector: 'AGRICULTURE' },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Project not found',
            });
        }

        await prisma.project.delete({
            where: { id },
        });

        return res.json({
            success: true,
            message: 'Agriculture project deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting agriculture project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete agriculture project',
        });
    }
};

function calculateMatchScore(userSkills: any[], requiredSkills: string[]): number {
    const matchedSkills = userSkills.filter(s => requiredSkills.includes(s.category));
    const matchPercentage = (matchedSkills.length / requiredSkills.length) * 100;
    const avgProficiency = matchedSkills.length > 0
        ? matchedSkills.reduce((sum, s) => sum + s.proficiencyLevel, 0) / matchedSkills.length
        : 0;
    return Math.round((matchPercentage * 0.7) + (avgProficiency / 5 * 100 * 0.3));
}
