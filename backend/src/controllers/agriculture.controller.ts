import { Request, Response } from 'express';
import prisma from '../config/database';
import { Sector } from '@prisma/client';

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
                sector: Sector.AGRICULTURE,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: skills,
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
                sector: Sector.AGRICULTURE,
            },
            orderBy: {
                issueDate: 'desc',
            },
        });

        res.json({
            success: true,
            data: certifications,
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
                sector: Sector.AGRICULTURE,
            },
            orderBy: {
                startDate: 'desc',
            },
        });

        res.json({
            success: true,
            data: projects,
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
            where: { userId, sector: Sector.AGRICULTURE },
        });

        const certifications = await prisma.certification.findMany({
            where: { userId, sector: Sector.AGRICULTURE },
        });

        const projects = await prisma.project.findMany({
            where: { userId, sector: Sector.AGRICULTURE },
        });

        // Calculate innovation readiness score
        const totalSkills = skills.length;
        const avgProficiency = skills.length > 0
            ? skills.reduce((sum, skill) => sum + skill.proficiencyLevel, 0) / skills.length
            : 0;

        const innovationScore = Math.min(100, Math.round(
            (avgProficiency / 5) * 40 + // 40% from skill proficiency
            Math.min(certifications.length * 15, 30) + // 30% from certifications
            Math.min(projects.filter(p => p.status === 'COMPLETED').length * 6, 30) // 30% from projects
        ));

        res.json({
            success: true,
            data: {
                innovationScore,
                totalSkills,
                certifications: certifications.length,
                completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
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
            where: { userId, sector: Sector.AGRICULTURE },
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

function calculateMatchScore(userSkills: any[], requiredSkills: string[]): number {
    const matchedSkills = userSkills.filter(s => requiredSkills.includes(s.category));
    const matchPercentage = (matchedSkills.length / requiredSkills.length) * 100;
    const avgProficiency = matchedSkills.length > 0
        ? matchedSkills.reduce((sum, s) => sum + s.proficiencyLevel, 0) / matchedSkills.length
        : 0;
    return Math.round((matchPercentage * 0.7) + (avgProficiency / 5 * 100 * 0.3));
}
