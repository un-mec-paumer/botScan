import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { MangaService } from '../../../services/MangaService';
import { WorkServiceError } from '../../../errors/WorkServiceError';
import { DisplayMangaDto } from '../../../dtos/mangas/DisplayMangaDto';
import { ErrorDto } from '../../../dtos/ErrorDto';

const getMangaByIdRoute: FastifyPluginAsync = async (fastify) => {
    const mangaService = new MangaService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get the manga associated with the id',
        description: 'Get the manga associated with the id',
        tags: ['mangas'],
        response: {
            200: DisplayMangaDto,
            401: ErrorDto,
        },
    };

    fastify.get(
        '/id/:id',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: number };

                const manga = await mangaService.getMangaById(id);

                return reply.code(200).send(manga);
            } catch (err) {
                if (err instanceof WorkServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default getMangaByIdRoute;
