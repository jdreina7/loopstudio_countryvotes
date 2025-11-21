import { useState, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { HealthStatus } from './components/HealthStatus';
import { VoteForm } from './components/VoteForm';
import { SuccessMessage } from './components/SuccessMessage';
import { ErrorMessage } from './components/ErrorMessage';
import { CountriesTable } from './components/CountriesTable';
import { Footer } from './components/Footer';
import { useLanguage } from './contexts/LanguageContext';
import { MESSAGE_DISPLAY_DURATION_MS } from './utils/constants';
import './App.css';

// Lazy load heavy chart components
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

const queryClient = new QueryClient();

type MessageType = 'success' | 'error' | null;

const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

function ChartsSection() {
  const { t } = useLanguage();

  return (
    <div className="charts-section">
      <h2 className="charts-section-title">{t.charts.sectionTitle}</h2>
      <Suspense fallback={<LoadingFallback />}>
        <StatsCards />
      </Suspense>
      <div className="charts-grid">
        <Suspense fallback={<LoadingFallback />}>
          <VotesBarChart />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <RegionPieChart />
        </Suspense>
      </div>
    </div>
  );
}

function App() {
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVoteSuccess = () => {
    setMessageType('success');
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      setMessageType(null);
    }, MESSAGE_DISPLAY_DURATION_MS);
  };

  const handleVoteError = () => {
    setMessageType('error');

    setTimeout(() => {
      setMessageType(null);
    }, MESSAGE_DISPLAY_DURATION_MS);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <div className="app">
              <Header />
              <main className="main-content">
                <HealthStatus />
                <AnimatePresence mode="wait">
                  {messageType === 'success' && <SuccessMessage key="success" />}
                  {messageType === 'error' && <ErrorMessage key="error" />}
                </AnimatePresence>
                <VoteForm onSuccess={handleVoteSuccess} onError={handleVoteError} />
                <CountriesTable refreshTrigger={refreshTrigger} />
                <ChartsSection />
              </main>
              <Footer />
            </div>
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
