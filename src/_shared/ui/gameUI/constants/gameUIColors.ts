/**
 * Game UI Color Palette
 * Centralized color system for all Game UI components
 * Following cyberpunk/sci-fi aesthetic
 */
export const gameUIColors = {
  // Background & Panels
  background: "rgba(5, 5, 10, 0.98)",
  panel: "rgba(10, 10, 20, 0.98)",
  border: "rgba(0, 212, 255, 0.3)",

  // Status Colors - Consistent semantic meaning
  success: "#00FF88",   // Valid, working, good states
  warning: "#FFD700",   // Issues needing attention
  error: "#FF4444",     // Critical failures only
  info: "#00D4FF",      // Informational, neutral
  critical: "#FF00FF",  // System-critical states
  optional: "#9D4EDD",  // Optional features/data

  // Tool-Specific Accent Colors
  env: "#00FF88",       // Environment variables
  storage: "#FFD700",   // Storage browser
  query: "#00D4FF",     // Query inspector
  debug: "#FF4444",     // Debug tools
  network: "#9D4EDD",   // Network monitor

  // Text Hierarchy
  primary: "#FFFFFF",   // Main text
  primaryLight: "#E2E8F0", // Slightly dimmed main text
  secondary: "#AAA",    // Subtitles, descriptions
  muted: "#666",        // Hints, footer text
} as const;

export type GameUIColorKey = keyof typeof gameUIColors;