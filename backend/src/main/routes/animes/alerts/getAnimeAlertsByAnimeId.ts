import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AnimeAlertService } from '@services/AnimeAlertService';
import { AnimeAlertServiceError } from '@errors/AnimeAlertServiceError';
import { DisplayAnimeAlertDto } from '@dtos/animes/alerts/DisplayAnimeAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getAnimeAlertsByAnimeIdRoute: FastifyPluginAsync = async (fastify) => {
    const animeAlertService = new AnimeAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get alerts by anime id',
        description: 'Get alerts by anime id',
        tags: ['alerts', 'animes'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.array(DisplayAnimeAlertDto),
            401: ErrorDto,
        },
    };

    fastify.get(
        '/anime-id/:animeId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { animeId } = request.params as { animeId: number };

                const alerts = await animeAlertService.getAlertsByAnimeId(animeId);

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

export default getAnimeAlertsByAnimeIdRoute;
