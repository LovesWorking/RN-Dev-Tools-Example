/**
 * Developer Tools Theme
 * Cyberpunk theme with neon colors and glitch effects
 */

import { TextStyle, ViewStyle } from "react-native";

// ============================================================================
// Theme Colors
// ============================================================================

export const colors = {
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

// ============================================================================
// Theme Styles
// ============================================================================

export const styles = {
  modal: {
    backgroundColor: colors.backgroundModal,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    shadowColor: colors.shadowGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  } as ViewStyle,
  modalHeader: {
    backgroundColor: colors.modalHeader,
    borderBottomColor: colors.modalHeaderBorder,
    borderBottomWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  } as ViewStyle,
  modalContent: {
    backgroundColor: colors.modalContent,
    flex: 1,
  } as ViewStyle,
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  } as ViewStyle,
  button: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  } as ViewStyle,
  buttonPressed: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryGlow,
    transform: [{ scale: 0.98 }],
  } as ViewStyle,
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  } as ViewStyle,
  text: {
    color: colors.text,
    fontFamily: "monospace",
    fontSize: 14,
  } as TextStyle,
  textSecondary: {
    color: colors.textSecondary,
    fontFamily: "monospace",
    fontSize: 12,
  } as TextStyle,
  title: {
    color: colors.text,
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  } as TextStyle,
  subtitle: {
    color: colors.textSecondary,
    fontFamily: "monospace",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  } as TextStyle,
};

// ============================================================================
// Theme Object (for backwards compatibility)
// ============================================================================

export const theme = {
  name: "cyberpunk",
  colors,
  styles,
};

// ============================================================================
// Helper Functions
// ============================================================================

export const getSectionColor = (
  section: "query" | "env" | "sentry" | "storage" | "network" | "settings"
): string => {
  const colorMap = {
    query: colors.queryColor,
    env: colors.envColor,
    sentry: colors.sentryColor,
    storage: colors.storageColor,
    network: colors.networkColor,
    settings: colors.settingsColor,
  };
  return colorMap[section] || colors.primary;
};