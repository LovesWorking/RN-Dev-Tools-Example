# React Native StyleSheet Complete API Reference

> A comprehensive guide to every style property and API available in React Native's StyleSheet system.

## Table of Contents

1. [StyleSheet API Methods](#stylesheet-api-methods)
2. [Layout Properties (Flexbox)](#layout-properties-flexbox)
3. [Positioning Properties](#positioning-properties)
4. [Dimension Properties](#dimension-properties)
5. [Spacing Properties (Margin & Padding)](#spacing-properties-margin--padding)
6. [Border Properties](#border-properties)
7. [Color & Background Properties](#color--background-properties)
8. [Shadow & Elevation Properties](#shadow--elevation-properties)
9. [Transform Properties](#transform-properties)
10. [Text Styling Properties](#text-styling-properties)
11. [Image Properties](#image-properties)
12. [Interaction Properties](#interaction-properties)
13. [Advanced Visual Effects](#advanced-visual-effects)
14. [Platform-Specific Properties](#platform-specific-properties)
15. [Type Definitions](#type-definitions)
16. [Usage Examples](#usage-examples)

---

## StyleSheet API Methods

### `StyleSheet.create(styles)`
Creates a StyleSheet from an object. In development mode, freezes the styles for immutability.

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
```

### `StyleSheet.hairlineWidth`
The width of a hairline (1 pixel on most devices). Platform-specific calculation.

```javascript
borderBottomWidth: StyleSheet.hairlineWidth
```

### `StyleSheet.absoluteFill`
Predefined style object for absolute positioning that fills the parent.

```javascript
style={StyleSheet.absoluteFill}
// Equivalent to:
// position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
```

### `StyleSheet.absoluteFillObject`
Same as `absoluteFill` but as a spreadable object for customization.

```javascript
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000
  }
});
```

### `StyleSheet.compose(style1, style2)`
Combines two styles where `style2` overrides properties in `style1`.

```javascript
const combinedStyle = StyleSheet.compose(baseStyle, overrideStyle);
```

### `StyleSheet.flatten(styles)`
Flattens an array of style objects into a single style object.

```javascript
const flatStyle = StyleSheet.flatten([styles.base, styles.override]);
```

### `StyleSheet.setStyleAttributePreprocessor(property, process)`
**EXPERIMENTAL** - Sets a preprocessor function for a style property.

```javascript
StyleSheet.setStyleAttributePreprocessor('color', (value) => processColor(value));
```

---

## Layout Properties (Flexbox)

React Native uses Yoga layout engine (Flexbox implementation) with some differences from CSS.

### Display
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `display` | string | `'flex'` (default), `'none'`, `'contents'` | Controls element display type |

### Flex Container Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `flexDirection` | string | `'row'`, `'column'` (default), `'row-reverse'`, `'column-reverse'` | Main axis direction |
| `flexWrap` | string | `'nowrap'` (default), `'wrap'`, `'wrap-reverse'` | Whether flex items wrap |
| `justifyContent` | string | `'flex-start'` (default), `'flex-end'`, `'center'`, `'space-between'`, `'space-around'`, `'space-evenly'` | Alignment along main axis |
| `alignItems` | string | `'stretch'` (default), `'flex-start'`, `'flex-end'`, `'center'`, `'baseline'` | Alignment along cross axis |
| `alignContent` | string | `'flex-start'`, `'flex-end'`, `'center'`, `'stretch'`, `'space-between'`, `'space-around'` | Multi-line alignment |

### Flex Item Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `flex` | number | Any number | Flex grow, shrink, and basis combined |
| `flexGrow` | number | >= 0 | How much item should grow |
| `flexShrink` | number | >= 0 | How much item should shrink |
| `flexBasis` | number/string | number or percentage | Initial main size before flex |
| `alignSelf` | string | `'auto'`, `'flex-start'`, `'flex-end'`, `'center'`, `'stretch'`, `'baseline'` | Override parent's alignItems |

### Additional Layout
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `aspectRatio` | number | Any positive number | Width/height ratio |
| `zIndex` | number | Any integer | Stack order of element |
| `direction` | string | `'inherit'`, `'ltr'`, `'rtl'` | Layout direction |
| `overflow` | string | `'visible'` (default), `'hidden'`, `'scroll'` | Content overflow behavior |
| `rowGap` | number | >= 0 | Gap between rows in flex container |
| `columnGap` | number | >= 0 | Gap between columns in flex container |
| `gap` | number | >= 0 | Shorthand for rowGap and columnGap |

---

## Positioning Properties

### Position Types
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `position` | string | `'relative'` (default), `'absolute'`, `'static'` | Positioning method |

### Position Offsets
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `top` | number/string | points, percentage, 'auto' | Distance from top edge |
| `bottom` | number/string | points, percentage, 'auto' | Distance from bottom edge |
| `left` | number/string | points, percentage, 'auto' | Distance from left edge |
| `right` | number/string | points, percentage, 'auto' | Distance from right edge |
| `start` | number/string | points, percentage, 'auto' | Logical start (LTR: left, RTL: right) |
| `end` | number/string | points, percentage, 'auto' | Logical end (LTR: right, RTL: left) |

### Logical Position Properties (New)
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `inset` | number/string | points, percentage | Shorthand for top, right, bottom, left |
| `insetBlock` | number/string | points, percentage | Vertical inset (top and bottom) |
| `insetBlockStart` | number/string | points, percentage | Block start position |
| `insetBlockEnd` | number/string | points, percentage | Block end position |
| `insetInline` | number/string | points, percentage | Horizontal inset (left and right) |
| `insetInlineStart` | number/string | points, percentage | Inline start position |
| `insetInlineEnd` | number/string | points, percentage | Inline end position |

---

## Dimension Properties

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `width` | number/string | points, percentage, 'auto' | Element width |
| `height` | number/string | points, percentage, 'auto' | Element height |
| `minWidth` | number/string | points, percentage | Minimum width |
| `maxWidth` | number/string | points, percentage | Maximum width |
| `minHeight` | number/string | points, percentage | Minimum height |
| `maxHeight` | number/string | points, percentage | Maximum height |

---

## Spacing Properties (Margin & Padding)

### Margin Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `margin` | number/string | points, percentage, 'auto' | All sides margin |
| `marginTop` | number/string | points, percentage, 'auto' | Top margin |
| `marginBottom` | number/string | points, percentage, 'auto' | Bottom margin |
| `marginLeft` | number/string | points, percentage, 'auto' | Left margin |
| `marginRight` | number/string | points, percentage, 'auto' | Right margin |
| `marginHorizontal` | number/string | points, percentage, 'auto' | Left and right margin |
| `marginVertical` | number/string | points, percentage, 'auto' | Top and bottom margin |
| `marginStart` | number/string | points, percentage, 'auto' | Logical start margin |
| `marginEnd` | number/string | points, percentage, 'auto' | Logical end margin |

### Logical Margin Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `marginBlock` | number/string | points, percentage | Block axis margin |
| `marginBlockStart` | number/string | points, percentage | Block start margin |
| `marginBlockEnd` | number/string | points, percentage | Block end margin |
| `marginInline` | number/string | points, percentage | Inline axis margin |
| `marginInlineStart` | number/string | points, percentage | Inline start margin |
| `marginInlineEnd` | number/string | points, percentage | Inline end margin |

### Padding Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `padding` | number/string | points, percentage | All sides padding |
| `paddingTop` | number/string | points, percentage | Top padding |
| `paddingBottom` | number/string | points, percentage | Bottom padding |
| `paddingLeft` | number/string | points, percentage | Left padding |
| `paddingRight` | number/string | points, percentage | Right padding |
| `paddingHorizontal` | number/string | points, percentage | Left and right padding |
| `paddingVertical` | number/string | points, percentage | Top and bottom padding |
| `paddingStart` | number/string | points, percentage | Logical start padding |
| `paddingEnd` | number/string | points, percentage | Logical end padding |

### Logical Padding Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `paddingBlock` | number/string | points, percentage | Block axis padding |
| `paddingBlockStart` | number/string | points, percentage | Block start padding |
| `paddingBlockEnd` | number/string | points, percentage | Block end padding |
| `paddingInline` | number/string | points, percentage | Inline axis padding |
| `paddingInlineStart` | number/string | points, percentage | Inline start padding |
| `paddingInlineEnd` | number/string | points, percentage | Inline end padding |

---

## Border Properties

### Border Width
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `borderWidth` | number | >= 0 | All borders width |
| `borderTopWidth` | number | >= 0 | Top border width |
| `borderBottomWidth` | number | >= 0 | Bottom border width |
| `borderLeftWidth` | number | >= 0 | Left border width |
| `borderRightWidth` | number | >= 0 | Right border width |
| `borderStartWidth` | number | >= 0 | Logical start border width |
| `borderEndWidth` | number | >= 0 | Logical end border width |

### Border Color
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `borderColor` | color | Any color value | All borders color |
| `borderTopColor` | color | Any color value | Top border color |
| `borderBottomColor` | color | Any color value | Bottom border color |
| `borderLeftColor` | color | Any color value | Left border color |
| `borderRightColor` | color | Any color value | Right border color |
| `borderStartColor` | color | Any color value | Logical start border color |
| `borderEndColor` | color | Any color value | Logical end border color |
| `borderBlockColor` | color | Any color value | Block axis border color |
| `borderBlockStartColor` | color | Any color value | Block start border color |
| `borderBlockEndColor` | color | Any color value | Block end border color |

### Border Radius
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `borderRadius` | number/string | points or percentage | All corners radius |
| `borderTopLeftRadius` | number/string | points or percentage | Top-left corner |
| `borderTopRightRadius` | number/string | points or percentage | Top-right corner |
| `borderBottomLeftRadius` | number/string | points or percentage | Bottom-left corner |
| `borderBottomRightRadius` | number/string | points or percentage | Bottom-right corner |
| `borderTopStartRadius` | number/string | points or percentage | Top logical start |
| `borderTopEndRadius` | number/string | points or percentage | Top logical end |
| `borderBottomStartRadius` | number/string | points or percentage | Bottom logical start |
| `borderBottomEndRadius` | number/string | points or percentage | Bottom logical end |
| `borderStartStartRadius` | number/string | points or percentage | Start-start corner |
| `borderStartEndRadius` | number/string | points or percentage | Start-end corner |
| `borderEndStartRadius` | number/string | points or percentage | End-start corner |
| `borderEndEndRadius` | number/string | points or percentage | End-end corner |

### Border Style
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `borderStyle` | string | `'solid'` (default), `'dotted'`, `'dashed'` | Border line style |
| `borderCurve` | string | `'circular'`, `'continuous'` | iOS-specific border curve style |

### Outline Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `outlineColor` | color | Any color value | Outline color |
| `outlineOffset` | number | Any number | Space between outline and border |
| `outlineStyle` | string | `'solid'`, `'dotted'`, `'dashed'` | Outline style |
| `outlineWidth` | number | >= 0 | Outline width |

---

## Color & Background Properties

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `backgroundColor` | color | Any color value | Background color |
| `opacity` | number | 0 to 1 | Element opacity |
| `experimental_backgroundImage` | array/string | Gradient or image values | Experimental background image support |

### Color Value Formats
- **Hex**: `'#rgb'`, `'#rgba'`, `'#rrggbb'`, `'#rrggbbaa'`
- **RGB/RGBA**: `'rgb(255, 0, 0)'`, `'rgba(255, 0, 0, 0.5)'`
- **HSL/HSLA**: `'hsl(360, 100%, 50%)'`, `'hsla(360, 100%, 50%, 0.5)'`
- **Named Colors**: `'red'`, `'blue'`, `'transparent'`, etc.
- **Platform Colors**: `PlatformColor('systemBlue')` (iOS), `PlatformColor('@android:color/holo_blue')` (Android)
- **Dynamic Colors**: `DynamicColorIOS({light: '#000', dark: '#fff'})` (iOS only)

---

## Shadow & Elevation Properties

### iOS Shadow Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `shadowColor` | color | Any color value | Shadow color |
| `shadowOffset` | object | `{width: number, height: number}` | Shadow offset |
| `shadowOpacity` | number | 0 to 1 | Shadow opacity |
| `shadowRadius` | number | >= 0 | Shadow blur radius |

### Android Elevation
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `elevation` | number | >= 0 | Android shadow elevation |

### Cross-Platform Box Shadow
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `boxShadow` | array/string | Shadow values | CSS-like box shadow (newer API) |

Example:
```javascript
boxShadow: [{
  offsetX: 0,
  offsetY: 2,
  blurRadius: 4,
  spreadRadius: 0,
  color: 'rgba(0, 0, 0, 0.2)'
}]
```

---

## Transform Properties

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `transform` | array | Array of transform objects | Transform operations |
| `transformOrigin` | string | CSS-like transform origin | Transform origin point |

### Transform Functions
```javascript
transform: [
  { translateX: number },
  { translateY: number },
  { translate: [x, y] },
  { rotate: 'deg' },         // e.g., '45deg'
  { rotateX: 'deg' },
  { rotateY: 'deg' },
  { rotateZ: 'deg' },
  { scale: number },
  { scaleX: number },
  { scaleY: number },
  { skewX: 'deg' },
  { skewY: 'deg' },
  { perspective: number },
  { matrix: [a, b, c, d, tx, ty] }
]
```

### Transform Style Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `backfaceVisibility` | string | `'visible'`, `'hidden'` | Whether back face is visible when rotated |

---

## Text Styling Properties

### Font Properties
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `fontFamily` | string | Font name | Font family name |
| `fontSize` | number | >= 0 | Font size in points |
| `fontStyle` | string | `'normal'`, `'italic'` | Font style |
| `fontWeight` | string/number | `'normal'`, `'bold'`, `'100'`-`'900'`, numeric 100-900 | Font weight |
| `fontVariant` | array/string | `['small-caps', 'oldstyle-nums', ...]` | Font variant options |

### Font Weight Values
- `'normal'` = 400
- `'bold'` = 700
- `'100'` = Thin
- `'200'` = Extra Light
- `'300'` = Light
- `'400'` = Regular
- `'500'` = Medium
- `'600'` = Semi Bold
- `'700'` = Bold
- `'800'` = Extra Bold
- `'900'` = Black

### Text Layout
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `textAlign` | string | `'auto'`, `'left'`, `'right'`, `'center'`, `'justify'` | Horizontal text alignment |
| `textAlignVertical` | string | `'auto'`, `'top'`, `'bottom'`, `'center'` | Vertical text alignment (Android) |
| `lineHeight` | number | >= 0 | Line height |
| `letterSpacing` | number | Any number | Letter spacing |

### Text Decoration
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `textDecorationLine` | string | `'none'`, `'underline'`, `'line-through'`, `'underline line-through'` | Text decoration line |
| `textDecorationStyle` | string | `'solid'`, `'double'`, `'dotted'`, `'dashed'` | Decoration line style |
| `textDecorationColor` | color | Any color value | Decoration line color |

### Text Effects
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `textTransform` | string | `'none'`, `'capitalize'`, `'uppercase'`, `'lowercase'` | Text transformation |
| `textShadowColor` | color | Any color value | Text shadow color |
| `textShadowOffset` | object | `{width: number, height: number}` | Text shadow offset |
| `textShadowRadius` | number | >= 0 | Text shadow blur radius |

### Text Behavior
| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `color` | color | Any color value | Text color |
| `writingDirection` | string | `'auto'`, `'ltr'`, `'rtl'` | Text writing direction |
| `includeFontPadding` | boolean | true/false | Include font padding (Android) |
| `userSelect` | string | `'auto'`, `'text'`, `'none'`, `'contain'`, `'all'` | Text selection behavior |
| `verticalAlign` | string | `'auto'`, `'top'`, `'bottom'`, `'middle'` | Vertical alignment |

---

## Image Properties

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `resizeMode` | string | `'cover'`, `'contain'`, `'stretch'`, `'repeat'`, `'center'` | How image should be resized |
| `objectFit` | string | `'cover'`, `'contain'`, `'fill'`, `'scale-down'`, `'none'` | CSS-like object fit |
| `tintColor` | color | Any color value | Tint color applied to image |
| `overlayColor` | color | Any color value | Color overlay on image |

### Resize Mode Values
- `'cover'`: Scale image to cover entire container, may crop
- `'contain'`: Scale image to fit within container
- `'stretch'`: Scale width and height independently
- `'repeat'`: Repeat image to cover container
- `'center'`: Center image without scaling

---

## Interaction Properties

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `pointerEvents` | string | `'auto'`, `'none'`, `'box-none'`, `'box-only'` | How view handles touch events |
| `cursor` | string | `'auto'`, `'pointer'` | Cursor style on hover (web) |

### Pointer Events Values
- `'auto'`: View can be target of touch events
- `'none'`: View is never target of touch events
- `'box-none'`: View is never target, but subviews can be
- `'box-only'`: View can be target, but subviews cannot

---

## Advanced Visual Effects

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `filter` | array/string | Filter functions | CSS-like filters |
| `mixBlendMode` | string | Blend mode values | How element blends with background |
| `isolation` | string | `'auto'`, `'isolate'` | Creates new stacking context |

### Filter Functions
```javascript
filter: [
  { brightness: 1.2 },
  { contrast: 1.5 },
  { grayscale: 0.5 },
  { hueRotate: '90deg' },
  { invert: 0.7 },
  { opacity: 0.8 },
  { saturate: 2 },
  { sepia: 0.5 },
  { blur: 5 }
]
```

### Blend Mode Values
- `'normal'`
- `'multiply'`
- `'screen'`
- `'overlay'`
- `'darken'`
- `'lighten'`
- `'color-dodge'`
- `'color-burn'`
- `'hard-light'`
- `'soft-light'`
- `'difference'`
- `'exclusion'`
- `'hue'`
- `'saturation'`
- `'color'`
- `'luminosity'`

---

## Platform-Specific Properties

### iOS-Specific
- `borderCurve`: Continuous corners (iOS 13+)
- `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`: iOS shadow system
- Dynamic colors with `DynamicColorIOS`

### Android-Specific
- `elevation`: Material Design elevation
- `includeFontPadding`: Font padding behavior
- `textAlignVertical`: Vertical text alignment

### Web-Specific
- `cursor`: Mouse cursor style
- `userSelect`: Text selection behavior
- CSS-compatible properties when using React Native Web

---

## Type Definitions

### Exported Types from StyleSheet module

```typescript
// Style prop types for components
export type ViewStyleProp    // For <View> style prop
export type TextStyleProp    // For <Text> style prop
export type ImageStyleProp   // For <Image> style prop

// Style object types
export type ViewStyle        // View style object
export type TextStyle        // Text style object
export type ImageStyle       // Image style object

// Utility types
export type ColorValue       // Any valid color value
export type DimensionValue   // number | string | 'auto'
export type TransformsStyle  // Transform style object

// Get type for specific style key
export type TypeForStyleKey<'position'>  // Returns 'absolute' | 'relative' | 'static'
```

---

## Usage Examples

### Basic StyleSheet Creation
```javascript
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.25, // iOS
    shadowRadius: 3.84, // iOS
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});
```

### Advanced Layout Example
```javascript
const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 10, // New gap property
  },
  flexItem: {
    flexBasis: '48%',
    flexGrow: 1,
    flexShrink: 0,
    aspectRatio: 1,
    alignSelf: 'flex-start',
  }
});
```

### Transform Animation Example
```javascript
const styles = StyleSheet.create({
  animatedBox: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    transform: [
      { translateX: 50 },
      { translateY: 100 },
      { rotate: '45deg' },
      { scale: 1.5 },
      { skewX: '20deg' }
    ],
    backfaceVisibility: 'hidden',
  }
});
```

### Responsive Design Example
```javascript
import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  responsive: {
    width: width * 0.9,  // 90% of screen width
    maxWidth: 400,       // Max width constraint
    minHeight: height * 0.3, // 30% minimum height
    paddingHorizontal: '5%', // Percentage padding
    marginVertical: height > 700 ? 20 : 10, // Conditional spacing
  }
});
```

### Platform-Specific Styles
```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  }
});
```

### Using StyleSheet.compose
```javascript
const baseStyle = StyleSheet.create({
  text: {
    fontSize: 16,
    color: 'black',
  }
});

const emphasisStyle = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    color: 'red',
  }
});

