import fp from 'fastify-plugin';
import sensible from '@fastify/sensible';
import type { FastifyPluginAsync } from 'fastify';

/**
 * Ce plugin ajoute des utilitaires pour gérer les erreurs HTTP.
 *
 * @see https://github.com/fastify/fastify-sensible
 */

const sensiblePlugin: FastifyPluginAsync = async (fastify) => {
    fastify.register(sensible);
};

export default fp(sensiblePlugin, { name: 'sensible' });
