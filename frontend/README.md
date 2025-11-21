# CountryVote Frontend

React + Vite frontend application for the CountryVote platform with modern UI/UX features, animations, and comprehensive testing.

## Features

- Vote submission form with real-time validation using Zod
- Country autocomplete with debounced search (minimum 2 characters)
- Top 10 countries table with advanced search and filtering
- Interactive charts and statistics visualization
- Success/error message handling with smooth animations
- Dark/Light theme switching with system preference detection
- Multi-language support (English/Spanish)
- Fully responsive design with mobile-first approach
- TypeScript with strict type checking
- Real-time data updates with TanStack Query
- Comprehensive accessibility features (WCAG 2.1 compliant)
- Performance optimizations (code splitting, lazy loading)
- Comprehensive test coverage

## Installation

```bash
npm install
```

## Environment Variables

Create `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm test                 # Run tests in watch mode
npm run test:ui          # Run tests with UI interface
npm run test:coverage    # Generate test coverage report
```

Access the development server at http://localhost:5173

## Tech Stack

- **React 19 + TypeScript:** Component-based UI with latest React features and type safety
- **Vite:** Fast build tool and development server with HMR
- **TanStack Query (React Query):** Server state management, caching, and synchronization
- **Axios:** HTTP client for API requests with interceptors
- **Zod:** Runtime validation schemas for type-safe form validation
- **Framer Motion:** Declarative animations and transitions
- **Recharts:** Composable charting library for data visualization
- **Vitest:** Fast unit testing framework with React Testing Library
- **Context API:** Global state management (Theme, Language)

## Project Structure

