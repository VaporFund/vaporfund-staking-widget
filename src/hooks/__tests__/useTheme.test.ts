import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';

describe('useTheme', () => {
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  beforeEach(() => {
    mockMatchMedia(false); // Default to light mode
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with light theme', () => {
    const { result } = renderHook(() => useTheme({ theme: 'light' }));
    expect(result.current.theme).toBe('light');
  });

  it('should initialize with dark theme', () => {
    const { result } = renderHook(() => useTheme({ theme: 'dark' }));
    expect(result.current.theme).toBe('dark');
  });

  it('should detect system preference for auto theme', () => {
    mockMatchMedia(true); // Dark mode preference
    const { result } = renderHook(() => useTheme({ theme: 'auto' }));
    expect(result.current.theme).toBe('dark');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme({ theme: 'light' }));

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
  });

  it('should merge custom colors with defaults', () => {
    const customColors = {
      primary: '#ff0000',
      accent: '#00ff00',
    };

    const { result } = renderHook(() =>
      useTheme({ theme: 'light', customColors })
    );

    expect(result.current.colors.primary).toBe('#ff0000');
    expect(result.current.colors.accent).toBe('#00ff00');
    expect(result.current.colors.background).toBeDefined(); // Default value
  });

  it('should apply dark theme colors', () => {
    const { result } = renderHook(() => useTheme({ theme: 'dark' }));
    expect(result.current.colors.background).toBe('#1a1a1a');
  });

  it('should apply light theme colors', () => {
    const { result } = renderHook(() => useTheme({ theme: 'light' }));
    expect(result.current.colors.background).toBe('#ffffff');
  });
});
