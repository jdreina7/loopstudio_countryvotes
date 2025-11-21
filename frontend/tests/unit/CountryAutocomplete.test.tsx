import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CountryAutocomplete } from '../../src/components/CountryAutocomplete';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { countriesApi } from '../../src/services/api';
import type { Country } from '../../src/types';

// Mock the API
vi.mock('../../src/services/api', () => ({
  countriesApi: {
    searchCountries: vi.fn(),
  },
}));

const mockCountries: Country[] = [
  {
    code: 'COL',
    name: 'Colombia',
    flag: '🇨🇴',
    region: 'Americas',
    capital: 'Bogotá',
    voteCount: 10,
  },
  {
    code: 'CAN',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    capital: 'Ottawa',
    voteCount: 5,
  },
];

describe('CountryAutocomplete', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (value = '', error?: string) => {
    return render(
      <LanguageProvider>
        <CountryAutocomplete value={value} onChange={mockOnChange} error={error} />
      </LanguageProvider>
    );
  };

  it('renders input with correct role and attributes', () => {
    renderComponent();
    const input = screen.getByRole('combobox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-controls', 'suggestions-list');
  });

  it('renders with placeholder from translation', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('País')).toBeInTheDocument();
  });

  it('calls onChange when user types', () => {
    renderComponent();
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'Col' } });

    expect(mockOnChange).toHaveBeenCalledWith('Col', '', '');
  });

  it('displays suggestions when search returns results', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      expect(screen.getByText('Colombia')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('displays country regions in suggestions', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      const regions = screen.getAllByText('Americas');
      expect(regions.length).toBeGreaterThan(0);
    }, { timeout: 1000 });
  });

  it('calls onChange with country details when suggestion is clicked', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      expect(screen.getByText('Colombia')).toBeInTheDocument();
    }, { timeout: 1000 });

    fireEvent.click(screen.getByText('Colombia'));

    expect(mockOnChange).toHaveBeenCalledWith('Colombia', 'COL', '🇨🇴');
  });

  it('displays no results message when search returns empty array', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue([]);

    renderComponent('XYZ');

    await waitFor(() => {
      expect(screen.getByText('No se encontraron países')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(countriesApi.searchCountries).mockRejectedValue(new Error('API Error'));

    renderComponent('Col');

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching countries:', expect.any(Error));
    }, { timeout: 1000 });

    consoleErrorSpy.mockRestore();
  });

  it('ignores AbortError when request is cancelled', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const abortError = new Error('AbortError');
    abortError.name = 'AbortError';

    vi.mocked(countriesApi.searchCountries).mockRejectedValue(abortError);

    renderComponent('Col');

    await waitFor(() => {
      expect(countriesApi.searchCountries).toHaveBeenCalled();
    }, { timeout: 1000 });

    // Should not log AbortError
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('closes suggestions when clicking outside', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      expect(screen.getByText('Colombia')).toBeInTheDocument();
    }, { timeout: 1000 });

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Colombia')).not.toBeInTheDocument();
    });
  });

  it('navigates suggestions with ArrowDown key', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      expect(screen.getByText('Colombia')).toBeInTheDocument();
    }, { timeout: 1000 });

    const input = screen.getByRole('combobox');

    // Press ArrowDown
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // First item should be selected
    const firstItem = screen.getByText('Colombia').closest('li');
    expect(firstItem).toHaveClass('selected');
  });

  it('selects suggestion with Enter key', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      expect(screen.getByText('Colombia')).toBeInTheDocument();
    }, { timeout: 1000 });

    const input = screen.getByRole('combobox');

    // Navigate to first item
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Select with Enter
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnChange).toHaveBeenCalledWith('Colombia', 'COL', '🇨🇴');
  });

  it('closes suggestions with Escape key', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      expect(screen.getByText('Colombia')).toBeInTheDocument();
    }, { timeout: 1000 });

    const input = screen.getByRole('combobox');

    fireEvent.keyDown(input, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Colombia')).not.toBeInTheDocument();
    });
  });

  it('does not navigate when suggestions are not visible', () => {
    renderComponent('C');
    const input = screen.getByRole('combobox');

    // Try to navigate when no suggestions
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Should not throw error
    expect(input).toBeInTheDocument();
  });

  it('updates aria-expanded when suggestions are shown', async () => {
    vi.mocked(countriesApi.searchCountries).mockResolvedValue(mockCountries);

    renderComponent('Col');

    await waitFor(() => {
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-expanded', 'true');
    }, { timeout: 1000 });
  });
});
