---
id: overview
title: React Native Pure Modal
---

# React Native Pure Modal

Powerful, performant and extensible pure JavaScript modal for React Native with **zero native dependencies**.

## Overview

React Native Pure Modal is a production-ready modal solution that delivers native-like 60 FPS performance using only JavaScript. No native modules, no linking, no platform-specific code required.

## Motivation

**Out-of-the-box modal solutions in React Native apps can be a pain**. Between managing native dependencies, dealing with platform differences, and achieving smooth animations, developers often struggle to find the right balance between performance and simplicity.

While native solutions offer excellent performance, they come with complexity:

- Platform-specific installation steps
- Pod installation headaches
- Version compatibility issues
- Build configuration problems
- Difficult debugging across platforms

React Native Pure Modal solves these problems by providing:

- **🚀 Native-level performance** - Consistent 60 FPS animations
- **📦 Zero native dependencies** - Pure JavaScript, works everywhere
- **🎨 Fully customizable** - Theme system with complete control
- **♿ Accessible by default** - Screen reader and keyboard support
- **📱 Platform optimized** - iOS and Android specific behaviors
- **💾 State persistence** - Remember modal positions between sessions
- **🎯 TypeScript first** - Complete type safety and IntelliSense

## Quick Start

```tsx
import { Modal } from "@yourscope/react-native-pure-modal";

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>Open Modal</Button>

      <Modal visible={visible} onClose={() => setVisible(false)}>
        <Text>Hello World!</Text>
      </Modal>
    </>
  );
}
```

That's it! You now have a working modal with:

- Smooth animations
- Gesture support
- Backdrop
- Platform-appropriate styling

## Core Features

### Bottom Sheet Mode

Transform your modal into a bottom sheet with snap points:

```tsx
<Modal
  mode="bottom-sheet"
  snapPoints={["25%", "50%", "90%"]}
  enablePanDownToClose
>
  <Content />
</Modal>
```

### Floating Mode

Create draggable, resizable floating modals:

```tsx
<Modal mode="floating" draggable resizable initialPosition={{ x: 100, y: 100 }}>
  <Content />
</Modal>
```

### State Persistence

Remember modal state between app sessions:

```tsx
<Modal persistenceKey="user-settings" enablePersistence>
  <Settings />
</Modal>
```

## Why Pure JavaScript?

### The Problem with Native Dependencies

Most React Native modal libraries rely on native modules for performance. This creates several challenges:

1. **Installation Complexity** - Different steps for iOS and Android
2. **Version Conflicts** - Native module compatibility issues
3. **Build Failures** - Pod installation, linking problems
4. **Debugging Difficulty** - Native crashes are hard to debug
5. **Upgrade Pain** - Breaking changes with React Native updates

### Our Solution

React Native Pure Modal achieves native-level performance using:

- **React Native Animated API** - Hardware-accelerated animations
- **PanResponder** - Efficient gesture handling
- **Transform-based animations** - GPU-optimized rendering
- **Worklet-compatible design** - Ready for Reanimated if needed
- **Platform optimizations** - iOS and Android specific tuning

## Performance

We maintain strict performance standards:

- **60 FPS animations** - Smooth, jank-free movement
- **< 50KB bundle size** - Minimal impact on app size
- **< 16ms gesture response** - Instant user feedback
- **Zero memory leaks** - Proper cleanup and lifecycle management

## Comparison

| Feature          | Pure Modal | react-native-modal | react-native-bottom-sheet | @gorhom/bottom-sheet |
| ---------------- | ---------- | ------------------ | ------------------------- | -------------------- |
| Zero native deps | ✅         | ✅                 | ❌                        | ❌                   |
| 60 FPS           | ✅         | ⚠️                 | ✅                        | ✅                   |
| Bottom sheet     | ✅         | ❌                 | ✅                        | ✅                   |
| Floating mode    | ✅         | ❌                 | ❌                        | ❌                   |
| TypeScript       | ✅         | ✅                 | ✅                        | ✅                   |
| Bundle size      | 45KB       | 38KB               | 125KB                     | 180KB                |
| Accessibility    | ✅         | ⚠️                 | ⚠️                        | ✅                   |
| Web support      | ✅         | ✅                 | ❌                        | ❌                   |

## Installation

```bash
npm install @yourscope/react-native-pure-modal
```

```bash
yarn add @yourscope/react-native-pure-modal
```

```bash
pnpm add @yourscope/react-native-pure-modal
```

That's it! No pod install, no linking, no native configuration needed.

## Basic Concepts

React Native Pure Modal is built around a few core concepts:

### Modal Modes

The modal can operate in three distinct modes:

- **Standard** - Traditional centered modal
- **Bottom Sheet** - Slides up from bottom with snap points
- **Floating** - Draggable and resizable window

### Snap Points

Define positions where the bottom sheet can rest:

```tsx
snapPoints={[100, '50%', '90%']}
```

### Gestures

Full gesture support with customizable behaviors:

- Pan to dismiss
- Drag to resize
- Swipe velocity detection
- Over-drag resistance

### Theming

Complete control over appearance:

```tsx
<Modal theme={{
  colors: {
    background: '#1a1a1a',
    backdrop: 'rgba(0,0,0,0.5)'
  }
}}>
```

## TypeScript

React Native Pure Modal is written in TypeScript and provides complete type definitions:

```tsx
import {
  Modal,
  ModalProps,
  ModalMode,
} from "@yourscope/react-native-pure-modal";

const props: ModalProps = {
  visible: true,
  mode: "bottom-sheet",
  snapPoints: ["25%", "50%"],
  onClose: () => console.log("closed"),
};
```

## Platform Support

- ✅ iOS 11+
- ✅ Android 5.0+ (API 21)
- ✅ React Native 0.63+
- ✅ Expo SDK 40+
- ✅ Web (Experimental)

## Community

- [GitHub Discussions](https://github.com/yourscope/react-native-pure-modal/discussions)
- [Discord Server](https://discord.gg/pure-modal)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native-pure-modal)

## Contributing

We welcome contributions! See our [Contributing Guide](./contributing.md) for details.

## License

MIT © [Your Name]

## Sponsors

React Native Pure Modal is an MIT-licensed open source project that's completely free to use. However, the amount of effort needed to maintain and develop new features requires sustainable financial backing.

[Become a Sponsor](https://github.com/sponsors/yourscope)
