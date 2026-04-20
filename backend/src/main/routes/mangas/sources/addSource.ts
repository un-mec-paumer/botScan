import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { MangaSourceService } from '@services/MangaSourceService';
import { MangaSourceServiceError } from '@errors/MangaSourceServiceError';
import { DisplayMangaSourceDto } from '@dtos/mangas/sources/DisplayMangaSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const addSourceRoute: FastifyPluginAsync = async (fastify) => {
    const mangaSourceService = new MangaSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add the source to the manga',
        description: 'Add the source to the manga',
        tags: ['mangas', 'sources'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayMangaSourceDto,
            401: ErrorDto,
        },
    };

    fastify.post(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const {
                    link,
                    mangaId,
                    globalMangaSourceId
                } = request.body as {
                    link: string,
                    mangaId: number,
                    globalMangaSourceId: number
                };

                const mangaSource = await mangaSourceService.addSource(link, mangaId, globalMangaSourceId);

                return reply.code(200).send(mangaSource.display());
            } catch (err) {
                if (err instanceof MangaSourceServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default addSourceRoute;
