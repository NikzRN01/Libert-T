import { Request, Response } from 'express';
import prisma from '../config/database';
import { Sector, SkillCategory } from '@prisma/client';

// Healthcare-specific skill categories
const HEALTHCARE_CATEGORIES = [
    'CLINICAL_INFORMATICS',
    'HEALTH_DATA_ANALYTICS',
    'EHR_SYSTEMS',
    'TELEMEDICINE',
    'MEDICAL_CODING',
    'HIPAA_COMPLIANCE',
    'HEALTHCARE_IT',
];

// Get all healthcare skills for a user
export const getHealthcareSkills = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const skills = await prisma.skill.findMany({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
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
        console.error('Error fetching healthcare skills:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch healthcare skills',
        });
    }
};

// Get healthcare certifications
export const getHealthcareCertifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const certifications = await prisma.certification.findMany({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
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
        console.error('Error fetching healthcare certifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch healthcare certifications',
        });
    }
};

// Add healthcare certification
export const addHealthcareCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { name, issuingOrg, credentialId, credentialUrl, issueDate, expiryDate, neverExpires, skills } = req.body;

        const certification = await prisma.certification.create({
            data: {
                userId,
                name,
                issuingOrg,
                sector: Sector.HEALTHCARE,
                credentialId,
                credentialUrl,
                issueDate: new Date(issueDate),
                expiryDate: expiryDate ? new Date(expiryDate) : null,
                neverExpires: neverExpires || false,
                skills: skills || [],
            },
        });

        res.status(201).json({
            success: true,
            data: certification,
            message: 'Healthcare certification added successfully',
        });
    } catch (error) {
        console.error('Error adding healthcare certification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add healthcare certification',
        });
    }
};

// Get healthcare projects
export const getHealthcareProjects = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const projects = await prisma.project.findMany({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
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
        console.error('Error fetching healthcare projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch healthcare projects',
        });
    }
};

// Healthcare competency assessment
export const getHealthcareCompetencyAssessment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        // Get all healthcare skills
        const skills = await prisma.skill.findMany({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
            },
        });

        // Get certifications
        const certifications = await prisma.certification.findMany({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
            },
        });

        // Get projects
        const projects = await prisma.project.findMany({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
            },
        });

        // Calculate competency score
        const totalSkills = skills.length;
        const avgProficiency = skills.length > 0
            ? skills.reduce((sum, skill) => sum + skill.proficiencyLevel, 0) / skills.length
            : 0;

        const verifiedSkills = skills.filter(s => s.verified).length;
        const activeCertifications = certifications.filter(c =>
            !c.expiryDate || new Date(c.expiryDate) > new Date()
        ).length;
        const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;

        // Competency score calculation (0-100)
        const competencyScore = Math.min(100, Math.round(
            (avgProficiency / 5) * 30 + // 30% from skill proficiency
            (verifiedSkills / Math.max(totalSkills, 1)) * 20 + // 20% from verified skills
            Math.min(activeCertifications * 10, 25) + // 25% from certifications (max 2-3)
            Math.min(completedProjects * 5, 25) // 25% from projects (max 5)
        ));

        // Category breakdown
        const categoryBreakdown = HEALTHCARE_CATEGORIES.map(category => {
            const categorySkills = skills.filter(s => s.category === category);
            const avgLevel = categorySkills.length > 0
                ? categorySkills.reduce((sum, s) => sum + s.proficiencyLevel, 0) / categorySkills.length
                : 0;

            return {
                category,
                skillCount: categorySkills.length,
                averageProficiency: avgLevel,
                hasSkills: categorySkills.length > 0,
            };
        });

        res.json({
            success: true,
            data: {
                competencyScore,
                totalSkills,
                verifiedSkills,
                activeCertifications,
                completedProjects,
                averageProficiency: avgProficiency.toFixed(2),
                categoryBreakdown,
                recommendations: generateHealthcareRecommendations(categoryBreakdown, competencyScore),
            },
        });
    } catch (error) {
        console.error('Error calculating healthcare competency:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate healthcare competency',
        });
    }
};

