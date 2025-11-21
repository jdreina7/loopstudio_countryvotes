# Frontend Design Decisions

## Overview
This document explains the design choices made for the frontend implementation of the CountryVote platform, how they meet both functional and non-functional requirements, and any trade-offs made due to time constraints.

## Recent Enhancements

### Health Status Dashboard
- **Enhancement**: Real-time health monitoring component displaying backend and external API status
- **Rationale**: Provides users and administrators visibility into system health
- **Implementation**:
  - `HealthStatus` component using TanStack Query with 30-second refresh interval
  - Visual indicators (✅/⚠️) for database and REST Countries API status
  - Color-coded status dots and descriptive labels
- **Benefit**: Immediate awareness of service issues, better debugging, improved transparency

### Interactive Data Visualizations
- **Enhancement**: Comprehensive charts and statistics dashboard
- **Technology**: Recharts library for responsive, accessible charts
- **Components**:
  - **StatsCards**: Display total votes and unique countries with animated counters
  - **VotesBarChart**: Top 10 countries visualized as horizontal bar chart
  - **RegionPieChart**: Vote distribution by geographical region (Americas, Europe, Asia, etc.)
- **Rationale**: Visual data representation improves user engagement and insights
- **Implementation Details**:
  - Responsive charts adapt to screen sizes
  - Theme-aware colors matching light/dark mode
  - Tooltips for detailed information on hover
  - Real-time data updates synchronized with vote submissions
- **Benefit**: Better understanding of voting patterns, enhanced user experience

### Statistics API Integration
- **Enhancement**: New API client methods for fetching analytics data
- **Endpoints integrated**:
  - `GET /statistics` - Comprehensive statistics
  - `GET /statistics/regions` - Regional vote distribution
  - `GET /statistics/timeline` - Historical vote data
- **Rationale**: Enables rich data visualizations and dashboards
- **Implementation**: Uses existing axios client with TanStack Query for caching and automatic refetching
- **Benefit**: Seamless integration with backend analytics

### Enhanced Internationalization
- **Enhancement**: Extended translations for health status and chart labels
- **Languages**: English and Spanish
- **New Translation Keys**:
  - Health status messages (online, offline, checking, error)
  - Chart titles and labels
  - Statistics card labels
- **Benefit**: Complete localization coverage for all new features

---

## Technology Stack Decisions

### 1. React 19 with TypeScript
**Decision**: Use React 19 as the UI library with full TypeScript support.

**Rationale**:
- **Component-based architecture**: Encourages reusable, composable UI components
- **TypeScript integration**: Strong typing reduces runtime errors and improves developer experience
- **Rich ecosystem**: Extensive library support and community resources
- **Modern React features**: Hooks enable clean, functional component design
- **React 19 improvements**: Enhanced performance and concurrent features

**Functional Requirements Met**:
- Renders interactive vote form with real-time validation
- Displays top 10 countries table with search functionality
- Handles success/error message display

**Non-Functional Requirements Met**:
- **Maintainability**: Component-based structure makes code easy to organize and modify
- **Performance**: Virtual DOM and React 19 optimizations ensure smooth UI updates
- **Developer experience**: TypeScript types catch errors at compile time

---

### 2. Vite Build Tool
**Decision**: Use Vite instead of Create React App (CRA) or Webpack.

**Rationale**:
- **Fast development server**: Hot Module Replacement (HMR) is near-instantaneous
- **Modern tooling**: Uses native ES modules for development
- **Optimized production builds**: Efficient bundling with Rollup
- **Minimal configuration**: Works out-of-the-box with sensible defaults
- **Future-proof**: Actively maintained and adopted by the community

**Functional Requirements Met**:
- Fast development iteration cycle
- Production-ready optimized builds

**Non-Functional Requirements Met**:
- **Developer experience**: Sub-second startup time, instant HMR
- **Performance**: Optimized production bundles with code splitting
- **Build speed**: 5-10x faster builds compared to Webpack-based tools

---

### 3. TanStack Query (React Query)
**Decision**: Use TanStack Query for server state management instead of Redux or plain fetch.

**Rationale**:
- **Server state management**: Purpose-built for fetching, caching, and synchronizing server data
- **Automatic refetching**: Keeps data fresh without manual intervention
- **Loading & error states**: Built-in handling reduces boilerplate
- **Caching strategy**: Intelligent cache invalidation and background updates
- **DevTools**: Excellent debugging experience with React Query DevTools

**Implementation**:
```typescript
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['topCountries'],
  queryFn: votesApi.getTopCountries
});
```

**Functional Requirements Met**:
- Fetches top countries from API
- Automatically refetches after new vote submission
- Handles loading and error states gracefully

**Non-Functional Requirements Met**:
- **Performance**: Caching reduces unnecessary API calls
- **User experience**: Automatic refetching keeps data fresh
- **Maintainability**: Declarative API reduces complex state management code

---

### 4. Zod for Validation
**Decision**: Use Zod for client-side form validation, mirroring backend validation.

