import { Request, Response } from 'express';
import * as verificationService from '../services/verification.service';

export async function createRequest(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const { skillId } = req.params;
        const { reviewerId, message, evidenceUrl } = req.body;

        if (!reviewerId || typeof reviewerId !== 'string') {
            res.status(400).json({ error: 'Validation Error', message: 'reviewerId is required' });
            return;
        }

        const request = await verificationService.createVerificationRequest({
            skillId,
            requesterId: req.user.userId,
            reviewerId,
            message: typeof message === 'string' ? message : undefined,
            evidenceUrl: typeof evidenceUrl === 'string' ? evidenceUrl : undefined,
        });

        res.status(201).json({ message: 'Verification request created', request });
    } catch (error) {
        console.error('Create verification request error:', error);

        if (error instanceof Error) {
            const known = [
                'Skill not found',
                'Unauthorized to request verification for this skill',
                'Skill is already verified',
                'Reviewer cannot be the same as requester',
                'Reviewer is not an approved mentor',
                'Reviewer is not approved to verify this sector',
                'A pending request already exists for this skill and reviewer',
            ];

            if (known.includes(error.message)) {
                res.status(400).json({ error: 'Validation Error', message: error.message });
                return;
            }
        }

        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create request' });
    }
}

export async function listSent(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const requests = await verificationService.listRequestsSent(req.user.userId);
        res.status(200).json({ requests, count: requests.length });
    } catch (error) {
        console.error('List sent requests error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list requests' });
    }
}

export async function listReceived(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const { status } = req.query;
        const requests = await verificationService.listRequestsReceived(req.user.userId, {
            status: status ? String(status) : undefined,
        });
        res.status(200).json({ requests, count: requests.length });
    } catch (error) {
        console.error('List received requests error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to list requests' });
    }
}

export async function cancel(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const { requestId } = req.params;
        const updated = await verificationService.cancelRequest({
            requestId,
            requesterId: req.user.userId,
        });

        res.status(200).json({ message: 'Request cancelled', request: updated });
    } catch (error) {
        console.error('Cancel request error:', error);

        if (error instanceof Error) {
            const known = [
                'Verification request not found',
                'Unauthorized to cancel this request',
                'Only pending requests can be cancelled',
            ];

            if (known.includes(error.message)) {
                res.status(error.message === 'Verification request not found' ? 404 : 400).json({
                    error: 'Validation Error',
                    message: error.message,
                });
                return;
            }
        }

        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to cancel request' });
    }
}

export async function decide(req: Request, res: Response): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
            return;
        }

        const { requestId } = req.params;
        const { decision, decisionNote } = req.body;

        if (decision !== 'APPROVED' && decision !== 'REJECTED') {
            res.status(400).json({ error: 'Validation Error', message: 'decision must be APPROVED or REJECTED' });
            return;
        }

        const updated = await verificationService.decideRequest({
            requestId,
            reviewerId: req.user.userId,
            decision,
            decisionNote: typeof decisionNote === 'string' ? decisionNote : undefined,
        });

        res.status(200).json({ message: 'Decision recorded', request: updated });
    } catch (error) {
        console.error('Decide request error:', error);

        if (error instanceof Error) {
            const known = [
                'Verification request not found',
                'Unauthorized to decide this request',
                'Only pending requests can be decided',
            ];

            if (known.includes(error.message)) {
                res.status(error.message === 'Verification request not found' ? 404 : 400).json({
                    error: 'Validation Error',
                    message: error.message,
                });
                return;
            }
        }

        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to record decision' });
    }
}
