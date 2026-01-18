import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Sector = 'HEALTHCARE' | 'AGRICULTURE' | 'URBAN';

async function findUserByEmailAny(emails: string[]) {
    for (const email of emails) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) return user;
    }
    return null;
}

async function ensureSkill(params: {
    userId: string;
    name: string;
    sector: Sector;
    category: string;
    proficiencyLevel: number;
}) {
    const existing = await prisma.skill.findFirst({
        where: { userId: params.userId, name: params.name, sector: params.sector },
        orderBy: { createdAt: 'desc' },
    });

    if (existing) return existing;

    return prisma.skill.create({
        data: {
            userId: params.userId,
            name: params.name,
            sector: params.sector,
            category: params.category,
            proficiencyLevel: params.proficiencyLevel,
            verified: false,
            verificationSource: null,
        },
    });
}

async function ensurePendingRequest(params: {
    skillId: string;
    requesterId: string;
    reviewerId: string;
    message: string;
    evidenceUrl?: string;
}) {
    const existing = await prisma.skillVerificationRequest.findFirst({
        where: {
            skillId: params.skillId,
            requesterId: params.requesterId,
            reviewerId: params.reviewerId,
            status: 'PENDING',
        },
        orderBy: { createdAt: 'desc' },
    });

    if (existing) return existing;

    return prisma.skillVerificationRequest.create({
        data: {
            skillId: params.skillId,
            requesterId: params.requesterId,
            reviewerId: params.reviewerId,
            status: 'PENDING',
            message: params.message,
            evidenceUrl: params.evidenceUrl,
        },
    });
}

async function main() {
    console.log('Creating demo verification requests (Prisma)...');

    const educator = await prisma.user.findUnique({ where: { email: 'educator@skillxintell.com' } });
    const student = await prisma.user.findUnique({ where: { email: 'student@skillxintell.com' } });
    const employee = await findUserByEmailAny(['employee@skillxintell.com', 'Employee@skillxintell.com']);

    if (!educator) throw new Error('Missing educator@skillxintell.com user. Run: npm run seed');
    if (!student) throw new Error('Missing student@skillxintell.com user. Run: npm run seed');
    if (!employee) throw new Error('Missing employee user. Run: npm run seed');

    const mentorProfile = await prisma.mentorProfile.findUnique({ where: { userId: educator.id } });
    if (!mentorProfile?.isApproved) {
        throw new Error('Educator is not an approved mentor in DB. Re-run seed (it approves mentorProfile).');
    }

    const studentSkill = await ensureSkill({
        userId: student.id,
        name: 'Demo Skill (Student) - HL7 Basics',
        sector: 'HEALTHCARE',
        category: 'GENERAL',
        proficiencyLevel: 3,
    });

    const employeeSkill = await ensureSkill({
        userId: employee.id,
        name: 'Demo Skill (Employee) - Urban GIS',
        sector: 'URBAN',
        category: 'GENERAL',
        proficiencyLevel: 4,
    });

    const studentReq = await ensurePendingRequest({
        skillId: studentSkill.id,
        requesterId: student.id,
        reviewerId: educator.id,
        message: 'Please verify my Healthcare skill (demo request).',
        evidenceUrl: 'https://example.com/evidence/student-skill',
    });

    const employeeReq = await ensurePendingRequest({
        skillId: employeeSkill.id,
        requesterId: employee.id,
        reviewerId: educator.id,
        message: 'Please verify my Urban skill (demo request).',
        evidenceUrl: 'https://example.com/evidence/employee-skill',
    });

    console.log('✅ Created/ensured student request:', studentReq.id);
    console.log('✅ Created/ensured employee request:', employeeReq.id);
    console.log('');
    console.log('Now login as educator@skillxintell.com (Educator@123) and open /dashboard/verification.');
}

main()
    .catch((e) => {
        console.error('❌ Failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