```
frontend/
├── src/
│   ├── components/              # React components (organized by feature)
│   │   ├── CountriesTable/      # Top 10 countries table with search
│   │   ├── CountryAutocomplete/ # Country search with autocomplete
│   │   ├── ErrorBoundary/       # Error boundary for app resilience
│   │   ├── ErrorIcon/           # Reusable error icon component
│   │   ├── ErrorMessage/        # Error message with animations
│   │   ├── Footer/              # App footer with links
│   │   ├── Header/              # Header with theme/language switchers
│   │   ├── HealthStatus/        # Backend health status indicator
│   │   ├── RegionPieChart/      # Pie chart for region statistics
│   │   ├── SearchInput/         # Reusable search input component
│   │   ├── StatsCards/          # Statistics cards display
│   │   ├── SuccessMessage/      # Success message with animations
│   │   ├── VoteForm/            # Vote submission form
│   │   └── VotesBarChart/       # Bar chart for vote statistics
│   ├── contexts/
│   │   ├── LanguageContext.tsx  # Multi-language support (en/es)
│   │   └── ThemeContext.tsx     # Theme switching with auto-detection
│   ├── i18n/
│   │   └── translations.ts      # Translation strings for all languages
│   ├── services/
│   │   └── api.ts               # API client configuration and endpoints
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions and interfaces
│   ├── utils/
│   │   └── constants.ts         # Application-wide constants
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles and CSS variables
├── tests/
│   ├── unit/                    # Unit tests
│   │   ├── ErrorBoundary.test.tsx
│   │   ├── ThemeContext.test.tsx
│   │   └── VoteForm.test.tsx
│   ├── integration/             # Integration tests
│   └── setup.ts                 # Test environment setup
├── public/                      # Static assets
├── vitest.config.ts             # Vitest configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

## Key Features

### 1. Component Architecture

**Organized Structure:**
- Components are organized in feature-based folders
- Each component has its own directory with TypeScript, CSS, and index files
- Promotes code reusability and maintainability

**Reusable Components:**
- `SearchInput`: Debounced search input with clear functionality
- `ErrorIcon`: SVG-based error icon for consistency
- `StatsCards`: Statistics cards with loading states

**Component Composition:**
- Small, focused components with single responsibilities
- Props-based configuration for flexibility
- Type-safe props with TypeScript interfaces

**Type Safety:**
- All components fully typed with TypeScript
- Strict mode enabled for enhanced type checking
- Runtime validation with Zod schemas

### 2. State Management

**TanStack Query (React Query):**
- Automatic caching and background refetching
- Optimistic updates and cache invalidation
- Stale-while-revalidate pattern for better UX
- Automatic retry on failed requests
- Request deduplication

**Context API:**
- Global theme and language preferences
- localStorage persistence for user preferences
- System preference detection for themes
- Efficient re-renders with context optimization

**Local State:**
- React hooks (useState, useEffect, useMemo) for component-specific state
- Form state management with controlled components
- Search state with debouncing for performance

### 3. Dark Mode

**Auto-Detection:**
- Detects system color scheme preference on first load
- Uses `window.matchMedia('(prefers-color-scheme: dark)')`
- Listens for system theme changes in real-time
- Respects manual user selection over system preference

**Theme Implementation:**
- CSS variables for consistent theming
- Smooth transitions between themes
- Persistent theme preference in localStorage
- Document-level attribute for theme application

**User Control:**
- Toggle button in header for manual switching
- Visual indicator of current theme
- Immediate theme application without page reload

### 4. Internationalization (i18n)

**Language Support:**
- English and Spanish fully supported
- Easy to extend with additional languages
- Centralized translation files in `/src/i18n/translations.ts`

**Implementation:**
- Context-based language switching
- Persistent language preference in localStorage
- Type-safe translation keys with TypeScript
- Fallback to English for missing translations

**Coverage:**
- All UI text, labels, and messages
- Form validation messages
- Error messages and notifications
- Button labels and placeholders

### 5. Animations (Framer Motion)

**Subtle & Performant:**
- All animations under 300ms for snappiness
- GPU-accelerated transforms
- Respects user's motion preferences

**Message Animations:**
- Success/Error messages: Fade in + slide up with scale
- AnimatePresence for smooth exit animations
- Mode="wait" for sequential message display

**Table Animations:**
- Stagger animation for table rows (50ms delay per row)
- Fade in + slide from left for row entries
- Smooth transitions on data updates

**Performance Optimizations:**
- useTransform for declarative animations
- Layout animations with layoutId
- Animation variants for reusability

### 6. Performance

**Code Splitting:**
- Lazy loading for chart components (VotesBarChart, RegionPieChart, StatsCards)
- React.lazy() with Suspense boundaries
- Loading fallback components for better UX

**Optimization Techniques:**
- Memoization with useMemo for expensive computations
- Debounced search inputs (300ms delay)
- Efficient re-renders with React.memo where appropriate
- Virtual scrolling for large data sets (if needed)

**Bundle Optimization:**
- Tree-shaking with ES modules
- Dynamic imports for route-based code splitting
- Minimized bundle size with Vite optimizations
- CSS code splitting by component

**Caching Strategy:**
- TanStack Query cache with configurable stale time
- 30-second background refetch interval
- Cache invalidation on mutations
- Optimistic updates for instant feedback

### 7. Accessibility

**Keyboard Navigation:**
- All interactive elements keyboard accessible
- Logical tab order throughout the application
- Focus indicators on all focusable elements
- Escape key support for modals and dropdowns

**ARIA Attributes:**
- Proper ARIA labels on all form inputs
- ARIA live regions for dynamic content updates
- ARIA descriptions for complex interactions
- Role attributes for semantic HTML enhancement

**Screen Reader Support:**
- Descriptive alt text for all images
- Semantic HTML structure (header, main, footer, nav)
- Form labels associated with inputs
- Status messages announced to screen readers

**Color Contrast:**
- WCAG 2.1 AA compliant color contrast ratios
- Both light and dark themes meet accessibility standards
- Focus indicators visible in all themes
- Text readable at all zoom levels

**Other Features:**
- Error messages associated with form fields
- Loading states announced to assistive technologies
- Reduced motion support for accessibility preferences

### 8. Real-time Updates

**Automatic Refetching:**
- Background refetch every 30 seconds for top countries
- Stale-while-revalidate pattern for better UX
- Automatic retry on network failures

**Manual Refresh:**
- Trigger-based refresh after successful vote submission
- Query invalidation for immediate data updates
- Optimistic UI updates for instant feedback

**Cache Strategy:**
- Smart cache invalidation
- Configurable stale time for different queries
- Garbage collection for unused cache entries

### 9. Error Handling

**Error Boundary:**
- Global error boundary wraps entire application
- Catches React component errors gracefully
- Provides fallback UI with reload option
- Shows detailed error info in development mode only

**API Error Handling:**
- Axios interceptors for centralized error handling
- User-friendly error messages
- Retry logic for transient failures
- Network error detection and messaging

**Form Validation:**
- Client-side validation with Zod schemas
- Real-time validation feedback
- Field-level error messages
- Server-side validation error handling

## Testing

### Test Infrastructure

**Framework:**
- Vitest for fast unit and integration testing
- React Testing Library for component testing
- jsdom for DOM simulation
- User Event library for realistic user interactions

**Configuration:**
- Global test utilities setup in `/tests/setup.ts`
- Mocked window.matchMedia for theme tests
- Mocked IntersectionObserver for lazy loading tests
- Automatic cleanup after each test

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

**Unit Tests:**
- `ErrorBoundary.test.tsx`: Error catching, fallback UI, reload functionality
- `ThemeContext.test.tsx`: System preference detection, theme toggling, localStorage persistence
- `VoteForm.test.tsx`: Form validation, submission, error handling

**Integration Tests:**
- End-to-end workflows (voting, search, filtering)
- API integration testing
- Context provider integration

### Writing Tests

**Best Practices:**
- Test user behavior, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Mock external dependencies (API calls, localStorage)
- Test accessibility features
- Maintain high code coverage (>80%)

**Example Test:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('toggles theme from light to dark', async () => {
  const user = userEvent.setup();
  render(<ThemeProvider><App /></ThemeProvider>);

  const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
  await user.click(toggleButton);

  expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
});
```

