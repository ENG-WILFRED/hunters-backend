# Hunters Backend API

A comprehensive NestJS backend for managing a football team, including player statistics, donations, documents, and administrative functions.

## Features

- **Player Management** - Track player information and statistics (appearances, goals, assists, cards)
- **Donation Tracking** - Manage team donations with M-Pesa integration
- **Document Management** - Upload and manage team documents
- **Authentication** - JWT-based authentication with admin authorization
- **PostgreSQL Database** - Robust relational database with TypeORM migrations
- **Swagger API Documentation** - Interactive API docs at `/docs`

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/hunters_db
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
createdb hunters_db
```

Run migrations to initialize the schema:

```bash
npm run migration:run
```

## Running the Application

### Development Mode

```bash
# Start with auto-reload
npm run start:dev

# Alternative with nodemon
npm run dev
```

### Production Mode

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## Database Migrations

TypeORM migrations are used to manage database schema changes.

### Available Commands

```bash
# Run pending migrations
npm run migration:run

# Show migration status
npm run migration:show

# Revert the last migration
npm run migration:revert

# Generate a new migration from entity changes
npm run migration:generate -- ./src/migrations/YourMigrationName
```

## API Documentation

Once the application is running, access the Swagger API documentation at:

```
http://localhost:3000/docs
```

## Project Structure

```
src/
├── admin/              # Admin management module
├── auth/               # Authentication & JWT strategy
├── documents/          # Document management
├── donations/          # Donation tracking & M-Pesa integration
├── entities/           # TypeORM entity definitions
├── migrations/         # Database migrations
├── players/            # Player management
├── app.module.ts       # Root module
├── app.controller.ts   # Root controller
├── app.service.ts      # Root service
└── main.ts            # Application entry point
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Linting & Formatting

```bash
# Lint and fix files
npm run lint

# Format code
npm run format
```

## Database Entities

- **Player** - Football team player information and statistics
- **Donation** - Donation records with M-Pesa transaction tracking
- **Document** - Team documents and files

## Core Modules

- **PlayersModule** - CRUD operations for player management
- **DonationsModule** - Donation tracking and payment processing
- **DocumentsModule** - Document upload and retrieval
- **AuthModule** - Authentication and authorization
- **AdminModule** - Administrative functions

## Technologies

- **Framework** - NestJS
- **Database** - PostgreSQL
- **ORM** - TypeORM
- **Authentication** - JWT with Passport
- **Documentation** - Swagger/OpenAPI
- **Language** - TypeScript
- **Testing** - Jest

## License

Proprietary
