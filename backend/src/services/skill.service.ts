import prisma from '../config/database';

// Define types locally (these match the Prisma schema)
type Sector = 'HEALTHCARE' | 'AGRICULTURE' | 'URBAN';
type SkillCategory =
    | 'CLINICAL_INFORMATICS'
    | 'HEALTH_DATA_ANALYTICS'
    | 'EHR_SYSTEMS'
    | 'TELEMEDICINE'
    | 'MEDICAL_CODING'
    | 'HIPAA_COMPLIANCE'
    | 'HEALTHCARE_IT'
    | 'PRECISION_AGRICULTURE'
    | 'FARM_MANAGEMENT_SOFTWARE'
    | 'AGRICULTURAL_IOT'
    | 'CROP_MONITORING'
    | 'SOIL_ANALYSIS'
    | 'SUSTAINABLE_FARMING'
    | 'AGRIBUSINESS'
    | 'URBAN_PLANNING'
    | 'GIS_MAPPING'
    | 'SMART_INFRASTRUCTURE'
    | 'IOT_SENSORS'
    | 'SUSTAINABLE_URBAN_DESIGN'
    | 'TRANSPORTATION_SYSTEMS'
    | 'ENERGY_MANAGEMENT'
    | 'DATA_ANALYSIS'
    | 'MACHINE_LEARNING'
    | 'PROJECT_MANAGEMENT'
    | 'COMMUNICATION'
    | 'LEADERSHIP'
    | 'RESEARCH';

export interface CreateSkillData {
    name: string;
    category: SkillCategory;
    sector: Sector;
    proficiencyLevel: number;
    verified?: boolean;
    verificationSource?: string;
    tags?: string[];
    description?: string;
    yearsOfExperience?: number;
    lastUsed?: Date;
}

export interface UpdateSkillData {
    name?: string;
    category?: SkillCategory;
    sector?: Sector;
    proficiencyLevel?: number;
    tags?: string[];
    description?: string;
    yearsOfExperience?: number;
    lastUsed?: Date;
}

export interface SkillFilters {
    sector?: Sector;
    category?: SkillCategory;
    search?: string;
}

/**
 * Get all skills for a user with optional filters
 */
export async function getUserSkills(userId: string, filters?: SkillFilters) {
    const where: any = { userId };

    if (filters?.sector) {
        where.sector = filters.sector;
    }

    if (filters?.category) {
        where.category = filters.category;
    }

    if (filters?.search) {
        where.name = {
            contains: filters.search,
            mode: 'insensitive',
        };
    }

    const skills = await prisma.skill.findMany({
        where,
        orderBy: [
            { verified: 'desc' },
            { proficiencyLevel: 'desc' },
            { createdAt: 'desc' },
        ],
    });

    return skills;
}

/**
 * Create a new skill for a user
 */
export async function createSkill(userId: string, data: CreateSkillData) {
    // Validate proficiency level (1-5)
    if (data.proficiencyLevel < 1 || data.proficiencyLevel > 5) {
        throw new Error('Proficiency level must be between 1 and 5');
    }

    const skill = await prisma.skill.create({
        data: {
            userId,
            name: data.name,
            category: data.category,
            sector: data.sector,
            proficiencyLevel: data.proficiencyLevel,
            verified: data.verified || false,
            verificationSource: data.verificationSource,
            tags: data.tags || [],
            description: data.description,
            yearsOfExperience: data.yearsOfExperience,
            lastUsed: data.lastUsed,
        },
    });

    return skill;
}

/**
 * Update a skill (only if user owns it)
 */
