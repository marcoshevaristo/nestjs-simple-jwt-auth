# Base stage
FROM node:22-alpine AS base
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
WORKDIR /usr/src/app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development dependencies stage
FROM base AS dev-deps
COPY package*.json ./
RUN npm ci

# Build stage
FROM dev-deps AS build
COPY . .
RUN npm run build

# Development stage
FROM dev-deps AS development
COPY . .
USER nestjs
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
COPY --from=deps --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /usr/src/app/package*.json ./
USER nestjs
EXPOSE 3000
CMD ["node", "dist/main.js"]
