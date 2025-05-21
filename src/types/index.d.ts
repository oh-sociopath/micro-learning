import { Role } from '@prisma/client';

declare global {
    namespace Express {
        interface User {
            userId: number;
            role: Role;
        }

        interface Request {
            user?: User;
            authUser?: { id: string; role: Role };
        }
    }
}
