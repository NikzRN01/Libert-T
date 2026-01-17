import { Request, Response } from 'express';
import prisma from '../config/database';

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
                sector: 'URBAN',
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
                sector: 'URBAN',
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
                sector: 'URBAN',
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
            where: { userId, sector: 'URBAN' },
        });

        const certifications = await prisma.certification.findMany({
            where: { userId, sector: 'URBAN' },
        });

        const projects = await prisma.project.findMany({
            where: { userId, sector: 'URBAN' },
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
            where: { userId, sector: 'URBAN' },
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

// Add urban certification
export const addUrbanCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { name, issuingOrg, credentialId, credentialUrl, issueDate, expiryDate, neverExpires, skills } = req.body;

        const certification = await prisma.certification.create({
            data: {
                userId,
                name,
                issuingOrg,
                sector: 'URBAN',
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
            message: 'Urban certification added successfully',
        });
    } catch (error) {
        console.error('Error adding urban certification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add urban certification',
        });
    }
};

// Update urban certification
export const updateUrbanCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;
        const { name, issuingOrg, credentialId, credentialUrl, issueDate, expiryDate, neverExpires, skills } = req.body;

        const existing = await prisma.certification.findFirst({
            where: { id, userId, sector: 'URBAN' },
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
            message: 'Urban certification updated successfully',
        });
    } catch (error) {
        console.error('Error updating urban certification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update urban certification',
        });
    }
};

// Delete urban certification
export const deleteUrbanCertification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const existing = await prisma.certification.findFirst({
            where: { id, userId, sector: 'URBAN' },
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
            message: 'Urban certification deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting urban certification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete urban certification',
        });
    }
};

// Add urban project
export const addUrbanProject = async (req: Request, res: Response) => {
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
                sector: 'URBAN',
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
            message: 'Urban project added successfully',
        });
    } catch (error) {
        console.error('Error adding urban project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add urban project',
        });
    }
};

// Update urban project
export const updateUrbanProject = async (req: Request, res: Response) => {
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
            where: { id, userId, sector: 'URBAN' },
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
            message: 'Urban project updated successfully',
        });
    } catch (error) {
        console.error('Error updating urban project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update urban project',
        });
    }
};

// Delete urban project
export const deleteUrbanProject = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const existing = await prisma.project.findFirst({
            where: { id, userId, sector: 'URBAN' },
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
            message: 'Urban project deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting urban project:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete urban project',
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
