/**
 * Developer Tools Theme System
 * Provides comprehensive theming for all developer tools components
 * 
 * Features:
 * - Cyberpunk theme with neon colors and glitch effects
 * - Dark theme for a clean, professional look
 * - Easy theme switching throughout the app
 * - Consistent color palette across all components
 */

import { TextStyle, ViewStyle } from "react-native";

// ============================================================================
// Type Definitions
// ============================================================================

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGlow: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;
  accentGlow: string;
  
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundModal: string;
  backgroundOverlay: string;
  
  // Surface colors
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  surfaceBorder: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Status colors
  success: string;
  successLight: string;
  successDark: string;
  
  warning: string;
  warningLight: string;
  warningDark: string;
  
  error: string;
  errorLight: string;
  errorDark: string;
  
  info: string;
  infoLight: string;
  infoDark: string;
  
  // Special colors
  border: string;
  borderLight: string;
  borderFocused: string;
  borderActive: string;
  
  shadow: string;
  shadowLight: string;
  shadowGlow: string;
  
  // Glitch effect colors
  glitchPrimary: string;
  glitchSecondary: string;
  glitchTertiary: string;
  
  // Section-specific colors
  queryColor: string;
  envColor: string;
  sentryColor: string;
  storageColor: string;
  networkColor: string;
  settingsColor: string;
  
  // Modal specific
  modalHeader: string;
  modalHeaderBorder: string;
  modalContent: string;
  modalDragIndicator: string;
  modalDragIndicatorActive: string;
  modalCloseButton: string;
  modalCloseButtonBg: string;
  modalToggleButton: string;
  modalToggleButtonBg: string;
}

export interface ThemeStyles {
  modal: ViewStyle;
  modalHeader: ViewStyle;
  modalContent: ViewStyle;
  card: ViewStyle;
  button: ViewStyle;
  buttonPressed: ViewStyle;
  input: ViewStyle;
  text: TextStyle;
  textSecondary: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  styles: ThemeStyles;
  animations: {
    glitchEnabled: boolean;
    pulseEnabled: boolean;
    scanlineEnabled: boolean;
    borderGlowEnabled: boolean;
  };
}

// ============================================================================
// Cyberpunk Theme
// ============================================================================

const cyberpunkColors: ThemeColors = {
  // Primary colors - Neon cyan
  primary: "#00FFFF",
  primaryLight: "#84FFFF",
  primaryDark: "#00E5FF",
  primaryGlow: "rgba(0, 255, 255, 0.6)",
  
  // Accent colors - Hot pink
  accent: "#FF006E",
  accentLight: "#FF80AB",
  accentDark: "#FF4081",
  accentGlow: "rgba(255, 0, 110, 0.6)",
  
  // Background colors - Deep dark with purple tint
  background: "#0A0A0F",
  backgroundSecondary: "#0F0F1A",
  backgroundTertiary: "#141424",
  backgroundModal: "rgba(10, 10, 15, 0.95)",
  backgroundOverlay: "rgba(0, 0, 0, 0.95)",
  
  // Surface colors - Glass effect
  surface: "rgba(20, 20, 35, 0.8)",
  surfaceLight: "rgba(30, 30, 50, 0.6)",
  surfaceDark: "rgba(10, 10, 20, 0.9)",
  surfaceBorder: "rgba(0, 255, 255, 0.3)",
  
  // Text colors
  text: "#FFFFFF",
  textSecondary: "#B4B4B4",
  textTertiary: "#808080",
  textInverse: "#0A0A0F",
  
  // Status colors - Neon variants
  success: "#00FF88",
  successLight: "#69F0AE",
  successDark: "#00E676",
  
  warning: "#FFFF00",
  warningLight: "#FFFF8D",
  warningDark: "#FFD600",
  
  error: "#FF1744",
  errorLight: "#FF8A80",
  errorDark: "#FF5252",
  
  info: "#00E5FF",
  infoLight: "#84FFFF",
  infoDark: "#00B8D4",
  
  // Special colors
  border: "rgba(0, 255, 255, 0.3)",
  borderLight: "rgba(0, 255, 255, 0.2)",
  borderFocused: "rgba(0, 255, 255, 0.8)",
  borderActive: "#00FFFF",
  
  shadow: "rgba(0, 255, 255, 0.4)",
  shadowLight: "rgba(0, 255, 255, 0.2)",
  shadowGlow: "rgba(0, 255, 255, 0.8)",
  
  // Glitch effect colors
  glitchPrimary: "#00FFFF",
  glitchSecondary: "#FF00FF",
  glitchTertiary: "#FFFF00",
  
  // Section-specific colors
  queryColor: "#FF006E",
  envColor: "#00FFFF",
  sentryColor: "#FF1744",
  storageColor: "#00FF88",
  networkColor: "#E040FB",
  settingsColor: "#FFB800",
  
  // Modal specific
  modalHeader: "rgba(10, 10, 20, 0.95)",
  modalHeaderBorder: "rgba(0, 255, 255, 0.2)",
  modalContent: "rgba(15, 15, 25, 0.9)",
  modalDragIndicator: "rgba(0, 255, 255, 0.3)",
  modalDragIndicatorActive: "rgba(0, 255, 255, 0.8)",
  modalCloseButton: "#FF1744",
  modalCloseButtonBg: "rgba(255, 23, 68, 0.15)",
  modalToggleButton: "#00FFFF",
  modalToggleButtonBg: "rgba(0, 255, 255, 0.15)",
};

