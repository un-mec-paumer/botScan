import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AnimeService } from '@services/AnimeService';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { DisplayAnimeDto } from '@dtos/animes/DisplayAnimeDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getAnimesRoute: FastifyPluginAsync = async (fastify) => {
    const animeService = new AnimeService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get all animes',
        description: 'Get all animes',
        tags: ['animes'],
        response: {
            200: z.array(DisplayAnimeDto),
            401: ErrorDto,
        },
    };

    fastify.get(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const animes = await animeService.getAnimes();

                return reply.code(200).send(animes.map(anime => anime.display()));
            } catch (err) {
                if (err instanceof AnimeServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default getAnimesRoute;
