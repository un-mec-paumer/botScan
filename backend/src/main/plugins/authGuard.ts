import fp from 'fastify-plugin';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      _request: FastifyRequest,
      _reply: FastifyReply
    ) => Promise<void>;
  }
}

export default fp(async (fastify) => {
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, _reply: FastifyReply) => {
      // La fonction jwtVerify fait :
      // 1. Trouve le token dans le header
      // 2. Le vérifie
      // 3. Attache le payload à request.user
      // 4. Envoie une erreur 401 si ça échoue
      await request.jwtVerify();
    }
  );
});
/**
 * rc/
└── main/
    └── routes/
        ├── api/
        │   ├── conversations/
        │   │   ├── index.ts         # Route: GET /api/conversations
        │   │   ├── create.ts        # Route: POST /api/conversations
        │   │   ├── [conversationId]/
        │   │   │   ├── index.ts     # Routes: GET & DELETE /api/conversations/:id
        │   │   │   └── messages.ts  # Route: POST /api/conversations/:id/messages
        │   │   │
        │   │   └── conversations.routes.ts # Fichier qui assemble tout
        │   │
        │   ├── index.ts             # Fichier principal des routes API
        │   ├── ping.ts
        │   └── test.ts
        │
        └── auth/
            └── ... (inchangé)
 */
