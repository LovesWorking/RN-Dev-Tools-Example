# Complete React Native SVG to Pure React Native API Migration Guide

## 📚 Overview

This guide analyzes what's possible when creating SVG-like graphics using only Pure React Native APIs without any native dependencies. This is designed for creating a minimal SVG renderer that works in Expo Go and any React Native app without native modules.

## 🎯 Quick Summary

### ✅ What's Possible with Pure React Native
- Basic shapes (rectangles, squares)
- Simple lines (horizontal/vertical)
- Basic circles (using borderRadius)
- Basic transforms (scale, rotate, translate)
- Basic gradients (limited)
- Touch interactions
- Simple animations

### ❌ What Requires Native Code
- Complex path drawing
- Bezier curves
- True SVG text rendering
- Clipping paths
- Masks
- Filters
- Patterns
- Complex gradients

---

## Complete API Mapping

### 1. Rect → View with styles

#### react-native-svg
```javascript
import { Rect } from 'react-native-svg';

<Rect
  x={10}
  y={20}
  width={100}
  height={50}
  fill="blue"
  stroke="red"
  strokeWidth={2}
  rx={5}
  ry={5}
/>
```

#### Pure React Native
```javascript
import { View } from 'react-native';

<View
  style={{
    position: 'absolute',
    left: 10,
    top: 20,
    width: 100,
    height: 50,
    backgroundColor: 'blue',
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 5,
  }}
/>
```

---

### 2. Circle → View with borderRadius

#### react-native-svg
```javascript
import { Circle } from 'react-native-svg';

<Circle
  cx={50}
  cy={50}
  r={30}
  fill="green"
  stroke="black"
  strokeWidth={1}
/>
```

#### Pure React Native
```javascript
import { View } from 'react-native';

const radius = 30;
<View
  style={{
    position: 'absolute',
    left: 50 - radius, // cx - r
    top: 50 - radius,  // cy - r
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    backgroundColor: 'green',
    borderColor: 'black',
    borderWidth: 1,
  }}
/>
```

---

### 3. Ellipse → View with borderRadius + transform

#### react-native-svg
```javascript
import { Ellipse } from 'react-native-svg';

<Ellipse
  cx={100}
  cy={60}
  rx={50}
  ry={30}
  fill="yellow"
/>
```

#### Pure React Native
```javascript
import { View } from 'react-native';

const rx = 50;
const ry = 30;
<View
  style={{
    position: 'absolute',
    left: 100 - rx,
    top: 60 - ry,
    width: rx * 2,
    height: ry * 2,
    borderRadius: rx,
    backgroundColor: 'yellow',
    transform: [{ scaleY: ry / rx }],
  }}
/>
```

---

### 4. Line → View with rotation

#### react-native-svg
```javascript
import { Line } from 'react-native-svg';

<Line
  x1={10}
  y1={10}
  x2={100}
  y2={100}
  stroke="purple"
  strokeWidth={3}
/>
```

#### Pure React Native
```javascript
import { View } from 'react-native';

// Calculate line properties
const x1 = 10, y1 = 10, x2 = 100, y2 = 100;
const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

<View
  style={{
    position: 'absolute',
    left: x1,
    top: y1,
    width: length,
    height: 3, // strokeWidth
    backgroundColor: 'purple',
    transformOrigin: 'left center',
    transform: [{ rotate: `${angle}deg` }],
  }}
/>
```

---

### 5. Polygon → Multiple Views (limited)

#### react-native-svg
```javascript
import { Polygon } from 'react-native-svg';

<Polygon
  points="50,5 95,97 5,97"
  fill="lime"
  stroke="purple"
  strokeWidth={1}
/>
```

#### Pure React Native (Triangle approximation)
```javascript
import { View } from 'react-native';

// Can only approximate with CSS triangles
<View
  style={{
    width: 0,
    height: 0,
    borderLeftWidth: 45,
    borderRightWidth: 45,
    borderBottomWidth: 92,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'lime',
  }}
/>
```

---

### 6. G (Group) → View container

#### react-native-svg
```javascript
import { G, Circle, Rect } from 'react-native-svg';

<G transform="translate(50, 50) rotate(45)">
  <Circle r={20} fill="red" />
  <Rect width={40} height={40} fill="blue" />
</G>
```

#### Pure React Native
```javascript
import { View } from 'react-native';

<View
  style={{
    transform: [
      { translateX: 50 },
      { translateY: 50 },
      { rotate: '45deg' }
    ],
  }}
>
  <View style={circleStyle} />
  <View style={rectStyle} />
</View>
```

---

### 7. LinearGradient → react-native-linear-gradient (requires Expo)

