import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { HealthStatus } from './components/HealthStatus';
import { VoteForm } from './components/VoteForm';
import { SuccessMessage } from './components/SuccessMessage';
import { ErrorMessage } from './components/ErrorMessage';
import { CountriesTable } from './components/CountriesTable';
import { VotesBarChart } from './components/VotesBarChart';
import { RegionPieChart } from './components/RegionPieChart';
import { Footer } from './components/Footer';
import { useLanguage } from './contexts/LanguageContext';
import { MESSAGE_DISPLAY_DURATION_MS } from './utils/constants';
import './App.css';

const queryClient = new QueryClient();

type MessageType = 'success' | 'error' | null;

function ChartsSection() {
  const { t } = useLanguage();

  return (
    <div className="charts-section">
      <h2 className="charts-section-title">{t.charts.sectionTitle}</h2>
      <div className="charts-grid">
        <VotesBarChart />
        <RegionPieChart />
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
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <div className="app">
            <Header />
            <main className="main-content">
              <HealthStatus />
              {messageType === 'success' && <SuccessMessage />}
              {messageType === 'error' && <ErrorMessage />}
              <VoteForm onSuccess={handleVoteSuccess} onError={handleVoteError} />
              <CountriesTable refreshTrigger={refreshTrigger} />
              <ChartsSection />
            </main>
            <Footer />
          </div>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