## API Integration

### Endpoints Used

**Votes API:**
- `POST /votes` - Submit a new vote
- `GET /votes/top-countries/:limit` - Get top countries by votes
- `GET /votes/statistics` - Get vote statistics

**Countries API:**
- `GET /countries/search?query=` - Search countries by name

**Health API:**
- `GET /health` - Check backend health status

### API Client Configuration

The API client is configured in `/src/services/api.ts`:
- Base URL from environment variable
- Request/response interceptors
- Error handling middleware
- TypeScript types for all responses

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Guidelines

### Code Style

- Follow ESLint configuration
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use const for immutable values
- Destructure props in component parameters

### Component Guidelines

- Keep components small and focused (< 200 lines)
- Extract reusable logic into custom hooks
- Use proper TypeScript types (avoid `any`)
- Add prop-types or TypeScript interfaces
- Include comments for complex logic

### CSS Guidelines

- Use CSS modules or component-scoped CSS
- Leverage CSS variables for theming
- Mobile-first responsive design
- Avoid inline styles (use CSS classes)
- Maintain consistent spacing and naming

### Git Workflow

- Create feature branches from `develop`
- Write meaningful commit messages
- Run tests before committing
- Keep commits focused and atomic
- Use pull requests for code review

## Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or change port in vite.config.ts
```

**API Connection Error:**
- Check `.env` file has correct `VITE_API_URL`
- Ensure backend is running on the specified port
- Check for CORS issues in browser console

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Tests Failing:**
```bash
# Clear test cache
npm test -- --clearCache
# Run tests with verbose output
npm test -- --verbose
```

## Performance Metrics

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Score:** > 90
- **Bundle Size:** < 500KB (gzipped)

## Future Enhancements

- [ ] Add more language support (French, German, etc.)
- [ ] Implement infinite scroll for countries table
- [ ] Add export functionality for statistics
- [ ] Enhanced analytics and metrics tracking
- [ ] Progressive Web App (PWA) support
- [ ] Server-Side Rendering (SSR) with Next.js
- [ ] Advanced filtering and sorting options
- [ ] User authentication and profiles
- [ ] Real-time updates with WebSockets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the CountryVote platform.

## Support

For issues, questions, or contributions, please open an issue in the repository.
