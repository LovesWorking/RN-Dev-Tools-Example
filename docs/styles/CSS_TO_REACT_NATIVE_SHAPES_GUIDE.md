# Complete CSS to React Native Shapes & Icons Conversion Guide

> A comprehensive guide for converting CSS shapes, icons, and visual effects to pure React Native styles without SVG or external libraries.

## 📚 Table of Contents

### Core Concepts

- [Understanding the Differences](#understanding-the-differences)
- [Key Conversion Principles](#key-conversion-principles)
- [Transform Limitations & Workarounds](#transform-limitations--workarounds)

### CSS to React Native Mappings

- [Border Tricks → Triangle Shapes](#1-border-tricks--triangle-shapes)
- [Border Radius → Circles & Ovals](#2-border-radius--circles--ovals)
- [Transform → Rotation & Skew](#3-transform--rotation--skew)
- [Pseudo Elements → Multiple Views](#4-pseudo-elements--multiple-views)
- [Box Shadow → Shadow/Elevation](#5-box-shadow--shadowelevation)
- [Gradients → Alternative Approaches](#6-gradients--alternative-approaches)
- [Clip Path → View Masking](#7-clip-path--view-masking)
- [Multiple Shadows → Layered Views](#8-multiple-shadows--layered-views)

### Advanced Shape Patterns

- [Complex Shapes with Composition](#9-complex-shapes-with-composition)
- [Icon Creation Techniques](#10-icon-creation-techniques)
- [WiFi Symbol Example](#11-wifi-symbol-example)
- [Arrow Patterns](#12-arrow-patterns)
- [Badge & Ribbon Shapes](#13-badge--ribbon-shapes)
- [Geometric Polygons](#14-geometric-polygons)

### Complete Shape Library

- [Basic Shapes](#basic-shapes)
- [Triangles & Arrows](#triangles--arrows)
- [Stars & Polygons](#stars--polygons)
- [Curves & Organic Shapes](#curves--organic-shapes)
- [UI Elements](#ui-elements)
- [Social Media Icons](#social-media-icons)

---

## Understanding the Differences

### CSS vs React Native Style System

| CSS Feature                     | React Native Equivalent                 | Notes                               |
| ------------------------------- | --------------------------------------- | ----------------------------------- |
| `::before`, `::after`           | Multiple `<View>` components            | Use absolute positioning            |
| `border-radius: 50%`            | `borderRadius: width/2`                 | Must use absolute values            |
| `transform-origin`              | Limited support                         | Use positioning workarounds         |
| `clip-path`                     | Not supported                           | Use overflow: 'hidden'              |
| `background: linear-gradient()` | Not native                              | Use libraries or multiple views     |
| `box-shadow`                    | `shadowX` (iOS) / `elevation` (Android) | Platform differences                |
| `border-radius: X / Y`          | Not supported                           | Use `scaleX/Y` with circular radius |
| `content: ""`                   | Separate `<View>`                       | No pseudo-elements                  |
| `radial-gradient()`             | Not supported                           | Use concentric circles              |
| `border-style: dotted/dashed`   | `borderStyle: 'dotted'/'dashed'`        | Limited support                     |

---

## Key Conversion Principles

### 1. **Zero Dimensions with Borders = Triangles**

```css
/* CSS Triangle */
.triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid red;
}
```

```javascript
// React Native Triangle
triangle: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 50,
  borderRightWidth: 50,
  borderBottomWidth: 100,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: 'red'
}
```

### 2. **Pseudo Elements = Multiple Views**

```css
/* CSS with pseudo element */
.shape::before {
  content: "";
  position: absolute;
  /* styles */
}
```

```javascript
// React Native equivalent
<View style={styles.shapeContainer}>
  <View style={styles.shapeBefore} />
  <View style={styles.shapeMain} />
</View>
```

### 3. **Percentage Border Radius = Calculated Values**

```css
/* CSS */
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
```

```javascript
// React Native
circle: {
  width: 100,
  height: 100,
  borderRadius: 50, // Half of width/height
}
```

---

## CSS to React Native Mappings

## 1. Border Tricks → Triangle Shapes

### Pattern Recognition

When you see `width: 0`, `height: 0` with colored borders, it creates triangles.

```javascript
// Triangle Direction Formula:
// - Colored border opposite to direction
// - Transparent borders on sides
// - Direction = opposite of colored border

// UP Triangle = colored BOTTOM border
triangleUp: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 50,
  borderRightWidth: 50,
  borderBottomWidth: 100,
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderBottomColor: '#FF0000'
}

// RIGHT Triangle = colored LEFT border
triangleRight: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderTopWidth: 50,
  borderBottomWidth: 50,
  borderLeftWidth: 100,
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent',
  borderLeftColor: '#FF0000'
}

// Corner triangles use two borders
triangleCorner: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderRightWidth: 100,
  borderTopWidth: 100,
  borderRightColor: 'transparent',
  borderTopColor: '#FF0000'
}
```

## 2. Border Radius → Circles & Ovals

### Circle Creation

```javascript
// Perfect Circle
circle: {
  width: 100,
  height: 100,
  borderRadius: 50, // width/2
  backgroundColor: '#FF0000'
}

// Oval - Using Scale Transform
oval: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#FF0000',
  transform: [{ scaleX: 2 }] // Stretch horizontally
}

// Egg Shape - Asymmetric Border Radius
egg: {
  width: 126,
  height: 180,
  backgroundColor: '#FF0000',
  borderTopLeftRadius: 63,
  borderTopRightRadius: 63,
  borderBottomLeftRadius: 63,
  borderBottomRightRadius: 63,
  transform: [{ scaleX: 1 }, { scaleY: 1.4 }]
}
```

## 3. Transform → Rotation & Skew

### Transform Conversions

```javascript
// CSS: transform: rotate(45deg)
// React Native:
transform: [{ rotate: "45deg" }];

// CSS: transform: skew(20deg)
// React Native:
transform: [{ skewX: "20deg" }];

// CSS: transform: scale(1.5)
// React Native:
transform: [{ scale: 1.5 }];

// Combined transforms (order matters!)
transform: [{ rotate: "45deg" }, { scaleX: 2 }, { translateY: 20 }];
```

## 4. Pseudo Elements → Multiple Views

### Converting ::before and ::after

```javascript
// CSS Heart Shape with pseudo elements
const Heart = () => (
  <View style={styles.heartContainer}>
    <View style={styles.heartShape}>
      <View style={styles.heartBefore} />
      <View style={styles.heartAfter} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  heartContainer: {
    width: 100,
    height: 90,
    position: "relative",
  },
  heartShape: {
    position: "relative",
    width: 100,
    height: 90,
  },
  heartBefore: {
    position: "absolute",
    width: 52,
    height: 80,
    left: 50,
    top: 0,
    backgroundColor: "red",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ rotate: "-45deg" }],
  },
  heartAfter: {
    position: "absolute",
    width: 52,
    height: 80,
    left: 0,
    top: 0,
    backgroundColor: "red",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ rotate: "45deg" }],
  },
});
```

## 5. Box Shadow → Shadow/Elevation

### Platform-Specific Shadows

```javascript
// iOS Shadow
iosShadow: {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84
}

// Android Elevation
androidShadow: {
  elevation: 5
}

// Cross-platform shadow
shadow: {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84
    },
    android: {
      elevation: 5
    }
  })
}
```

## 6. Gradients → Alternative Approaches

### Gradient Alternatives

Since React Native doesn't support CSS gradients natively, use these approaches:

```javascript
// 1. Multiple Layered Views (for simple gradients)
const GradientSimulation = () => (
  <View style={styles.gradientContainer}>
    <View
      style={[styles.gradientLayer, { opacity: 1, backgroundColor: "#FF0000" }]}
    />
    <View
      style={[
        styles.gradientLayer,
        { opacity: 0.8, backgroundColor: "#FF3333" },
      ]}
    />
    <View
      style={[
        styles.gradientLayer,
        { opacity: 0.6, backgroundColor: "#FF6666" },
      ]}
    />
    <View
      style={[
        styles.gradientLayer,
        { opacity: 0.4, backgroundColor: "#FF9999" },
      ]}
    />
    <View
      style={[
        styles.gradientLayer,
        { opacity: 0.2, backgroundColor: "#FFCCCC" },
      ]}
    />
  </View>
);

// 2. Concentric Circles (for radial gradients)
const RadialGradient = () => (
  <View style={styles.radialContainer}>
    <View
      style={[
        styles.radialCircle,
        { width: 100, height: 100, backgroundColor: "#FF0000" },
      ]}
    />
    <View
      style={[
        styles.radialCircle,
        { width: 80, height: 80, backgroundColor: "#FF3333" },
      ]}
    />
    <View
      style={[
        styles.radialCircle,
        { width: 60, height: 60, backgroundColor: "#FF6666" },
      ]}
    />
    <View
      style={[
        styles.radialCircle,
        { width: 40, height: 40, backgroundColor: "#FF9999" },
      ]}
    />
    <View
      style={[
        styles.radialCircle,
        { width: 20, height: 20, backgroundColor: "#FFCCCC" },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  gradientContainer: {
    height: 100,
    width: 200,
    position: "relative",
  },
  gradientLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  radialContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  radialCircle: {
    position: "absolute",
    borderRadius: 50,
  },
});
```

## 7. Clip Path → View Masking

### Overflow Hidden Technique

```javascript
// Diamond shape using rotation and overflow
diamond: {
  width: 100,
  height: 100,
  backgroundColor: 'red',
  transform: [{ rotate: '45deg' }],
  overflow: 'hidden'
}

// Curved corners using overflow
curvedCorner: {
  width: 100,
  height: 100,
  overflow: 'hidden',
  backgroundColor: 'transparent'
}
```

## 8. Multiple Shadows → Layered Views

### Space Invader Example (Multiple box-shadows)

```css
/* CSS with multiple box-shadows */
.space-invader {
  box-shadow:
    0 0 0 1em red,
    0 1em 0 1em red,
    -2.5em 1.5em 0 0.5em red;
  /* ... many more ... */
}
```

```javascript
// React Native: Create each shadow as a separate view
const SpaceInvader = () => (
  <View style={styles.spaceInvaderContainer}>
    <View style={[styles.pixel, { top: 0, left: 0 }]} />
    <View style={[styles.pixel, { top: 16, left: 0 }]} />
    <View style={[styles.pixel, { top: 24, left: -40, width: 8, height: 8 }]} />
    {/* ... more pixel views ... */}
  </View>
);

const styles = StyleSheet.create({
  spaceInvaderContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  pixel: {
    position: "absolute",
    width: 16,
    height: 16,
    backgroundColor: "red",
  },
});
```

---

## Advanced Shape Patterns

## 9. Complex Shapes with Composition

### Star Shape (5-pointed)

```javascript
const Star = () => (
  <View style={styles.starContainer}>
    <View style={styles.starMain} />
    <View style={styles.starBefore} />
    <View style={styles.starAfter} />
  </View>
);

const styles = StyleSheet.create({
  starContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  starMain: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 70,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    transform: [{ rotate: "35deg" }],
    position: "absolute",
    top: 0,
    left: 0,
  },
  starBefore: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderBottomWidth: 80,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    position: "absolute",
    top: -45,
    left: -65,
    transform: [{ rotate: "-35deg" }],
  },
  starAfter: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 100,
    borderRightWidth: 100,
    borderBottomWidth: 70,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    position: "absolute",
    top: 3,
    left: -105,
    transform: [{ rotate: "-70deg" }],
  },
});
```

## 10. Icon Creation Techniques

### Hamburger Menu Icon

```javascript
hamburgerMenu: {
  width: 30,
  height: 20,
  justifyContent: 'space-between'
},
hamburgerLine: {
  width: '100%',
  height: 3,
  backgroundColor: '#000'
}

// Usage
<View style={styles.hamburgerMenu}>
  <View style={styles.hamburgerLine} />
  <View style={styles.hamburgerLine} />
  <View style={styles.hamburgerLine} />
</View>
```

### Play Button

```javascript
playButton: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 40,
  borderTopWidth: 25,
  borderBottomWidth: 25,
  borderLeftColor: '#000',
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent'
}
```

### Close (X) Icon

```javascript
closeIcon: {
  width: 30,
  height: 30,
  position: 'relative'
},
closeLine1: {
  position: 'absolute',
  width: 30,
  height: 2,
  backgroundColor: '#000',
  transform: [{ rotate: '45deg' }],
  top: 14,
  left: 0
},
closeLine2: {
  position: 'absolute',
  width: 30,
  height: 2,
  backgroundColor: '#000',
  transform: [{ rotate: '-45deg' }],
  top: 14,
  left: 0
}

// Usage
<View style={styles.closeIcon}>
  <View style={styles.closeLine1} />
  <View style={styles.closeLine2} />
</View>
```

## 11. WiFi Symbol Example

### CSS WiFi Symbol Conversion

```css
/* Original CSS */
.wifi {
  width: 1em;
  height: 1em;
  background-color: transparent;
}
.wifi:before {
  width: 0.7em;
  height: 0.7em;
  background-image: radial-gradient(
    circle at 0 100%,
    currentcolor 0,
    currentcolor 17%,
    transparent 17%,
    transparent 28%,
    currentcolor 28%,
    currentcolor 36%,
    transparent 36% /* ... */
  );
  transform: translate(-50%, -50%) rotate(-45deg);
}
```

```javascript
// React Native WiFi Symbol
const WifiIcon = () => (
  <View style={styles.wifiContainer}>
    {/* Signal dot */}
    <View style={styles.wifiDot} />

    {/* Signal waves */}
    <View style={styles.wifiWave1} />
    <View style={styles.wifiWave2} />
    <View style={styles.wifiWave3} />
  </View>
);

const styles = StyleSheet.create({
  wifiContainer: {
    width: 60,
    height: 60,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  wifiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 0,
  },
  wifiWave1: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#000",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "-45deg" }],
    bottom: 8,
  },
  wifiWave2: {
    position: "absolute",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 3,
    borderColor: "#000",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "-45deg" }],
    bottom: 15,
  },
  wifiWave3: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#000",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    transform: [{ rotate: "-45deg" }],
    bottom: 22,
  },
});
```

## 12. Arrow Patterns

### Various Arrow Types

```javascript
// Right Arrow
arrowRight: {
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderLeftWidth: 30,
  borderTopWidth: 15,
  borderBottomWidth: 15,
  borderLeftColor: '#000',
  borderTopColor: 'transparent',
  borderBottomColor: 'transparent'
}

// Chevron Right
chevronRight: {
  width: 10,
  height: 10,
  borderRightWidth: 2,
  borderTopWidth: 2,
  borderColor: '#000',
  borderStyle: 'solid',
  transform: [{ rotate: '45deg' }]
}

// Arrow with Tail
const ArrowWithTail = () => (
  <View style={styles.arrowContainer}>
    <View style={styles.arrowTail} />
    <View style={styles.arrowHead} />
  </View>
);

const styles = {
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowTail: {
    width: 50,
    height: 2,
    backgroundColor: '#000'
  },
  arrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: '#000',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent'
  }
};
```

## 13. Badge & Ribbon Shapes

### Badge with Ribbon

```javascript
const BadgeRibbon = () => (
  <View style={styles.badgeContainer}>
    <View style={styles.badgeCircle}>
      <Text style={styles.badgeText}>1st</Text>
    </View>
    <View style={styles.ribbonLeft} />
    <View style={styles.ribbonRight} />
  </View>
);

const styles = StyleSheet.create({
  badgeContainer: {
    width: 100,
    height: 100,
    position: "relative",
    alignItems: "center",
  },
  badgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "gold",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  ribbonLeft: {
    position: "absolute",
    bottom: -20,
    left: 10,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 70,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    transform: [{ rotate: "-140deg" }],
  },
  ribbonRight: {
    position: "absolute",
    bottom: -20,
    right: 10,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 70,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    transform: [{ rotate: "140deg" }],
  },
});
```

## 14. Geometric Polygons

### Pentagon

```javascript
const Pentagon = () => (
  <View style={styles.pentagonContainer}>
    <View style={styles.pentagonTop} />
    <View style={styles.pentagonBottom} />
  </View>
);

const styles = StyleSheet.create({
  pentagonContainer: {
    width: 54,
    position: "relative",
  },
  pentagonTop: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 45,
    borderRightWidth: 45,
    borderBottomWidth: 35,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    position: "absolute",
    top: 0,
    left: -18,
  },
  pentagonBottom: {
    width: 54,
    height: 0,
    borderStyle: "solid",
    borderTopWidth: 50,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopColor: "red",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: 35,
  },
});
```

### Hexagon

```javascript
const Hexagon = () => (
  <View style={styles.hexagonContainer}>
    <View style={styles.hexagonBefore} />
    <View style={styles.hexagonMain} />
    <View style={styles.hexagonAfter} />
  </View>
);

const styles = StyleSheet.create({
  hexagonContainer: {
    width: 100,
    height: 55,
    position: "relative",
  },
  hexagonMain: {
    width: 100,
    height: 55,
    backgroundColor: "red",
  },
  hexagonBefore: {
    position: "absolute",
    top: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 25,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
  },
  hexagonAfter: {
    position: "absolute",
    bottom: -25,
    left: 0,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderTopWidth: 25,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "red",
  },
});
```

---

## Complete Shape Library

## Basic Shapes

```javascript
const basicShapes = StyleSheet.create({
  // Square
  square: {
    width: 100,
    height: 100,
    backgroundColor: "red",
  },

  // Rectangle
  rectangle: {
    width: 200,
    height: 100,
    backgroundColor: "blue",
  },

  // Circle
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "green",
  },

  // Oval
  oval: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "orange",
    transform: [{ scaleX: 2 }],
  },

  // Rounded Rectangle
  roundedRect: {
    width: 200,
    height: 100,
    borderRadius: 20,
    backgroundColor: "purple",
  },

  // Pill Shape
  pill: {
    width: 200,
    height: 60,
    borderRadius: 30,
    backgroundColor: "cyan",
  },
});
```

## Triangles & Arrows

```javascript
const triangleShapes = StyleSheet.create({
  // All 8 triangle directions
  triangleUp: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
  },

  // Equilateral Triangle
  equilateralTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 86.6, // height = width * √3/2
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "blue",
  },

  // Right-angled Triangle
  rightTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: "transparent",
    borderTopColor: "green",
  },
});
```

## Stars & Polygons

```javascript
// 6-pointed Star
const SixPointStar = () => (
  <View style={styles.starSixContainer}>
    <View style={styles.starSixTop} />
    <View style={styles.starSixBottom} />
  </View>
);

const styles = StyleSheet.create({
  starSixContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },
  starSixTop: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "red",
    position: "absolute",
    top: 0,
    left: 0,
  },
  starSixBottom: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderTopWidth: 100,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "red",
    position: "absolute",
    top: 30,
    left: 0,
  },
});
```

## Curves & Organic Shapes

```javascript
// Heart Shape
const Heart = () => (
  <View style={styles.heart}>
    <View style={styles.heartLeft} />
    <View style={styles.heartRight} />
  </View>
);

// Infinity Symbol
const Infinity = () => (
  <View style={styles.infinityContainer}>
    <View style={styles.infinityLeft} />
    <View style={styles.infinityRight} />
  </View>
);

// Pac-Man
const PacMan = () => <View style={styles.pacman} />;

const styles = StyleSheet.create({
  heart: {
    position: "relative",
    width: 100,
    height: 90,
  },
  heartLeft: {
    position: "absolute",
    width: 52,
    height: 80,
    left: 50,
    top: 0,
    backgroundColor: "red",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ rotate: "-45deg" }],
  },
  heartRight: {
    position: "absolute",
    width: 52,
    height: 80,
    left: 0,
    top: 0,
    backgroundColor: "red",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    transform: [{ rotate: "45deg" }],
  },
  infinityContainer: {
    width: 212,
    height: 100,
    position: "relative",
  },
  infinityLeft: {
    position: "absolute",
    width: 60,
    height: 60,
    borderWidth: 20,
    borderColor: "red",
    borderRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 50,
    transform: [{ rotate: "-45deg" }],
    left: 0,
    top: 0,
  },
  infinityRight: {
    position: "absolute",
    width: 60,
    height: 60,
    borderWidth: 20,
    borderColor: "red",
    borderRadius: 50,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    transform: [{ rotate: "45deg" }],
    right: 0,
    top: 0,
  },
  pacman: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderRightWidth: 60,
    borderTopWidth: 60,
    borderLeftWidth: 60,
    borderBottomWidth: 60,
    borderRightColor: "transparent",
    borderTopColor: "yellow",
    borderLeftColor: "yellow",
    borderBottomColor: "yellow",
    borderRadius: 60,
  },
});
```

## UI Elements

```javascript
// Speech Bubble
const SpeechBubble = () => (
  <View style={styles.speechBubbleContainer}>
    <View style={styles.speechBubble}>
      <Text>Hello!</Text>
    </View>
    <View style={styles.speechBubbleTail} />
  </View>
);

// Toggle Switch
const ToggleSwitch = ({ isOn }) => (
  <View style={[styles.switchContainer, isOn && styles.switchOn]}>
    <View style={[styles.switchThumb, isOn && styles.switchThumbOn]} />
  </View>
);

// Loading Spinner (using animation)
const Spinner = () => <View style={styles.spinner} />;

const styles = StyleSheet.create({
  speechBubbleContainer: {
    position: "relative",
  },
  speechBubble: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    minHeight: 40,
  },
  speechBubbleTail: {
    position: "absolute",
    bottom: -10,
    left: 20,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#f0f0f0",
  },
  switchContainer: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    padding: 2,
  },
  switchOn: {
    backgroundColor: "#4CAF50",
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "white",
    transform: [{ translateX: 0 }],
  },
  switchThumbOn: {
    transform: [{ translateX: 20 }],
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#f0f0f0",
    borderTopColor: "#3498db",
    // Add animation with Animated API
  },
});
```

## Social Media Icons

```javascript
// Facebook F
const FacebookIcon = () => (
  <View style={styles.facebookContainer}>
    <View style={styles.facebookF} />
    <View style={styles.facebookBar} />
  </View>
);

// Twitter Bird (simplified)
const TwitterIcon = () => (
  <View style={styles.twitterContainer}>
    <View style={styles.twitterBody} />
    <View style={styles.twitterBeak} />
  </View>
);

// YouTube Play Button
const YouTubeIcon = () => (
  <View style={styles.youtubeContainer}>
    <View style={styles.youtubePlay} />
  </View>
);

const styles = StyleSheet.create({
  facebookContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#3b5998",
    borderRadius: 5,
    position: "relative",
    overflow: "hidden",
  },
  facebookF: {
    position: "absolute",
    width: 20,
    height: 35,
    right: 8,
    top: 8,
    borderWidth: 3,
    borderColor: "white",
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 5,
  },
  facebookBar: {
    position: "absolute",
    width: 12,
    height: 3,
    backgroundColor: "white",
    top: 20,
    right: 8,
  },
  twitterContainer: {
    width: 50,
    height: 40,
    position: "relative",
  },
  twitterBody: {
    width: 40,
    height: 30,
    backgroundColor: "#1DA1F2",
    borderRadius: 20,
    position: "absolute",
    top: 5,
    left: 5,
  },
  twitterBeak: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftColor: "#1DA1F2",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    position: "absolute",
    left: 0,
    top: 15,
  },
  youtubeContainer: {
    width: 60,
    height: 42,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  youtubePlay: {
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderLeftWidth: 15,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "white",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
});
```

---

## Conversion Cheat Sheet

### Quick Reference Table

| CSS Pattern                        | React Native Approach                 | Key Differences                              |
| ---------------------------------- | ------------------------------------- | -------------------------------------------- |
| `width: 0; height: 0; border: ...` | Same, but split border properties     | Must specify each border property separately |
| `border-radius: 50%`               | `borderRadius: width/2`               | Use absolute values                          |
| `::before, ::after`                | Multiple `<View>` components          | Use absolute positioning                     |
| `transform-origin`                 | Position adjustments                  | No direct equivalent                         |
| `box-shadow`                       | iOS: shadow props, Android: elevation | Platform-specific                            |
| `linear-gradient()`                | Library or multiple views             | No native support                            |
| `clip-path`                        | `overflow: 'hidden'`                  | Limited support                              |
| `border: X / Y`                    | Transform with scaleX/Y               | No elliptical radius                         |
| `transform: multiple`              | `transform: [{...}, {...}]`           | Array of objects                             |
| `position: fixed`                  | Not supported                         | Use absolute                                 |
| `cursor`                           | Not needed                            | Touch-based                                  |
| `transition`                       | Animated API                          | Different system                             |

### Common Gotchas

1. **Border Radius Percentage**: Always calculate actual pixel values
2. **Transform Order**: Order matters in transform array
3. **Pseudo Elements**: Plan component structure with multiple Views
4. **Gradients**: Consider if you really need them or can use solid colors
5. **Complex Shapes**: Sometimes SVG (react-native-svg) is better for very complex shapes
6. **Performance**: Many layered views can impact performance
7. **Shadow Differences**: iOS and Android handle shadows differently

### Best Practices

1. **Component Composition**: Break complex shapes into smaller components
2. **Reusable Styles**: Create a shapes utility file
3. **Platform Testing**: Always test on both iOS and Android
4. **Performance**: Use `shouldComponentUpdate` or `React.memo` for complex shapes
5. **Accessibility**: Add accessibility labels to shape components
6. **Responsive Sizing**: Use dimensions relative to screen size when needed

---

## Example: Complete CSS to RN Conversion

### Original CSS Shape

```css
.complex-shape {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, red, blue);
  border-radius: 50% 0 50% 0;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transform: rotate(45deg) scale(1.2);
  position: relative;
}
.complex-shape::before {
  content: "";
  position: absolute;
  width: 50px;
  height: 50px;
  background: yellow;
  border-radius: 50%;
  top: 25px;
  left: 25px;
}
```

### React Native Conversion

```javascript
const ComplexShape = () => (
  <View style={styles.complexShapeContainer}>
    {/* Gradient simulation with two views */}
    <View style={styles.gradientLayer1} />
    <View style={styles.gradientLayer2} />

    {/* Main shape */}
    <View style={styles.complexShape}>
      {/* Inner circle (::before equivalent) */}
      <View style={styles.innerCircle} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  complexShapeContainer: {
    width: 120,
    height: 120,
    position: "relative",
  },
  gradientLayer1: {
    position: "absolute",
    width: 100,
    height: 100,
    backgroundColor: "red",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    transform: [{ rotate: "45deg" }, { scale: 1.2 }],
    opacity: 0.5,
  },
  gradientLayer2: {
    position: "absolute",
    width: 100,
    height: 100,
    backgroundColor: "blue",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    transform: [{ rotate: "45deg" }, { scale: 1.2 }],
    opacity: 0.5,
  },
  complexShape: {
    width: 100,
    height: 100,
    backgroundColor: "rgba(255,0,0,0.5)",
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    transform: [{ rotate: "45deg" }, { scale: 1.2 }],
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  innerCircle: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "yellow",
    borderRadius: 25,
    top: 25,
    left: 25,
  },
});
```

---

## Resources & Tools

### Helpful Resources

- [React Native StyleSheet Docs](https://reactnative.dev/docs/stylesheet)
- [CSS Shapes Reference](https://css-tricks.com/the-shapes-of-css/)
- [Transform Origin Workarounds](https://github.com/facebook/react-native/issues/1964)

### Testing Tools

- Use React Native Debugger to inspect computed styles
- Expo Snack for quick prototyping
- Device simulators for platform-specific testing

### Performance Optimization

- Use `react-native-svg` for very complex shapes
- Consider `react-native-reanimated` for animated shapes
- Profile with React DevTools

---

_This guide provides comprehensive patterns for converting CSS shapes to React Native. Remember that while pure styles can create many shapes, sometimes using SVG or image assets might be more performant for very complex designs._
