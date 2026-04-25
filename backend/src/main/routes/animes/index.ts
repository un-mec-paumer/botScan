import type { FastifyPluginAsync } from 'fastify';
import getAnimeByIdRoute from './getAnimeById';
import getAnimeByNameRoute from './getAnimeByName';
import getAnimesRoute from './getAnimes';
import addAnimeRoute from './addAnime';
import updateChapterRoute from './updateEpisode';
import animeAlertRoutes from './alerts';
import globalAnimeSourceRoutes from './global-sources';
import animeSourceRoutes from './sources';

const animeRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(addAnimeRoute);
    await fastify.register(getAnimeByIdRoute);
    await fastify.register(getAnimeByNameRoute);
    await fastify.register(getAnimesRoute);
    await fastify.register(updateChapterRoute);
    await fastify.register(animeAlertRoutes, { prefix: '/alerts' })
    await fastify.register(globalAnimeSourceRoutes, { prefix: '/global-sources' })
    await fastify.register(animeSourceRoutes, { prefix: '/sources' })
};

export default animeRoutes;
