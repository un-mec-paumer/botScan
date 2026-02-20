########### BASE IMAGE ###########
# 1. Utilisation d'une image légère de Node.js
FROM node:22-slim AS base

# 2. Définir le dossier de travail
WORKDIR /app

# 3. Copier les fichiers package.json et package-lock.json pour optimiser le cache
COPY *.json ./

# 4. Installer les dépendances (inclus Puppeteer)
RUN npm install

############ DEVELOPMENT IMAGE ###########
FROM base AS dev

# 9. Exposer le port (optionnel, si ton bot a un serveur HTTP)
EXPOSE 3003

# 10. Commande pour démarrer l'application
CMD ["npm", "run", "dev"]

############ BUILD IMAGE ###########
FROM base AS build

COPY ./src /app/src
RUN npm run build

############ PRODUCTION IMAGE ###########
FROM node:22-slim AS production
WORKDIR /app

# Copier les dépendances installées depuis l'étape de base
COPY --from=build /app/dist ./dist

# Copier les fichiers package.json et package-lock.json
COPY *.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Exposer le port (optionnel, si ton bot a un serveur HTTP)
EXPOSE 3003

# Commande pour démarrer l'application
CMD [ "npm", "start" ]