import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Note: Since we're using JWT authentication instead of Supabase Auth,
    // we don't need to seed users here. Users will be created through registration.

    console.log('✅ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log('- Database schema is ready');
    console.log('- Users can register through the app');
    console.log('- Skills can be added through the dashboard');

    console.log('\n💡 Next steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Start the frontend: cd ../frontend && npm run dev');
    console.log('3. Register a new user at http://localhost:3000/register');
    console.log('4. Add skills through the dashboard');
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
