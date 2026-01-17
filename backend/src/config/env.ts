import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',

    database: {
        url: process.env.DATABASE_URL!,
    },

    supabase: {
        url: process.env.SUPABASE_URL!,
        anonKey: process.env.SUPABASE_ANON_KEY!,
        serviceKey: process.env.SUPABASE_SERVICE_KEY!,
        avatarBucket: process.env.SUPABASE_AVATAR_BUCKET || 'avatars',
    },

    jwt: {
        secret: process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },

    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    },
};

// Validate required environment variables
const requiredEnvVars = [
    'DATABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY',
    'JWT_SECRET',
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    throw new Error(
        [
            `Missing required environment variable(s): ${missingEnvVars.join(', ')}`,
            'Create a backend/.env file (copy backend/.env.example) and fill in the values.',
        ].join('\n')
    );
}
