# SVG Icons to Pure React Native Conversion Guide

## 📋 Overview

This guide demonstrates how to convert SVG icons (like those in icons.ts) to pure React Native components without any native dependencies. We'll provide exact conversions where possible and approximations where SVG features aren't available in React Native.

## 🎯 Quick Reference

| SVG Element | Convertible | Pure RN Solution |
|------------|-------------|------------------|
| Circle | ✅ Yes | View with borderRadius |
| Rect | ✅ Yes | View with backgroundColor |
| Line | ✅ Yes | Rotated View |
| Path (simple) | ⚠️ Partial | Multiple Views |
| Path (curves) | ❌ No | Not possible |
| Polyline | ⚠️ Partial | Multiple Lines |
| Polygon | ⚠️ Limited | CSS triangles only |

---

## 🔄 Element-by-Element Conversions

### 1. Circle → View with borderRadius

#### SVG (from AlertCircleIcon)
```javascript
<Circle cx="12" cy="12" r="10" />
```

#### Pure React Native
```javascript
const PureCircle = ({ cx, cy, r, stroke, strokeWidth = 0, fill = 'transparent' }) => {
  const diameter = r * 2;
  return (
    <View
      style={{
        position: 'absolute',
        left: cx - r - strokeWidth / 2,
        top: cy - r - strokeWidth / 2,
        width: diameter,
        height: diameter,
        borderRadius: r,
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: strokeWidth,
      }}
    />
  );
};
```

---

### 2. Rect → View

#### SVG (from PauseIcon)
```javascript
<Rect x="14" y="3" width="5" height="18" rx="1" />
```

#### Pure React Native
```javascript
const PureRect = ({ x, y, width, height, rx = 0, stroke, strokeWidth = 0, fill = 'transparent' }) => (
  <View
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      backgroundColor: fill,
      borderRadius: rx,
      borderColor: stroke,
      borderWidth: strokeWidth,
    }}
  />
);
```

---

### 3. Line → Rotated View

#### SVG (from AlertCircleIcon)
```javascript
<Line x1="12" y1="8" x2="12" y2="12" />
```

#### Pure React Native
```javascript
const PureLine = ({ x1, y1, x2, y2, stroke, strokeWidth = 2 }) => {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  
  return (
    <View
      style={{
        position: 'absolute',
        left: x1,
        top: y1 - strokeWidth / 2,
        width: length,
        height: strokeWidth,
        backgroundColor: stroke,
        transform: [{ rotate: `${angle}deg` }],
        transformOrigin: 'left center',
      }}
    />
  );
};
```

---

### 4. Path → Multiple Strategies

#### Simple Path (Move + Line commands only)

##### SVG (from CheckIcon)
```javascript
<Path d="M20 6 9 17l-5-5" />
```

##### Pure React Native
```javascript
// Parse simple path: M20 6 L9 17 L4 12
const CheckIconPure = ({ size = 24, color = 'black', strokeWidth = 2 }) => {
  return (
    <View style={{ width: size, height: size }}>
      {/* Line from (20,6) to (9,17) */}
      <PureLine x1={20} y1={6} x2={9} y2={17} stroke={color} strokeWidth={strokeWidth} />
      {/* Line from (9,17) to (4,12) */}
      <PureLine x1={9} y1={17} x2={4} y2={12} stroke={color} strokeWidth={strokeWidth} />
    </View>
  );
};
```

#### Complex Path (with curves) - NOT CONVERTIBLE ❌

##### SVG (from ActivityIcon)
```javascript
<Path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
```

##### Pure React Native
```javascript
// ❌ Contains curves and complex paths - NOT POSSIBLE
// Workaround: Pre-render as PNG or use simplified version
```

---

### 5. Polyline → Multiple Lines

#### SVG (hypothetical)
```javascript
<Polyline points="0,0 10,5 20,0" />
```

#### Pure React Native
```javascript
const PurePolyline = ({ points, stroke, strokeWidth = 2 }) => {
  const pointsArray = points.split(' ').map(p => p.split(',').map(Number));
  const lines = [];
  
  for (let i = 0; i < pointsArray.length - 1; i++) {
    const [x1, y1] = pointsArray[i];
    const [x2, y2] = pointsArray[i + 1];
    lines.push(
      <PureLine
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
  
  return <>{lines}</>;
};
```

---

### 6. Polygon → CSS Triangles (limited)

#### SVG (from NavigationIcon)
```javascript
<Polygon points="3 11 22 2 13 21 11 13 3 11" />
```