#### react-native-svg
```javascript
import { LinearGradient, Stop, Rect, Defs } from 'react-native-svg';

<Defs>
  <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
    <Stop offset="0%" stopColor="rgb(255,255,0)" />
    <Stop offset="100%" stopColor="rgb(255,0,0)" />
  </LinearGradient>
</Defs>
<Rect fill="url(#grad)" />
```

#### Pure React Native (Approximation)
```javascript
import { View } from 'react-native';

// Basic gradient simulation with multiple views
const GradientView = () => {
  const steps = 10;
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: steps }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            backgroundColor: `rgb(255, ${255 - (255 * i / steps)}, 0)`,
          }}
        />
      ))}
    </View>
  );
};
```

---

### 8. Text → Text component (limited SVG features)

#### react-native-svg
```javascript
import { Text as SvgText } from 'react-native-svg';

<SvgText
  x={50}
  y={50}
  fontSize="20"
  fill="black"
  textAnchor="middle"
  transform="rotate(45 50 50)"
>
  Hello World
</SvgText>
```

#### Pure React Native
```javascript
import { Text, View } from 'react-native';

<View
  style={{
    position: 'absolute',
    left: 50,
    top: 50,
    transform: [{ rotate: '45deg' }],
  }}
>
  <Text
    style={{
      fontSize: 20,
      color: 'black',
      textAlign: 'center',
    }}
  >
    Hello World
  </Text>
</View>
```

---

### 9. Image → Image component

#### react-native-svg
```javascript
import { Image as SvgImage } from 'react-native-svg';

<SvgImage
  x={10}
  y={10}
  width={100}
  height={100}
  href={require('./image.png')}
  preserveAspectRatio="xMidYMid slice"
/>
```

#### Pure React Native
```javascript
import { Image } from 'react-native';

<Image
  source={require('./image.png')}
  style={{
    position: 'absolute',
    left: 10,
    top: 10,
    width: 100,
    height: 100,
  }}
  resizeMode="cover"
/>
```

---

### 10. Transform → transform style

#### react-native-svg
```javascript
<G transform="translate(50 100) rotate(45) scale(1.5)">
  {/* children */}
</G>
```

#### Pure React Native
```javascript
<View
  style={{
    transform: [
      { translateX: 50 },
      { translateY: 100 },
      { rotate: '45deg' },
      { scale: 1.5 },
    ],
  }}
>
  {/* children */}
</View>
```

---

## 🚫 APIs Not Possible Without Native Code

### 1. Path ❌
```javascript
// react-native-svg
<Path d="M10 10 L90 90 Q50 50 90 10 Z" />

// Pure RN: ❌ Cannot draw arbitrary bezier curves
// Workaround: Pre-render as image or use multiple line segments
```

### 2. ClipPath ❌
```javascript
// react-native-svg
<ClipPath id="clip">
  <Circle r={50} />
</ClipPath>

// Pure RN: ❌ No clipping paths available
// Workaround: Use overflow: 'hidden' for rectangular clipping only
```

### 3. Mask ❌
```javascript
// react-native-svg
<Mask id="mask">
  <Rect fill="white" />
</Mask>

// Pure RN: ❌ No masking support
// Workaround: None
```

### 4. Pattern ❌
```javascript
// react-native-svg
<Pattern id="pattern" patternUnits="userSpaceOnUse">
  <Circle r={5} fill="red" />
</Pattern>

// Pure RN: ❌ No pattern fill support
// Workaround: Use background images with repeat
```

### 5. Filters (Blur, ColorMatrix, etc.) ❌
```javascript
// react-native-svg
<FeGaussianBlur stdDeviation={5} />
<FeColorMatrix type="saturate" values={0} />

// Pure RN: ❌ No filter effects
// Workaround: Pre-process images or use external libraries
```

### 6. Gradients (Complex) ❌
```javascript
// react-native-svg
<RadialGradient>
  <Stop offset="0%" stopColor="gold" />
  <Stop offset="95%" stopColor="red" />
</RadialGradient>

// Pure RN: ❌ No radial gradients
// Workaround: Simulate with multiple concentric circles
```

### 7. TextPath ❌
```javascript
// react-native-svg
<TextPath href="#path">
  Text along a path
</TextPath>

// Pure RN: ❌ Cannot curve text along paths
// Workaround: None
```

### 8. Markers ❌
```javascript
// react-native-svg
<Marker id="arrow" markerWidth={10} markerHeight={10}>
  <Path d="M 0 0 L 10 5 L 0 10 z" />
</Marker>

// Pure RN: ❌ No marker support
// Workaround: Manually position elements at path endpoints
```

### 9. Symbol & Use ❌
```javascript
// react-native-svg
<Symbol id="icon" viewBox="0 0 20 20">
  <Circle r={10} />
</Symbol>
<Use href="#icon" x={10} y={10} />

// Pure RN: ❌ No symbol reuse mechanism
// Workaround: Create reusable React components
```