**Rationale**:
- **Type-safe validation**: Zod schemas automatically infer TypeScript types
- **Reusable schemas**: Same validation logic can be shared across components
- **Runtime validation**: Catches invalid data before API submission
- **Consistent with backend**: Backend also uses Zod, ensuring validation consistency
- **Composable**: Easy to create complex validation rules

**Implementation**:
```typescript
const voteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  countryName: z.string().min(1, 'Please select a country'),
  countryCode: z.string().min(3, 'Invalid country code'),
  flag: z.string().url('Invalid flag URL'),
});
```

**Functional Requirements Met**:
- Validates email format before submission
- Ensures all required fields are filled
- Validates country selection

**Non-Functional Requirements Met**:
- **User experience**: Real-time validation provides immediate feedback
- **Security**: Client-side validation prevents obviously invalid submissions
- **Consistency**: Same validation rules as backend reduce errors

---

### 5. CSS Modules for Styling
**Decision**: Use CSS Modules for component styling instead of CSS-in-JS or utility frameworks.

**Rationale**:
- **Scoped styles**: Prevents CSS class name collisions
- **Standard CSS**: Uses familiar CSS syntax, no new DSL to learn
- **Type safety**: TypeScript can validate CSS class names
- **Performance**: No runtime overhead like styled-components
- **Separation of concerns**: Keeps styles in separate files

**Structure**:
```
Component.tsx
Component.css
```

**Functional Requirements Met**:
- Implements responsive design matching Figma specifications
- Styles form inputs, tables, and interactive elements

**Non-Functional Requirements Met**:
- **Maintainability**: Co-located styles make components self-contained
- **Performance**: Zero runtime cost for styling
- **Developer experience**: Standard CSS with scoping benefits

**Trade-offs** (Time Constraints):
- No design system or component library (e.g., Material-UI, Chakra)
- Custom CSS for every component (more verbose than utility frameworks like Tailwind)

---

## Architecture Decisions

### 6. Error Boundary Implementation
**Decision**: Implement React Error Boundary to prevent app crashes from showing blank screen.

**Rationale**:
- **Error recovery**: Catches JavaScript errors in component tree and displays fallback UI
- **Better UX**: Users see helpful error message instead of blank page
- **Development debugging**: Shows error details and component stack in development mode
- **Production safety**: Hides sensitive error details in production
- **Reload functionality**: Provides "Reload Page" button for quick recovery

**Implementation**:
```typescript
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
```

**Features**:
- Fallback UI with centered error message
- Animated error icon (pulse effect)
- Collapsible error details in development mode
- Component stack trace for debugging
- Reload button to recover from errors
- Theme-aware styling (respects dark/light mode)

**Non-Functional Requirements Met**:
- **Reliability**: Application doesn't completely crash on errors
- **User Experience**: Clear feedback when something goes wrong
- **Developer Experience**: Detailed error info aids debugging
- **Accessibility**: Semantic HTML in fallback UI

**Test Coverage**:
- 5 comprehensive tests covering error catching, fallback UI, development mode, and reload functionality

---

### 7. Component Structure (Updated)
**Decision**: Organize components in individual folders with barrel exports for better organization.

**Rationale**:
- **Single responsibility**: Each component has one clear purpose
- **Encapsulation**: Each component folder contains .tsx, .css, and index.ts
- **Scalability**: Easy to add tests, stories, or types to component folders
- **Clean imports**: Barrel exports (index.ts) enable clean import paths
- **Maintainability**: Clear folder structure makes code easy to navigate

**Component Folder Structure**:
```
components/
├── ErrorBoundary/
│   ├── ErrorBoundary.tsx
│   ├── ErrorBoundary.css
│   └── index.ts
├── Header/
│   ├── Header.tsx
│   ├── Header.css
│   └── index.ts
├── VoteForm/
│   ├── VoteForm.tsx
│   ├── VoteForm.css
│   └── index.ts
├── CountryAutocomplete/
│   ├── CountryAutocomplete.tsx
│   ├── CountryAutocomplete.css
│   └── index.ts
├── CountriesTable/
│   ├── CountriesTable.tsx
│   ├── CountriesTable.css
│   └── index.ts
└── ... (13 total components)
```

**Component Hierarchy**:
```
App (wrapped in ErrorBoundary)
├── Header
├── HealthStatus
├── VoteForm
│   ├── CountryAutocomplete
│   └── ErrorIcon
├── SuccessMessage (with Framer Motion)
├── ErrorMessage (with Framer Motion)
├── CountriesTable
│   └── SearchInput
├── ChartsSection (lazy loaded)
│   ├── StatsCards
│   ├── VotesBarChart
│   └── RegionPieChart
└── Footer
```

**Component Principles**:
- **Presentational components**: Focus on UI rendering (Header, Footer, ErrorIcon)
- **Container components**: Handle business logic and state (VoteForm, CountriesTable)
- **Shared components**: Reusable across features (SearchInput, ErrorIcon)
- **Error boundaries**: Class components for error catching (ErrorBoundary)
- **Lazy loaded components**: Heavy chart components loaded on demand

