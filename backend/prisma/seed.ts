import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create test users with universal credentials
    const testUsers = [
        {
            email: 'test@skillxintell.com',
            password: 'Test@123',
            name: 'Test User',
            role: 'STUDENT',
        },
        {
            email: 'student@skillxintell.com',
            password: 'Student@123',
            name: 'Student Demo',
            role: 'STUDENT',
        },
        {
            email: 'educator@skillxintell.com',
            password: 'Educator@123',
            name: 'Educator Demo',
            role: 'EDUCATOR',
        },
        {
            email: 'Employee@skillxintell.com',
            password: 'Employee@123',
            name: 'Employee Demo',
            role: 'Employee',
        },
    ];

    for (const userData of testUsers) {
        const existingUser = await prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (!existingUser) {
            const passwordHash = await bcrypt.hash(userData.password, 10);
            
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    name: userData.name,
                    passwordHash,
                    role: userData.role,
                    isActive: true,
                    profile: {
                        create: {
                            bio: `This is a demo ${userData.role.toLowerCase()} account for testing SkillXIntell.`,
                        },
                    },
                },
            });

            console.log(`✅ Created user: ${user.email}`);
        } else {
            console.log(`ℹ️  User already exists: ${userData.email}`);
        }
    }

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📊 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 General Test Account:');
    console.log('   Email: test@skillxintell.com');
    console.log('   Password: Test@123');
    console.log('');
    console.log('🎓 Student Account:');
    console.log('   Email: student@skillxintell.com');
    console.log('   Password: Student@123');
    console.log('');
    console.log('👨‍🏫 Educator Account:');
    console.log('   Email: educator@skillxintell.com');
    console.log('   Password: Educator@123');
    console.log('');
    console.log('💼 Employee Account:');
    console.log('   Email: Employee@skillxintell.com');
    console.log('   Password: Employee@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log('\n💡 Next steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Start the frontend: cd ../frontend && npm run dev');
    console.log('3. Login with any test account above');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('\n🔌 Database connection closed');
    });
