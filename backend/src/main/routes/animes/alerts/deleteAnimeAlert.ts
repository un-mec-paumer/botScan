import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AnimeAlertService } from '@services/AnimeAlertService';
import { AnimeAlertServiceError } from '@errors/AnimeAlertServiceError';
import { ErrorDto } from '@dtos/ErrorDto';

const deleteAnimeAlertRoute: FastifyPluginAsync = async (fastify) => {
    const animeAlertService = new AnimeAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Hard delete alert by anime and user ids',
        description: 'Hard delete alert by anime and user ids',
        tags: ['alerts', 'animes'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.null(),
            404: ErrorDto,
        },
    };

    fastify.delete(
        '/:userId/:animeId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId, animeId } = request.body as {
                    userId: string;
                    animeId: number;
                };

                await animeAlertService.deleteAlert(userId, animeId);

                return reply.code(200);
            } catch (err) {
                if (err instanceof AnimeAlertServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default deleteAnimeAlertRoute;
