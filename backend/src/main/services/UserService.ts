import { PrismaClient } from '@prisma/client';
import { UserServiceError } from '@errors/UserServiceError';
import { ModelUser } from '@models/User';

export class UserService {
    constructor(private readonly prisma: PrismaClient) {}

    /**
     * Récupère un utilisateur.
     * @param id L'ID de l'utilisateur.
     */
    async getUser(id: string): Promise<ModelUser> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new UserServiceError('User not found.', 404);
        }

        return new ModelUser(user);
    }

    /**
     * Récupère un utilisateur.
     * @param id L'ID de l'utilisateur.
     */
    async addUser(id: string): Promise<ModelUser> {
        const user = await this.prisma.user.create({
            data: {
                id,
            },
        });

        if (!user) {
            throw new UserServiceError('User already exists.', 409);
        }

        return new ModelUser(user);
    }
}
