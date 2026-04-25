import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AnimeAlertService } from '@services/AnimeAlertService';
import { AnimeAlertServiceError } from '@errors/AnimeAlertServiceError';
import { DisplayAnimeAlertDto } from '@dtos/animes/alerts/DisplayAnimeAlertDto';
import {
    AddAnimeAlertDto,
    AddAnimeAlertDtoType,
} from '@dtos/animes/alerts/AddAnimeAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const addAnimeAlertRoute: FastifyPluginAsync = async (fastify) => {
    const animeAlertService = new AnimeAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add alert with anime and user ids',
        description:
            'Add alert with anime and user ids. Non-specified params keeps the current value, false otherwise',
        tags: ['alerts', 'animes'],
        security: [{ bearerAuth: [] }],
        body: AddAnimeAlertDto,
        response: {
            201: z.array(DisplayAnimeAlertDto),
            404: ErrorDto,
        },
    };

    fastify.post<{ Body: AddAnimeAlertDtoType }>(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId, animeId } =
                    request.body as {
                        userId: string;
                        animeId: number;
                    };

                const alert = await animeAlertService.addAlert(userId, animeId);

                return reply.code(201).send(alert.display());
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

export default addAnimeAlertRoute;
