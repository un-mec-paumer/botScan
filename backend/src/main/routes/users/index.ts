import type { FastifyPluginAsync } from 'fastify';
import meRoutes from './me';

const usersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(meRoutes, { prefix: '/me' });
};

export default usersRoutes;
