import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    someSupport(): string;
  }
}

const supportPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.decorate('someSupport', function () {
    return 'hugs';
  });
};

export default fp(supportPlugin, { name: 'support' });