### 10. ForeignObject ❌
```javascript
// react-native-svg
<ForeignObject x={10} y={10}>
  <View />
</ForeignObject>

// Pure RN: ❌ Already in React Native context
// Workaround: Not needed, just use regular RN components
```

---

## 🛠 Utility Functions for Pure RN SVG

### Calculate Line Properties
```javascript
function calculateLine(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  return {
    length,
    angle,
    midX: (x1 + x2) / 2,
    midY: (y1 + y2) / 2,
  };
}
```

### Create Star Shape
```javascript
function createStar(cx, cy, spikes, outerRadius, innerRadius) {
  const views = [];
  const step = Math.PI / spikes;
  
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    
    // Create line from center to point
    views.push(
      <View
        key={i}
        style={createLineStyle(cx, cy, x, y)}
      />
    );
  }
  
  return views;
}
```

### Simulate Arc
```javascript
function createArc(cx, cy, radius, startAngle, endAngle, segments = 20) {
  const views = [];
  const angleStep = (endAngle - startAngle) / segments;
  
  for (let i = 0; i < segments; i++) {
    const angle = startAngle + angleStep * i;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    
    views.push(
      <View
        key={i}
        style={{
          position: 'absolute',
          left: x - 1,
          top: y - 1,
          width: 2,
          height: 2,
          backgroundColor: 'black',
          borderRadius: 1,
        }}
      />
    );
  }
  
  return views;
}
```

---

## 📊 Feature Comparison Table

| Feature | react-native-svg | Pure React Native | Workaround |
|---------|-----------------|-------------------|------------|
| **Shapes** |
| Rectangle | ✅ Full support | ✅ View | Perfect match |
| Circle | ✅ Full support | ✅ borderRadius | Perfect for circles |
| Ellipse | ✅ Full support | ⚠️ Transform scale | Good approximation |
| Line | ✅ Full support | ⚠️ Rotated View | Works for straight lines |
| Polyline | ✅ Full support | ❌ Multiple Views | Complex implementation |
| Polygon | ✅ Full support | ❌ CSS triangles only | Very limited |
| Path | ✅ Full support | ❌ Not possible | Pre-render as image |
| **Styling** |
| Fill | ✅ Any color/gradient | ✅ backgroundColor | Solid colors only |
| Stroke | ✅ Full support | ⚠️ border | Limited to all sides |
| StrokeWidth | ✅ Full support | ✅ borderWidth | All sides only |
| StrokeDasharray | ✅ Full support | ❌ Not possible | No dashed borders |
| Opacity | ✅ Full support | ✅ opacity | Perfect match |
| **Gradients** |
| Linear | ✅ Full support | ⚠️ Multiple views | Basic simulation |
| Radial | ✅ Full support | ❌ Not possible | Multiple circles |
| **Transforms** |
| Translate | ✅ Full support | ✅ translateX/Y | Perfect match |
| Rotate | ✅ Full support | ✅ rotate | Perfect match |
| Scale | ✅ Full support | ✅ scale | Perfect match |
| Skew | ✅ Full support | ✅ skewX/Y | iOS only |
| Matrix | ✅ Full support | ✅ transform matrix | Advanced usage |
| **Text** |
| Basic Text | ✅ Full support | ✅ Text component | Different positioning |
| Text Path | ✅ Full support | ❌ Not possible | No workaround |
| TSpan | ✅ Full support | ❌ Text nesting | Limited support |
| **Advanced** |
| Clipping | ✅ Full support | ❌ overflow only | Rectangular only |
| Masking | ✅ Full support | ❌ Not possible | No workaround |
| Filters | ✅ Full support | ❌ Not possible | Pre-process images |
| Patterns | ✅ Full support | ❌ Not possible | Background images |
| Markers | ✅ Full support | ❌ Not possible | Manual positioning |
| **Interaction** |
| Touch Events | ✅ Full support | ✅ TouchableOpacity | Perfect match |
| Gestures | ✅ Full support | ✅ PanResponder | Perfect match |
| **Animation** |
| Basic | ✅ Full support | ✅ Animated API | Perfect match |
| Path Morph | ✅ Full support | ❌ Not possible | No workaround |
| **Performance** |
| Hardware Accel | ✅ Native rendering | ✅ View rendering | Both optimized |
| Virtualization | ⚠️ Manual | ✅ FlatList | Better in RN |

---

## 🎯 Best Practices for Pure RN SVG

### 1. Use Composition
```javascript
// Create reusable shape components
const Circle = ({ cx, cy, r, fill, stroke, strokeWidth }) => (
  <View
    style={{
      position: 'absolute',
      left: cx - r,
      top: cy - r,
      width: r * 2,
      height: r * 2,
      borderRadius: r,
      backgroundColor: fill,
      borderColor: stroke,
      borderWidth: strokeWidth,
    }}
  />
);
```

