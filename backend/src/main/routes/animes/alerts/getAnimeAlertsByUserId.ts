import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AnimeAlertService } from '@services/AnimeAlertService';
import { AnimeAlertServiceError } from '@errors/AnimeAlertServiceError';
import { DisplayAnimeAlertDto } from '@dtos/animes/alerts/DisplayAnimeAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getAnimeAlertsByUserIdRoute: FastifyPluginAsync = async (fastify) => {
    const animeAlertService = new AnimeAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get alerts by user id',
        description: 'Get alerts by user id',
        tags: ['alerts', 'animes'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.array(DisplayAnimeAlertDto),
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

                const alerts = await animeAlertService.getAlertsByUserId(userId);

                return reply.code(200).send(alerts.map(alert => alert.display()));
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

export default getAnimeAlertsByUserIdRoute;
