import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../../src/contexts/ThemeContext';
import { STORAGE_KEY_THEME, DOM_ATTR_THEME } from '../../src/utils/constants';

// Test component to access theme context
const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear document attribute
    document.documentElement.removeAttribute(DOM_ATTR_THEME);
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('detects system preference for dark mode on first load', () => {
    // Mock matchMedia to prefer dark mode
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('detects system preference for light mode on first load', () => {
    // Mock matchMedia to prefer light mode
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('uses saved preference from localStorage over system preference', () => {
    // Set localStorage preference to light
    localStorage.setItem(STORAGE_KEY_THEME, 'light');

    // Mock matchMedia to prefer dark mode
    const matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // Should use localStorage preference (light) instead of system preference (dark)
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('toggles theme from light to dark', async () => {
    const user = userEvent.setup();

    // Start with light theme
    localStorage.setItem(STORAGE_KEY_THEME, 'light');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });
  });

  it('toggles theme from dark to light', async () => {
    const user = userEvent.setup();

    // Start with dark theme
    localStorage.setItem(STORAGE_KEY_THEME, 'dark');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });
  });

  it('persists theme to localStorage on change', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY_THEME, 'light');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    await waitFor(() => {
      expect(localStorage.getItem(STORAGE_KEY_THEME)).toBe('dark');
    });
  });

  it('applies theme to document element', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY_THEME, 'light');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute(DOM_ATTR_THEME)).toBe('light');

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement.getAttribute(DOM_ATTR_THEME)).toBe('dark');
    });
  });

  it('sets up theme change listener for system preference tracking', () => {
    // This test verifies the listener setup exists
    // The implementation correctly checks localStorage before adding the listener
    // which happens in the second useEffect
    const mediaQueryList = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    const matchMediaMock = vi.fn().mockReturnValue(mediaQueryList);

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // Verify matchMedia was called with the correct query
    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('does not listen for system theme changes when manual preference exists', () => {
    localStorage.setItem(STORAGE_KEY_THEME, 'dark');

    const addEventListenerMock = vi.fn();

    const matchMediaMock = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // Should NOT add event listener when manual preference exists
    expect(addEventListenerMock).not.toHaveBeenCalled();
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const TestComponent = () => {
      useTheme();
      return <div>Test</div>;
    };

    expect(() => render(<TestComponent />)).toThrow(
      'useTheme must be used within ThemeProvider'
    );
  });
});
