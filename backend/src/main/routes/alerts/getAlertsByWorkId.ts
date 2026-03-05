import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AlertService } from '../../services/AlertService';
import { AlertServiceError } from '../../errors/AlertServiceError';
import { DisplayAlertDto } from '../../dtos/alerts/DisplayAlertDto';
import { ErrorDto } from '../../dtos/ErrorDto';

const getAlertsByWorkIdRoute: FastifyPluginAsync = async (fastify) => {
  const alertService = new AlertService(fastify.prisma);

  const schema: FastifySchema = {
    summary: "Get alerts by work id",
    description: "Get alerts by work id",
    tags: ['alerts'],
    security: [{ bearerAuth: [] }],
    response: {
      200: z.array(DisplayAlertDto),
      401: ErrorDto,
    },
  };

  fastify.get(
    '/work-id/:workId',
    {
      schema,
    },
    async (request, reply) => {
      try {
        const { workId } = request.params as { workId: number };

        const alerts = await alertService.getAlertsByWorkId(workId);

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

export default getAlertsByWorkIdRoute;
