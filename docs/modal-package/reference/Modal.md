---
id: Modal
title: Modal
---

# Modal

The main component for rendering modals in your React Native application.

```tsx
import { Modal } from "@yourscope/react-native-pure-modal";
```

## Usage

[//]: # "Usage"

```tsx
const MyComponent = () => {
  const [visible, setVisible] = useState(false);

  return (
    <Modal
      visible={visible}
      onClose={() => setVisible(false)}
      mode="bottom-sheet"
      snapPoints={["25%", "50%", "90%"]}
      theme={customTheme}
    >
      <YourContent />
    </Modal>
  );
};
```

[//]: # "Usage"

## Props

```tsx
interface ModalProps {
  // Core props
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;

  // Mode configuration
  mode?: "standard" | "bottom-sheet" | "floating";

  // Bottom sheet specific
  snapPoints?: Array<number | string>;
  initialSnapIndex?: number;
  enablePanDownToClose?: boolean;
  enableOverDrag?: boolean;
  overDragResistanceFactor?: number;

  // Floating mode specific
  draggable?: boolean;
  resizable?: boolean;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };

  // Appearance
  theme?: ModalTheme;
  backdropOpacity?: number;
  customHeader?: React.ReactNode;
  showHandle?: boolean;

  // Behavior
  animationType?: "spring" | "timing" | "none";
  animationConfig?: AnimationConfig;
  closeOnBackdropPress?: boolean;
  keyboardAvoidingEnabled?: boolean;

  // Persistence
  persistenceKey?: string;
  enablePersistence?: boolean;
  storageAdapter?: StorageAdapter;

  // Accessibility
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;

  // Callbacks
  onOpen?: () => void;
  onSnapPointChange?: (index: number) => void;
  onModalStateChange?: (state: ModalState) => void;
  onDragStart?: () => void;
  onDragEnd?: (position: number) => void;
}
```

## Core Props

### `visible`

- **Type:** `boolean`
- **Required:** Yes
- **Description:** Controls the visibility of the modal

### `onClose`

- **Type:** `() => void`
- **Required:** Yes
- **Description:** Callback function called when the modal should close

### `children`

- **Type:** `React.ReactNode`
- **Required:** Yes
- **Description:** The content to display inside the modal

## Mode Configuration

### `mode`

- **Type:** `'standard' | 'bottom-sheet' | 'floating'`
- **Default:** `'standard'`
- **Description:** Determines the modal presentation style
  - `'standard'` - Centered modal with backdrop
  - `'bottom-sheet'` - Slides up from bottom with snap points
  - `'floating'` - Draggable and resizable window

## Bottom Sheet Props

### `snapPoints`

- **Type:** `Array<number | string>`
- **Default:** `['50%']`
- **Description:** Defines the heights where the bottom sheet can snap to
  - Numbers represent pixels from bottom
  - Strings with '%' represent percentage of screen height
  - Example: `[200, '50%', '90%']`

### `initialSnapIndex`

- **Type:** `number`
- **Default:** `0`
- **Description:** The initial snap point index when the modal opens

### `enablePanDownToClose`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Allow closing the modal by dragging down past the lowest snap point

### `enableOverDrag`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable resistance when dragging beyond boundaries

### `overDragResistanceFactor`

- **Type:** `number`
- **Default:** `2.5`
- **Description:** Controls the resistance strength when over-dragging

## Floating Mode Props

### `draggable`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Allow dragging the floating modal around the screen

### `resizable`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable corner handles for resizing the floating modal

### `initialPosition`

- **Type:** `{ x: number; y: number }`
- **Default:** Center of screen
- **Description:** Starting position for floating modal

### `initialSize`

- **Type:** `{ width: number; height: number }`
- **Default:** `{ width: 380, height: 500 }`
- **Description:** Initial dimensions for floating modal

## Appearance Props

### `theme`

- **Type:** `ModalTheme`
- **Description:** Custom theme configuration

```tsx
interface ModalTheme {
  colors: {
    background: string;
    surface: string;
    text: string;
    backdrop: string;
    handle: string;
    border: string;
    primary: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
  shadows: {
    sm: ShadowStyle;
    md: ShadowStyle;
    lg: ShadowStyle;
  };
}
```

### `backdropOpacity`

- **Type:** `number`
- **Default:** `0.5`
- **Description:** Opacity of the backdrop overlay (0-1)

### `customHeader`

- **Type:** `React.ReactNode`
- **Default:** `undefined`
- **Description:** Custom header component to replace the default header

### `showHandle`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Show the drag handle indicator

## Behavior Props

### `animationType`

- **Type:** `'spring' | 'timing' | 'none'`
- **Default:** Platform-specific (spring on iOS, timing on Android)
- **Description:** Type of animation to use for modal transitions

### `animationConfig`

- **Type:** `AnimationConfig`
- **Description:** Custom animation configuration

```tsx
interface AnimationConfig {
  // For spring animations
  tension?: number;
  friction?: number;
  velocity?: number;

  // For timing animations
  duration?: number;
  easing?: (value: number) => number;

  // Shared
  useNativeDriver?: boolean;
}
```

### `closeOnBackdropPress`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Close modal when backdrop is pressed

### `keyboardAvoidingEnabled`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Automatically adjust modal position when keyboard appears

## Persistence Props

### `persistenceKey`

- **Type:** `string`
- **Description:** Unique key for storing modal state

### `enablePersistence`

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable state persistence between app sessions

### `storageAdapter`

- **Type:** `StorageAdapter`
- **Default:** `AsyncStorage`
- **Description:** Custom storage implementation

```tsx
interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}
```

## Accessibility Props

### `accessible`

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Enable accessibility features

### `accessibilityLabel`

- **Type:** `string`
- **Description:** Label for screen readers

### `accessibilityHint`

- **Type:** `string`
- **Description:** Hint text for screen readers

### `accessibilityRole`

- **Type:** `AccessibilityRole`
- **Default:** `'dialog'`
- **Description:** Semantic role for accessibility

## Callback Props

### `onOpen`

- **Type:** `() => void`
- **Description:** Called when the modal finishes opening animation

### `onSnapPointChange`

- **Type:** `(index: number) => void`
- **Description:** Called when the bottom sheet snaps to a new point

### `onModalStateChange`

- **Type:** `(state: ModalState) => void`
- **Description:** Called when modal state changes

```tsx
type ModalState = "closed" | "opening" | "open" | "closing";
```

### `onDragStart`

- **Type:** `() => void`
- **Description:** Called when user starts dragging the modal

### `onDragEnd`

- **Type:** `(position: number) => void`
- **Description:** Called when dragging ends with final position

## Examples

### Basic Modal

[//]: # "BasicModal"

```tsx
<Modal visible={visible} onClose={handleClose}>
  <Text>Simple modal content</Text>
</Modal>
```

[//]: # "BasicModal"

### Bottom Sheet with Multiple Snap Points

[//]: # "BottomSheet"

```tsx
<Modal
  visible={visible}
  onClose={handleClose}
  mode="bottom-sheet"
  snapPoints={[100, "50%", "90%"]}
  initialSnapIndex={1}
  enablePanDownToClose
  onSnapPointChange={(index) => console.log("Snapped to:", index)}
>
  <ScrollView>
    <Content />
  </ScrollView>
</Modal>
```

[//]: # "BottomSheet"

### Floating Modal with Custom Position

[//]: # "FloatingModal"

```tsx
<Modal
  visible={visible}
  onClose={handleClose}
  mode="floating"
  draggable
  resizable
  initialPosition={{ x: 50, y: 100 }}
  initialSize={{ width: 300, height: 400 }}
>
  <WindowContent />
</Modal>
```

[//]: # "FloatingModal"

### Themed Modal

[//]: # "ThemedModal"

```tsx
const darkTheme = {
  colors: {
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
    backdrop: 'rgba(0,0,0,0.8)',
    handle: '#666',
    border: '#333',
    primary: '#007AFF',
    error: '#FF3B30'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  radii: {
    sm: 8,
    md: 16,
    lg: 24
  }
}

<Modal
  visible={visible}
  onClose={handleClose}
  theme={darkTheme}
  backdropOpacity={0.9}
>
  <ThemedContent />
</Modal>
```

[//]: # "ThemedModal"

### Persistent Modal

[//]: # "PersistentModal"

```tsx
<Modal
  visible={visible}
  onClose={handleClose}
  mode="bottom-sheet"
  snapPoints={["25%", "50%", "90%"]}
  persistenceKey="user-settings-modal"
  enablePersistence
>
  <SettingsPanel />
</Modal>
```

[//]: # "PersistentModal"

## Platform Differences

### iOS

- Uses spring animations by default
- Supports interactive keyboard dismissal
- Respects safe area insets automatically

### Android

- Uses timing animations by default
- Hardware acceleration enabled
- Elevation used for shadows

### Web (Experimental)

- CSS transitions for animations
- Mouse events for dragging
- Keyboard navigation support

## Performance Tips

1. **Use `useNativeDriver: true`** - All animations use native driver by default
2. **Avoid heavy renders in children** - Memoize complex components
3. **Optimize lists** - Use `FlatList` or `VirtualizedList` for long content
4. **Lazy load content** - Load heavy content after modal opens

## Troubleshooting

### Modal doesn't appear

- Ensure `visible` prop is `true`
- Check if modal is rendered within app hierarchy
- Verify no conflicting `zIndex` styles

### Gestures not working

- Check if gesture handlers are enabled
- Ensure no parent components are intercepting touches
- Verify `PanResponder` is not conflicting

### Performance issues

- Profile with React DevTools
- Check for unnecessary re-renders
- Ensure animations use native driver

## See Also

- [useModal Hook](./useModal.md) - Imperative API for modal control
- [Modal Provider](./ModalProvider.md) - Global modal management
- [Theming Guide](../guides/theming.md) - Complete theming documentation
- [Migration Guide](../guides/migration.md) - Migrating from other libraries
