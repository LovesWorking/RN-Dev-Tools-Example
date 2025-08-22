/**
 * Developer Tools Theme Context
 * Provides theme management and switching capabilities for all dev tools
 * 
 * Features:
 * - Theme state management
 * - Persistent theme selection
 * - Easy theme switching
 * - Type-safe theme access
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Theme, ThemeName, getTheme, cyberpunkTheme } from "./devToolsThemes";

// ============================================================================
// Context Types
// ============================================================================

interface DevToolsThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  toggleTheme: () => void;
  isLoading: boolean;
}

// ============================================================================
// Storage Operations
// ============================================================================

const THEME_STORAGE_KEY = "@dev_tools_theme_preference";

// Safe storage operations that fallback to memory if AsyncStorage isn't available
class SafeStorage {
  private static memoryCache: Record<string, any> = {};

  static async getItem(key: string): Promise<string | null> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (AsyncStorage) {
        return await AsyncStorage.getItem(key);
      }
      return this.memoryCache[key] || null;
    } catch {
      return this.memoryCache[key] || null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
      } else {
        this.memoryCache[key] = value;
      }
    } catch {
      this.memoryCache[key] = value;
    }
  }

  private static async getAsyncStorage() {
    try {
      const module = await import("@react-native-async-storage/async-storage");
      return module.default;
    } catch {
      return null;
    }
  }
}

// ============================================================================
// Context Creation
// ============================================================================

const DevToolsThemeContext = createContext<DevToolsThemeContextType | undefined>(
  undefined
);

// ============================================================================
// Theme Provider Component
// ============================================================================

interface DevToolsThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function DevToolsThemeProvider({
  children,
  defaultTheme = "cyberpunk",
}: DevToolsThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [theme, setThemeState] = useState<Theme>(getTheme(defaultTheme));
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await SafeStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === "cyberpunk" || savedTheme === "dark")) {
          setThemeName(savedTheme as ThemeName);
          setThemeState(getTheme(savedTheme as ThemeName));
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    if (!isLoading) {
      const saveThemePreference = async () => {
        try {
          await SafeStorage.setItem(THEME_STORAGE_KEY, themeName);
        } catch (error) {
          console.warn("Failed to save theme preference:", error);
        }
      };

      saveThemePreference();
    }
  }, [themeName, isLoading]);

  // Theme setter function
  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    setThemeState(getTheme(newThemeName));
  };

  // Toggle between themes
  const toggleTheme = () => {
    const newTheme = themeName === "cyberpunk" ? "dark" : "cyberpunk";
    setTheme(newTheme);
  };

  const value: DevToolsThemeContextType = {
    theme,
    themeName,
    setTheme,
    toggleTheme,
    isLoading,
  };

  return (
    <DevToolsThemeContext.Provider value={value}>
      {children}
    </DevToolsThemeContext.Provider>
  );
}

// ============================================================================
// Theme Hook
// ============================================================================

export function useDevToolsTheme(): DevToolsThemeContextType {
  const context = useContext(DevToolsThemeContext);
  if (!context) {
    throw new Error(
      "useDevToolsTheme must be used within a DevToolsThemeProvider"
    );
  }
  return context;
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to get only the current theme object
 */
export function useTheme(): Theme {
  const { theme } = useDevToolsTheme();
  return theme;
}

/**
 * Hook to get only the theme colors
 */
export function useThemeColors() {
  const { theme } = useDevToolsTheme();
  return theme.colors;
}

/**
 * Hook to get only the theme styles
 */
export function useThemeStyles() {
  const { theme } = useDevToolsTheme();
  return theme.styles;
}

/**
 * Hook to check if animations are enabled
 */
export function useThemeAnimations() {
  const { theme } = useDevToolsTheme();
  return theme.animations;
}

// ============================================================================
// Higher Order Component for Theme
// ============================================================================

export function withDevToolsTheme<P extends object>(
  Component: React.ComponentType<P & { theme: Theme }>
): React.ComponentType<P> {
  return function ThemedComponent(props: P) {
    const { theme } = useDevToolsTheme();
    return <Component {...props} theme={theme} />;
  };
}