# CountryVote API (Backend)

NestJS REST API for the CountryVote platform. Allows users to vote for their favorite countries and retrieve voting statistics.

## Features

- RESTful API with Swagger documentation
- API versioning (v1)
- Rate limiting (5 requests per second)
- Health check endpoint with database status
- MongoDB integration with Mongoose
- One vote per email validation
- Country search/autocomplete (minimum 2 characters)
- Top 10 countries ranking with detailed information
- In-memory caching for optimized performance
- Input validation using Zod
- Integration with REST Countries API
- Docker support

## Tech Stack

- **Framework:** NestJS + TypeScript
- **Database:** MongoDB + Mongoose
- **Validation:** Zod (via nestjs-zod)
- **Documentation:** Swagger
- **Caching:** @nestjs/cache-manager
- **HTTP Client:** Axios
- **Rate Limiting:** @nestjs/throttler
- **Health Checks:** @nestjs/terminus
- **External API:** https://restcountries.com/v3.1

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/countryvote
REST_COUNTRIES_API=https://restcountries.com/v3.1
```

**⚠️ IMPORTANT:** The `REST_COUNTRIES_API` environment variable is **REQUIRED**. The application will not start without it and will display an error message if missing.

### Local Development (Running API outside Docker)

If you want to run the API locally while using MongoDB in Docker, create a `.env.local` file:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/countryvote
REST_COUNTRIES_API=https://restcountries.com/v3.1
```

**Note:** `.env.local` takes priority over `.env`. Use `localhost` when running the API locally, and `mongo` (service name) when running inside Docker.

## Running the App

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Documentation

Once the application is running, visit:
- Swagger UI: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/v1/health

**Note:** All API endpoints are versioned and accessible under `/api/v1/` prefix.

## API Endpoints

**All endpoints are prefixed with `/api/v1/`**

### Health

#### Health Check
```http
GET /api/v1/health
```
Returns the health status of the API and database connection.

### Votes

#### Create Vote
```http
POST /api/v1/votes
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "countryCode": "USA",
  "countryName": "United States",
  "flag": "https://flagcdn.com/us.svg"
}
```
**Note:** `countryCode` must be a 3-letter code (ISO Alpha-3).

#### Get Top Countries
```http
GET /api/v1/votes/top?limit=10
```

#### Check if Email Voted
```http
GET /api/v1/votes/check?email=john@example.com
```

#### Get Voting Statistics
```http
GET /api/v1/votes/stats
```

#### Get All Votes
```http
GET /api/v1/votes
```
Returns all votes sorted by creation date (newest first).

### Countries

#### Get All Countries
```http
GET /api/v1/countries
```

#### Search Countries (Autocomplete)
```http
GET /api/v1/countries/search?q=ar
```
*Minimum 2 characters required*

#### Get Country by Code
```http
GET /api/v1/countries/USA
```
**Note:** Uses 3-letter country codes (ISO Alpha-3).

## Project Structure

```
src/
├── votes/
│   ├── dto/
│   │   └── create-vote.dto.ts      # Zod validation schemas
│   ├── schemas/
│   │   └── vote.schema.ts          # Mongoose schema
│   ├── votes.controller.ts         # Votes endpoints
│   ├── votes.service.ts            # Business logic
│   └── votes.module.ts             # Module configuration
├── countries/
│   ├── countries.controller.ts     # Countries endpoints
│   ├── countries.service.ts        # REST Countries API integration
│   └── countries.module.ts         # Module configuration
├── health/
│   ├── health.controller.ts        # Health check endpoint
│   └── health.module.ts            # Health module
├── common/
│   ├── constants/
│   │   └── messages.ts             # Centralized messages/strings
│   └── interfaces/
│       ├── country.interface.ts    # Country-related interfaces
│       └── vote.interface.ts       # Vote-related interfaces
├── app.module.ts                   # Root module (includes throttler)
└── main.ts                         # Application entry point

test/
└── unit/
    ├── votes/
    │   ├── votes.controller.spec.ts  # Controller unit tests
    │   └── votes.service.spec.ts     # Service unit tests
    ├── countries/
    │   ├── countries.controller.spec.ts  # Controller unit tests
    │   └── countries.service.spec.ts     # Service unit tests
    └── health/
        └── health.controller.spec.ts     # Health controller tests
```

