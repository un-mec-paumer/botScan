import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AnimeAlertService } from '@services/AnimeAlertService';
import { AnimeAlertServiceError } from '@errors/AnimeAlertServiceError';
import { DisplayAnimeAlertDto } from '@dtos/animes/alerts/DisplayAnimeAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getAnimeAlertRoute: FastifyPluginAsync = async (fastify) => {
    const animeAlertService = new AnimeAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get alert by anime and user ids',
        description: 'Get alert by anime and user ids',
        tags: ['alerts', 'animes'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.array(DisplayAnimeAlertDto),
            404: ErrorDto,
        },
    };

    fastify.get(
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

                const alert = await animeAlertService.getAlert(userId, animeId);

                return reply.code(200).send(alert.display());
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

export default getAnimeAlertRoute;
