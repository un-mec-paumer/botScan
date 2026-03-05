import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AlertService } from '../../services/AlertService';
import { AlertServiceError } from '../../errors/AlertServiceError';
import { DisplayAlertDto } from '../../dtos/alerts/DisplayAlertDto';
import { ErrorDto } from '../../dtos/ErrorDto';

const getAlertRoute: FastifyPluginAsync = async (fastify) => {
  const alertService = new AlertService(fastify.prisma);

  const schema: FastifySchema = {
    summary: "Get alert by work and user ids",
    description: "Get alert by work and user ids",
    tags: ['alerts'],
    security: [{ bearerAuth: [] }],
    response: {
      200: z.array(DisplayAlertDto),
      404: ErrorDto,
    },
  };

  fastify.get(
    '/:userId/:workId',
    {
      schema,
    },
    async (request, reply) => {
      try {
        const { userId, workId } = request.body as { userId: string, workId: number };

        const alert = await alertService.getAlert(userId, workId);

        return reply.code(200).send(alert);
      } catch (err) {
        if (err instanceof AlertServiceError) {
          return reply.code(err.statusCode).send({ error: err.message });
        }
        throw err;
      }
    }
  );
};

export default getAlertRoute;