// Composed style will have fontSize: 16, fontWeight: 'bold', color: 'red'
const combinedStyle = StyleSheet.compose(baseStyle.text, emphasisStyle.text);
```

### Using StyleSheet.flatten
```javascript
const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    color: 'black',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  }
});

// Flatten multiple styles into one
const textStyle = StyleSheet.flatten([
  styles.base,
  isImportant && styles.bold,
  isQuote && styles.italic,
].filter(Boolean));
```

### Absolute Positioning Overlay
```javascript
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  }
});
```

### Advanced Text Styling
```javascript
const styles = StyleSheet.create({
  fancyText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    fontStyle: 'italic',
    fontVariant: ['small-caps', 'lining-nums'],
    letterSpacing: 2,
    lineHeight: 40,
    textAlign: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'double',
    textDecorationColor: 'red',
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    writingDirection: 'ltr',
  }
});
```

### Using Logical Properties (RTL Support)
```javascript
const styles = StyleSheet.create({
  rtlFriendly: {
    marginStart: 20,        // Uses marginLeft in LTR, marginRight in RTL
    marginEnd: 10,          // Uses marginRight in LTR, marginLeft in RTL
    paddingStart: 15,       // Uses paddingLeft in LTR, paddingRight in RTL
    paddingEnd: 15,         // Uses paddingRight in LTR, paddingLeft in RTL
    borderStartWidth: 1,    // Uses borderLeftWidth in LTR, borderRightWidth in RTL
    borderEndWidth: 2,      // Uses borderRightWidth in LTR, borderLeftWidth in RTL
    borderStartColor: 'red',
    borderEndColor: 'blue',
    start: 0,               // Uses left in LTR, right in RTL
    end: 0,                 // Uses right in LTR, left in RTL
  }
});
```

### Modern CSS-like Properties
```javascript
const styles = StyleSheet.create({
  modern: {
    // Box shadow (newer API)
    boxShadow: [{
      offsetX: 0,
      offsetY: 4,
      blurRadius: 6,
      spreadRadius: -1,
      color: 'rgba(0, 0, 0, 0.1)'
    }],
    
    // Filters
    filter: [
      { brightness: 1.2 },
      { contrast: 1.1 },
      { blur: 0 }
    ],
    
    // Blend modes
    mixBlendMode: 'multiply',
    
    // Isolation
    isolation: 'isolate',
    
    // Object fit for images
    objectFit: 'cover',
    
    // Gap for flexbox
    gap: 10,
    rowGap: 15,
    columnGap: 5,
    
    // Logical properties
    inset: 10,              // All sides
    insetBlock: 20,         // Top and bottom
    insetInline: 30,        // Left and right
    marginBlock: 10,        // Top and bottom margin
    paddingInline: 15,      // Left and right padding
  }
});
```

---

## Best Practices

1. **Use `StyleSheet.create()`** instead of inline styles for better performance
2. **Leverage `StyleSheet.hairlineWidth`** for thin borders that look crisp on all devices
3. **Use `StyleSheet.absoluteFillObject`** for overlays instead of manually setting all position values
4. **Prefer logical properties** (`marginStart`, `paddingEnd`) for RTL language support
5. **Use Platform.select()** for platform-specific styles
6. **Flatten styles only when necessary** as it creates new objects
7. **Compose styles** for reusable style combinations
8. **Use TypeScript types** (`ViewStyleProp`, `TextStyleProp`) for type safety
9. **Avoid deep nesting** of style objects for better performance
10. **Cache computed styles** outside of render methods

---

## Performance Tips

1. **Static Styles**: Define styles outside components with `StyleSheet.create()`
2. **Avoid Inline Styles**: They create new objects on every render
3. **Use `StyleSheet.flatten()` sparingly**: It creates new objects
4. **Conditional Styles**: Use `StyleSheet.compose()` or array syntax
5. **Memoize Dynamic Styles**: Use `useMemo` for styles that depend on props
6. **Avoid Unnecessary Re-renders**: Static styles help React's reconciliation

---

## Common Gotchas

1. **No CSS Units**: Only numbers (points) and percentages work, no `em`, `rem`, `px`, etc.
2. **No Cascade**: Styles don't cascade like CSS - each component needs explicit styles
3. **Limited Inheritance**: Only `Text` components inherit text styles
4. **Transform Array Order**: Transform operations are applied in array order
5. **Shadow Differences**: iOS uses shadow properties, Android uses elevation
6. **Default Flex Direction**: React Native defaults to `flexDirection: 'column'` unlike CSS
7. **Position Relative Default**: All elements are `position: 'relative'` by default
8. **No Float or Clear**: These CSS properties don't exist in React Native
9. **Percentage Heights**: Need parent with defined height to work
10. **Border Radius Overflow**: Need `overflow: 'hidden'` to clip content on Android

---

## Resources

- [React Native StyleSheet Documentation](https://reactnative.dev/docs/stylesheet)
- [Yoga Layout Documentation](https://yogalayout.com/docs)
- [React Native Flexbox Guide](https://reactnative.dev/docs/flexbox)
- [Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code)

---

*Last Updated: Based on React Native 0.73+*
*File Location: `/packages/react-native/Libraries/StyleSheet/`*