import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { MangaAlertService } from '@services/MangaAlertService';
import { MangaAlertServiceError } from '@errors/MangaAlertServiceError';
import { DisplayMangaAlertDto } from '@dtos/mangas/alerts/DisplayMangaAlertDto';
import {
    AddMangaAlertDto,
    AddMangaAlertDtoType,
} from '@dtos/mangas/alerts/AddMangaAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const addMangaAlertRoute: FastifyPluginAsync = async (fastify) => {
    const mangaAlertService = new MangaAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add alert with manga and user ids',
        description:
            'Add alert with manga and user ids. Non-specified params keeps the current value, false otherwise',
        tags: ['alerts', 'mangas'],
        security: [{ bearerAuth: [] }],
        body: AddMangaAlertDto,
        response: {
            201: z.array(DisplayMangaAlertDto),
            404: ErrorDto,
        },
    };

    fastify.post<{ Body: AddMangaAlertDtoType }>(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId, mangaId } =
                    request.body as {
                        userId: string;
                        mangaId: number;
                    };

                const alert = await mangaAlertService.addAlert(userId, mangaId);

                return reply.code(201).send(alert.display());
            } catch (err) {
                if (err instanceof MangaAlertServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default addMangaAlertRoute;
