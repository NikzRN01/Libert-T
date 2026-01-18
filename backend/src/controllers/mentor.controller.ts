import { Request, Response } from 'express';
import * as mentorService from '../services/mentor.service';

export async function getMyMentorProfile(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const profile = await mentorService.getMyMentorProfile(req.user.userId);
        res.status(200).json({ profile });
    } catch (error) {
        console.error('Get mentor profile error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch mentor profile' });
    }
}

export async function upsertMyMentorProfile(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const { sectors, organization, title, bio, contactEmail } = req.body;

        const profile = await mentorService.upsertMyMentorProfile(req.user.userId, {
            sectors,
            organization,
            title,
            bio,
            contactEmail,
        });

        res.status(200).json({ message: 'Mentor profile saved', profile });
    } catch (error) {
        console.error('Upsert mentor profile error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to save mentor profile' });
    }
}

export async function listApprovedMentors(req: Request, res: Response): Promise<void> {
    try {
        const { sector } = req.query;
        const mentors = await mentorService.listApprovedMentors({
            sector: sector ? String(sector) : undefined,
        });

        res.status(200).json({ mentors, count: mentors.length });
    } catch (error) {
        console.error('List mentors error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list mentors' });
    }
}

export async function approveMentor(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const { userId } = req.params;
        const profile = await mentorService.approveMentorProfile(req.user.userId, userId);
        res.status(200).json({ message: 'Mentor approved', profile });
    } catch (error) {
        console.error('Approve mentor error:', error);

        if (error instanceof Error && error.message === 'Mentor profile not found') {
            res.status(404).json({ error: 'Not Found', message: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to approve mentor' });
    }
}
