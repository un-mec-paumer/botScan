import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AlertService } from '../../services/AlertService';
import { AlertServiceError } from '../../errors/AlertServiceError';
import { DisplayAlertDto } from '../../dtos/alerts/DisplayAlertDto';
import { ErrorDto } from '../../dtos/ErrorDto';

const getAlertsByUserIdRoute: FastifyPluginAsync = async (fastify) => {
  const alertService = new AlertService(fastify.prisma);

  const schema: FastifySchema = {
    summary: "Get alerts by user id",
    description: "Get alerts by user id",
    tags: ['alerts'],
    security: [{ bearerAuth: [] }],
    response: {
      200: z.array(DisplayAlertDto),
      401: ErrorDto,
    },
  };

  fastify.get(
    '/user-id/:userId',
    {
      schema,
    },
    async (request, reply) => {
      try {
        const { userId } = request.params as { userId: string };

        const alerts = await alertService.getAlertsByUserId(userId);

        return reply.code(200).send(alerts);
      } catch (err) {
        if (err instanceof AlertServiceError) {
          return reply.code(err.statusCode).send({ error: err.message });
        }
        throw err;
      }
    }
  );
};

export default getAlertsByUserIdRoute;
