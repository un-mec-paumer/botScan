import { PrismaClient } from '@prisma/client';
import { UserServiceError } from '../errors/UserServiceError';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Récupère un utilisateur.
   * @param id L'ID de l'utilisateur.
   */
  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UserServiceError('User not found.', 404);
    }

    return user;
  }

  /**
   * Récupère un utilisateur.
   * @param id L'ID de l'utilisateur.
   */
  async addUser(id: string) {
    const user = await this.prisma.user.create({
      data: {
        id
      }
    });

    if (!user) {
      throw new UserServiceError('User already exists.', 409);
    }

    return user;
  }

  /**
   * Récupère la liste d'alerte d'un utilisateur.
   * @param id L'ID de l'utilisateur.
   */
  async getUserAlerts(id: string) {
    const mangas = await this.prisma.alert.findMany({
      where: { userId: id },
    });

    return mangas;
  }
}
