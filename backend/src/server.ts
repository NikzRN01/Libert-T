import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config, connectDatabase } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import skillRoutes from './routes/skill.routes';
import healthcareRoutes from './routes/healthcare.routes';
import agricultureRoutes from './routes/agriculture.routes';
import urbanRoutes from './routes/urban.routes';
import analyticsRoutes from './routes/analytics.routes';
import chatRoutes from './routes/chat.routes';
import mentorRoutes from './routes/mentor.routes';
import verificationRoutes from './routes/verification.routes';

const app: Application = express();

// Middleware
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'SkillXIntell API',
        version: '1.0.0',
        status: 'running',
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/agriculture', agricultureRoutes);
app.use('/api/urban', urbanRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/verification', verificationRoutes);

// Start server
const PORT = config.port;

async function startServer() {
    try {
        // Connect to database
        await connectDatabase();

        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📊 Environment: ${config.nodeEnv}`);
            console.log(`🔗 API: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

export default app;

