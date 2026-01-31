import type { FastifyPluginAsync } from 'fastify';
import authRoutes from './auth/index';
import apiRoutes from './api/index';

const mainRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(apiRoutes, { prefix: '/api' });
};

export default mainRoutes;