export async function updateSkill(
    skillId: string,
    userId: string,
    data: UpdateSkillData
) {
    // Check if skill exists and belongs to user
    const existingSkill = await prisma.skill.findUnique({
        where: { id: skillId },
    });

    if (!existingSkill) {
        throw new Error('Skill not found');
    }

    if (existingSkill.userId !== userId) {
        throw new Error('Unauthorized to update this skill');
    }

    // Validate proficiency level if provided
    if (data.proficiencyLevel !== undefined) {
        if (data.proficiencyLevel < 1 || data.proficiencyLevel > 5) {
            throw new Error('Proficiency level must be between 1 and 5');
        }
    }

    const updatedSkill = await prisma.skill.update({
        where: { id: skillId },
        data: {
            name: data.name,
            category: data.category,
            sector: data.sector,
            proficiencyLevel: data.proficiencyLevel,
            tags: data.tags,
            description: data.description,
            yearsOfExperience: data.yearsOfExperience,
            lastUsed: data.lastUsed,
        },
    });

    return updatedSkill;
}

/**
 * Delete a skill (only if user owns it)
 */
export async function deleteSkill(skillId: string, userId: string) {
    // Check if skill exists and belongs to user
    const existingSkill = await prisma.skill.findUnique({
        where: { id: skillId },
    });

    if (!existingSkill) {
        throw new Error('Skill not found');
    }

    if (existingSkill.userId !== userId) {
        throw new Error('Unauthorized to delete this skill');
    }

    await prisma.skill.delete({
        where: { id: skillId },
    });

    return { message: 'Skill deleted successfully' };
}

/**
 * Get skill categories by sector
 */
export function getSkillCategoriesBySector(sector: Sector): SkillCategory[] {
    const categoriesBySector: Record<Sector, SkillCategory[]> = {
        HEALTHCARE: [
            'CLINICAL_INFORMATICS',
            'HEALTH_DATA_ANALYTICS',
            'EHR_SYSTEMS',
            'TELEMEDICINE',
            'MEDICAL_CODING',
            'HIPAA_COMPLIANCE',
            'HEALTHCARE_IT',
        ],
        AGRICULTURE: [
            'PRECISION_AGRICULTURE',
            'FARM_MANAGEMENT_SOFTWARE',
            'AGRICULTURAL_IOT',
            'CROP_MONITORING',
            'SOIL_ANALYSIS',
            'SUSTAINABLE_FARMING',
            'AGRIBUSINESS',
        ],
        URBAN: [
            'URBAN_PLANNING',
            'GIS_MAPPING',
            'SMART_INFRASTRUCTURE',
            'IOT_SENSORS',
            'SUSTAINABLE_URBAN_DESIGN',
            'TRANSPORTATION_SYSTEMS',
            'ENERGY_MANAGEMENT',
        ],
    };

    // Add cross-sector categories to all
    const crossSectorCategories: SkillCategory[] = [
        'DATA_ANALYSIS',
        'MACHINE_LEARNING',
        'PROJECT_MANAGEMENT',
        'COMMUNICATION',
        'LEADERSHIP',
        'RESEARCH',
    ];

    return [...categoriesBySector[sector], ...crossSectorCategories];
}

/**
 * Get all skill categories
 */
export function getAllSkillCategories(): SkillCategory[] {
    return [
        'CLINICAL_INFORMATICS',
        'HEALTH_DATA_ANALYTICS',
        'EHR_SYSTEMS',
        'TELEMEDICINE',
        'MEDICAL_CODING',
        'HIPAA_COMPLIANCE',
        'HEALTHCARE_IT',
        'PRECISION_AGRICULTURE',
        'FARM_MANAGEMENT_SOFTWARE',
        'AGRICULTURAL_IOT',
        'CROP_MONITORING',
        'SOIL_ANALYSIS',
        'SUSTAINABLE_FARMING',
        'AGRIBUSINESS',
        'URBAN_PLANNING',
        'GIS_MAPPING',
        'SMART_INFRASTRUCTURE',
        'IOT_SENSORS',
        'SUSTAINABLE_URBAN_DESIGN',
        'TRANSPORTATION_SYSTEMS',
        'ENERGY_MANAGEMENT',
        'DATA_ANALYSIS',
        'MACHINE_LEARNING',
        'PROJECT_MANAGEMENT',
        'COMMUNICATION',
        'LEADERSHIP',
        'RESEARCH',
    ];
}