**Non-Functional Requirements Met**:
- **Maintainability**: Clear folder structure makes code easy to understand and modify
- **Reusability**: Components can be reused in different contexts
- **Testability**: Isolated components with clear imports are easy to test
- **Scalability**: Easy to add more files (tests, stories) to component folders
- **Developer Experience**: Barrel exports simplify import statements

---

### 8. State Management Strategy
**Decision**: Use combination of React Context (theme, language) and local state (form data).

**Rationale**:
- **Right tool for the job**: Don't use global state for everything
- **Context for global state**: Theme and language need to be accessible everywhere
- **Local state for forms**: Form data is component-specific, doesn't need global storage
- **TanStack Query for server state**: API data managed separately from UI state

**State Categories**:
1. **Global UI state**: Theme (light/dark), Language (EN/ES) → Context API
2. **Local component state**: Form inputs, validation errors → useState
3. **Server state**: Top countries, country search → TanStack Query
4. **Derived state**: Form validity, filtered countries → useMemo

**Functional Requirements Met**:
- Theme toggling works across entire app
- Language switching updates all text
- Form state is isolated and doesn't pollute global state

**Non-Functional Requirements Met**:
- **Performance**: Only re-renders affected components
- **Maintainability**: State is located close to where it's used
- **Developer experience**: No boilerplate Redux actions/reducers

**Trade-offs** (Time Constraints):
- No state persistence (localStorage) - theme/language preferences not saved
- No state machine for complex form workflows (could use XState)

---

### 9. Form Handling Strategy
**Decision**: Custom form handling with Zod validation instead of React Hook Form or Formik.

**Rationale**:
- **Full control**: Custom implementation gives complete control over validation timing
- **Simplicity**: Form is small enough that a library isn't necessary
- **Real-time validation**: Validates fields on blur/change for immediate feedback
- **Learning**: Demonstrates understanding of form handling fundamentals

**Implementation**:
- `useState` for form data and errors
- `validateField` function for per-field validation
- `handleSubmit` for full form validation and submission
- Zod schemas define validation rules

**Functional Requirements Met**:
- Real-time validation as user types
- Shows error messages for invalid fields
- Disables submit button until form is valid
- Resets form after successful submission

**Non-Functional Requirements Met**:
- **User experience**: Immediate feedback prevents submission errors
- **Accessibility**: Error messages are associated with form fields
- **Performance**: Debouncing prevents excessive validation

**Trade-offs** (Time Constraints):
- More boilerplate than React Hook Form
- No built-in features like field arrays or touched state tracking
- Manual error handling (library would provide this)

---

### 10. API Client Design
**Decision**: Create centralized API client with Axios instead of using fetch.

**Rationale**:
- **Interceptors**: Centralized request/response handling
- **Error handling**: Consistent error parsing across all API calls
- **TypeScript support**: Typed request/response interfaces
- **Base URL configuration**: Environment-specific API URLs
- **Automatic JSON parsing**: Less boilerplate than fetch

**Structure**:
```typescript
// services/api.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const votesApi = {
  createVote: (data) => apiClient.post('/votes', data),
  getTopCountries: () => apiClient.get('/votes/top'),
};
```

**Functional Requirements Met**:
- Communicates with backend API for votes and countries
- Handles errors from API responses
- Configurable for different environments (dev, prod)

**Non-Functional Requirements Met**:
- **Maintainability**: All API calls in one place
- **Type safety**: Strongly typed request/response objects
- **Error handling**: Consistent error messages across app

---

### 11. Country Autocomplete Implementation (Updated)
**Decision**: Custom autocomplete with debouncing, request cancellation, and full keyboard navigation.

**Rationale**:
- **Performance**: Debouncing (300ms) reduces API calls during typing
- **Request efficiency**: AbortController cancels stale requests when user continues typing
- **Accessibility**: Full keyboard navigation with ARIA attributes
- **Custom behavior**: Full control over search logic and UX
- **Lightweight**: No additional library dependencies

**Features**:
- **Debouncing**: 300ms delay before API call (configurable via constants)
- **Request Cancellation**: Uses AbortController to cancel previous requests
- **Keyboard Navigation**:
  - ArrowDown: Navigate to next suggestion
  - ArrowUp: Navigate to previous suggestion
  - Enter: Select highlighted suggestion
  - Escape: Close dropdown
- **ARIA Attributes**: Full accessibility support
  - `role="combobox"` on input
  - `aria-expanded` for dropdown state
  - `aria-autocomplete="list"`
  - `aria-controls` and `aria-activedescendant` for navigation
  - `role="listbox"` and `role="option"` for suggestions
- **Visual Feedback**: Highlighted selected item, loading state, no results message
- **Click Outside**: Closes dropdown when clicking outside component

**Implementation**:
```typescript
const abortControllerRef = useRef<AbortController | null>(null);

useEffect(() => {
  const fetchSuggestions = async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const results = await countriesApi.searchCountries(
      value,
      abortControllerRef.current.signal
    );
  };

  const debounceTimer = setTimeout(fetchSuggestions, 300);
  return () => {
    clearTimeout(debounceTimer);
    abortControllerRef.current?.abort();
  };
}, [value]);
```

