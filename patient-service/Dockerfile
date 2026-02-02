FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps

COPY . .

# Generate Prisma client with DATABASE_URL dummy value for schema only
RUN DATABASE_URL="postgresql://user:pass@localhost/db" npx prisma generate

RUN npm run build

EXPOSE 3002

CMD ["node", "dist/main"]
