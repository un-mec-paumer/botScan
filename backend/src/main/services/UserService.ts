import { PrismaClient } from '@prisma/client';
import { UserServiceError } from '../errors/UserServiceError';

export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Récupère les paramètres d'un utilisateur.
   * @param userId L'ID de l'utilisateur.
   */
  async getUserSettings(userId: string) {
    const settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Les settings sont censés être créés à l'inscription. Ne pas les trouver est une erreur.
      throw new UserServiceError('User settings not found.', 404);
    }

    return settings;
  }

  /**
   * Met à jour les paramètres d'un utilisateur.
   * @param userId L'ID de l'utilisateur.
   * @param data Les données à mettre à jour.
   */
  async updateUserSettings(
    userId: string,
    data: Partial<{
      nativeLanguageCode: string;
      interfaceLanguageCode: string;
      preferredStudyLanguage: string | null;
      defaultIaModel: string | null;
    }>
  ) {
    try {
      const updatedSettings = await this.prisma.userSettings.update({
        where: { userId },
        data,
      });
      return updatedSettings;
    } catch (error) {
      console.error('Failed to update user settings:', error);
      throw new UserServiceError('Could not update user settings.', 500);
    }
  }
}
