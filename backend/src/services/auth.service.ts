import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../config/database';

const SALT_ROUNDS = 10;

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: 'STUDENT' | 'EDUCATOR' | 'EMPLOYER' | 'ADMIN';
}

export interface LoginData {
    email: string;
    password: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: TokenPayload): string {
    return jwt.sign(payload as any, config.jwt.secret as any, {
        expiresIn: config.jwt.expiresIn,
    } as any);
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Create a new user with profile in a transaction
 */
export async function createUserWithProfile(data: RegisterData) {
    const { email, password, name, role = 'STUDENT' } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create user and profile in a transaction
    const user = await prisma.user.create({
        data: {
            email,
            name,
            passwordHash,
            role,
            profile: {
                create: {
                    interests: [],
                    targetSectors: [],
                },
            },
        },
        include: {
            profile: true,
        },
    });

    return user;
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(data: LoginData) {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            profile: true,
        },
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
        throw new Error('Account is deactivated');
    }

    // Verify password
    if (!user.passwordHash) {
        throw new Error('Invalid authentication method');
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        token,
    };
}
