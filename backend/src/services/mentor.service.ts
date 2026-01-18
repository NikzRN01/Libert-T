import prisma from '../config/database';

export type Sector = 'HEALTHCARE' | 'AGRICULTURE' | 'URBAN';

const allowedSectors: Sector[] = ['HEALTHCARE', 'AGRICULTURE', 'URBAN'];

function normalizeSectors(input: unknown): Sector[] {
    if (!Array.isArray(input)) return [];

    const sectors = input
        .filter((value): value is string => typeof value === 'string')
        .map(value => value.toUpperCase());

    const uniqueAllowed = Array.from(new Set(sectors)).filter((value): value is Sector =>
        allowedSectors.includes(value as Sector)
    );

    return uniqueAllowed;
}

export async function upsertMyMentorProfile(
    userId: string,
    data: {
        sectors?: unknown;
        organization?: string;
        title?: string;
        bio?: string;
        contactEmail?: string;
    }
) {
    const sectors = data.sectors !== undefined ? normalizeSectors(data.sectors) : undefined;

    return prisma.mentorProfile.upsert({
        where: { userId },
        create: {
            userId,
            sectors: JSON.stringify(sectors ?? []),
            organization: data.organization,
            title: data.title,
            bio: data.bio,
            contactEmail: data.contactEmail,
        },
        update: {
            sectors: sectors ? JSON.stringify(sectors) : undefined,
            organization: data.organization,
            title: data.title,
            bio: data.bio,
            contactEmail: data.contactEmail,
            // Keep approval as-is; only admin approves
        },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    });
}

export async function getMyMentorProfile(userId: string) {
    const profile = await prisma.mentorProfile.findUnique({
        where: { userId },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
    });

    if (!profile) return null;

    return {
        ...profile,
        sectors: profile.sectors ? (JSON.parse(profile.sectors) as Sector[]) : [],
    };
}

export async function listApprovedMentors(filters?: { sector?: string }) {
    const sectorFilter = filters?.sector?.toUpperCase();

    const mentors = await prisma.mentorProfile.findMany({
        where: {
            isApproved: true,
        },
        include: {
            user: {
                select: { id: true, name: true, email: true, role: true },
            },
        },
        orderBy: [{ updatedAt: 'desc' }],
    });

    const mapped = mentors.map(m => ({
        ...m,
        sectors: m.sectors ? (JSON.parse(m.sectors) as Sector[]) : [],
    }));

    if (sectorFilter && allowedSectors.includes(sectorFilter as Sector)) {
        return mapped.filter(m => m.sectors.includes(sectorFilter as Sector));
    }

    return mapped;
}

export async function approveMentorProfile(adminUserId: string, userIdToApprove: string) {
    // adminUserId currently unused, but kept for audit extensibility
    void adminUserId;

    const existing = await prisma.mentorProfile.findUnique({
        where: { userId: userIdToApprove },
    });

    if (!existing) {
        throw new Error('Mentor profile not found');
    }

    return prisma.mentorProfile.update({
        where: { userId: userIdToApprove },
        data: {
            isApproved: true,
            approvedAt: new Date(),
        },
    });
}
