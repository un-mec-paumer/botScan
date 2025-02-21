FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

RUN npm i
COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate dev --name init && npx prisma db seed && npm run dev"]

# Better way to do it but refuse to elaborate
# RUN npx prisma generate && \
#     npx prisma migrate dev --name init && \
#     npx prisma db seed

# CMD ["npm", "run", "dev"]
