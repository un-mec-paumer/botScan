import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { GlobalAnimeSourceService } from '@services/GlobalAnimeSourceService';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { DisplayGlobalAnimeSourceDto } from '@dtos/animes/sources/DisplayGlobalAnimeSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getGlobalSourcesRoute: FastifyPluginAsync = async (fastify) => {
    const globalAnimeSourceService = new GlobalAnimeSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get all globalAnimeSources',
        description: 'Get all globalAnimeSources',
        tags: ['animes', 'global-sources'],
        response: {
            200: z.array(DisplayGlobalAnimeSourceDto),
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
                const globalAnimeSources = await globalAnimeSourceService.getGlobalAnimeSources();

                return reply.code(200).send(globalAnimeSources.map(globalAnimeSource => globalAnimeSource.display()));
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

export default getGlobalSourcesRoute;
