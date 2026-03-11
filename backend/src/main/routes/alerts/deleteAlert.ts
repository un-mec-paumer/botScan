import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AlertService } from '../../services/AlertService';
import { AlertServiceError } from '../../errors/AlertServiceError';
import { ErrorDto } from '../../dtos/ErrorDto';

const deleteAlertRoute: FastifyPluginAsync = async (fastify) => {
    const alertService = new AlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Hard delete alert by work and user ids',
        description: 'Hard delete alert by work and user ids',
        tags: ['alerts'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.null(),
            404: ErrorDto,
        },
    };

    fastify.delete(
        '/:userId/:workId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId, workId } = request.body as {
                    userId: string;
                    workId: number;
                };

                await alertService.deleteAlert(userId, workId);

                return reply.code(200);
            } catch (err) {
                if (err instanceof AlertServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default deleteAlertRoute;
