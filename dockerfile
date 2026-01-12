########### BASE IMAGE ###########
# 1. Utilisation d'une image légère de Node.js
FROM node:22-slim AS base

# 2. Installation des dépendances système nécessaires à Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    chromium \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Définir le dossier de travail
WORKDIR /app

# 4. Copier les fichiers package.json et package-lock.json pour optimiser le cache
COPY package*.json ./

# 5. Installer les dépendances (inclus Puppeteer)
RUN npm install

# 6. Copier le reste des fichiers du projet
COPY . .

# 7. Compiler TypeScript
# RUN npm run build

# 8. Définir les variables d'environnement pour Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROME_DEVEL_SANDBOX="/usr/local/sbin/chrome-devel-sandbox"


############ DEVELOPMENT IMAGE ###########
FROM base AS dev

# 9. Exposer le port (optionnel, si ton bot a un serveur HTTP)
EXPOSE 3003

# 10. Commande pour démarrer l'application
CMD ["npm", "run", "dev"]

############ BUILD IMAGE ###########
FROM base AS build

RUN npm run build

############ PRODUCTION IMAGE ###########
FROM node:22-slim AS production
WORKDIR /app

# Installer les dépendances système nécessaires à Puppeteer
RUN apt-get update && apt-get install -y \
    chromium \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copier les dépendances installées depuis l'étape de base
COPY --from=build /app/dist ./dist

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm install --only=production

# Définir les variables d'environnement pour Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    # CHROME_DEVEL_SANDBOX="/usr/local/sbin/chrome-devel-sandbox"

# Exposer le port (optionnel, si ton bot a un serveur HTTP)
EXPOSE 3003

# Commande pour démarrer l'application
CMD [ "npm", "start" ]