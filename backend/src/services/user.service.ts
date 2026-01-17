import prisma from '../config/database';

export interface UpdateProfileData {
    bio?: string;
    phone?: string;
    location?: string;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
    dateOfBirth?: Date;
    education?: any;
    experience?: any;
    interests?: string[];
    targetSectors?: ('HEALTHCARE' | 'AGRICULTURE' | 'URBAN')[];
    careerGoals?: string;
    preferredLearningStyle?: string;
    availableHoursPerWeek?: number;
}

/**
 * Get user profile with related data
 */
export async function getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: true,
            skills: {
                orderBy: { createdAt: 'desc' },
                take: 10,
            },
            projects: {
                where: { status: 'COMPLETED' },
                orderBy: { endDate: 'desc' },
                take: 5,
            },
            certifications: {
                orderBy: { issueDate: 'desc' },
                take: 5,
            },
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Remove password hash from response
    const { passwordHash, ...userWithoutPassword } = user;

    return {
        ...userWithoutPassword,
        stats: {
            totalSkills: user.skills.length,
            totalProjects: user.projects.length,
            totalCertifications: user.certifications.length,
        },
    };
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, data: UpdateProfileData) {
    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
        where: { userId },
        data: {
            bio: data.bio,
            phone: data.phone,
            location: data.location,
            linkedIn: data.linkedIn,
            github: data.github,
            portfolio: data.portfolio,
            dateOfBirth: data.dateOfBirth,
            education: data.education,
            experience: data.experience,
            interests: data.interests,
            targetSectors: data.targetSectors,
            careerGoals: data.careerGoals,
            preferredLearningStyle: data.preferredLearningStyle,
            availableHoursPerWeek: data.availableHoursPerWeek,
        },
    });

    return updatedProfile;
}

/**
 * Update user basic info (name, avatar)
 */
export async function updateUserBasicInfo(
    userId: string,
    data: { name?: string; avatar?: string }
) {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            avatar: data.avatar,
        },
        include: {
            profile: true,
        },
    });

    // Remove password hash
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
}

/**
 * Get public user profile (limited information)
 */
export async function getPublicProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
            createdAt: true,
            profile: {
                select: {
                    bio: true,
                    location: true,
                    linkedIn: true,
                    github: true,
                    portfolio: true,
                    interests: true,
                    targetSectors: true,
                },
            },
            skills: {
                where: { verified: true },
                select: {
                    id: true,
                    name: true,
                    category: true,
                    sector: true,
                    proficiencyLevel: true,
                },
            },
            projects: {
                where: {
                    isPublic: true,
                    status: 'COMPLETED',
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    sector: true,
                    skillsUsed: true,
                    startDate: true,
                    endDate: true,
                },
                take: 5,
            },
            certifications: {
                where: { verified: true },
                select: {
                    id: true,
                    name: true,
                    issuingOrg: true,
                    sector: true,
                    issueDate: true,
                },
                take: 5,
            },
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
}

/**
 * Upload user avatar (placeholder - actual upload logic will use Supabase Storage)
 */
export async function uploadUserAvatar(userId: string, avatarUrl: string) {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarUrl },
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
        },
    });

    return updatedUser;
}
