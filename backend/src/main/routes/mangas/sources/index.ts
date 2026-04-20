import type { FastifyPluginAsync } from 'fastify';
import addSourceRoute from './addSource';
import updateLinkRoute from './updateLink';

const mangaSourceRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(addSourceRoute);
    await fastify.register(updateLinkRoute);
};

export default mangaSourceRoutes;
