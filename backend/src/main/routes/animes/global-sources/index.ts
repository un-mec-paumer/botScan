import type { FastifyPluginAsync } from 'fastify';
import getGlobalSourcesRoute from './getGlobalSources';
import updateUrlRoute from './updateUrl';

const globalAnimeSourceRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(getGlobalSourcesRoute);
    await fastify.register(updateUrlRoute);
};

export default globalAnimeSourceRoutes;