const cyberpunkStyles: ThemeStyles = {
  modal: {
    backgroundColor: cyberpunkColors.backgroundModal,
    borderColor: cyberpunkColors.border,
    borderWidth: 1,
    borderRadius: 16,
    shadowColor: cyberpunkColors.shadowGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    backgroundColor: cyberpunkColors.modalHeader,
    borderBottomColor: cyberpunkColors.modalHeaderBorder,
    borderBottomWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalContent: {
    backgroundColor: cyberpunkColors.modalContent,
    flex: 1,
  },
  card: {
    backgroundColor: cyberpunkColors.surface,
    borderColor: cyberpunkColors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: cyberpunkColors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  button: {
    backgroundColor: cyberpunkColors.surfaceLight,
    borderColor: cyberpunkColors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonPressed: {
    backgroundColor: cyberpunkColors.primary,
    borderColor: cyberpunkColors.primaryGlow,
    transform: [{ scale: 0.98 }],
  },
  input: {
    backgroundColor: cyberpunkColors.surface,
    borderColor: cyberpunkColors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  text: {
    color: cyberpunkColors.text,
    fontFamily: "monospace",
    fontSize: 14,
  } as TextStyle,
  textSecondary: {
    color: cyberpunkColors.textSecondary,
    fontFamily: "monospace",
    fontSize: 12,
  },
  title: {
    color: cyberpunkColors.text,
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    textShadowColor: cyberpunkColors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: cyberpunkColors.textSecondary,
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
};

export const cyberpunkTheme: Theme = {
  name: "cyberpunk",
  colors: cyberpunkColors,
  styles: cyberpunkStyles,
  animations: {
    glitchEnabled: true,
    pulseEnabled: true,
    scanlineEnabled: true,
    borderGlowEnabled: true,
  },
};

// ============================================================================
// Dark Theme (Classic)
// ============================================================================

const darkColors: ThemeColors = {
  // Primary colors - Blue
  primary: "#3B82F6",
  primaryLight: "#60A5FA",
  primaryDark: "#2563EB",
  primaryGlow: "rgba(59, 130, 246, 0.5)",
  
  // Accent colors - Green
  accent: "#10B981",
  accentLight: "#34D399",
  accentDark: "#059669",
  accentGlow: "rgba(16, 185, 129, 0.5)",
  
  // Background colors - Neutral grays
  background: "#1A1A1A",
  backgroundSecondary: "#2A2A2A",
  backgroundTertiary: "#3A3A3A",
  backgroundModal: "#2A2A2A",
  backgroundOverlay: "rgba(0, 0, 0, 0.8)",
  
  // Surface colors
  surface: "#2D2D2D",
  surfaceLight: "#3D3D3D",
  surfaceDark: "#1D1D1D",
  surfaceBorder: "rgba(255, 255, 255, 0.1)",
  
  // Text colors
  text: "#FFFFFF",
  textSecondary: "#9CA3AF",
  textTertiary: "#6B7280",
  textInverse: "#1A1A1A",
  
  // Status colors
  success: "#10B981",
  successLight: "#34D399",
  successDark: "#059669",
  
  warning: "#F59E0B",
  warningLight: "#FCD34D",
  warningDark: "#D97706",
  
  error: "#EF4444",
  errorLight: "#F87171",
  errorDark: "#DC2626",
  
  info: "#3B82F6",
  infoLight: "#60A5FA",
  infoDark: "#2563EB",
  
  // Special colors
  border: "rgba(255, 255, 255, 0.1)",
  borderLight: "rgba(255, 255, 255, 0.06)",
  borderFocused: "rgba(59, 130, 246, 0.5)",
  borderActive: "#3B82F6",
  
  shadow: "#000000",
  shadowLight: "rgba(0, 0, 0, 0.5)",
  shadowGlow: "rgba(59, 130, 246, 0.3)",
  
  // Glitch effect colors (disabled in dark theme)
  glitchPrimary: "transparent",
  glitchSecondary: "transparent",
  glitchTertiary: "transparent",
  
  // Section-specific colors
  queryColor: "#FF006E",
  envColor: "#10B981",
  sentryColor: "#EF4444",
  storageColor: "#3B82F6",
  networkColor: "#8B5CF6",
  settingsColor: "#F59E0B",
  
  // Modal specific
  modalHeader: "#171717",
  modalHeaderBorder: "rgba(255, 255, 255, 0.06)",
  modalContent: "#2A2A2A",
  modalDragIndicator: "rgba(255, 255, 255, 0.2)",
  modalDragIndicatorActive: "rgba(34, 197, 94, 0.8)",
  modalCloseButton: "#FFFFFF",
  modalCloseButtonBg: "rgba(239, 68, 68, 0.1)",
  modalToggleButton: "#E5E7EB",
  modalToggleButtonBg: "rgba(156, 163, 175, 0.1)",
};

const darkStyles: ThemeStyles = {
  modal: {
    backgroundColor: darkColors.backgroundModal,
    borderColor: darkColors.border,
    borderWidth: 1,
    borderRadius: 14,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  modalHeader: {
    backgroundColor: darkColors.modalHeader,
    borderBottomColor: darkColors.modalHeaderBorder,
    borderBottomWidth: 1,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  modalContent: {
    backgroundColor: darkColors.modalContent,
    flex: 1,
  },
  card: {
    backgroundColor: darkColors.surface,
    borderColor: darkColors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    backgroundColor: darkColors.surface,
    borderColor: darkColors.border,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    backgroundColor: darkColors.surfaceLight,
    borderColor: darkColors.primary,
    transform: [{ scale: 0.98 }],
  },
  input: {
    backgroundColor: darkColors.surface,
    borderColor: darkColors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  text: {
    color: darkColors.text,
    fontSize: 14,
  },
  textSecondary: {
    color: darkColors.textSecondary,
    fontSize: 12,
  },
  title: {
    color: darkColors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    color: darkColors.textSecondary,
    fontSize: 12,
    fontWeight: "400",
  },
};

export const darkTheme: Theme = {
  name: "dark",
  colors: darkColors,
  styles: darkStyles,
  animations: {
    glitchEnabled: false,
    pulseEnabled: false,
    scanlineEnabled: false,
    borderGlowEnabled: false,
  },
};

// ============================================================================
// Theme Utilities
// ============================================================================

export type ThemeName = "cyberpunk" | "dark";

export const themes: Record<ThemeName, Theme> = {
  cyberpunk: cyberpunkTheme,
  dark: darkTheme,
};

export const getTheme = (themeName: ThemeName): Theme => {
  return themes[themeName] || cyberpunkTheme;
};

// Helper function to get section color based on theme
export const getSectionColor = (
  theme: Theme,
  section: "query" | "env" | "sentry" | "storage" | "network" | "settings"
): string => {
  const colorMap = {
    query: theme.colors.queryColor,
    env: theme.colors.envColor,
    sentry: theme.colors.sentryColor,
    storage: theme.colors.storageColor,
    network: theme.colors.networkColor,
    settings: theme.colors.settingsColor,
  };
  return colorMap[section] || theme.colors.primary;
};

// Export default theme
export const defaultTheme = cyberpunkTheme;