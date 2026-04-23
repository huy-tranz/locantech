FROM node:20-alpine

WORKDIR /app

# Cài openssl cho Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

EXPOSE 3001

CMD ["npx", "tsx", "--import", "tsconfig-paths/register", "src/index.ts"]