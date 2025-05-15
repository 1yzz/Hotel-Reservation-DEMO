# H-Reservation

A hotel reservation system built with SolidJS and Node.js.

## Project Structure

This is a monorepo containing the following packages:

- `apps/frontend`: SolidJS frontend application
- `apps/backend`: Node.js/Express backend application

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

3. Start development servers:
   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm lint`: Run linting for all applications
- `pnpm test`: Run tests for all applications
- `pnpm clean`: Clean build artifacts

## Development

### Frontend

The frontend is built with SolidJS and includes:
- TypeScript
- Solid Router for routing

### Backend

The backend is built with Node.js and Express, featuring:
- TypeScript
- MongoDB
- JWT authentication
- GraphQL API with Apollo Server