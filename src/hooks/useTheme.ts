import { useState, useEffect } from 'react';
import { ThemeMode, CustomColors } from '@/types';
import { DEFAULT_COLORS } from '@/constants';

interface UseThemeOptions {
  theme?: 'light' | 'dark' | 'auto';
  customColors?: CustomColors;
}

interface UseThemeReturn {
  theme: ThemeMode;
  colors: Required<CustomColors>;
  toggleTheme: () => void;
}

export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const { theme: themeProp = 'auto', customColors } = options;

  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (themeProp === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeProp;
  });

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (themeProp !== 'auto') {
      setTheme(themeProp);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeProp]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Merge custom colors with defaults
  const colors: Required<CustomColors> = {
    ...DEFAULT_COLORS[theme],
    ...customColors,
  };

  // Apply custom colors as CSS variables
  useEffect(() => {
    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--vapor-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      document.documentElement.style.setProperty(cssVar, value);
    });
  }, [colors]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    colors,
    toggleTheme,
  };
}
