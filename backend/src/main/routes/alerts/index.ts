import type { FastifyPluginAsync } from 'fastify';
import addAlertRoute from './addAlert';
import deleteAlertRoute from './deleteAlert';
import getAlertRoute from './getAlert';
import getAlertsByUserIdRoute from './getAlertsByUserId';
import getAlertsByWorkIdRoute from './getAlertsByWorkId';
import updateAlertRoute from './updateAlert';

const alertRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(addAlertRoute);
    await fastify.register(deleteAlertRoute);
    await fastify.register(getAlertRoute);
    await fastify.register(getAlertsByUserIdRoute);
    await fastify.register(getAlertsByWorkIdRoute);
    await fastify.register(updateAlertRoute);
};

export default alertRoutes;
