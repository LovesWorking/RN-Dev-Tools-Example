# ClaudeModal

A powerful, flexible, and feature-rich modal component for React Native with drag, resize, and persistence capabilities.

## ✨ Features

- 📱 **Dual Mode Support**: Bottom sheet and floating/detached modes
- 🎯 **Drag & Drop**: Move the modal anywhere on screen in floating mode
- 📐 **Resizable**: Resize from corners in floating mode, drag header to resize in bottom sheet
- 💾 **State Persistence**: Remembers position, size, and mode across app restarts
- 🎨 **Fully Customizable**: Override any style or component
- 📦 **Zero Dependencies**: Uses only React Native core and safe-area-context
- 🔧 **TypeScript**: Full type safety and IntelliSense support
- ⚡ **Performance Optimized**: Throttled updates, optimized re-renders
- 🎭 **Smooth Animations**: Native driver animations where possible

## 📦 Installation

```bash
npm install react-native-safe-area-context
# or
yarn add react-native-safe-area-context
```

Then copy the `ClaudeModal.tsx` file to your project.

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { ClaudeModal } from './claudeModal/ClaudeModal';

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Button title="Open Modal" onPress={() => setVisible(true)} />
      
      <ClaudeModal
        visible={visible}
        onClose={() => setVisible(false)}
        header={{ title: 'My Modal' }}
      >
        <View style={{ padding: 20 }}>
          <Text>Hello from ClaudeModal!</Text>
        </View>
      </ClaudeModal>
    </View>
  );
}
```

### With Persistence

```tsx
<ClaudeModal
  visible={visible}
  onClose={() => setVisible(false)}
  persistenceKey="my-modal-state" // Enable state persistence
  header={{ 
    title: 'Persistent Modal',
    subtitle: 'I remember my position!' 
  }}
>
  <YourContent />
</ClaudeModal>
```

### Custom Header

```tsx
<ClaudeModal
  visible={visible}
  onClose={() => setVisible(false)}
  header={{
    customContent: (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="settings" size={20} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 8 }}>Settings</Text>
      </View>
    ),
    showToggleButton: true,
    hideCloseButton: false
  }}
>
  <YourContent />
</ClaudeModal>
```

### Custom Styles

```tsx
<ClaudeModal
  visible={visible}
  onClose={() => setVisible(false)}
  header={{ title: 'Styled Modal' }}
  styles={{
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: 20,
    },
    header: {
      backgroundColor: '#2a2a2a',
    },
    headerTitle: {
      color: '#00ff00',
      fontSize: 18,
    },
    content: {
      padding: 20,
    }
  }}
>
  <YourContent />
</ClaudeModal>
```

### With Callbacks

```tsx
<ClaudeModal
  visible={visible}
  onClose={() => setVisible(false)}
  header={{ title: 'Interactive Modal' }}
  onModeChange={(mode) => {
    console.log('Mode changed to:', mode);
  }}
  onDimensionsChange={(dimensions) => {
    console.log('New dimensions:', dimensions);
  }}
>
  <YourContent />
</ClaudeModal>
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | **required** | Whether the modal is visible |
| `onClose` | `() => void` | **required** | Callback when modal is closed |
| `children` | `ReactNode` | **required** | Content to render inside the modal |
| `persistenceKey` | `string` | `undefined` | Unique key for persisting modal state |
| `header` | `ModalHeaderConfig` | `undefined` | Header configuration |
| `initialMode` | `'bottomSheet' \| 'floating'` | `'bottomSheet'` | Initial display mode |
| `styles` | `ModalStyles` | `{}` | Custom style overrides |
| `minHeight` | `number` | `150` | Minimum height for the modal |
| `maxHeight` | `number` | `screen height - safe area` | Maximum height for the modal |
| `initialHeight` | `number` | `400` | Initial height for bottom sheet mode |
| `enablePersistence` | `boolean` | `true` | Whether to enable state persistence |
| `onModeChange` | `(mode: ModalMode) => void` | `undefined` | Callback when mode changes |
| `onDimensionsChange` | `(dimensions: ModalDimensions) => void` | `undefined` | Callback when dimensions change |

### ModalHeaderConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `undefined` | Title text for the header |
| `customContent` | `ReactNode` | `undefined` | Custom header content (overrides title) |
| `subtitle` | `string` | `undefined` | Subtitle text below the main header |
| `showToggleButton` | `boolean` | `true` | Show mode toggle button |
| `hideCloseButton` | `boolean` | `false` | Hide the close button |

### ModalStyles

| Property | Type | Description |
|----------|------|-------------|
| `container` | `ViewStyle` | Container/overlay style |
| `modal` | `ViewStyle` | Modal panel style |
| `header` | `ViewStyle` | Header container style |
| `headerTitle` | `TextStyle` | Header title text style |
| `headerSubtitle` | `TextStyle` | Header subtitle text style |
| `content` | `ViewStyle` | Content container style |
| `dragIndicator` | `ViewStyle` | Drag indicator style |

### ModalDimensions

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number` | Modal width |
| `height` | `number` | Modal height |
| `top` | `number` | Top position (floating mode) |
| `left` | `number` | Left position (floating mode) |

## 🎮 Gestures

### Bottom Sheet Mode
- **Drag header up/down**: Resize the modal height
- **Tap toggle button**: Switch to floating mode
- **Tap close button**: Close the modal

### Floating Mode
- **Drag modal**: Move it anywhere on screen
- **Drag corners**: Resize from any corner
- **Tap toggle button**: Switch back to bottom sheet
- **Tap close button**: Close the modal

## 💾 Persistence

When you provide a `persistenceKey`, the modal will automatically save and restore:
- Current mode (bottom sheet or floating)
- Panel height (for bottom sheet mode)
- Position and dimensions (for floating mode)

The modal uses AsyncStorage if available, with an in-memory fallback.

## 🎨 Theming

The modal uses a dark theme by default that matches typical dev tools aesthetics. You can completely customize the appearance using the `styles` prop.

### Example: Light Theme

```tsx
const lightTheme = {
  modal: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    color: '#000000',
  },
  content: {
    backgroundColor: '#ffffff',
  }
};

<ClaudeModal styles={lightTheme} {...otherProps}>
  <YourContent />
</ClaudeModal>
```

## 🏗️ Architecture

The component follows these principles:

- **Single Responsibility**: Each sub-component has one clear purpose
- **Composition over Configuration**: Uses component composition for flexibility
- **Performance First**: Throttled updates, memoized handlers, ref-based state
- **Type Safety**: Full TypeScript support with comprehensive types
- **Zero Dependencies**: Only requires React Native and safe-area-context

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ React Native 0.60+

## 🤝 Contributing

Feel free to customize and extend ClaudeModal for your needs. The component is designed to be easily hackable with clear separation of concerns.

## 📄 License

MIT - Use it however you like!

---

Built with ❤️ by Claude