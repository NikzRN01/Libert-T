
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Testing database connection...');
    console.log(`📡 URL: ${process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@')}`); // Mask password

    try {
        await prisma.$connect();
        console.log('✅ Connection SUCCESSFUL!');

        // Try a simple query
        const userCount = await prisma.user.count();
        console.log(`📊 Current user count: ${userCount}`);

    } catch (error) {
        console.error('❌ Connection FAILED:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
