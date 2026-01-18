import prisma from '../config/database';

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
type Sector = 'HEALTHCARE' | 'AGRICULTURE' | 'URBAN';

function safeParseJsonArray(raw: string | null | undefined): unknown[] {
    if (!raw) return [];
    try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export async function createVerificationRequest(params: {
    skillId: string;
    requesterId: string;
    reviewerId: string;
    message?: string;
    evidenceUrl?: string;
}) {
    const skill = await prisma.skill.findUnique({
        where: { id: params.skillId },
    });

    if (!skill) throw new Error('Skill not found');
    if (skill.userId !== params.requesterId) throw new Error('Unauthorized to request verification for this skill');
    if (skill.verified) throw new Error('Skill is already verified');
    if (params.requesterId === params.reviewerId) throw new Error('Reviewer cannot be the same as requester');

    const reviewerProfile = await prisma.mentorProfile.findUnique({
        where: { userId: params.reviewerId },
        include: { user: true },
    });

    if (!reviewerProfile || !reviewerProfile.isApproved) {
        throw new Error('Reviewer is not an approved mentor');
    }

    const allowedSectors = safeParseJsonArray(reviewerProfile.sectors) as string[];
    const skillSector = (skill.sector || '').toUpperCase() as Sector;
    const canVerifySector = allowedSectors.map(s => String(s).toUpperCase()).includes(skillSector);

    if (!canVerifySector) {
        throw new Error('Reviewer is not approved to verify this sector');
    }

    const existingPending = await prisma.skillVerificationRequest.findFirst({
        where: {
            skillId: params.skillId,
            reviewerId: params.reviewerId,
            requesterId: params.requesterId,
            status: 'PENDING',
        },
    });

    if (existingPending) {
        throw new Error('A pending request already exists for this skill and reviewer');
    }

    return prisma.skillVerificationRequest.create({
        data: {
            skillId: params.skillId,
            requesterId: params.requesterId,
            reviewerId: params.reviewerId,
            status: 'PENDING',
            message: params.message,
            evidenceUrl: params.evidenceUrl,
        },
        include: {
            skill: true,
            requester: { select: { id: true, name: true, email: true, role: true } },
            reviewer: { select: { id: true, name: true, email: true, role: true } },
        },
    });
}

export async function listRequestsSent(requesterId: string) {
    return prisma.skillVerificationRequest.findMany({
        where: { requesterId },
        include: {
            skill: true,
            reviewer: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: [{ createdAt: 'desc' }],
    });
}

export async function listRequestsReceived(reviewerId: string, filters?: { status?: string }) {
    const status = filters?.status?.toUpperCase();
    const statusFilter: VerificationStatus | undefined =
        status === 'PENDING' || status === 'APPROVED' || status === 'REJECTED' || status === 'CANCELLED'
            ? (status as VerificationStatus)
            : undefined;

    return prisma.skillVerificationRequest.findMany({
        where: {
            reviewerId,
            ...(statusFilter ? { status: statusFilter } : {}),
        },
        include: {
            skill: true,
            requester: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: [{ createdAt: 'desc' }],
    });
}

export async function cancelRequest(params: { requestId: string; requesterId: string }) {
    const request = await prisma.skillVerificationRequest.findUnique({
        where: { id: params.requestId },
    });

    if (!request) throw new Error('Verification request not found');
    if (request.requesterId !== params.requesterId) throw new Error('Unauthorized to cancel this request');
    if (request.status !== 'PENDING') throw new Error('Only pending requests can be cancelled');

    return prisma.skillVerificationRequest.update({
        where: { id: params.requestId },
        data: {
            status: 'CANCELLED',
            decidedAt: new Date(),
        },
    });
}

export async function decideRequest(params: {
    requestId: string;
    reviewerId: string;
    decision: 'APPROVED' | 'REJECTED';
    decisionNote?: string;
}) {
    const request = await prisma.skillVerificationRequest.findUnique({
        where: { id: params.requestId },
        include: { skill: true },
    });

    if (!request) throw new Error('Verification request not found');
    if (request.reviewerId !== params.reviewerId) throw new Error('Unauthorized to decide this request');
    if (request.status !== 'PENDING') throw new Error('Only pending requests can be decided');

    const updated = await prisma.skillVerificationRequest.update({
        where: { id: params.requestId },
        data: {
            status: params.decision,
            decisionNote: params.decisionNote,
            decidedAt: new Date(),
        },
        include: {
            skill: true,
            requester: { select: { id: true, name: true, email: true, role: true } },
            reviewer: { select: { id: true, name: true, email: true, role: true } },
        },
    });

    if (params.decision === 'APPROVED') {
        await prisma.skill.update({
            where: { id: request.skillId },
            data: {
                verified: true,
                verificationSource: `Verified by ${updated.reviewer.name}`,
            },
        });
    }

    return updated;
}
