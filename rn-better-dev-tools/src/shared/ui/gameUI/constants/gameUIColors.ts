/**
 * Game UI Color Palette - Simple Theme Swapping
 *
 * TO CHANGE THEME:
 * 1. Comment out the current theme line
 * 2. Uncomment the theme you want
 * 3. Save and refresh
 */

// ============================================
// THEME DEFINITIONS
// ============================================

const defaultTheme = {
  // Base colors
  border: "#00B8E666",
  blackTint1: "rgba(8, 12, 21, 0.95)",
  blackTint2: "rgba(16, 22, 35, 0.9)",
  blackTint3: "rgba(24, 32, 48, 0.85)",

  // Status Colors - Mixed colors for different semantic meanings
  success: "#4AFF9F", // Green for success
  warning: "#FFEB3B", // Yellow for warning
  error: "#FF5252", // Red for error
  info: "#00B8E6", // Cyan for info
  critical: "#FF00FF", // Magenta for critical
  optional: "#9D4EDD", // Purple for optional

  // Tool Colors - Different colors for different tools
  env: "#4AFF9F", // Green for environment
  storage: "#BA68C8", // Purple/Magenta for storage (was yellow)
  query: "#00B8E6", // Cyan for query
  debug: "#FF5252", // Red for debug
  network: "#4AFF9F", // Green for network to match connectivity theme

  // Data Types - Varied colors for syntax highlighting
  dataTypes: {
    object: "#00B8E6", // Cyan
    array: "#FFEB3B", // Yellow
    string: "#4AFF9F", // Green
    number: "#FF9F1C", // Orange
    boolean: "#FF00FF", // Magenta
    function: "#9D4EDD", // Purple
    undefined: "#7A8599", // Gray
    null: "#FF5252", // Red
  },

  // Text
  text: "#FFFFFF",
  secondary: "#B8BFC9",
  tertiary: "#9CA3AF",
  muted: "#7A8599",

  // Neon - Multi-color glow effects
  neonGlow: {
    primary: "#00D4FF",
    secondary: "#FF00FF",
    tertiary: "#4AFF9F",
  },

  // Diff Viewer Colors - Exact from devToolsDefaultTheme
  diff: {
    // Line backgrounds
    addedBackground: "rgba(74, 255, 159, 0.1)", // Green-cyan for additions
    removedBackground: "rgba(255, 82, 82, 0.1)", // Red for removals
    modifiedBackground: "rgba(0, 184, 230, 0.1)", // Cyan for modifications
    unchangedBackground: "transparent",
    contextBackground: "rgba(255, 255, 255, 0.02)",

    // Text colors
    addedText: "#4AFF9F", // Bright green-cyan
    removedText: "#FF5252", // Bright red
    modifiedText: "#00B8E6", // Bright cyan
    unchangedText: "#B8BFC9", // Muted text

    // Word-level highlights (darker than line backgrounds)
    addedWordHighlight: "rgba(74, 255, 159, 0.3)",
    removedWordHighlight: "rgba(255, 82, 82, 0.3)",

    // Line numbers
    lineNumberBackground: "#0A0E1A",
    lineNumberText: "#7A8599",
    lineNumberBorder: "#1F2937",

    // Markers (+/-)
    markerAddedBackground: "rgba(74, 255, 159, 0.2)",
    markerRemovedBackground: "rgba(255, 82, 82, 0.2)",
    markerModifiedBackground: "rgba(0, 184, 230, 0.2)",
    markerText: "#7A8599",
  },
};

