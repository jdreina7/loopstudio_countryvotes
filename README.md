# CountryVote Platform

Full-stack application that allows users to vote for their favorite countries and view the top 10 most voted countries with comprehensive statistics and visualizations.

## Features

### Backend (NestJS)
- RESTful API with full Swagger documentation (alphabetically sorted)
- MongoDB database for vote storage
- One vote per email validation
- Country search/autocomplete endpoint (minimum 2 characters)
- Top 10 countries ranking with detailed information
- **Health monitoring** for database and external API status
- **Statistics module** with comprehensive voting analytics
- In-memory caching system for optimized performance
- Input validation with Zod
- Docker containerization

### Frontend (React + Vite)
- Responsive vote submission form with real-time validation
- Country autocomplete with 2-character minimum
- Top 10 countries table with search functionality
- **Real-time health status dashboard** (DB + External API monitoring)
- **Interactive charts and visualizations**:
  - Stats cards showing total votes and unique countries
  - Bar chart displaying top 10 countries by votes
  - Pie chart showing votes distribution by region
- Success/error message handling
- Dark/Light theme support
- Multi-language support (English/Spanish)
- Modern UI following Figma design specifications

## Tech Stack

### Backend
- **Framework:** NestJS + TypeScript
- **Database:** MongoDB + Mongoose
- **Validation:** Zod
- **Documentation:** Swagger
- **Caching:** NestJS Cache Manager
- **HTTP Client:** Axios
- **External API:** REST Countries API (https://restcountries.com)

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **State Management:** React Query (TanStack Query)
- **HTTP Client:** Axios
- **Validation:** Zod
- **Charts:** Recharts
- **Styling:** CSS Modules

## Project Structure
```
country-votes-platform
├─ README.md
├─ /backend
│  ├─ .dockerignore
│  ├─ .prettierrc
│  ├─ Dockerfile
│  ├─ README.md
│  ├─ eslint.config.mjs
│  ├─ nest-cli.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ /src
│  │  ├─ app.module.ts
│  │  ├─ /common
│  │  │  ├─ /constants
│  │  │  │  └─ messages.ts
│  │  │  └─ /interfaces
│  │  │     ├─ country.interface.ts
│  │  │     └─ vote.interface.ts
│  │  ├─ /countries
│  │  │  ├─ countries.controller.ts
│  │  │  ├─ countries.module.ts
│  │  │  ├─ countries.service.ts
│  │  │  └─ dto
│  │  ├─ /health
│  │  │  ├─ health.controller.ts
│  │  │  └─ health.module.ts
│  │  ├─ main.ts
│  │  └─ /votes
│  │     ├─ /dto
│  │     │  └─ create-vote.dto.ts
│  │     ├─ /schemas
│  │     │  └─ vote.schema.ts
│  │     ├─ votes.controller.ts
│  │     ├─ votes.module.ts
│  │     └─ votes.service.ts
│  ├─ /test
│  │  ├─ jest-e2e.json
│  │  └─ /unit
│  │     ├─ app
│  │     ├─ /countries
│  │     │  ├─ countries.controller.spec.ts
│  │     │  └─ countries.service.spec.ts
│  │     ├─ /health
│  │     │  └─ health.controller.spec.ts
│  │     └─ /votes
│  │        ├─ votes.controller.spec.ts
│  │        └─ votes.service.spec.ts
│  ├─ tsconfig.build.json
│  └─ tsconfig.json
├─ docker-compose.yml
└─ /frontend
   ├─ README.md
   ├─ eslint.config.js
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ /public
   │  ├─ loopstudio-logo.png
   │  └─ vite.svg
   ├─ /src
   │  ├─ App.css
   │  ├─ App.tsx
   │  ├─ /assets
   │  │  └─ react.svg
   │  ├─ /components
   │  │  ├─ CountriesTable.css
   │  │  ├─ CountriesTable.tsx
   │  │  ├─ CountryAutocomplete.css
   │  │  ├─ CountryAutocomplete.tsx
   │  │  ├─ ErrorIcon.css
   │  │  ├─ ErrorIcon.tsx
   │  │  ├─ ErrorMessage.css
   │  │  ├─ ErrorMessage.tsx
   │  │  ├─ Footer.css
   │  │  ├─ Footer.tsx
   │  │  ├─ Header.css
   │  │  ├─ Header.tsx
   │  │  ├─ SearchInput.css
   │  │  ├─ SearchInput.tsx
   │  │  ├─ SuccessMessage.css
   │  │  ├─ SuccessMessage.tsx
   │  │  ├─ VoteForm.css
   │  │  └─ VoteForm.tsx
   │  ├─ /contexts
   │  │  ├─ LanguageContext.tsx
   │  │  └─ ThemeContext.tsx
   │  ├─ hooks
   │  ├─ /i18n
   │  │  └─ translations.ts
   │  ├─ index.css
   │  ├─ main.tsx
   │  ├─ /services
   │  │  └─ api.ts
   │  └─ /types
   │     └─ index.ts
   ├─ tsconfig.app.json
   ├─ tsconfig.json
   ├─ tsconfig.node.json
   └─ vite.config.ts
```

## Getting Started

### Prerequisites
- Node.js 20+ (for local development)
- Docker & Docker Compose (recommended)
- `npm` or `yarn`

### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
cd challenges/country-votes-platform
```

2. Start all services with Docker Compose:
```bash
docker-compose up --build
```

This will start:
- MongoDB on port `27017`
- Backend API on port `3000`
- Frontend will need to be run separately **(see below)**

3. Start the frontend (in a separate terminal):
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs

### Option 2: Manual Setup

#### Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/countryvote
```

4. Ensure MongoDB is running locally on port `27017`

5. Start the development server:
```bash
npm run start:dev
```

#### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

All endpoints are prefixed with `/api/v1` and documented in Swagger (alphabetically sorted).

### Countries
- `GET /countries` - Get all countries
- `GET /countries/search?q=ar` - Search countries (min 2 chars)
- `GET /countries/:code` - Get country by code

### Health
- `GET /health` - Health check for database and external REST Countries API

### Statistics
- `GET /statistics` - Get comprehensive statistics (total votes, unique countries, regions, timeline)
- `GET /statistics/regions` - Get votes grouped by geographical region
- `GET /statistics/timeline` - Get daily vote counts over time

### Votes
- `POST /votes` - Create a new vote
- `GET /votes/top?limit=10` - Get top voted countries
- `GET /votes/check?email=user@example.com` - Check if email has voted
- `GET /votes/stats` - Get voting statistics
- `GET /votes` - Get all votes

## Development

### Backend Commands
```bash
npm run start       # Production mode
npm run start:dev   # Development mode with watch
npm run build       # Build for production
npm run test        # Run tests
npm run lint        # Lint code
npm run format      # Format code with Prettier
```

### Frontend Commands
```bash
npm run dev        # Development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up --build api
```

## Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/countryvote
REST_COUNTRIES_API=https://restcountries.com/v3.1
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## Key Features Implementation

### 1. One Vote Per Email
- Email uniqueness enforced at database level (unique index)
- Validation in service layer before saving
- Conflict error (`409`) returned if email already voted

### 2. Country Autocomplete
- Minimum 2 characters required
- Debounced search (300ms)
- Results cached for performance
- Search by country name

### 3. Caching Strategy
- In-memory cache with NestJS Cache Manager
- Countries data: 1 hour TTL
- Top countries: 5 minutes TTL
- Cache invalidation on new vote

### 4. Input Validation
- Zod schemas on both backend and frontend
- Real-time validation on frontend
- Server-side validation as final check
- Descriptive error messages

## Contributing

Follow the standards defined in `/CLAUDE.md`:
- Use kebab-case for files
- Use PascalCase for classes/types
- Prefer Zod for validations
- Document all endpoints with Swagger
- Write clean, readable code

## AI Usage Disclaimer (Claude Code)

Some portions of the code and certain architectural decisions were assisted by AI tools, specifically **Claude Code**.
Full responsibility for the implementation, validation, maintenance, and security of the project rests solely with the author.
AI assistance was limited to accelerating code generation, documentation, and development support tasks.

## License

This project is part of a coding challenge.