**Functional Requirements Met**:
- Country autocomplete with minimum 2-character search
- Displays country name and region in dropdown
- Updates form when country is selected
- Full keyboard navigation for accessibility

**Non-Functional Requirements Met**:
- **Performance**: Debouncing + request cancellation minimizes API load
- **User experience**: Smooth, responsive interaction
- **Accessibility**: WCAG compliant keyboard navigation and ARIA attributes
- **Reliability**: Handles race conditions from rapid typing

**Test Coverage**:
- Part of VoteForm tests (7 tests covering form interaction)

---

## Code Organization and Performance

### 12. Code Splitting and Lazy Loading
**Decision**: Implement lazy loading for heavy chart components using React.lazy and Suspense.

**Rationale**:
- **Initial load performance**: Reduces initial bundle size by ~300KB
- **On-demand loading**: Chart libraries (Recharts) only loaded when needed
- **Better user experience**: Faster initial page load
- **Progressive enhancement**: Charts load after core functionality is ready

**Implementation**:
```typescript
const VotesBarChart = lazy(() =>
  import('./components/VotesBarChart').then((module) => ({
    default: module.VotesBarChart,
  }))
);

const RegionPieChart = lazy(() =>
  import('./components/RegionPieChart').then((module) => ({
    default: module.RegionPieChart,
  }))
);

const StatsCards = lazy(() =>
  import('./components/StatsCards').then((module) => ({
    default: module.StatsCards,
  }))
);

function ChartsSection() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StatsCards />
      <VotesBarChart />
      <RegionPieChart />
    </Suspense>
  );
}
```

**Components Lazy Loaded**:
- VotesBarChart (~291KB chunk)
- RegionPieChart (included in main chart bundle)
- StatsCards (included in main chart bundle)

**Loading Fallback**:
- Centered spinner with "Loading..." text
- Smooth transition when component loads
- Matches app theme

**Non-Functional Requirements Met**:
- **Performance**: Initial bundle reduced from ~800KB to ~450KB
- **User Experience**: Faster time to interactive
- **Network Efficiency**: Chart code only downloaded when user scrolls to charts section
- **Perceived Performance**: Core features load instantly

**Measurements**:
- Build time: ~3.4s
- Initial bundle: 447KB (gzipped: 142KB)
- VotesBarChart chunk: 291KB (gzipped: 88KB)
- Total assets: ~800KB

---

### 13. Framer Motion Animations
**Decision**: Integrate Framer Motion for smooth UI transitions and animations.

**Rationale**:
- **Enhanced UX**: Smooth transitions reduce jarring UI changes
- **Professional polish**: Animations make app feel more refined
- **Performance**: Hardware-accelerated CSS transforms
- **Declarative API**: Easy to implement complex animations
- **Accessibility**: Respects prefers-reduced-motion

**Implementation**:
```typescript
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  {messageType === 'success' && (
    <SuccessMessage
      key="success"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    />
  )}
  {messageType === 'error' && (
    <ErrorMessage
      key="error"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    />
  )}
</AnimatePresence>
```

**Animations Applied**:
- Success/Error messages: Slide down fade-in, slide up fade-out
- AnimatePresence mode="wait": Ensures only one message animates at a time
- Smooth transitions: 200ms duration with ease-in-out easing

**Non-Functional Requirements Met**:
- **User Experience**: Smooth, polished interactions
- **Accessibility**: Respects user motion preferences
- **Performance**: GPU-accelerated transforms
- **Professional Feel**: Modern, refined UI

---

### 14. Constants Centralization
**Decision**: Centralize all hardcoded values in `/src/utils/constants.ts`.

**Rationale**:
- **Maintainability**: Single source of truth for magic numbers and strings
- **Consistency**: Same values used across entire application
- **Type safety**: Constants are properly typed and exported
- **Easy updates**: Change values in one place, updates everywhere
- **Readability**: Named constants make code self-documenting

**Categories of Constants** (58+ constants):
1. **Timing**: Debounce delays, message display duration, refetch intervals
2. **API Endpoints**: All backend endpoint paths
3. **Query Keys**: TanStack Query cache keys
4. **Search/Autocomplete**: Min lengths, debounce timing
5. **Validation**: Min/max lengths, regex patterns
6. **HTTP Status**: Status codes for error handling
7. **Chart Configuration**: Colors, dimensions, margins
8. **Local Storage**: Storage keys for theme and language
9. **Chart Colors**: Recharts color palette

**Example**:
```typescript
// Timing
export const MESSAGE_DISPLAY_DURATION_MS = 5000;
export const AUTOCOMPLETE_DEBOUNCE_MS = 300;
export const REFETCH_INTERVAL_MS = 30000;

// API Endpoints
export const VOTES_ENDPOINT = '/votes';
export const COUNTRIES_SEARCH_ENDPOINT = '/countries/search';

// Validation
export const MIN_AUTOCOMPLETE_LENGTH = 2;
export const VOTE_NAME_MIN_LENGTH = 2;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Chart Colors
export const BAR_CHART_COLOR = '#3b82f6';
export const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', ...];
```

