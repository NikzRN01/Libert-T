import { Request, Response } from 'express';
import prisma from '../config/database';
import { Sector } from '@prisma/client';

// Urban-specific skill categories
const URBAN_CATEGORIES = [
    'URBAN_PLANNING',
    'GIS_MAPPING',
    'SMART_INFRASTRUCTURE',
    'IOT_SENSORS',
    'SUSTAINABLE_URBAN_DESIGN',
    'TRANSPORTATION_SYSTEMS',
    'ENERGY_MANAGEMENT',
];

// Get all urban skills for a user
export const getUrbanSkills = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const skills = await prisma.skill.findMany({
            where: {
                userId,
                sector: Sector.URBAN,
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
        console.error('Error fetching urban skills:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch urban skills',
        });
    }
};

// Get urban certifications
export const getUrbanCertifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const certifications = await prisma.certification.findMany({
            where: {
                userId,
                sector: Sector.URBAN,
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
        console.error('Error fetching urban certifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch urban certifications',
        });
    }
};

// Get urban projects
export const getUrbanProjects = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const projects = await prisma.project.findMany({
            where: {
                userId,
                sector: Sector.URBAN,
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
        console.error('Error fetching urban projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch urban projects',
        });
    }
};

// Urban transformation readiness assessment
export const getUrbanAssessment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const skills = await prisma.skill.findMany({
            where: { userId, sector: Sector.URBAN },
        });

        const certifications = await prisma.certification.findMany({
            where: { userId, sector: Sector.URBAN },
        });

        const projects = await prisma.project.findMany({
            where: { userId, sector: Sector.URBAN },
        });

        // Calculate transformation readiness score
        const totalSkills = skills.length;
        const avgProficiency = skills.length > 0
            ? skills.reduce((sum, skill) => sum + skill.proficiencyLevel, 0) / skills.length
            : 0;

        const readinessScore = Math.min(100, Math.round(
            (avgProficiency / 5) * 35 + // 35% from skill proficiency
            Math.min(certifications.length * 12, 30) + // 30% from certifications
            Math.min(projects.filter(p => p.status === 'COMPLETED').length * 7, 35) // 35% from projects
        ));

        res.json({
            success: true,
            data: {
                readinessScore,
                totalSkills,
                certifications: certifications.length,
                completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
                averageProficiency: avgProficiency.toFixed(2),
            },
        });
    } catch (error) {
        console.error('Error calculating urban assessment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate urban assessment',
        });
    }
};

// Urban career pathways
export const getUrbanCareerPathways = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const skills = await prisma.skill.findMany({
            where: { userId, sector: Sector.URBAN },
        });

        const pathways = [
            {
                role: 'Smart City Planner',
                description: 'Design and implement smart city initiatives',
                requiredSkills: ['URBAN_PLANNING', 'SMART_INFRASTRUCTURE'],
                matchScore: calculateMatchScore(skills, ['URBAN_PLANNING', 'SMART_INFRASTRUCTURE']),
                salaryRange: '$65,000 - $100,000',
                demand: 'Very High',
            },
            {
                role: 'GIS Specialist',
                description: 'Analyze spatial data for urban development',
                requiredSkills: ['GIS_MAPPING', 'URBAN_PLANNING'],
                matchScore: calculateMatchScore(skills, ['GIS_MAPPING', 'URBAN_PLANNING']),
                salaryRange: '$55,000 - $85,000',
                demand: 'High',
            },
            {
                role: 'Sustainable Urban Designer',
                description: 'Create environmentally sustainable urban spaces',
                requiredSkills: ['SUSTAINABLE_URBAN_DESIGN', 'ENERGY_MANAGEMENT'],
                matchScore: calculateMatchScore(skills, ['SUSTAINABLE_URBAN_DESIGN', 'ENERGY_MANAGEMENT']),
                salaryRange: '$60,000 - $95,000',
                demand: 'Growing',
            },
            {
                role: 'Smart Transportation Engineer',
                description: 'Develop intelligent transportation systems',
                requiredSkills: ['TRANSPORTATION_SYSTEMS', 'IOT_SENSORS'],
                matchScore: calculateMatchScore(skills, ['TRANSPORTATION_SYSTEMS', 'IOT_SENSORS']),
                salaryRange: '$70,000 - $105,000',
                demand: 'High',
            },
        ].sort((a, b) => b.matchScore - a.matchScore);

        res.json({
            success: true,
            data: { pathways, currentSkills: skills.length },
        });
    } catch (error) {
        console.error('Error fetching urban career pathways:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch urban career pathways',
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
