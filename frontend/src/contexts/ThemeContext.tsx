import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEY_THEME, DOM_ATTR_THEME } from '../utils/constants';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  // Check if user has a saved preference
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }

  // Auto-detect system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.setAttribute(DOM_ATTR_THEME, theme);
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  // Listen for system theme changes (only if user hasn't manually set a preference)
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme) return; // User has a manual preference

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
