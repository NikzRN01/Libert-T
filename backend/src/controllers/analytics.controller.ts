import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateAIRecommendations } from '../services/ai-recommendation.service';

// Generate or update skill analytics for a user
export const generateSkillAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { sector } = req.params;

        if (!sector || !['HEALTHCARE', 'AGRICULTURE', 'URBAN'].includes(sector)) {
            return res.status(400).json({
                success: false,
                message: 'Valid sector required (HEALTHCARE, AGRICULTURE, or URBAN)',
            });
        }

        // Get user's skills for the sector
        const skills = await prisma.skill.findMany({
            where: { userId, sector: sector as string },
        });

        const certifications = await prisma.certification.findMany({
            where: { userId, sector: sector as string },
        });

        const projects = await prisma.project.findMany({
            where: { userId, sector: sector as string },
        });

        // Calculate scores
        const overallScore = calculateOverallScore(skills, certifications, projects);
        const careerReadiness = calculateCareerReadiness(skills, certifications, projects);
        const industryAlignment = calculateIndustryAlignment(skills, projects, sector as string);

        // Identify skill gaps
        const skillGaps = identifySkillGaps(skills, sector as string);

        // Identify strengths
        const strengths = identifyStrengths(skills);

        // Generate recommendations
        const recommendations = generateRecommendations(skills, skillGaps, certifications);

        // Suggest roles
        const suggestedRoles = suggestCareerRoles(skills, sector as string);

        // Delete existing analytics for this user/sector if exists
        await prisma.skillAnalytics.deleteMany({
            where: {
                userId,
                sector: sector as string,
            },
        });

        // Create new analytics
        const analytics = await prisma.skillAnalytics.create({
            data: {
                userId,
                sector: sector as string,
                overallScore,
                careerReadiness,
                industryAlignment,
                skillGaps: JSON.stringify(skillGaps),
                strengths: JSON.stringify(strengths),
                recommendations: JSON.stringify(recommendations),
                suggestedRoles: suggestedRoles ? JSON.stringify(suggestedRoles) : undefined,
                dataPoints: skills.length + certifications.length + projects.length,
            },
        });

        return res.json({
            success: true,
            data: analytics,
            message: 'Analytics generated successfully',
        });
    } catch (error) {
        console.error('Error generating analytics:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate analytics',
        });
    }
};

// Get analytics for a sector
export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { sector } = req.params;

        const analytics = await prisma.skillAnalytics.findFirst({
            where: {
                userId,
                sector: sector as string,
            },
            orderBy: {
                calculatedAt: 'desc',
            },
        });

        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: 'No analytics found. Generate analytics first.',
            });
        }

        return res.json({
            success: true,
            data: {
                ...analytics,
                skillGaps: JSON.parse(analytics.skillGaps),
                strengths: JSON.parse(analytics.strengths),
                recommendations: JSON.parse(analytics.recommendations),
                suggestedRoles: analytics.suggestedRoles ? JSON.parse(analytics.suggestedRoles) : [],
                marketDemand: analytics.marketDemand ? JSON.parse(analytics.marketDemand) : null
            },
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
        });
    }
};

// Get cross-sector analytics
export const getCrossSectorAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        const allAnalytics = await prisma.skillAnalytics.findMany({
            where: { userId },
            orderBy: { calculatedAt: 'desc' },
        });

        // Get latest analytics for each sector
        const latestBySector = {
            HEALTHCARE: allAnalytics.find(a => a.sector === 'HEALTHCARE'),
            AGRICULTURE: allAnalytics.find(a => a.sector === 'AGRICULTURE'),
            URBAN: allAnalytics.find(a => a.sector === 'URBAN'),
        };

        // Calculate cross-sector insights
        const totalSkills = await prisma.skill.count({ where: { userId } });
        const totalProjects = await prisma.project.count({ where: { userId } });
        const totalCertifications = await prisma.certification.count({ where: { userId } });

        const averageReadiness = allAnalytics.length > 0
            ? allAnalytics.reduce((sum, a) => sum + a.careerReadiness, 0) / allAnalytics.length
            : 0;

        res.json({
            success: true,
            data: {
                bySector: latestBySector,
                overall: {
                    totalSkills,
                    totalProjects,
                    totalCertifications,
                    averageReadiness: Math.round(averageReadiness),
                    sectorsActive: allAnalytics.length,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching cross-sector analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch cross-sector analytics',
        });
    }
};

// Helper functions
function calculateOverallScore(skills: any[], certifications: any[], projects: any[]): number {
    const skillScore = skills.length > 0
        ? (skills.reduce((sum, s) => sum + s.proficiencyLevel, 0) / skills.length / 5) * 40
        : 0;

    const certScore = Math.min(certifications.length * 10, 30);
    const projectScore = Math.min(projects.filter(p => p.status === 'COMPLETED').length * 6, 30);

    return Math.round(skillScore + certScore + projectScore);
}

function calculateCareerReadiness(skills: any[], certifications: any[], projects: any[]): number {
    const verifiedSkills = skills.filter(s => s.verified).length;
    const activeCerts = certifications.filter(c => !c.expiryDate || new Date(c.expiryDate) > new Date()).length;

    // Career Readiness is calculated based on skills and certifications only
    const readiness = Math.min(100, Math.round(
        (verifiedSkills / Math.max(skills.length, 1)) * 50 + // 50% from verified skills
        Math.min(activeCerts * 10, 50) // 50% from active certifications (max 5 certs)
    ));

    return readiness;
}

