# Build stage for frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
RUN npm install -g pnpm

# Copy frontend files
COPY apps/frontend/package.json apps/frontend/pnpm-lock.yaml ./apps/frontend/
COPY apps/frontend ./apps/frontend

# Install frontend dependencies and build
WORKDIR /app/apps/frontend
RUN pnpm install
RUN pnpm build

# Build stage for backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
RUN npm install -g pnpm

# Copy backend files
COPY apps/backend/package.json apps/backend/pnpm-lock.yaml ./apps/backend/
COPY apps/backend ./apps/backend

# Install backend dependencies and build
WORKDIR /app/apps/backend
RUN pnpm install
RUN pnpm build

# Production stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm

# Copy built frontend files
COPY --from=frontend-builder /app/apps/frontend/dist ./apps/frontend/dist

# Copy built backend files and dependencies
COPY --from=backend-builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=backend-builder /app/apps/backend/package.json ./apps/backend/
COPY --from=backend-builder /app/apps/backend/pnpm-lock.yaml ./apps/backend/

# Install production dependencies
WORKDIR /app/apps/backend
RUN pnpm install --prod

# Create logs directory
RUN mkdir -p logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "dist/index.js"] 