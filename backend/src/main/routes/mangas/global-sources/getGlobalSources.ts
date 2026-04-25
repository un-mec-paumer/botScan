import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { GlobalMangaSourceService } from '@services/GlobalMangaSourceService';
import { MangaServiceError } from '@errors/MangaServiceError';
import { DisplayGlobalMangaSourceDto } from '@dtos/mangas/sources/DisplayGlobalMangaSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getGlobalSourcesRoute: FastifyPluginAsync = async (fastify) => {
    const globalMangaSourceService = new GlobalMangaSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get all globalMangaSources',
        description: 'Get all globalMangaSources',
        tags: ['mangas', 'global-sources'],
        response: {
            200: z.array(DisplayGlobalMangaSourceDto),
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
                const globalMangaSources = await globalMangaSourceService.getGlobalMangaSources();

                return reply.code(200).send(globalMangaSources.map(globalMangaSource => globalMangaSource.display()));
            } catch (err) {
                if (err instanceof MangaServiceError) {
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
