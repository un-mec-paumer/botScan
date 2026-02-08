import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { UserService } from '../../../services/UserService';
import { UserServiceError } from '../../../errors/UserServiceError';
import {
  UpdateUserSettingsRequestDto,
  UpdateUserSettingsRequestDtoType,
} from '../../../dtos/UpdateUserSettingsRequestDto';

const patchSettingsRoute: FastifyPluginAsync = async (fastify) => {
  const userService = new UserService(fastify.prisma);

  const schema: FastifySchema = {
    summary: "Update user's settings",
    description:
      'Updates one or more settings for the authenticated user. Only the provided fields will be updated.',
    tags: ['users', 'settings'],
    security: [{ bearerAuth: [] }],
    body: UpdateUserSettingsRequestDto,
    response: {
      200: z.object({
        userId: z.string().uuid(),
        nativeLanguageCode: z.string(),
        interfaceLanguageCode: z.string(),
        preferredStudyLanguage: z.string().nullable(),
        defaultIaModel: z.string().nullable(),
      }),
      401: z.object({
        error: z.string(),
      }),
    },
  };

  fastify.patch<{ Body: UpdateUserSettingsRequestDtoType }>(
    '/',
    {
      schema,
      preHandler: fastify.authenticate,
    },
    async (request, reply) => {
      try {
        // @ts-ignore - request.user is added by the auth decorator
        const userId = request.user.sub;
        const dataToUpdate = request.body;

        if (Object.keys(dataToUpdate).length === 0) {
          return reply.code(400).send({
            error: 'Bad Request',
            details: "Body empty or haven't correct fields.",
          });
        }

        // On s'assure d'abord que les settings existent.
        // Cette ligne lèvera une erreur 404 si ce n'est pas le cas, ce qui est le comportement attendu.
        await userService.getUserSettings(userId);

        const updatedSettings = await userService.updateUserSettings(
          userId,
          dataToUpdate
        );

        return reply.code(200).send(updatedSettings);
      } catch (err) {
        if (err instanceof UserServiceError) {
          return reply.code(err.statusCode).send({ error: err.message });
        }
        throw err;
      }
    }
  );
};

export default patchSettingsRoute;