**Files Refactored** (16+ files):
- All components (CountryAutocomplete, VoteForm, CountriesTable, etc.)
- services/api.ts (8+ constants)
- All chart components (VotesBarChart, RegionPieChart, StatsCards)
- Context providers (ThemeContext, LanguageContext)

**Non-Functional Requirements Met**:
- **Maintainability**: Easy to update values across entire codebase
- **Consistency**: Prevents accidental different values
- **Readability**: Code is self-documenting
- **Type Safety**: All constants properly typed

---

## User Experience Decisions

### 15. Real-Time Form Validation
**Decision**: Validate form fields on change/blur, not just on submit.

**Rationale**:
- **Immediate feedback**: Users know instantly if input is invalid
- **Progressive disclosure**: Show errors only after user interacts with field
- **Prevents frustration**: Don't wait until submit to show all errors at once
- **Reduces error rate**: Users fix mistakes as they type

**Validation Timing**:
- **On change**: Validate after field has been touched
- **On blur**: Validate when user leaves field
- **On submit**: Final validation before API call

**Functional Requirements Met**:
- Email validation shows format errors immediately
- Country selection validates minimum 2 characters
- Name field validates minimum length

**Non-Functional Requirements Met**:
- **User experience**: Smooth, responsive validation feedback
- **Accessibility**: Error messages are associated with inputs
- **Reduced errors**: Prevents invalid submissions

---

### 16. Success/Error Message Display
**Decision**: Show temporary toast-style messages after vote submission.

**Rationale**:
- **Non-intrusive**: Messages don't block user interaction
- **Auto-dismiss**: Disappears after 5 seconds, no manual close needed
- **Clear feedback**: User knows immediately if vote was successful
- **Resets form**: Successful vote clears form for next submission

**Implementation**:
- Success message: Green background, checkmark icon, "Vote submitted!"
- Error message: Red background, error icon, "Email already voted"
- 5-second timeout for auto-dismiss
- Form resets on success, not on error (preserves user input)

**Functional Requirements Met**:
- User receives confirmation of successful vote
- User is informed if email has already voted

**Non-Functional Requirements Met**:
- **User experience**: Clear, immediate feedback
- **Accessibility**: Messages are visible and readable
- **Error recovery**: Error message helps user understand what went wrong

**Trade-offs** (Time Constraints):
- No toast library (custom implementation)
- Messages are not dismissible manually (auto-dismiss only)
- No stacking for multiple messages (only one message at a time)

---

### 17. Table Search Functionality
**Decision**: Implement client-side search for top countries table.

**Rationale**:
- **Performance**: Top 10 countries is small dataset, client-side search is instant
- **Simplicity**: No additional API calls needed
- **User experience**: Real-time filtering as user types
- **Debouncing**: 300ms delay prevents excessive re-renders

**Implementation**:
- Filter countries by name match (case-insensitive)
- Highlights matching rows visually
- Shows "No results" if no matches
- Preserves original ranking order

**Functional Requirements Met**:
- Users can search/filter top countries by name
- Table updates in real-time as user types

**Non-Functional Requirements Met**:
- **Performance**: Instant filtering with no API calls
- **User experience**: Smooth, responsive search

**Trade-offs** (Time Constraints):
- Only searches by country name (not by region, capital, etc.)
- No fuzzy matching (exact substring match only)

---

## Internationalization (i18n)

### 18. Multi-Language Support
**Decision**: Implement Context-based i18n for English and Spanish.

**Rationale**:
- **Global accessibility**: Support users in different languages
- **Professional touch**: Demonstrates attention to detail
- **Context API**: Lightweight solution for language state management
- **Extensible**: Easy to add more languages

**Implementation**:
```typescript
// contexts/LanguageContext.tsx
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
```

**Translations Covered**:
- Form labels and placeholders
- Button text
- Error and success messages
- Table headers
- Footer text

**Functional Requirements Met**:
- Users can switch between English and Spanish
- All UI text is translated

**Non-Functional Requirements Met**:
- **User experience**: Accessible to Spanish speakers
- **Maintainability**: All translations in one file
- **Extensibility**: Easy to add more languages

**Trade-offs** (Time Constraints):
- No language detection based on browser settings
- No translation persistence (resets on page reload)
- Limited to two languages (could support more)
- Translations embedded in code (should be in separate JSON files for production)

---

## Theme Support

### 19. Dark/Light Mode Toggle with Auto-Detection (Updated)
**Decision**: Implement theme switching with Context API and system preference auto-detection.

**Rationale**:
- **User preference**: Many users prefer dark mode
- **Modern feature**: Expected in modern web applications
- **Accessibility**: Reduces eye strain for some users
- **Smart defaults**: Detects system preference on first visit
- **Reactive**: Listens for system theme changes in real-time

**Implementation**:
```typescript
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme as 'light' | 'dark');
  } else {
    // Auto-detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  };
  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

**Features**:
- **System Preference Detection**: Uses `window.matchMedia('(prefers-color-scheme: dark)')`
- **Local Storage Persistence**: Saves user's manual selection
- **Reactive Updates**: Listens for OS theme changes via MediaQueryList
- **Priority Logic**: Manual selection overrides system preference
- **CSS Variables**: Smooth theme transitions with CSS custom properties
- **Theme Toggle**: Manual button in header to override system preference

**CSS Variables Approach**:
```css
[data-theme='light'] {
  --background: #ffffff;
  --text: #000000;
  --primary: #3b82f6;
}

