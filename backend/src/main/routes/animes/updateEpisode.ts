import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { AnimeService } from '@services/AnimeService';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { DisplayAnimeDto } from '@dtos/animes/DisplayAnimeDto';
import { ErrorDto } from '@dtos/ErrorDto';

const updateEpisodeRoute: FastifyPluginAsync = async (fastify) => {
    const animeService = new AnimeService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Updates the episode of the anime',
        description: 'Updates the episode of the anime',
        tags: ['animes'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayAnimeDto,
            401: ErrorDto,
        },
    };

    fastify.patch(
        '/update-episode/:id',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: number };
                const { episode } = request.body as { episode: string };

                const anime = await animeService.updateEpisode(id, episode);

                return reply.code(200).send(anime.display());
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

export default updateEpisodeRoute;
