import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

/**
 * Ce plugin configure Swagger (OpenAPI) pour l'application.
 * Il utilise @fastify/swagger pour générer la documentation et
 * @fastify/swagger-ui pour servir une interface web.
 *
 * La fonction `jsonSchemaTransform` de `fastify-type-provider-zod` est la clé
 * pour convertir automatiquement les schémas Zod en schémas JSON pour OpenAPI.
 */
export default fp(async (fastify) => {
  // Enregistre le générateur Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'botscan API',
        description: "Documentation de l'API pour le backend botscan.",
        version: '1.0.0',
      },
      // Si votre API est protégée, vous pouvez définir les schémas de sécurité ici
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    // Cette fonction de transformation est la clé pour faire fonctionner les schémas Zod avec Swagger
    transform: jsonSchemaTransform,
  });

  // Enregistre l'interface utilisateur de Swagger
  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list', // 'full', 'none'
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  fastify.log.info(
    'Plugin Swagger enregistré. Documentation disponible sur /docs'
  );
});