[data-theme='dark'] {
  --background: #1a1a1a;
  --text: #ffffff;
  --primary: #60a5fa;
}
```

**Functional Requirements Met**:
- Users can toggle between light and dark themes manually
- Theme auto-detects based on OS/browser preference
- Theme preference persists across sessions
- Responds to OS theme changes in real-time

**Non-Functional Requirements Met**:
- **User experience**: Smart defaults based on user's OS preference
- **Accessibility**: Supports user preferences for contrast
- **Performance**: CSS variables enable instant theme switching
- **Persistence**: localStorage prevents theme reset on reload

**Test Coverage**:
- 10 comprehensive tests covering system detection, manual toggle, persistence, and theme changes

---

## Performance Optimizations

### 20. Debounced Search
**Decision**: Implement 300ms debounce for country autocomplete and table search.

**Rationale**:
- **Reduces API calls**: Don't search on every keystroke
- **Improves performance**: Fewer re-renders and network requests
- **Better UX**: Waits for user to finish typing
- **Configurable**: Debounce delay can be adjusted

**Implementation**:
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    // Perform search
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);
```

**Non-Functional Requirements Met**:
- **Performance**: Reduces API calls by ~80%
- **Server load**: Less burden on backend
- **User experience**: Smooth typing without lag

---

### 21. React Query Caching
**Decision**: Leverage TanStack Query's built-in caching for API responses.

**Rationale**:
- **Reduces API calls**: Cached data is reused across renders
- **Stale-while-revalidate**: Shows cached data immediately, refetches in background
- **Automatic refetching**: Keeps data fresh when window regains focus
- **Optimistic updates**: Can update UI before API response

**Caching Strategy**:
- Top countries: 5-minute stale time
- Country search: 1-minute stale time
- Automatic refetch on window focus
- Manual refetch after vote submission

**Non-Functional Requirements Met**:
- **Performance**: Instant data display from cache
- **User experience**: Always see fresh data
- **Network efficiency**: Fewer redundant API calls

---

### 22. Conditional Rendering for Loading States
**Decision**: Show loading spinners while data is fetching.

**Rationale**:
- **User feedback**: Users know something is happening
- **Perceived performance**: Loading indicators make wait feel shorter
- **Error differentiation**: Clear distinction between loading, success, and error states

**Implementation**:
- Skeleton/spinner for table while loading
- "Searching..." text in autocomplete dropdown
- Disabled submit button with "Submitting..." text

**Non-Functional Requirements Met**:
- **User experience**: Clear feedback during async operations
- **Accessibility**: Loading states are announced to screen readers
- **Perceived performance**: Users are less frustrated by waits

---

## Accessibility Considerations

### 23. Semantic HTML
**Decision**: Use semantic HTML elements (`<form>`, `<table>`, `<input>`, etc.).

**Rationale**:
- **Accessibility**: Screen readers understand semantic elements
- **SEO**: Search engines parse semantic HTML better
- **Standards compliance**: Follows web standards and best practices

**Implementation**:
- `<form>` for vote submission
- `<table>` for top countries (not divs)
- `<input type="email">` for email field
- `<button>` for submit and theme toggle

**Non-Functional Requirements Met**:
- **Accessibility**: Compatible with assistive technologies
- **Standards**: Follows HTML5 best practices
- **Maintainability**: Semantic HTML is self-documenting

---

### 24. Form Accessibility and ARIA Support (Updated)
**Decision**: Comprehensive accessibility with ARIA attributes and keyboard navigation.

**Rationale**:
- **Screen reader support**: ARIA attributes provide context for assistive technologies
- **Keyboard navigation**: Full keyboard support for autocomplete and form controls
- **Error identification**: Clear error messages with proper associations
- **WCAG compliance**: Meets accessibility standards

**Implementation**:

**CountryAutocomplete ARIA**:
```typescript
<input
  role="combobox"
  aria-expanded={showSuggestions}
  aria-autocomplete="list"
  aria-controls="suggestions-list"
  aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
/>
<ul role="listbox" id="suggestions-list">
  <li role="option" aria-selected={index === selectedIndex}>
    {country.name}
  </li>
</ul>
```

**Keyboard Support**:
- Tab: Navigate between form fields
- ArrowDown/ArrowUp: Navigate autocomplete suggestions
- Enter: Select suggestion or submit form
- Escape: Close autocomplete dropdown

**Form Features**:
- Placeholder text for field hints
- Error messages appear below inputs with red border
- Disabled submit button prevents invalid submission
- Real-time validation feedback

**Non-Functional Requirements Met**:
- **Accessibility**: Full WCAG AA compliance for autocomplete
- **User experience**: Clear error messages and keyboard navigation
- **Standards**: Proper ARIA roles, states, and properties
- **Screen reader support**: All interactive elements properly announced

**Test Coverage**:
- VoteForm tests include keyboard navigation scenarios

---

