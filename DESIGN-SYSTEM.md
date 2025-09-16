# Cyberpunk Game UI Design System

## Overview
This design system defines the visual language for our cyberpunk-themed developer tools UI. It combines glitch aesthetics, neon accents, and glass morphism to create a distinctive futuristic interface.

## Core Visual Principles

### 1. Dark Glass Morphism
- **Primary Background**: `rgba(5, 5, 10, 0.6)` - Ultra-dark glass base
- **Layered Glass Effects**: Multiple transparent layers for depth
  - Layer 1: `rgba(10, 10, 15, 0.7)` at 80% opacity
  - Layer 2: `rgba(15, 15, 25, 0.5)` at 60% opacity
  - Layer 3: `rgba(20, 20, 35, 0.3)` at 40% opacity
- **Glass Shimmer**: `rgba(255, 255, 255, 0.03)` at 60% opacity

### 2. Neon Glow System
- **Multi-color neon palette** for different semantic meanings
- **Dynamic glow intensity** that responds to interaction
- **Layered glow effects** using shadow and blur filters

## Border Styles

### Standard Borders
- **Width**: 1-1.5px for regular borders, 2-3px for emphasis
- **Color**: Semi-transparent accent colors at 40% opacity
- **Formula**: `${accentColor}40` (hex color + opacity)
- **Corner Radius**:
  - Small: 4px (badges, small buttons)
  - Medium: 8-10px (cards, containers)
  - Large: 12px (modals, major sections)

### Cyberpunk Geometric Borders
- **Angled corners** using SVG paths for futuristic look
- **Path pattern**: Cut corners at 45° angles
- **Glowing edges** with Gaussian blur filters
- **Corner accents**: Small colored bars at corners for detail

### Interactive Border States
- **Default**: 40% opacity of accent color
- **Hover/Press**: Increases to 60-80% opacity
- **Active**: Full opacity with enhanced glow

## Shadow & Glow Effects

### Neon Glow
- **Implementation**: Multiple layered shadows
- **Structure**:
  ```
  shadowColor: accentColor
  shadowOffset: { width: 0, height: 0 }
  shadowRadius: 20
  shadowOpacity: 0.3-0.8 (animated)
  ```
- **SVG Filters**:
  - FeGaussianBlur with stdDeviation 3-4
  - FeMerge for layered glow intensity

### Text Shadows
- **Glow effect**: `textShadowRadius: 8-10px`
- **No offset** for centered glow: `{ width: 0, height: 0 }`
- **Color matches** text or accent color

### Glass Reflections
- **Subtle shimmer** overlay at 3% white opacity
- **Gradient overlays** for glass depth perception

## Spacing System

### Base Unit: 4px
- **Micro**: 2px (indicator dots, fine details)
- **Small**: 4px (icon margins, text spacing)
- **Medium**: 8px (component padding)
- **Large**: 12-16px (section padding)
- **XL**: 20-24px (major sections)

### Component Spacing
- **Card padding**: 16px horizontal, 12-16px vertical
- **Section margins**: 12-20px between major sections
- **Icon containers**: 36-48px square with 8-14px margin
- **Badge padding**: 6-10px horizontal, 2-4px vertical

### Layout Patterns
- **Flex gaps**: 3px (dots), 8px (items), 12px (sections)
- **Grid spacing**: 12px standard gap
- **Modal padding**: 16-20px content padding

## Typography

### Font Stack
- **Primary**: `monospace` for all UI text
- **Weights**: 500 (regular), 600 (medium), 700 (bold)

### Size Scale
- **Micro**: 8-9px (binary patterns, tiny labels)
- **Small**: 10-11px (badges, secondary text)
- **Body**: 12-13px (standard content)
- **Title**: 14-15px (section headers)
- **Large**: 16-18px (major headings)

### Letter Spacing
- **Tight**: 0.3-0.5px (regular text)
- **Normal**: 1px (badges, labels)
- **Wide**: 1.5-2px (uppercase titles)

### Text Styling
- **Uppercase titles** with wide letter spacing
- **Opacity variations**: 0.7-0.9 for hierarchy
- **Glowing text** using textShadow for emphasis

## Animation Patterns

