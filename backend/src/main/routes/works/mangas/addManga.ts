import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { MangaService } from '@services/MangaService';
import { WorkServiceError } from '@errors/WorkServiceError';
import { AddMangaDto, AddMangaDtoType } from '@dtos/mangas/AddMangaDto';
import { DisplayMangaDto } from '@dtos/mangas/DisplayMangaDto';
import { ErrorDto } from '@dtos/ErrorDto';

const addMangaRoute: FastifyPluginAsync = async (fastify) => {
    const mangaService = new MangaService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add manga',
        description:
            'Add the manga, or only the data associated to a similar work.',
        tags: ['mangas'],
        body: AddMangaDto,
        response: {
            201: DisplayMangaDto,
            401: ErrorDto,
        },
    };

    fastify.post<{ Body: AddMangaDtoType }>(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const body = request.body as AddMangaDtoType;
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

export default addMangaRoute;
