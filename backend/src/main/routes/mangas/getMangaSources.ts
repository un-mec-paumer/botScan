import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { GlobalMangaSourceService } from '@services/GlobalMangaSourceService';
import { MangaServiceError } from '@errors/MangaServiceError';
import { DisplayMangaDto } from '@dtos/mangas/DisplayMangaDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getMangaSourcesRoute: FastifyPluginAsync = async (fastify) => {
    const mangaService = new GlobalMangaSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get all globalMangaSources',
        description: 'Get all globalMangaSources',
        tags: ['mangas', 'globalSources'],
        response: {
            200: z.array(DisplayMangaDto),
            401: ErrorDto,
        },
    };

    fastify.get(
        '/sources',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const globalMangaSources = await mangaService.getGlobalMangaSources();

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

export default getMangaSourcesRoute;
