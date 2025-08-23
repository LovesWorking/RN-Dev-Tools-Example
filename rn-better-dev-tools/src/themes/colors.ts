/**
 * Centralized color constants for rn-better-dev-tools
 * These can be customized by consumers of the package
 */

export const colors = {
  // Primary colors
  primary: '#00FF88',
  primaryDark: '#00CC6A',
  primaryLight: '#33FFB0',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  critical: '#DC2626',
  
  // UI colors
  background: '#0A0E1A',
  backgroundLight: '#141824',
  backgroundDark: '#050A12',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textDisabled: 'rgba(255, 255, 255, 0.4)',
  
  // Border colors
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.2)',
  borderFocus: '#00FF88',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Special effects
  glow: '#00FF88',
  glowSecondary: '#FF006E',
  gradient: {
    start: '#00FF88',
    end: '#00CC6A'
  },
  
  // Component specific
  modal: {
    background: 'rgba(10, 14, 26, 0.98)',
    border: 'rgba(0, 255, 136, 0.3)',
    header: '#0F1520'
  },
  
  button: {
    primary: '#00FF88',
    secondary: '#1A2332',
    danger: '#EF4444',
    disabled: 'rgba(255, 255, 255, 0.1)'
  }
};

// Common opacity values
export const opacity = {
  disabled: 0.4,
  muted: 0.6,
  secondary: 0.8,
  full: 1
};

// Common spacing values
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

// Common border radius values
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999
};

// Common dimensions
export const dimensions = {
  bubbleSize: 56,
  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  },
  modalHeader: 56,
  buttonHeight: {
    sm: 32,
    md: 40,
    lg: 48
  }
};