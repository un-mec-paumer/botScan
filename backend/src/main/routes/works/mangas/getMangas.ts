import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { MangaService } from '../../../services/MangaService';
import { WorkServiceError } from '../../../errors/WorkServiceError';
import { DisplayMangaDto } from '../../../dtos/mangas/DisplayMangaDto';
import { ErrorDto } from '../../../dtos/ErrorDto';

const getMangasRoute: FastifyPluginAsync = async (fastify) => {
    const mangaService = new MangaService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get all mangas',
        description: 'Get all mangas',
        tags: ['mangas'],
        response: {
            200: z.array(DisplayMangaDto),
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
                const manga = await mangaService.getMangas();

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

export default getMangasRoute;
