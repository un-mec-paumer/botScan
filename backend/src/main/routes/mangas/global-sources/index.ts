import type { FastifyPluginAsync } from 'fastify';
import updateUrlRoute from './updateUrl';

const globalMangaSourceRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(updateUrlRoute);
};

export default globalMangaSourceRoutes;
