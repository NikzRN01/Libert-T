import { Request, Response } from 'express';
import prisma from '../config/database';

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
                sector: 'HEALTHCARE',
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({
            success: true,
            data: skills.map(s => ({ ...s, tags: s.tags ? JSON.parse(s.tags) : [] })),
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
                sector: 'HEALTHCARE',
            },
            orderBy: {
                issueDate: 'desc',
            },
        });

        res.json({
            success: true,
            data: certifications.map(c => ({ ...c, skills: c.skills ? JSON.parse(c.skills) : [] })),
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
                sector: 'HEALTHCARE',
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
                sector: 'HEALTHCARE',
            },
            orderBy: {
                startDate: 'desc',
            },
        });

        res.json({
            success: true,
            data: projects.map(p => ({
                ...p,
                skillsUsed: p.skillsUsed ? JSON.parse(p.skillsUsed) : [],
                technologies: p.technologies ? JSON.parse(p.technologies) : [],
                metrics: p.metrics ? JSON.parse(p.metrics) : null,
                attachments: p.attachments ? JSON.parse(p.attachments) : null
            })),
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
                sector: 'HEALTHCARE',
            },
        });

        // Get certifications
        const certifications = await prisma.certification.findMany({
            where: {
                userId,
                sector: 'HEALTHCARE',
            },
        });

        // Get projects
        const projects = await prisma.project.findMany({
            where: {
                userId,
                sector: 'HEALTHCARE',
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
                sector: 'HEALTHCARE',
            },
        });

        // Get analytics if exists
        const analytics = await prisma.skillAnalytics.findFirst({
            where: {
                userId,
                sector: 'HEALTHCARE',
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

// Update healthcare certification
export const updateHealthcareCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        const { name, issuingOrg, credentialId, credentialUrl, issueDate, expiryDate, neverExpires, skills } = req.body;

        // Check if certification exists and belongs to user
        const existing = await prisma.certification.findFirst({
            where: { id, userId, sector: 'HEALTHCARE' },
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
            message: 'Healthcare certification updated successfully',
        });
    } catch (error) {
        console.error('Error updating healthcare certification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update healthcare certification',
        });
    }
};

// Delete healthcare certification
export const deleteHealthcareCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        // Check if certification exists and belongs to user
        const existing = await prisma.certification.findFirst({
            where: { id, userId, sector: 'HEALTHCARE' },
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
            message: 'Healthcare certification deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting healthcare certification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete healthcare certification',
        });
    }
};

// Add healthcare project
export const addHealthcareProject = async (req: Request, res: Response) => {
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
                sector: 'HEALTHCARE',
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
            message: 'Healthcare project added successfully',
        });
    } catch (error) {
        console.error('Error adding healthcare project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add healthcare project',
        });
    }
};

// Update healthcare project
export const updateHealthcareProject = async (req: Request, res: Response) => {
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
            where: { id, userId, sector: 'HEALTHCARE' },
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
            message: 'Healthcare project updated successfully',
        });
    } catch (error) {
        console.error('Error updating healthcare project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update healthcare project',
        });
    }
};

// Delete healthcare project
export const deleteHealthcareProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const existing = await prisma.project.findFirst({
            where: { id, userId, sector: 'HEALTHCARE' },
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
            message: 'Healthcare project deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting healthcare project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete healthcare project',
        });
    }
};

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
