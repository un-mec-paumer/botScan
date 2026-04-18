import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { MangaService } from '@services/MangaService';
import { MangaServiceError } from '@errors/MangaServiceError';
import { DisplayMangaDto } from '@dtos/mangas/DisplayMangaDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getMangaByNameRoute: FastifyPluginAsync = async (fastify) => {
    const mangaService = new MangaService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get the manga associated with the name',
        description: 'Get the manga associated with the name',
        tags: ['mangas'],
        response: {
            200: DisplayMangaDto,
            401: ErrorDto,
        },
    };

    fastify.get(
        '/name/:name',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { name } = request.params as { name: string };

                const manga = await mangaService.getMangaByName(name);

                return reply.code(200).send(manga.display());
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

export default getMangaByNameRoute;
