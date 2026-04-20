import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { MangaSourceService } from '@services/MangaSourceService';
import { MangaSourceServiceError } from '@errors/MangaSourceServiceError';
import { DisplayMangaSourceDto } from '@dtos/mangas/sources/DisplayMangaSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const updateLinkRoute: FastifyPluginAsync = async (fastify) => {
    const sourceService = new MangaSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Updates the link of the source',
        description: 'Updates the link of the source',
        tags: ['mangas', 'sources'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayMangaSourceDto,
            401: ErrorDto,
        },
    };

    fastify.patch(
        '/update-link/:mangaId/:globalMangaSourceId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { mangaId, globalMangaSourceId } = request.params as { mangaId: number, globalMangaSourceId: number };
                const { link } = request.body as { link: string };

                const source = await sourceService.updateLink(link, mangaId, globalMangaSourceId);

                return reply.code(200).send(source.display());
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

export default updateLinkRoute;
