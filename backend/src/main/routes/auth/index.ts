import type { FastifyPluginAsync } from 'fastify';
import loginRoute from './login';
import registerRoute from './register';
import refreshRoute from './refresh';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(loginRoute);
  await fastify.register(registerRoute);
  await fastify.register(refreshRoute);
};

export default authRoutes;