## Key Features

### 1. Email Uniqueness Validation
- MongoDB unique index on email field
- Service-level validation before insert
- Returns 409 Conflict if email already exists

### 2. Caching Strategy
- **Countries data:** 1 hour TTL
- **Top countries:** 5 minutes TTL
- Cache invalidation on new vote
- In-memory cache using cache-manager

### 3. Rate Limiting
- Global rate limiting: 5 requests per second
- Applied to all endpoints
- Returns 429 Too Many Requests when limit exceeded

### 4. Input Validation
- All DTOs validated with Zod schemas
- Automatic validation via nestjs-zod pipes
- Descriptive error messages

### 5. External API Integration
- REST Countries API for country details
- Optimized query with specific fields only
- Cached responses to minimize external calls
- Error handling and fallbacks
- Environment variable validation on startup

### 6. Health Checks
- Database connection monitoring
- MongoDB ping check with timeout
- Returns service health status
- Useful for container orchestration

### 7. Code Organization
- **Centralized Messages:** All error messages, success messages, and logs are centralized in `src/common/constants/messages.ts` for easy maintenance and i18n support
- **Type Safety:** No use of `any` types - all code properly typed with TypeScript
- **Consistent Error Handling:** Standardized error messages across the application
- **Comprehensive Testing:** Unit tests for all services and controllers with high coverage

## Docker

### Build and Run with Docker

```bash
# Build image
docker build -t countryvote-api .

# Run container
docker run -p 3000:3000 --env-file .env countryvote-api
```

### Run with Docker Compose (from project root)

```bash
docker-compose up --build
```

This starts both the API and MongoDB.

## Testing

The project includes comprehensive unit tests for all services and controllers.

### Running Tests

```bash
# unit tests
npm run test

# watch mode
npm run test:watch

# test coverage
npm run test:cov
# or
npm run coverage

# e2e tests
npm run test:e2e
```

### Test Coverage

Current test coverage (unit tests):

```
File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|----------
All files                 |   93.45 |    74.64 |   96.15 |   92.94
countries.controller.ts   |     100 |       90 |     100 |     100
countries.service.ts      |     100 |    94.44 |     100 |     100
health.controller.ts      |   90.90 |       75 |   66.66 |   88.88
votes.controller.ts       |     100 |       80 |     100 |     100
votes.service.ts          |   80.76 |       52 |     100 |      80
votes/dto                 |     100 |      100 |     100 |     100
votes/schemas             |     100 |      100 |     100 |     100

Test Suites: 5 passed
Tests: 47 passed
```

**Highlights:**
- ✅ **93.45%** statement coverage
- ✅ **96.15%** function coverage on all services and controllers
- ✅ 47 passing unit tests
- ✅ High coverage on DTOs and schemas
- ✅ Mock implementations for external dependencies (MongoDB, Cache, HTTP)
- ✅ Tests organized in `test/unit/` directory by feature

### Test Structure

All unit tests are organized in the `test/unit/` directory, separated by feature:

- `test/unit/votes/votes.controller.spec.ts` - Tests for vote endpoints
- `test/unit/votes/votes.service.spec.ts` - Tests for vote business logic
- `test/unit/countries/countries.controller.spec.ts` - Tests for country endpoints
- `test/unit/countries/countries.service.spec.ts` - Tests for REST Countries API integration
- `test/unit/health/health.controller.spec.ts` - Tests for health check endpoint

## Linting and Formatting

```bash
# lint
npm run lint

# format
npm run format
```

## Database Schema

### Vote Document
```typescript
{
  name: string;          // User name
  email: string;         // Unique email (lowercase)
  countryCode: string;   // 3-letter country code (ISO Alpha-3)
  countryName: string;   // Country name
  flag: string;          // Country flag URL
  createdAt: Date;       // Auto-generated
  updatedAt: Date;       // Auto-generated
}
```

### Indexes
- `email`: unique index for one vote per email
- Created automatically via Mongoose schema

## Notes

- Email addresses are stored in lowercase
- All endpoints return JSON responses
- CORS is enabled for all origins
- Global Zod validation pipe is configured
- Application logs to console in development mode
- Country codes use ISO Alpha-3 (3-letter codes)
- API versioning allows for future updates without breaking changes
- Rate limiting prevents abuse and ensures fair usage
