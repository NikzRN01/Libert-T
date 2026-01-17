import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import * as authService from '../services/auth.service';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = [
    // Validation middleware
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('name').notEmpty().withMessage('Name is required'),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, name, role } = req.body;

            const user = await authService.createUserWithProfile({
                email,
                password,
                name,
                role,
            });

            const token = authService.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            });

            return res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
                token,
            });
        } catch (error: any) {
            if (error.message === 'User with this email already exists') {
                return res.status(409).json({ error: error.message });
            }
            console.error('Registration error:', error);
            return res.status(500).json({ error: 'Failed to register user' });
        }
    },
];

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
export const login = [
    // Validation middleware
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            const result = await authService.authenticateUser({ email, password });

            return res.json({
                message: 'Login successful',
                user: result.user,
                token: result.token,
            });
        } catch (error: any) {
            if (
                error.message === 'Invalid email or password' ||
                error.message === 'Account is deactivated'
            ) {
                return res.status(401).json({ error: error.message });
            }
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Failed to authenticate user' });
        }
    },
];

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        return res.json({
            user: req.user,
        });
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({ error: 'Failed to get user information' });
    }
};
