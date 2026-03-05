import type { FastifyPluginAsync } from 'fastify';
import getUserRoute from './getUser';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(getUserRoute);
};

export default userRoutes;
