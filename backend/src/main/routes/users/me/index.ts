import type { FastifyPluginAsync } from 'fastify';
import getSettingsRoute from './get';
import patchSettingsRoute from './patch';

const meRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.register(getSettingsRoute);
  fastify.register(patchSettingsRoute);
};

export default meRoutes;