#### Pure React Native (Triangle approximation only)
```javascript
const PureTriangle = ({ size = 24, color = 'black' }) => {
  // Only works for triangular shapes
  return (
    <View
      style={{
        width: 0,
        height: 0,
        borderLeftWidth: size / 2,
        borderRightWidth: size / 2,
        borderBottomWidth: size,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: color,
        transform: [{ rotate: '-45deg' }],
      }}
    />
  );
};
```

---

## 🏭 Factory Functions for Conversion

### Path Parser (Simple Commands Only)

```javascript
/**
 * Parses simple SVG path commands (M, L, H, V, Z only)
 * Returns array of line segments or null if unsupported commands found
 */
function parseSimplePath(d) {
  const commands = d.match(/[MLHVZ][^MLHVZ]*/gi);
  if (!commands) return null;
  
  const segments = [];
  let currentX = 0, currentY = 0;
  let startX = 0, startY = 0;
  
  for (const cmd of commands) {
    const type = cmd[0].toUpperCase();
    const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number);
    
    switch (type) {
      case 'M': // Move to
        currentX = args[0];
        currentY = args[1];
        startX = currentX;
        startY = currentY;
        break;
        
      case 'L': // Line to
        segments.push({
          x1: currentX,
          y1: currentY,
          x2: args[0],
          y2: args[1]
        });
        currentX = args[0];
        currentY = args[1];
        break;
        
      case 'H': // Horizontal line
        segments.push({
          x1: currentX,
          y1: currentY,
          x2: args[0],
          y2: currentY
        });
        currentX = args[0];
        break;
        
      case 'V': // Vertical line
        segments.push({
          x1: currentX,
          y1: currentY,
          x2: currentX,
          y2: args[0]
        });
        currentY = args[0];
        break;
        
      case 'Z': // Close path
        segments.push({
          x1: currentX,
          y1: currentY,
          x2: startX,
          y2: startY
        });
        break;
        
      default:
        // Unsupported command (curves, arcs, etc.)
        return null;
    }
  }
  
  return segments;
}
```

### SVG to Pure RN Converter

```javascript
class SVGToPureRN {
  static convertElement(element, props) {
    const { stroke, strokeWidth, fill } = props;
    
    switch (element.type) {
      case 'Circle':
        return this.convertCircle(element.props, { stroke, strokeWidth, fill });
      case 'Rect':
        return this.convertRect(element.props, { stroke, strokeWidth, fill });
      case 'Line':
        return this.convertLine(element.props, { stroke, strokeWidth });
      case 'Path':
        return this.convertPath(element.props, { stroke, strokeWidth, fill });
      default:
        return null;
    }
  }
  
  static convertCircle({ cx, cy, r }, { stroke, strokeWidth, fill }) {
    return (
      <PureCircle
        cx={cx}
        cy={cy}
        r={r}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
      />
    );
  }
  
  static convertRect({ x, y, width, height, rx }, { stroke, strokeWidth, fill }) {
    return (
      <PureRect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
      />
    );
  }
  
  static convertLine({ x1, y1, x2, y2 }, { stroke, strokeWidth }) {
    return (
      <PureLine
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    );
  }
  
  static convertPath({ d }, { stroke, strokeWidth }) {
    const segments = parseSimplePath(d);
    
    if (!segments) {
      console.warn('Path contains unsupported commands:', d);
      return null;
    }
    
    return segments.map((seg, index) => (
      <PureLine
        key={index}
        x1={seg.x1}
        y1={seg.y1}
        x2={seg.x2}
        y2={seg.y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    ));
  }
}
```

---

## 🎨 Complete Icon Conversions

### Example 1: PlusIcon (Fully Convertible) ✅

#### Original SVG
```javascript
export const PlusIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M5 12h14" />
    <Path d="M12 5v14" />
  </Svg>
);
```

#### Pure React Native
```javascript
export const PlusIconPure = ({ size = 24, color = "black", strokeWidth = 2 }) => (
  <View style={{ width: size, height: size }}>
    {/* Horizontal line */}
    <View
      style={{
        position: 'absolute',
        left: 5,
        top: 12 - strokeWidth / 2,
        width: 14,
        height: strokeWidth,
        backgroundColor: color,
      }}
    />
    {/* Vertical line */}
    <View
      style={{
        position: 'absolute',
        left: 12 - strokeWidth / 2,
        top: 5,
        width: strokeWidth,
        height: 14,
        backgroundColor: color,
      }}
    />
  </View>
);
```

