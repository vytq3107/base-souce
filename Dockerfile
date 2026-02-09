# Build stage
FROM node:20-alpine AS build

ARG APP_NAME

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY nx.json tsconfig.base.json ./

# Copy all workspace packages
COPY apps/ ./apps/
COPY libs/ ./libs/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm nx build ${APP_NAME} --production

# Production stage
FROM node:20-alpine AS production

ARG APP_NAME

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from build stage
COPY --from=build /app/dist/apps/${APP_NAME} ./dist/

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
