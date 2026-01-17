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

    // Parse profile JSON fields
    const profile = userWithoutPassword.profile ? {
        ...userWithoutPassword.profile,
        education: userWithoutPassword.profile.education ? JSON.parse(userWithoutPassword.profile.education) : [],
        experience: userWithoutPassword.profile.experience ? JSON.parse(userWithoutPassword.profile.experience) : [],
        interests: userWithoutPassword.profile.interests ? JSON.parse(userWithoutPassword.profile.interests) : [],
        targetSectors: userWithoutPassword.profile.targetSectors ? JSON.parse(userWithoutPassword.profile.targetSectors) : [],
    } : null;

    return {
        ...userWithoutPassword,
        profile,
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
            education: data.education ? JSON.stringify(data.education) : undefined,
            experience: data.experience ? JSON.stringify(data.experience) : undefined,
            interests: data.interests ? JSON.stringify(data.interests) : undefined,
            targetSectors: data.targetSectors ? JSON.stringify(data.targetSectors) : undefined,
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

    // Parse profile JSON fields
    const parsedProfile = user.profile ? {
        ...user.profile,
        interests: user.profile.interests ? JSON.parse(user.profile.interests) : [],
        targetSectors: user.profile.targetSectors ? JSON.parse(user.profile.targetSectors) : [],
    } : null;

    return {
        ...user,
        profile: parsedProfile
    };
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
            role: true,
            createdAt: true,
        },
    });

    return updatedUser;
}