function calculateIndustryAlignment(skills: any[], projects: any[], sector: string): number {
    // Industry Alignment is calculated based on skills and projects
    const avgProficiency = skills.length > 0
        ? skills.reduce((sum, s) => sum + s.proficiencyLevel, 0) / skills.length
        : 0;

    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const publicProjects = projects.filter(p => p.isPublic).length;

    const alignment = Math.min(100, Math.round(
        (skills.length / 10) * 30 + // Up to 10 skills = 30%
        (avgProficiency / 5) * 30 + // Proficiency = 30%
        Math.min(completedProjects * 8, 25) + // Completed projects = 25% (max ~3 projects)
        Math.min(publicProjects * 5, 15) // Public projects = 15% (max 3 public projects)
    ));

    return alignment;
}

function identifySkillGaps(skills: any[], sector: string): any {
    const sectorSkillCategories: Record<string, string[]> = {
        HEALTHCARE: ['CLINICAL_INFORMATICS', 'HEALTH_DATA_ANALYTICS', 'EHR_SYSTEMS', 'TELEMEDICINE', 'HIPAA_COMPLIANCE'],
        AGRICULTURE: ['PRECISION_AGRICULTURE', 'AGRICULTURAL_IOT', 'CROP_MONITORING', 'SUSTAINABLE_FARMING'],
        URBAN: ['URBAN_PLANNING', 'GIS_MAPPING', 'SMART_INFRASTRUCTURE', 'SUSTAINABLE_URBAN_DESIGN'],
    };

    const requiredCategories = sectorSkillCategories[sector] || [];
    const userCategories = skills.map(s => s.category);

    const gaps = requiredCategories
        .filter(cat => !userCategories.includes(cat))
        .map(cat => ({
            category: cat,
            importance: 'high',
            recommendation: `Consider learning ${cat.toLowerCase().replace(/_/g, ' ')}`,
        }));

    return gaps;
}

function identifyStrengths(skills: any[]): any {
    const strongSkills = skills
        .filter(s => s.proficiencyLevel >= 4)
        .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
        .slice(0, 5)
        .map(s => ({
            skill: s.name,
            category: s.category,
            level: s.proficiencyLevel,
            verified: s.verified,
        }));

    return strongSkills;
}

function generateRecommendations(skills: any[], gaps: any[], certifications: any[]): any {
    const recommendations = [];

    if (gaps.length > 0) {
        recommendations.push({
            type: 'skill_development',
            priority: 'high',
            title: 'Fill Critical Skill Gaps',
            description: `Focus on developing skills in ${gaps.slice(0, 3).map((g: any) => g.category).join(', ')}`,
        });
    }

    const lowProficiencySkills = skills.filter(s => s.proficiencyLevel < 3);
    if (lowProficiencySkills.length > 0) {
        recommendations.push({
            type: 'improvement',
            priority: 'medium',
            title: 'Improve Existing Skills',
            description: 'Practice and enhance proficiency in your current skill set',
        });
    }

    if (certifications.length < 2) {
        recommendations.push({
            type: 'certification',
            priority: 'high',
            title: 'Obtain Professional Certifications',
            description: 'Industry certifications boost credibility and career prospects',
        });
    }

    return recommendations;
}

function suggestCareerRoles(skills: any[], sector: string): string[] {
    const rolesBySector: Record<string, string[]> = {
        HEALTHCARE: ['Clinical Informatics Specialist', 'Health Data Analyst', 'Healthcare IT Manager', 'Telemedicine Coordinator'],
        AGRICULTURE: ['Precision Agriculture Specialist', 'AgriTech Data Analyst', 'Sustainable Farming Consultant', 'Farm Technology Manager'],
        URBAN: ['Smart City Planner', 'GIS Specialist', 'Sustainable Urban Designer', 'Smart Transportation Engineer'],
    };

    return rolesBySector[sector] || [];
}

// Get AI-powered recommendations for a sector
export const getAIRecommendations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { sector } = req.params;
        const score = parseInt(req.query.score as string) || 0;

        if (!sector || !['HEALTHCARE', 'AGRICULTURE', 'URBAN'].includes(sector)) {
            return res.status(400).json({
                success: false,
                message: 'Valid sector required (HEALTHCARE, AGRICULTURE, or URBAN)',
            });
        }

        // Get user's skills, projects, and certifications
        const [skills, projects, certifications] = await Promise.all([
            prisma.skill.findMany({
                where: { userId, sector: sector as string },
                select: { name: true },
            }),
            prisma.project.count({
                where: { userId, sector: sector as string },
            }),
            prisma.certification.count({
                where: { userId, sector: sector as string },
            }),
        ]);

        const skillNames = skills.map((s) => s.name);

        // Generate AI recommendations
        const recommendations = await generateAIRecommendations({
            sector,
            competencyScore: score,
            skills: skillNames,
            projects,
            certifications,
        });

        return res.json({
            success: true,
            recommendations,
        });
    } catch (error) {
        console.error('Error getting AI recommendations:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get recommendations',
        });
    }
};