### Example 2: CheckCircleIcon (Fully Convertible) ✅

#### Original SVG
```javascript
export const CheckCircleIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="m9 12 2 2 4-4" />
    <Circle cx="12" cy="12" r="10" />
  </Svg>
);
```

#### Pure React Native
```javascript
export const CheckCircleIconPure = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size }}>
      {/* Circle */}
      <View
        style={{
          position: 'absolute',
          left: (2 - strokeWidth / 2) * scale,
          top: (2 - strokeWidth / 2) * scale,
          width: 20 * scale,
          height: 20 * scale,
          borderRadius: 10 * scale,
          borderColor: color,
          borderWidth: strokeWidth,
        }}
      />
      {/* Check mark - first line */}
      <PureLine
        x1={9 * scale}
        y1={12 * scale}
        x2={11 * scale}
        y2={14 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Check mark - second line */}
      <PureLine
        x1={11 * scale}
        y1={14 * scale}
        x2={15 * scale}
        y2={10 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};
```

### Example 3: XIcon (Fully Convertible) ✅

#### Original SVG
```javascript
export const XIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Svg>
);
```

#### Pure React Native
```javascript
export const XIconPure = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size }}>
      {/* First diagonal */}
      <PureLine
        x1={18 * scale}
        y1={6 * scale}
        x2={6 * scale}
        y2={18 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      {/* Second diagonal */}
      <PureLine
        x1={6 * scale}
        y1={6 * scale}
        x2={18 * scale}
        y2={18 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};
```

### Example 4: MinusIcon (Fully Convertible) ✅

#### Original SVG
```javascript
export const MinusIcon = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}>
    <Path d="M5 12h14" />
  </Svg>
);
```

#### Pure React Native
```javascript
export const MinusIconPure = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  const scale = size / 24;
  
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: 'absolute',
          left: 5 * scale,
          top: (12 - strokeWidth / 2) * scale,
          width: 14 * scale,
          height: strokeWidth,
          backgroundColor: color,
        }}
      />
    </View>
  );
};
```

---

## 🚫 Icons That Cannot Be Converted

### Complex Path Icons (Not Convertible)

These icons use curves, arcs, or complex path commands that can't be replicated with Views:

1. **ActivityIcon** - Complex bezier curves
2. **AlertTriangleIcon** - Curved triangle edges
3. **BugIcon** - Multiple curves
4. **EyeIcon** - Elliptical eye shape
5. **LinkIcon** - Curved chain links
6. **PaletteIcon** - Complex palette shape
7. **PlayIcon** - Triangular play button with curves
8. **RefreshCwIcon** - Circular arrows
9. **SettingsIcon** - Gear teeth
10. **ZapIcon** - Lightning bolt

### Workaround for Complex Icons

```javascript
// Option 1: Use pre-rendered PNGs
import ActivityIconPNG from './icons/activity.png';

export const ActivityIconPure = ({ size = 24 }) => (
  <Image
    source={ActivityIconPNG}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

// Option 2: Simplified geometric version
export const ActivityIconSimplified = ({ size = 24, color = "black" }) => (
  <View style={{ width: size, height: size }}>
    {/* Create simplified version with lines only */}
    <PureLine x1={2} y1={12} x2={6} y2={12} stroke={color} strokeWidth={2} />
    <PureLine x1={6} y1={12} x2={9} y2={4} stroke={color} strokeWidth={2} />
    <PureLine x1={9} y1={4} x2={12} y2={20} stroke={color} strokeWidth={2} />
    <PureLine x1={12} y1={20} x2={15} y2={8} stroke={color} strokeWidth={2} />
    <PureLine x1={15} y1={8} x2={18} y2={12} stroke={color} strokeWidth={2} />
    <PureLine x1={18} y1={12} x2={22} y2={12} stroke={color} strokeWidth={2} />
  </View>
);

// Option 3: Use icon fonts (requires setup)
import Icon from 'react-native-vector-icons/Feather';

export const ActivityIconFont = ({ size = 24, color = "black" }) => (
  <Icon name="activity" size={size} color={color} />
);
```

---

## 🛠 Complete Implementation Example