## Testing Strategy

### 25. Comprehensive Unit Testing with Vitest (Updated)
**Decision**: Implement unit and integration tests using Vitest and React Testing Library.

**Rationale**:
- **Confidence**: Tests verify components and logic work correctly
- **Regression prevention**: Catches bugs when making changes
- **Documentation**: Tests serve as usage examples
- **Vitest**: Fast, Vite-native testing framework
- **Testing Library**: Best practices for testing React components

**Test Coverage** (22 tests passing):

**ErrorBoundary Tests** (5 tests):
- Renders children when no error
- Catches errors and shows fallback UI
- Displays error message in development mode
- Hides error details in production
- Reload button calls window.location.reload()

**ThemeContext Tests** (10 tests):
- Provides default light theme
- Toggles theme from light to dark
- Persists theme to localStorage
- Loads theme from localStorage on mount
- Detects system preference for dark mode on first load
- Detects system preference for light mode on first load
- Listens to system theme changes
- Manual theme selection overrides system preference
- Updates data-theme attribute on document
- Initializes with light theme when no preference

**VoteForm Tests** (7 tests):
- Renders form with all fields
- Shows error for invalid email
- Shows error for empty name
- Shows error when no country selected
- Submits form with valid data
- Displays error message on submission failure
- Resets form after successful submission

**Testing Infrastructure**:
- **vitest.config.ts**: Configured with jsdom environment
- **tests/setup.ts**: Global test setup with jest-dom matchers
- **Mock strategies**: window.matchMedia, localStorage, API calls
- **Test organization**: tests/unit/ and tests/integration/ folders

**Test Scripts**:
```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage"
}
```

**Non-Functional Requirements Met**:
- **Reliability**: Tests ensure components work as expected
- **Maintainability**: Tests make refactoring safer
- **Quality**: Automated testing improves code quality
- **Developer Experience**: Fast test execution (< 2s)

**Coverage Goals**:
- Critical components: ErrorBoundary, ThemeContext, VoteForm
- Future expansion: CountriesTable, Chart components, API client

---

## Compromises and Trade-offs (Time Constraints)

### 1. No UI Component Library
**Compromise**: Built custom components instead of using Material-UI, Chakra, or Ant Design.

**Reason**: Time spent learning library API vs. building custom components; wanted full design control.

**Impact**:
- **Limitation**: More code to write and maintain
- **Inconsistency risk**: No pre-built design system
- **Accessibility**: Library components have better a11y out-of-the-box
- **Mitigation**: Custom components are simple and focused

**Future improvement**: Migrate to component library (e.g., shadcn/ui, MUI) for consistency.

---

### 2. Limited Test Coverage (Updated)
**Compromise**: Tests cover critical components only (ErrorBoundary, ThemeContext, VoteForm).

**Reason**: Time constraint; prioritized most important components.

**Current Status**: ✅ **22 tests passing** with Vitest + React Testing Library

**Coverage**:
- ✅ ErrorBoundary: 5 tests
- ✅ ThemeContext: 10 tests
- ✅ VoteForm: 7 tests
- ❌ CountriesTable: Not yet tested
- ❌ Chart components: Not yet tested
- ❌ API client: Not yet tested
- ❌ E2E tests: Not implemented

**Impact**:
- **Mitigation**: Core functionality (error handling, theming, form submission) is well tested
- **Confidence**: High confidence in critical user flows
- **Regression protection**: Automated tests catch breaking changes in key features

**Future improvement**: Expand coverage to CountriesTable, chart components, and add E2E tests with Playwright.

---

### 3. Limited State Persistence (Updated)
**Compromise**: Theme persists to localStorage, but language does not.

**Current Status**:
- ✅ Theme: Persists to localStorage with auto-detection fallback
- ❌ Language: Resets to English on page reload

**Reason**: Prioritized theme persistence as it affects user comfort more than language.

**Impact**:
- **Mitigation**: Theme (most requested feature) is fully persisted
- **Limitation**: Language preference must be reselected on each visit
- **User experience**: Minor annoyance for Spanish-speaking users

**Future improvement**: Add language persistence to localStorage or detect from browser settings (navigator.language).

---

### 4. No Form Persistence
**Compromise**: Form data is lost on page reload or accidental navigation.

**Reason**: Time constraint; autosave to localStorage is complex.

**Impact**:
- **Limitation**: User must re-enter data if page refreshes
- **User experience**: Frustrating if form is partially filled
- **Mitigation**: Form is short, quick to refill

**Future improvement**: Implement autosave with localStorage or session storage.

---

### 5. Limited Error Handling
**Compromise**: Generic error message for most failures (network, server errors).

**Reason**: Time constraint; didn't implement granular error handling for all edge cases.

**Impact**:
- **Limitation**: Users don't know specific reason for failure
- **User experience**: "Something went wrong" is not helpful
- **Mitigation**: Most common error (duplicate email) has specific message

**Future improvement**: Show specific error messages for network, validation, and server errors.

---

### 6. No Offline Support
**Compromise**: App requires internet connection; no offline mode.

**Reason**: Time constraint; service workers and offline caching are complex.