### 2. Optimize Renders
```javascript
// Use React.memo for static shapes
const StaticShape = React.memo(({ style }) => (
  <View style={style} />
));
```

### 3. Handle Responsive Sizing
```javascript
// Use dimensions for scaling
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = width / 375; // Base width

const scaledSize = (size) => size * scale;
```

### 4. Create SVG-like API
```javascript
// Wrapper component for SVG-like syntax
const Svg = ({ width, height, viewBox, children }) => {
  const [vx, vy, vw, vh] = viewBox ? viewBox.split(' ').map(Number) : [0, 0, width, height];
  const scaleX = width / vw;
  const scaleY = height / vh;
  
  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <View style={{ transform: [{ scaleX }, { scaleY }] }}>
        {children}
      </View>
    </View>
  );
};
```

---

## 🚀 Example: Complete Pure RN SVG Implementation

```javascript
import React from 'react';
import { View, Text, Animated } from 'react-native';

// Pure RN SVG-like components
const PureSvg = {
  Svg: ({ width, height, children }) => (
    <View style={{ width, height, overflow: 'hidden' }}>
      {children}
    </View>
  ),
  
  Rect: ({ x, y, width, height, fill, stroke, strokeWidth, rx = 0 }) => (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: strokeWidth,
        borderRadius: rx,
      }}
    />
  ),
  
  Circle: ({ cx, cy, r, fill, stroke, strokeWidth }) => (
    <View
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        backgroundColor: fill,
        borderColor: stroke,
        borderWidth: strokeWidth || 0,
      }}
    />
  ),
  
  Line: ({ x1, y1, x2, y2, stroke, strokeWidth }) => {
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
  },
  
  Text: ({ x, y, fontSize, fill, children }) => (
    <Text
      style={{
        position: 'absolute',
        left: x,
        top: y,
        fontSize,
        color: fill,
      }}
    >
      {children}
    </Text>
  ),
  
  G: ({ transform, children }) => {
    // Parse transform string (simplified)
    const transforms = [];
    if (transform) {
      if (transform.includes('translate')) {
        const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
        if (match) {
          transforms.push({ translateX: parseFloat(match[1]) });
          transforms.push({ translateY: parseFloat(match[2]) });
        }
      }
      if (transform.includes('rotate')) {
        const match = transform.match(/rotate\(([^)]+)\)/);
        if (match) {
          transforms.push({ rotate: `${match[1]}deg` });
        }
      }
      if (transform.includes('scale')) {
        const match = transform.match(/scale\(([^)]+)\)/);
        if (match) {
          transforms.push({ scale: parseFloat(match[1]) });
        }
      }
    }
    
    return (
      <View style={{ transform: transforms }}>
        {children}
      </View>
    );
  },
};

// Example usage
const ExampleSVG = () => (
  <PureSvg.Svg width={200} height={200}>
    <PureSvg.Rect
      x={10}
      y={10}
      width={180}
      height={180}
      fill="#f0f0f0"
      stroke="#333"
      strokeWidth={2}
      rx={10}
    />
    <PureSvg.Circle
      cx={100}
      cy={100}
      r={50}
      fill="lightblue"
      stroke="blue"
      strokeWidth={2}
    />
    <PureSvg.Line
      x1={50}
      y1={100}
      x2={150}
      y2={100}
      stroke="red"
      strokeWidth={3}
    />
    <PureSvg.Text
      x={100}
      y={100}
      fontSize={16}
      fill="black"
    >
      Pure RN
    </PureSvg.Text>
  </PureSvg.Svg>
);

export default ExampleSVG;
```

---

## 📝 Summary

### ✅ Use Pure RN When:
- Building simple shapes (rectangles, circles)
- Need to work in Expo Go
- Don't want native dependencies
- Performance is critical for simple graphics
- Need basic animations and transforms

### ❌ Use react-native-svg When:
- Need complex path drawing
- Require bezier curves
- Need text along paths
- Want SVG filters and effects
- Need clipping and masking
- Require gradient fills
- Want full SVG compatibility

### 🎯 Recommended Approach for Dev Tool:
For a dev tool that needs to work without native dependencies, focus on:
1. **Basic shapes**: Rect, Circle, Line
2. **Simple transforms**: translate, rotate, scale
3. **Touch interactions**: Using TouchableOpacity
4. **Basic animations**: Using Animated API
5. **Text rendering**: Using Text component
6. **Image display**: Using Image component

Avoid trying to implement:
- Complex paths
- Filters
- Gradients (beyond basic)
- Clipping/Masking
- Text paths

This approach will give you a functional SVG-like renderer that works everywhere without native dependencies!