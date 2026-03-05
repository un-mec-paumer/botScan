import type { FastifyPluginAsync } from 'fastify';
import pingRoute from './ping';

const apiRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(pingRoute);
};

export default apiRoutes;