const cyanTheme = {
  // Base colors
  border: "#00B8E666",
  blackTint1: "rgba(8, 12, 21, 0.95)",
  blackTint2: "rgba(16, 22, 35, 0.9)",
  blackTint3: "rgba(24, 32, 48, 0.85)",

  // Status Colors - All cyan/blue
  success: "#4DD0ED",
  warning: "#00B8E6",
  error: "#0074A3",
  info: "#00B8E6",
  critical: "#00D4FF",
  optional: "#5E9CAE",

  // Tool Colors - All cyan/blue
  env: "#4DD0ED",
  storage: "#0090B8",
  query: "#00B8E6",
  debug: "#0074A3",
  network: "#5E9CAE",

  // Data Types - All cyan/blue
  dataTypes: {
    object: "#00B8E6",
    array: "#4DD0ED",
    string: "#B3E5F4",
    number: "#00D4FF",
    boolean: "#0090B8",
    function: "#0074A3",
    undefined: "#5E9CAE",
    null: "#3A6B7C",
  },

  // Text
  text: "#FFFFFF",
  secondary: "#B8BFC9",
  tertiary: "#9CA3AF",
  muted: "#7A8599",

  // Neon
  neonGlow: {
    primary: "#00D4FF",
    secondary: "#00B8E6",
    tertiary: "#4DD0ED",
  },
};

const pinkTheme = {
  // Base colors
  border: "#FF69B466",
  blackTint1: "rgba(21, 8, 15, 0.95)",
  blackTint2: "rgba(35, 16, 28, 0.9)",
  blackTint3: "rgba(48, 24, 40, 0.85)",

  // Status Colors
  success: "#FFB6C1",
  warning: "#FF69B4",
  error: "#FF1493",
  info: "#FFC0CB",
  critical: "#FF00FF",
  optional: "#DB7093",

  // Tool Colors
  env: "#FFB6C1",
  storage: "#FF00FF",
  query: "#FFC0CB",
  debug: "#FF1493",
  network: "#DB7093",

  // Data Types
  dataTypes: {
    object: "#FF69B4",
    array: "#FFB6C1",
    string: "#FFC0CB",
    number: "#FF1493",
    boolean: "#C71585",
    function: "#FF00FF",
    undefined: "#DB7093",
    null: "#8B5A6B",
  },

  // Text
  secondary: "#FFB6C1",
  muted: "#DB7093",

  // Neon
  neonGlow: {
    primary: "#FF00FF",
    secondary: "#FF1493",
    tertiary: "#FF69B4",
  },
};

const greenTheme = {
  // Base colors
  border: "#00E67366",
  blackTint1: "rgba(8, 21, 12, 0.95)",
  blackTint2: "rgba(16, 35, 22, 0.9)",
  blackTint3: "rgba(24, 48, 32, 0.85)",

  // Status Colors
  success: "#00E673",
  warning: "#4AFF9F",
  error: "#00B85C",
  info: "#4AFF9F",
  critical: "#00FF88",
  optional: "#5E9E7E",

  // Tool Colors
  env: "#00E673",
  storage: "#00B85C",
  query: "#00E673",
  debug: "#00B85C",
  network: "#5E9E7E",

  // Data Types
  dataTypes: {
    object: "#00E673",
    array: "#4AFF9F",
    string: "#B3FFD9",
    number: "#00FF88",
    boolean: "#00B85C",
    function: "#008A47",
    undefined: "#5E9E7E",
    null: "#3A5F4D",
  },

  // Text
  secondary: "#4AFF9F",
  muted: "#5E9E7E",

  // Neon
  neonGlow: {
    primary: "#00FF88",
    secondary: "#00E673",
    tertiary: "#4AFF9F",
  },
};