```javascript
// PureRNIcons.js
import React from 'react';
import { View, Image } from 'react-native';

// Base Components
const PureCircle = ({ cx, cy, r, stroke, strokeWidth = 0, fill = 'transparent' }) => {
  const diameter = r * 2;
  return (
    <View
      style={{
        position: 'absolute',
        left: cx - r - strokeWidth / 2,
        top: cy - r - strokeWidth / 2,
        width: diameter,
        height: diameter,
        borderRadius: r,
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: strokeWidth,
      }}
    />
  );
};

const PureLine = ({ x1, y1, x2, y2, stroke, strokeWidth = 2 }) => {
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  
  return (
    <View
      style={{
        position: 'absolute',
        left: x1,
        top: y1 - strokeWidth / 2,
        width: length,
        height: strokeWidth,
        backgroundColor: stroke,
        transform: [{ rotate: `${angle}deg` }],
        transformOrigin: 'left center',
      }}
    />
  );
};

const PureRect = ({ x, y, width, height, rx = 0, stroke, strokeWidth = 0, fill = 'transparent' }) => (
  <View
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      backgroundColor: fill,
      borderRadius: rx,
      borderColor: stroke,
      borderWidth: strokeWidth,
    }}
  />
);

// Icon Components
export const PlusIconPure = ({ size = 24, color = "black", strokeWidth = 2 }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: 'absolute',
        left: 5 * (size / 24),
        top: (12 - strokeWidth / 2) * (size / 24),
        width: 14 * (size / 24),
        height: strokeWidth,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: 'absolute',
        left: (12 - strokeWidth / 2) * (size / 24),
        top: 5 * (size / 24),
        width: strokeWidth,
        height: 14 * (size / 24),
        backgroundColor: color,
      }}
    />
  </View>
);

export const CheckIconPure = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size }}>
      <PureLine
        x1={20 * scale}
        y1={6 * scale}
        x2={9 * scale}
        y2={17 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <PureLine
        x1={9 * scale}
        y1={17 * scale}
        x2={4 * scale}
        y2={12 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};

export const XIconPure = ({ size = 24, color = "black", strokeWidth = 2 }) => {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size }}>
      <PureLine
        x1={18 * scale}
        y1={6 * scale}
        x2={6 * scale}
        y2={18 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <PureLine
        x1={6 * scale}
        y1={6 * scale}
        x2={18 * scale}
        y2={18 * scale}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </View>
  );
};

// Usage Example
export default function IconDemo() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PlusIconPure size={48} color="blue" strokeWidth={3} />
      <CheckIconPure size={48} color="green" strokeWidth={3} />
      <XIconPure size={48} color="red" strokeWidth={3} />
    </View>
  );
}
```

---

## 📊 Conversion Success Rate Analysis

Based on your icons.ts file:

| Category | Count | Convertible | Notes |
|----------|-------|-------------|-------|
| **Fully Convertible** | 15 | ✅ Yes | Simple lines, circles, rects |
| **Partially Convertible** | 10 | ⚠️ Partial | Need simplification |
| **Not Convertible** | 25+ | ❌ No | Complex paths with curves |

### Fully Convertible Icons:
- PlusIcon
- MinusIcon
- XIcon
- CheckIcon (simplified)
- HashIcon
- PauseIcon
- AlertCircleIcon (circle + lines)
- InfoIcon (circle + lines)
- TimerIcon (circle + lines)

### Requires Simplification:
- ChevronIcons (can use CSS triangles)
- FilterIcon (horizontal lines only)
- ServerIcon (rectangles + dots)
- CopyIcon (overlapping rectangles)

### Not Convertible (Complex Paths):
- ActivityIcon
- BugIcon
- EyeIcon
- LinkIcon
- RefreshCwIcon
- SettingsIcon
- ZapIcon
- PaletteIcon
- And most others with curves

---

## 🎯 Recommendations

### For Your Dev Tool:

1. **Use Pure RN for Simple Icons**: Plus, Minus, X, Check marks
2. **Create Simplified Versions**: For medium complexity icons
3. **Use PNG/SVG Assets**: For complex icons that can't be converted
4. **Consider Icon Fonts**: As a middle ground (requires minimal setup)

### Best Approach:
```javascript
// Hybrid approach
const Icon = ({ name, size, color }) => {
  // Try pure RN first
  if (PURE_RN_ICONS[name]) {
    return PURE_RN_ICONS[name]({ size, color });
  }
  
  // Fall back to PNG for complex icons
  if (PNG_ICONS[name]) {
    return <Image source={PNG_ICONS[name]} style={{ width: size, height: size }} />;
  }
  
  // Default fallback
  return <View style={{ width: size, height: size, backgroundColor: '#ccc' }} />;
};
```

This gives you the best of both worlds - pure RN where possible, assets where necessary!