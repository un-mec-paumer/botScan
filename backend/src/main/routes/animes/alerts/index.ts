import type { FastifyPluginAsync } from 'fastify';
import addAnimeAlertRoute from './addAnimeAlert';
import deleteAnimeAlertRoute from './deleteAnimeAlert';
import getAnimeAlertRoute from './getAnimeAlert';
import getAnimeAlertsByUserIdRoute from './getAnimeAlertsByUserId';
import getAnimeAlertsByAnimeIdRoute from './getAnimeAlertsByAnimeId';

const animeAlertRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(addAnimeAlertRoute);
    await fastify.register(deleteAnimeAlertRoute);
    await fastify.register(getAnimeAlertRoute);
    await fastify.register(getAnimeAlertsByUserIdRoute);
    await fastify.register(getAnimeAlertsByAnimeIdRoute);
};

export default animeAlertRoutes;