const orangeTheme = {
  // Base colors
  border: "#FF8C0066",
  blackTint1: "rgba(21, 12, 8, 0.95)",
  blackTint2: "rgba(35, 22, 16, 0.9)",
  blackTint3: "rgba(48, 32, 24, 0.85)",

  // Status Colors
  success: "#FFA500",
  warning: "#FF8C00",
  error: "#CC7000",
  info: "#FFDAB9",
  critical: "#FF6F00",
  optional: "#CD853F",

  // Tool Colors
  env: "#FFA500",
  storage: "#FF6F00",
  query: "#FFDAB9",
  debug: "#CC7000",
  network: "#CD853F",

  // Data Types
  dataTypes: {
    object: "#FF8C00",
    array: "#FFA500",
    string: "#FFDAB9",
    number: "#FF9F1C",
    boolean: "#CC7000",
    function: "#FF6F00",
    undefined: "#CD853F",
    null: "#8B5A2B",
  },

  // Text
  secondary: "#FFA500",
  muted: "#CD853F",

  // Neon
  neonGlow: {
    primary: "#FF9F1C",
    secondary: "#FF8C00",
    tertiary: "#FFA500",
  },
};

// Bootstrap-inspired Light Theme
const lightTheme = {
  // Base colors / surfaces
  border: "#dee2e6",
  blackTint1: "#ffffff",
  blackTint2: "#ffffff",
  blackTint3: "#f8f9fa",

  // Status Colors (Bootstrap palette)
  success: "#198754", // green
  warning: "#ffc107", // yellow
  error: "#dc3545", // red
  info: "#0dcaf0", // cyan
  critical: "#6610f2", // indigo/purple accent
  optional: "#6c757d", // secondary

  // Tool Colors
  env: "#198754", // success
  storage: "#6f42c1", // purple
  query: "#0d6efd", // primary
  debug: "#dc3545", // danger
  network: "#20c997", // teal

  // Data Types
  dataTypes: {
    object: "#0d6efd", // primary blue
    array: "#20c997", // teal
    string: "#198754", // green
    number: "#fd7e14", // orange
    boolean: "#6f42c1", // purple
    function: "#6610f2", // indigo
    undefined: "#6c757d", // secondary gray
    null: "#dc3545", // red
  },

  // Text
  secondary: "#495057",
  muted: "#6c757d",

  // Neon (subtle in light mode)
  neonGlow: {
    primary: "#6ea8fe",
    secondary: "#6edff6",
    tertiary: "#75b798",
  },

  // Override surfaces/text for light mode
  background: "#f8f9fa",
  panel: "#ffffff",
  backdrop: "rgba(0, 0, 0, 0.4)",
  buttonBackground: "#ffffff",
  pureBlack: "#000000",

  // Primary text colors for light bg
  primary: "#212529",
  primaryLight: "#495057",
};

// ============================================
// THEME SELECTION - Just change this one line!
// ============================================

const activeTheme = defaultTheme; // DEFAULT - Mixed colors (original)
// const activeTheme = cyanTheme;  // Monochromatic cyan/blue
// const activeTheme = pinkTheme;  // Monochromatic pink
// const activeTheme = greenTheme; // Monochromatic green
// const activeTheme = orangeTheme; // Monochromatic orange

// ============================================
// GAME UI COLORS (uses selected theme)
// ============================================

export const gameUIColors = {
  // Defaults (dark-ish) which can be overridden by theme spreads
  background: "rgba(8, 12, 21, 0.98)",
  panel: "rgba(16, 22, 35, 0.98)",
  backdrop: "rgba(0, 0, 0, 0.85)",
  buttonBackground: "rgba(12, 16, 26, 0.9)",
  pureBlack: "#000000",

  // Default text colors for dark background
  primary: "#FFFFFF",
  primaryLight: "#F1F5F9",

  // Theme-specific colors (later spread overrides defaults when present)
  ...activeTheme,
} as const;

export type GameUIColorKey = keyof typeof gameUIColors;
export const THEME_ACCENT = gameUIColors.info;

// Simple helper for dial colors
export const getThemedDialColors = (accentColor: string = THEME_ACCENT) => {
  return {
    dialBackground: gameUIColors.pureBlack,
    dialGradient1: `${accentColor}10`,
    dialGradient2: `${accentColor}08`,
    dialGradient3: `${accentColor}15`,
    dialBorder: `${accentColor}40`,
    dialShadow: accentColor,
    dialGridLine: `${accentColor}26`,
  };
};