### Glitch Effects
- **Duration**: 100-2000ms configurable
- **Components**:
  - Opacity flicker: 0→1→0.3→0.9→0
  - X displacement: ±3-10px random
  - Y displacement: ±2-5px random
  - Scale distortion: 0.97-1.05
  - Color channel splitting (via overlays)

### Interactive Animations
- **Press feedback**:
  - Scale: 0.98 with spring animation
  - Glow intensity: 0.3→1.0
  - Duration: 100ms
- **Release**:
  - Spring back to scale 1.0
  - Glow fade to 0.3 over 200ms

### Ambient Animations
- **Border pulse**: 2-4 second loops
- **Glow breathing**: Sine wave easing
- **Random glitches**: 3-8 second intervals

## Component Patterns

### Cards & Containers
- **Glass background** with layered transparency
- **Glowing borders** with accent colors
- **Corner accents** for geometric detail
- **Hover states** with enhanced glow

### Badges
- **Rounded corners**: 4px standard, 10-12px for count badges
- **Background**: 15-20% opacity of accent color
- **Border**: 40% opacity of accent color
- **Min width**: 20px (count), 45px (method badges)

### Buttons
- **Geometric outline** using SVG paths
- **Gradient strokes** for depth
- **Active zones** with padding for touch
- **Glitch effect** on interaction

### Modal Headers
- **Fixed height**: 32px minimum
- **Flex layout** with navigation/content/actions
- **Consistent spacing**: 8px gaps, 4px padding

### Status Indicators
- **Dot arrays**: 3-4px dots with opacity fade
- **Pulse animation** for active states
- **Color coding** matches semantic meaning

## Interactive States

### Touch/Press
- **Immediate feedback**: Scale reduction
- **Glow enhancement**: Intensity increase
- **Glitch trigger**: Quick displacement effect

### Hover (if applicable)
- **Subtle glow increase**
- **Border opacity boost**
- **Cursor indication**

### Active/Selected
- **Persistent glow**
- **Full opacity borders**
- **Accent color emphasis**

## Accessibility Considerations

### Contrast
- **Text on dark**: Minimum 4.5:1 ratio
- **Interactive elements**: Clear visual boundaries
- **State changes**: Noticeable but not jarring

### Motion
- **Respects reduce motion** preferences
- **Fallback to simple transitions**
- **No critical information in animations**

### Touch Targets
- **Minimum 44x44px** for interactive elements
- **Clear active zones** with padding
- **Visual feedback** on all interactions

## Implementation Tips

### Performance
- **Use native driver** for animations when possible
- **Batch animated values** for efficiency
- **Limit blur effects** on lower-end devices

### Consistency
- **Import shared colors** from gameUIColors
- **Use style constants** for repeated patterns
- **Component composition** over configuration

### Theming
- **Accent colors** drive the color scheme
- **Semantic colors** for status/meaning
- **Opacity layers** for depth and hierarchy

## Quick Reference

### Essential Colors (from gameUIColors)
```javascript
// Status Colors
success: "#4AFF9F"     // Green
warning: "#FFEB3B"     // Yellow
error: "#FF5252"       // Red
info: "#00B8E6"        // Cyan
critical: "#FF00FF"    // Magenta

// Base UI
border: "#00B8E666"    // Cyan 40%
panel: "rgba(5, 5, 10, 0.95)"
blackTint1-3: Various opacity blacks

// Text
text: "#FFFFFF"
secondary: "#B8BFC9"
tertiary: "#9CA3AF"
muted: "#7A8599"
```

### Common Formulas
- **Border color**: `${accentColor}40`
- **Background**: `${accentColor}15` or `${accentColor}20`
- **Glow shadow**: `${accentColor}` at 30-80% opacity
- **Text shadow**: `textShadowColor: accentColor`

### Animation Timings
- **Quick feedback**: 50-100ms
- **Transitions**: 200-300ms
- **Ambient loops**: 2000-4000ms
- **Glitch effects**: 100-2000ms (configurable)

## Usage Example

```javascript
// Card with cyberpunk styling
const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(5, 5, 10, 0.6)",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: `${accentColor}40`,
    padding: 16,
    shadowColor: accentColor,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.3,
  },
  glowText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textShadowColor: accentColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  badge: {
    backgroundColor: `${accentColor}20`,
    borderColor: `${accentColor}40`,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  }
});
```

This design system creates a cohesive cyberpunk aesthetic that's both visually striking and functionally consistent across all components.