// Healthcare career pathway recommendations
export const getHealthcareCareerPathways = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        // Get user's healthcare skills
        const skills = await prisma.skill.findMany({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
            },
        });

        // Get analytics if exists
        const analytics = await prisma.skillAnalytics.findFirst({
            where: {
                userId,
                sector: Sector.HEALTHCARE,
            },
            orderBy: {
                calculatedAt: 'desc',
            },
        });

        // Career pathways based on skills
        const pathways = generateCareerPathways(skills);

        res.json({
            success: true,
            data: {
                pathways,
                currentSkills: skills.length,
                careerReadiness: analytics?.careerReadiness || 0,
                suggestedRoles: analytics?.suggestedRoles || [],
            },
        });
    } catch (error) {
        console.error('Error fetching healthcare career pathways:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch healthcare career pathways',
        });
    }
};

// Helper: Generate recommendations
function generateHealthcareRecommendations(categoryBreakdown: any[], score: number) {
    const recommendations = [];

    // Check for missing categories
    const missingCategories = categoryBreakdown.filter(c => !c.hasSkills);
    if (missingCategories.length > 0) {
        recommendations.push({
            type: 'skill_gap',
            priority: 'high',
            message: `Consider adding skills in: ${missingCategories.map(c => c.category).join(', ')}`,
        });
    }

    // Check for low proficiency
    const lowProficiency = categoryBreakdown.filter(c => c.hasSkills && c.averageProficiency < 3);
    if (lowProficiency.length > 0) {
        recommendations.push({
            type: 'improvement',
            priority: 'medium',
            message: 'Focus on improving proficiency in existing skills through practice and projects',
        });
    }

    // Score-based recommendations
    if (score < 50) {
        recommendations.push({
            type: 'certification',
            priority: 'high',
            message: 'Consider obtaining healthcare IT certifications (CPHIMS, CAHIMS) to boost credibility',
        });
    }

    return recommendations;
}

// Helper: Generate career pathways
function generateCareerPathways(skills: any[]) {
    const pathways = [
        {
            role: 'Clinical Informatics Specialist',
            description: 'Bridge clinical practice and IT systems',
            requiredSkills: ['CLINICAL_INFORMATICS', 'EHR_SYSTEMS', 'HEALTH_DATA_ANALYTICS'],
            matchScore: calculateMatchScore(skills, ['CLINICAL_INFORMATICS', 'EHR_SYSTEMS', 'HEALTH_DATA_ANALYTICS']),
            salaryRange: '$70,000 - $110,000',
            demand: 'High',
        },
        {
            role: 'Health Data Analyst',
            description: 'Analyze healthcare data for insights and improvements',
            requiredSkills: ['HEALTH_DATA_ANALYTICS', 'HEALTHCARE_IT'],
            matchScore: calculateMatchScore(skills, ['HEALTH_DATA_ANALYTICS', 'HEALTHCARE_IT']),
            salaryRange: '$60,000 - $95,000',
            demand: 'Very High',
        },
        {
            role: 'Telemedicine Coordinator',
            description: 'Manage and optimize telehealth services',
            requiredSkills: ['TELEMEDICINE', 'HEALTHCARE_IT'],
            matchScore: calculateMatchScore(skills, ['TELEMEDICINE', 'HEALTHCARE_IT']),
            salaryRange: '$55,000 - $85,000',
            demand: 'Growing',
        },
        {
            role: 'Healthcare Compliance Officer',
            description: 'Ensure HIPAA and regulatory compliance',
            requiredSkills: ['HIPAA_COMPLIANCE', 'HEALTHCARE_IT'],
            matchScore: calculateMatchScore(skills, ['HIPAA_COMPLIANCE', 'HEALTHCARE_IT']),
            salaryRange: '$65,000 - $100,000',
            demand: 'High',
        },
    ];

    return pathways.sort((a, b) => b.matchScore - a.matchScore);
}

// Helper: Calculate match score
function calculateMatchScore(userSkills: any[], requiredSkills: string[]): number {
    const matchedSkills = userSkills.filter(s => requiredSkills.includes(s.category));
    const matchPercentage = (matchedSkills.length / requiredSkills.length) * 100;

    // Factor in proficiency
    const avgProficiency = matchedSkills.length > 0
        ? matchedSkills.reduce((sum, s) => sum + s.proficiencyLevel, 0) / matchedSkills.length
        : 0;

    return Math.round((matchPercentage * 0.7) + (avgProficiency / 5 * 100 * 0.3));
}
