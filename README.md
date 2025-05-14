# Hilton Restaurants Table Reservation System

A modern table reservation system for Hilton Restaurants, built with Node.js, TypeScript, SQLite, and GraphQL.

## Features

- Guest reservation management
- Restaurant employee dashboard
- Real-time reservation status updates
- SQLite database for local development
- GraphQL API for business operations
- REST API for authentication
- Cucumber BDD testing

## Tech Stack

- **Backend:**
  - Node.js with TypeScript
  - Express.js for REST API
  - Apollo Server for GraphQL
  - TypeORM with SQLite
  - Winston for logging

- **Testing:**
  - Cucumber for BDD testing
  - Chai for assertions

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd h-reservation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Run tests:
   ```bash
   npm test
   ```

## Project Structure

```
/h-reservation
  /apps
    /backend         # Node.js backend
      /src
        /entities    # TypeORM entities
        /services    # Business logic
        /types       # TypeScript types
        /features    # Cucumber features
  /packages
    /common         # Shared utilities
```

## API Documentation

### GraphQL Endpoints

- `POST /graphql`
  - Query reservations
  - Create/update/cancel reservations
  - Filter by date and status

### REST Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

## Testing

The project uses Cucumber for Behavior-Driven Development (BDD) testing. Feature files are located in `apps/backend/features/`.

Run tests with:
```bash
npm test
```

## License

MIT 