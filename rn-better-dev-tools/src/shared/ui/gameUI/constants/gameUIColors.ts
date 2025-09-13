/**
 * Game UI Color Palette - Simple Theme Swapping
 *
 * TO CHANGE THEME:
 * 1. Comment out the current theme line
 * 2. Uncomment the theme you want
 * 3. Save and refresh
 */

import { macOSGameUIColors } from "./macOSDesignSystemColors";

// ============================================
// THEME DEFINITIONS
// ============================================

// macOS theme - Apple HIG based design system
const macOSTheme = macOSGameUIColors;

// ============================================
// THEME SELECTION - Just change this one line!
// ============================================

// const activeTheme = defaultTheme; // DEFAULT - Mixed colors (original)
const activeTheme = macOSTheme; // macOS - Apple HIG design system

// ============================================
// GAME UI COLORS (uses selected theme)
// ============================================

export const gameUIColors = {
  // Theme-specific colors (spread first)
  ...activeTheme,
  // Any missing properties will use these defaults
  background: activeTheme.background || "rgba(8, 12, 21, 0.98)",
  panel: activeTheme.panel || "rgba(16, 22, 35, 0.98)",
  backdrop: activeTheme.backdrop || "rgba(0, 0, 0, 0.85)",
  buttonBackground: activeTheme.buttonBackground || "rgba(12, 16, 26, 0.9)",
  pureBlack: activeTheme.pureBlack || "#000000",
  primary: activeTheme.primary || "#FFFFFF",
  primaryLight: activeTheme.primaryLight || "#F1F5F9",
} as const;

export type GameUIColorKey = keyof typeof gameUIColors;
// Fixed dial colors for cyberpunk theme
export const dialColors = {
  dialBackground: gameUIColors.pureBlack,
  dialGradient1: `${gameUIColors.info}10`,
  dialGradient2: `${gameUIColors.info}08`,
  dialGradient3: `${gameUIColors.info}15`,
  dialBorder: `${gameUIColors.info}40`,
  dialShadow: gameUIColors.info,
  dialGridLine: `${gameUIColors.info}26`,
};