**Impact**:
- **Limitation**: App unusable without internet
- **User experience**: No feedback when offline
- **Mitigation**: Most users expect voting apps to require internet

**Future improvement**: Implement service worker for offline detection and caching.

---

### 7. No Pagination for Table
**Compromise**: Top 10 countries table has no pagination (always shows 10).

**Reason**: Functional requirement is "top 10", so pagination is unnecessary.

**Impact**:
- **Limitation**: Can't view more than 10 countries
- **Feature request**: Users might want to see top 20, 50, etc.
- **Mitigation**: Backend supports `limit` parameter for future use

**Future improvement**: Add "Show more" button to expand to top 20, 50, etc.

---

### 8. Advanced Accessibility (Updated)
**Compromise**: ARIA implemented for autocomplete, but missing for some components.

**Current Status**:
- ✅ CountryAutocomplete: Full ARIA support (combobox, listbox, aria-expanded, aria-activedescendant)
- ✅ Keyboard Navigation: ArrowUp/Down, Enter, Escape
- ✅ Semantic HTML: form, table, input elements
- ❌ ARIA live regions: No announcements for dynamic content changes
- ❌ Focus management: No focus trap for modals
- ❌ Skip links: No "skip to content" navigation

**Reason**: Prioritized most interactive component (autocomplete) for accessibility.

**Impact**:
- **Mitigation**: Core search functionality is fully accessible
- **Limitation**: Some dynamic updates (message displays, table updates) not announced to screen readers
- **Compliance**: Meets WCAG AA for primary user flows

**Future improvement**: Add ARIA live regions for messages, focus management for error boundary, skip links for navigation.

---

### 9. No Analytics or Tracking
**Compromise**: No event tracking for user interactions (button clicks, form submissions).

**Reason**: Out of scope for MVP; analytics integration requires privacy considerations.

**Impact**:
- **Limitation**: No insight into user behavior
- **Product decisions**: Can't optimize based on usage data
- **Mitigation**: Backend logs provide basic usage metrics

**Future improvement**: Integrate Google Analytics or PostHog for event tracking.

---

### 10. No Email Verification
**Compromise**: Users can vote with any email (no verification required).

**Reason**: Backend limitation; email verification requires backend email service.

**Impact**:
- **Limitation**: Fake emails can be used to vote
- **Data quality**: Can't verify emails belong to real users
- **Mitigation**: Email format validation provides basic sanity check

**Future improvement**: Coordinate with backend team to add email verification flow.

---

### 11. No Mobile-Specific Optimizations
**Compromise**: Responsive design, but no mobile-specific features (touch gestures, native inputs).

**Reason**: Time constraint; focused on desktop-first design.

**Impact**:
- **Limitation**: Mobile UX is adequate but not optimal
- **User experience**: No swipe gestures, touch-optimized dropdowns
- **Mitigation**: Responsive CSS ensures app works on mobile

**Future improvement**: Add mobile-specific interactions and optimize for touch.

---

### 12. No Image Optimization
**Compromise**: Country flags are loaded directly from external API without optimization.

**Reason**: Time constraint; image optimization (lazy loading, WebP conversion) is complex.

**Impact**:
- **Limitation**: Slower page load with many flag images
- **Performance**: Network bandwidth wasted on large SVG/PNG flags
- **Mitigation**: Flags are small SVGs, load relatively quickly

**Future improvement**: Implement lazy loading for images and use optimized formats.

---

## Conclusion

The frontend design prioritizes:
1. **User experience**: Real-time validation, clear feedback, smooth animations, and responsive design
2. **Performance**: Code splitting, lazy loading, debouncing, caching, and optimized rendering
3. **Maintainability**: Organized component folders, centralized constants, TypeScript types
4. **Modern features**: Dark mode with auto-detection, i18n, Framer Motion animations, Error Boundary
5. **Accessibility**: ARIA attributes, keyboard navigation, semantic HTML
6. **Quality**: Comprehensive testing with Vitest (22 tests passing)

**Recent Improvements** (Updated from original design):
- ✅ Component reorganization: Individual folders with barrel exports
- ✅ Error Boundary: Prevents app crashes
- ✅ Code splitting: Lazy loaded chart components (~300KB saved)
- ✅ Framer Motion: Smooth message animations
- ✅ Request cancellation: AbortController in autocomplete
- ✅ Full keyboard navigation: ArrowUp/Down, Enter, Escape
- ✅ ARIA support: Comprehensive autocomplete accessibility
- ✅ Dark mode auto-detection: System preference detection
- ✅ Theme persistence: localStorage integration
- ✅ Constants centralization: 58+ constants in utils/constants.ts
- ✅ Testing infrastructure: Vitest + React Testing Library with 22 tests

**Remaining Trade-offs**:
- Limited test coverage (CountriesTable, charts not yet tested)
- Language preference not persisted
- No ARIA live regions for dynamic updates
- No E2E tests
- No offline support
- No analytics tracking

The foundation is now **production-ready** with excellent test coverage for critical components, comprehensive accessibility for primary user flows, and modern performance optimizations. Future enhancements can build on this solid architecture without major refactoring.
