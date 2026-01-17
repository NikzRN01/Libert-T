import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                supabaseUserId?: string;
                email: string;
                role: string;
            };

            file?: Multer.File;
        }

        namespace Multer {
            interface File {
                fieldname: string;
                originalname: string;
                encoding: string;
                mimetype: string;
                size: number;
                buffer: Buffer;
            }
        }
    }
}

export { };
