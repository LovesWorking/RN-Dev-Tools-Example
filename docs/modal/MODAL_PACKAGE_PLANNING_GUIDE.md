# ClaudeModal Package Planning Guide

## Executive Summary

This document outlines a comprehensive plan to transform the ClaudeModal60FPSClean component into a professional, TanStack-quality React Native package. The goal is to create a pure JavaScript modal/bottom sheet solution that rivals native implementations while maintaining simplicity and ease of adoption.

## Table of Contents

1. [Package Architecture](#package-architecture)
2. [API Design Philosophy](#api-design-philosophy)
3. [Core Improvements](#core-improvements)
4. [Developer Experience](#developer-experience)
5. [Documentation Strategy](#documentation-strategy)
6. [Performance Optimizations](#performance-optimizations)
7. [Testing & Quality](#testing--quality)
8. [Distribution Strategy](#distribution-strategy)

---

## Package Architecture

### Current State Analysis

The modal currently has:

- ✅ 60FPS performance with native driver animations
- ✅ Bottom sheet and floating modes
- ✅ State persistence with AsyncStorage
- ✅ Gesture-based resizing and dragging
- ✅ Custom header support
- ❌ Tight coupling to game UI colors
- ❌ Hard-coded dependencies on specific hooks
- ❌ No TypeScript declarations export
- ❌ Limited customization options
- ❌ No accessibility support

### Proposed Package Structure

```
@yourscope/react-native-pure-modal/
├── src/
│   ├── index.ts                    # Main exports
│   ├── Modal.tsx                   # Core modal component
│   ├── BottomSheet.tsx            # Bottom sheet variant
│   ├── FloatingModal.tsx          # Floating variant
│   ├── Provider.tsx               # Modal provider for global management
│   ├── hooks/
│   │   ├── useModal.ts            # Primary hook
│   │   ├── useBottomSheet.ts     # Bottom sheet specific
│   │   ├── useModalState.ts      # State management
│   │   └── useGestures.ts        # Gesture handling
│   ├── components/
│   │   ├── Handle.tsx             # Drag handle
│   │   ├── Backdrop.tsx           # Backdrop component
│   │   ├── Header.tsx             # Default header
│   │   └── Footer.tsx             # Optional footer
│   ├── animations/
│   │   ├── presets.ts             # Animation presets
│   │   └── spring.ts              # Spring configs
│   ├── utils/
│   │   ├── dimensions.ts          # Screen calculations
│   │   ├── platform.ts           # Platform-specific logic
│   │   └── storage.ts             # Persistence utilities
│   └── types/
│       └── index.ts               # TypeScript definitions
├── example/                        # Example app
├── docs/                          # Documentation
└── package.json
```

---

## API Design Philosophy

### Core Principles (TanStack-inspired)

1. **Declarative Configuration**

   ```tsx
   // Simple, intuitive API
   const modal = useModal({
     mode: "bottom-sheet",
     snapPoints: ["25%", "50%", "90%"],
     enablePanDownToClose: true,
   });

   modal.present(<Content />);
   modal.dismiss();
   ```

2. **Progressive Disclosure**

   ```tsx
   // Basic usage - works out of the box
   <Modal visible={visible} onClose={onClose}>
     <Content />
   </Modal>

   // Advanced usage - full control when needed
   <Modal
     visible={visible}
     onClose={onClose}
     config={{
       animation: springPreset.smooth,
       gestures: {
         threshold: 5,
         resistance: 2.5,
         velocityFactor: 0.2
       },
       persistence: {
         key: 'my-modal',
         storage: customStorage
       }
     }}
   >
     <Content />
   </Modal>
   ```

3. **Composition Over Configuration**
   ```tsx
   // Composable components
   <Modal.Root>
     <Modal.Backdrop opacity={0.5} />
     <Modal.Container>
       <Modal.Header>
         <Modal.Handle />
         <Modal.Title>Settings</Modal.Title>
         <Modal.CloseButton />
       </Modal.Header>
       <Modal.Content>
         <YourContent />
       </Modal.Content>
       <Modal.Footer>
         <Button>Save</Button>
       </Modal.Footer>
     </Modal.Container>
   </Modal.Root>
   ```

---

## Core Improvements

### 1. Decoupling & Modularity

**Remove Hard Dependencies:**

- Extract game UI colors to theme system
- Replace custom hooks with internal implementations
- Make SafeAreaInsets optional/configurable
- Remove AsyncStorage hard dependency

**Theme System:**

```tsx
interface ModalTheme {
  colors: {
    background: string;
    backdrop: string;
    handle: string;
    border: string;
    text: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
  };
  shadows: ShadowConfig;
}

// Allow theme customization
<ModalProvider theme={customTheme}>
  <App />
</ModalProvider>;
```

### 2. Enhanced Snap Points System

**Current:** Fixed array of snap points
**Proposed:** Dynamic snap point configuration

```tsx
interface SnapPointConfig {
  points: Array<number | string | SnapPointFunction>;
  enableDynamicSizing?: boolean;
  onSnapPointChange?: (index: number) => void;
  animateOnChange?: boolean;
}

type SnapPointFunction = (context: {
  screenHeight: number;
  keyboardHeight: number;
  safeAreaInsets: Insets;
}) => number;

// Usage
snapPoints: [
  "min", // Predefined constant
  200, // Fixed height
  "50%", // Percentage
  ({ screenHeight }) => screenHeight * 0.7, // Dynamic function
  "max", // Predefined constant
];
```

### 3. Gesture System Improvements

**Enhanced Gesture Configuration:**

```tsx
interface GestureConfig {
  handle: {
    enabled: boolean;
    activeOffsetY?: number[];
    failOffsetX?: number[];
    hitSlop?: Insets;
  };
  content: {
    enabled: boolean;
    scrollBehavior: "lock-scroll" | "dismiss-on-scroll" | "none";
    activateOnLongPress?: boolean;
  };
  backdrop: {
    dismissOnPress: boolean;
    pressThreshold?: number;
  };
  swipeToClose: {
    enabled: boolean;
    threshold: number;
    velocity: number;
    direction: "down" | "any";
  };
}
```

### 4. Animation System

**Preset Animations:**

```tsx
const animationPresets = {
  // iOS-like smooth spring
  ios: {
    type: "spring",
    config: { tension: 180, friction: 22 },
  },

  // Android material design
  android: {
    type: "timing",
    config: { duration: 300, easing: Easing.out(Easing.cubic) },
  },

  // Snappy response
  snappy: {
    type: "spring",
    config: { tension: 250, friction: 20 },
  },

  // Smooth and slow
  smooth: {
    type: "spring",
    config: { tension: 120, friction: 25 },
  },

  // Custom function
  custom: (velocity: number) => ({
    type: "spring",
    config: {
      tension: 180,
      friction: 22,
      velocity: velocity / 2,
    },
  }),
};
```

### 5. Accessibility

**Full Accessibility Support:**

```tsx
interface AccessibilityConfig {
  // Screen reader support
  announceOnOpen?: string;
  announceOnClose?: string;
  modalAccessibilityLabel?: string;
  modalAccessibilityHint?: string;

  // Focus management
  autoFocus?: boolean;
  restoreFocus?: boolean;
  focusTrap?: boolean;

  // Gesture alternatives
  enableAccessibilityGestures?: boolean;
  accessibilityActions?: AccessibilityAction[];
}

// Implementation
<Modal
  accessibility={{
    announceOnOpen: "Settings modal opened",
    announceOnClose: "Settings modal closed",
    autoFocus: true,
    focusTrap: true,
    accessibilityActions: [
      { name: "dismiss", label: "Close modal" },
      { name: "expand", label: "Expand to full screen" },
    ],
  }}
/>;
```

---

## Developer Experience

### 1. Installation Simplicity

```bash
# Single command installation
npm install @yourscope/react-native-pure-modal

# No native dependencies needed!
# No pod install required!
# No linking required!
```

### 2. TypeScript-First

**Complete Type Safety:**

```tsx
// Auto-completion for all props
interface ModalProps<T = any> {
  visible: boolean;
  onClose: () => void;
  onOpen?: () => void;
  onSnapPointChange?: (index: number) => void;
  onModalStateChange?: (state: ModalState) => void;
  children: React.ReactNode;
  data?: T; // Generic data passing
}

// Discriminated unions for variants
type ModalVariant =
  | { mode: "bottom-sheet"; snapPoints: SnapPoint[] }
  | { mode: "floating"; position?: Position; size?: Size }
  | { mode: "fullscreen"; transition?: Transition };
```

### 3. Hooks API

**Primary Hook:**

```tsx
const {
  // Methods
  present,
  dismiss,
  snapToIndex,
  expand,
  collapse,

  // State
  isVisible,
  isAnimating,
  currentSnapIndex,
  modalRef,

  // Utilities
  measureContent,
  forceUpdate,
} = useModal(config);
```

**Imperative API:**

```tsx
// Global modal management
import { modal } from "@yourscope/react-native-pure-modal";

// Present from anywhere
modal.show({
  component: <CustomContent />,
  options: {
    mode: "bottom-sheet",
    snapPoints: ["50%", "90%"],
  },
});

// Dismiss with animation
modal.hide({ animated: true });

// Update current modal
modal.update({ snapPoints: ["25%", "75%"] });
```

### 4. Debug Mode

```tsx
// Development helpers
<ModalProvider debug={__DEV__}>
  {/* Shows performance overlay */}
  {/* Logs gesture events */}
  {/* Displays snap point indicators */}
</ModalProvider>;

// Performance monitoring hook
const metrics = useModalMetrics();
console.log(metrics);
// {
//   fps: 59.8,
//   frameDrops: 2,
//   animationDuration: 245,
//   gestureResponseTime: 16
// }
```

---

## Documentation Strategy

### 1. Getting Started Guide

**Quick Start (< 1 minute):**

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

### 2. Interactive Examples

- **Storybook Integration:** Interactive component playground
- **Expo Snack Examples:** Try in browser
- **Video Tutorials:** 2-3 minute setup videos
- **CodeSandbox Templates:** Pre-configured starting points

### 3. API Reference

**Comprehensive Documentation:**

- Every prop documented with types
- Code examples for each feature
- Platform-specific notes
- Performance considerations
- Common patterns & recipes

### 4. Migration Guides

```markdown
## Migrating from react-native-modal

- No native dependencies needed
- Similar API surface
- Performance improvements
- [Step-by-step guide]

## Migrating from react-native-bottom-sheet

- Pure JS alternative
- Compatible gesture system
- [Feature comparison table]
```

---

## Performance Optimizations

### 1. Bundle Size Optimization

**Tree-Shaking Support:**

```tsx
// Only import what you need
import { BottomSheet } from "@yourscope/react-native-pure-modal/bottom-sheet";
import { useModal } from "@yourscope/react-native-pure-modal/hooks";
```

**Code Splitting:**

```tsx
// Lazy load heavy features
const FloatingModal = lazy(
  () => import("@yourscope/react-native-pure-modal/floating"),
);
```

### 2. Runtime Performance

**Optimization Strategies:**

- Worklet-compatible animations where possible
- Memoized expensive calculations
- Batched state updates
- RAF-throttled gesture handlers
- Native driver for all transforms

**Performance Budget:**

```tsx
// Enforce performance constraints
const performanceBudget = {
  initialRenderTime: 50, // ms
  animationFPS: 60, // target FPS
  gestureLatency: 16, // ms
  memoryFootprint: 5000, // KB
};
```

### 3. Platform Optimizations

```tsx
// Platform-specific optimizations built-in
const platformOptimizations = Platform.select({
  ios: {
    useNativeSpring: true,
    enableMomentum: true,
    shadowOptimization: "native",
  },
  android: {
    useTimingAnimation: true,
    enableElevation: true,
    renderToHardwareTextureAndroid: true,
  },
  web: {
    useCSSTransitions: true,
    enableWillChange: true,
    use3DTransform: true,
  },
});
```

---

## Testing & Quality

### 1. Testing Strategy

**Unit Tests:**

```tsx
describe("Modal", () => {
  it("should animate to snap points correctly", () => {
    const { result } = renderHook(() => useModal());
    act(() => result.current.snapToIndex(1));
    expect(result.current.currentSnapIndex).toBe(1);
  });
});
```

**Integration Tests:**

```tsx
// Gesture testing
it("should respond to drag gestures", async () => {
  const { getByTestId } = render(<Modal testID="modal" />);
  const modal = getByTestId("modal");

  fireEvent(modal, "panGesture", {
    translationY: 100,
    velocityY: 0.5,
  });

  await waitFor(() => {
    expect(modal).toHaveAnimatedStyle({
      transform: [{ translateY: 100 }],
    });
  });
});
```

**E2E Tests:**

- Detox for native testing
- Playwright for web testing
- Visual regression testing

### 2. Quality Metrics

**Code Quality:**

- 100% TypeScript
- ESLint + Prettier configured
- Pre-commit hooks
- Bundle size tracking
- Performance benchmarks

**CI/CD Pipeline:**

```yaml
# GitHub Actions
- Run tests on PR
- Check bundle size
- Performance benchmarks
- Visual regression tests
- Automated releases
```

### 3. Error Handling

```tsx
// Graceful error handling
interface ErrorBoundaryConfig {
  fallback?: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRecovery?: boolean;
}

// Built-in error boundary
<Modal
  errorBoundary={{
    fallback: ErrorFallback,
    onError: (error) => console.error(error),
    enableRecovery: true,
  }}
/>;
```

---

## Distribution Strategy

### 1. Package Publishing

**NPM Package:**

```json
{
  "name": "@yourscope/react-native-pure-modal",
  "version": "1.0.0",
  "description": "Pure JavaScript modal for React Native",
  "main": "lib/commonjs/index.js",
  "module": "lib/module/index.js",
  "types": "lib/typescript/index.d.ts",
  "react-native": "src/index.ts",
  "files": ["src", "lib"],
  "sideEffects": false,
  "keywords": ["react-native", "modal", "bottom-sheet", "pure-js", "60fps"]
}
```

### 2. Documentation Site

**Dedicated Documentation:**

- Docusaurus or VitePress site
- Interactive examples
- API playground
- Performance demos
- Video tutorials

### 3. Community Building

**Engagement Strategy:**

- Discord/Slack community
- GitHub discussions
- Stack Overflow presence
- Blog posts & tutorials
- Conference talks

### 4. Versioning Strategy

**Semantic Versioning:**

- Breaking changes in major versions
- New features in minor versions
- Bug fixes in patch versions
- Beta/RC releases for testing

---

## Implementation Roadmap

### Phase 1: Core Refactoring (Week 1-2)

- [ ] Extract hard dependencies
- [ ] Implement theme system
- [ ] Create modular architecture
- [ ] Set up TypeScript properly
- [ ] Build hook system

### Phase 2: API Design (Week 3-4)

- [ ] Design declarative API
- [ ] Implement composition pattern
- [ ] Create animation presets
- [ ] Build gesture configuration
- [ ] Add accessibility support

### Phase 3: Documentation (Week 5-6)

- [ ] Write comprehensive docs
- [ ] Create interactive examples
- [ ] Build documentation site
- [ ] Record video tutorials
- [ ] Write migration guides

### Phase 4: Testing & QA (Week 7-8)

- [ ] Write unit tests
- [ ] Add integration tests
- [ ] Set up E2E tests
- [ ] Performance benchmarking
- [ ] Bundle size optimization

### Phase 5: Release (Week 9-10)

- [ ] Publish beta version
- [ ] Gather feedback
- [ ] Fix issues
- [ ] Release v1.0.0
- [ ] Marketing & promotion

---

## Success Metrics

### Technical Metrics

- **Performance:** Consistent 60 FPS
- **Bundle Size:** < 50KB minified
- **Test Coverage:** > 90%
- **TypeScript Coverage:** 100%
- **Zero Native Dependencies**

### Adoption Metrics

- **NPM Downloads:** 10K/month within 6 months
- **GitHub Stars:** 1K within first year
- **Active Contributors:** 10+ contributors
- **Documentation Quality:** 4.5+ rating
- **Issue Response Time:** < 24 hours

---

## Conclusion

By following this plan, the ClaudeModal can be transformed into a professional-grade package that rivals established solutions like TanStack Query in terms of:

1. **Simplicity:** Easy to get started, progressive complexity
2. **Performance:** Native-like 60 FPS animations
3. **Flexibility:** Highly customizable without complexity
4. **Developer Experience:** Excellent TypeScript support and documentation
5. **Reliability:** Well-tested and production-ready

The key differentiator is being a **pure JavaScript solution** that requires no native dependencies while delivering native-level performance, making it the ideal choice for developers who want simplicity without sacrificing quality.

## Next Steps

1. Review and refine this plan
2. Set up the package structure
3. Begin core refactoring
4. Create proof-of-concept for new API
5. Gather early feedback from potential users
