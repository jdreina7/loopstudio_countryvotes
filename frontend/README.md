# CountryVote Frontend

React + Vite frontend application for the CountryVote platform.

## Features

- Vote submission form with real-time validation
- Country autocomplete (minimum 2 characters)
- Top 10 countries table with search functionality
- Success/error message handling
- Dark/Light theme switching
- Multi-language support (English/Spanish)
- Responsive design
- TypeScript with strict type checking
- Real-time data updates with TanStack Query

## Installation

```bash
npm install
```

## Environment Variables

Create `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Running

```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build
```

Access at http://localhost:5173

## Tech Stack

- **React 18 + TypeScript:** Component-based UI with type safety
- **Vite:** Fast build tool and development server
- **TanStack Query (React Query):** Server state management and caching
- **Axios:** HTTP client for API requests
- **Zod:** Runtime validation schemas
- **Context API:** Global state management (Theme, Language)

## Project Structure

```
src/
├── components/
│   ├── CountriesTable.tsx       # Top 10 countries table
│   ├── CountryAutocomplete.tsx  # Country search autocomplete
│   ├── ErrorIcon.tsx            # Reusable error icon component
│   ├── ErrorMessage.tsx         # Error message display
│   ├── Footer.tsx               # App footer
│   ├── Header.tsx               # App header with theme/language switchers
│   ├── SearchInput.tsx          # Reusable search input component
│   ├── SuccessMessage.tsx       # Success message display
│   └── VoteForm.tsx             # Vote submission form
├── contexts/
│   ├── LanguageContext.tsx      # Multi-language support (en/es)
│   └── ThemeContext.tsx         # Theme switching (light/dark)
├── i18n/
│   └── translations.ts          # Translation strings
├── services/
│   └── api.ts                   # API client and endpoints
├── types/
│   └── index.ts                 # TypeScript type definitions
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles and CSS variables
```

## Key Features

### 1. Component Architecture
- **Reusable Components:** `SearchInput` and `ErrorIcon` components for consistency
- **Component Composition:** Small, focused components with single responsibilities
- **Type Safety:** All components fully typed with TypeScript

### 2. State Management
- **TanStack Query:** Automatic caching, refetching, and invalidation for server data
- **Context API:** Global theme and language preferences with localStorage persistence
- **Local State:** React hooks for component-specific state

### 3. Theme Support
- Light and dark themes with smooth transitions
- CSS variables for easy customization
- Persistent theme preference in localStorage

### 4. Internationalization
- English and Spanish language support
- Easy to extend with additional languages
- Persistent language preference in localStorage

### 5. Real-time Updates
- Automatic refetch every 30 seconds for top countries
- Manual refresh trigger after successful vote
- Cache invalidation strategy for data consistency
