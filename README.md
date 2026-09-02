# stay_sync_hotel

A full-stack hotel management system developed as a personal project.  
It provides core front‑desk functionalities:

## Core features

- Room type and inventory management
- Customer reservation and check‑in/out
- Billing and payment recording
- Daily revenue statistics

## Tech Stack

- **Backend:** Node.js (Express.js) with TypeScript, Prisma ORM, JWT authentication
- **Frontend:** React 18 + Vite + React Router v6 + Zustand (state management)
- **Database:** PostgreSQL
- **Build Tools:** npm / pnpm (both backend and frontend)
- **API Communication:** RESTful API with JSON (axios on frontend)

## Project Structure

The project is split into two main folders (both in the same repository):

```
Hotel_System/
├── backend/        # Node.js + Express + TypeScript
│   ├── prisma/     # schema.prisma, migrations
│   ├── src/        # controllers, routes, services, middlewares, utils, app/server
│   ├── tests/      # unit & integration tests
│   └── package.json
└── frontend/       # React + Vite app
    └── src/
        ├── layouts/
        ├── pages/
        ├── components/
        ├── stores/
        └── api/
```

This separation keeps backend and frontend code clean and independently deployable.

### Frontend Structure

```
src/
├── layouts/       (Header + Sidebar wrapper)
├── pages/         (Dashboard, Rooms, Bookings, Reports)
├── components/    (Reusable UI parts)
├── stores/        (Zustand state - like Pinia)
└── api/           (Axios requests)
```

### Backend Structure

```
backend/
├── src/                          # Core: All application source code
│   ├── config/                   # Configuration management (env vars, third-party keys, DB connection)
│   │   └── index.js              # Unified export of config object
│   │
│   ├── controllers/              # Controller layer (handles requests and responses)
│   │   ├── userController.js     # User module controller
│   │   └── productController.js  # Product module controller
│   │
│   ├── middlewares/              # Middleware layer (global/local reusable logic)
│   │   ├── auth.js               # JWT authentication
│   │   ├── errorHandler.js       # Global error handling
│   │   └── upload.js             # File upload parsing
│   │
│   ├── routes/                   # Route layer (defines API endpoints, mounts middleware)
│   │   ├── userRoutes.js         # User routes (/api/users)
│   │   └── index.js              # Route aggregation entry point
│   │
│   ├── services/                 # Service layer (core business logic, transactions)
│   │   ├── userService.js        # User registration, login, password change, etc.
│   │   └── productService.js
│   │
│   ├── utils/                    # Utility functions (pure functions, no side effects)
│   │   ├── response.js           # Unified response format (success, error)
│   │   ├── encrypt.js            # Password encryption/decryption
│   │   └── validator.js          # Custom input validation
│   │
│   ├── app.js                    # Express instance config (registers middleware, routes, DB connection)
│   └── server.js                 # Process entry point (starts HTTP server, listens on port)
│
├── prisma/                       # ORM configuration and database migrations (Prisma official standard)
│   ├── schema.prisma             # Data model definitions (Models)
│   └── migrations/               # Database schema change history (auto-generated)
│       └── 20250101_init/
│
├── tests/                        # Test directory (ensures code quality)
│   ├── unit/                     # Unit tests (testing Utils, Services)
│   └── integration/              # Integration tests (testing API endpoints, connected to test DB)
│
├── .env.example                  # Environment variable template (commit to Git for team reference)
├── .env                          # Actual environment variables (local/prod, MUST be in .gitignore)
├── .gitignore                    # Git ignore file
├── package.json                  # Project dependencies and script commands
├── package-lock.json / yarn.lock # Dependency lock file
└── README.md                     # Project documentation (architecture, startup commands, API docs)
```

## Quick start

### Clone the repository

```
git clone
```

#### Install deps

```
npm install (or pnpm install)
```

### Run dev server

```
npm run dev
```

## Contributor notes / best practices

### Always update Prisma artifacts after schema changes:

- Create migration:
    - `npx prisma migrate dev --name`
- Generate client:
    - `npx prisma generate`
- Commit migrations under
  **backend/prisma/migrations**

- Use Prisma Studio for quick DB inspection and to help create seed data.
    - `npx prisma studio`

#### Integration tests:

- Use a separate test database (set via an environment variable, e.g. TEST_DATABASE_URL).
- In test setup, run migrations and (optionally) seed the test DB:

```
npx prisma migrate deploy # or npx prisma migrate dev --name init for local dev
npx prisma db seed
```
