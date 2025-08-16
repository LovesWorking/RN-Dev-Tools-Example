# Pure JavaScript Modal & Bottom Sheet Performance Optimization Guide

## Executive Summary

This guide distills the performance optimization techniques from the react-native-bottom-sheet library and translates them into pure JavaScript/React Native implementations without native dependencies. Based on extensive analysis of the library's architecture, these patterns will help you achieve near-native performance using only the React Native Animated API and JavaScript.

## Table of Contents

1. [Core Performance Principles](#core-performance-principles)
2. [Animation Optimization](#animation-optimization)
3. [Gesture Handling](#gesture-handling)
4. [State Management](#state-management)
5. [Rendering Optimizations](#rendering-optimizations)
6. [Platform-Specific Optimizations](#platform-specific-optimizations)
7. [Advanced Techniques](#advanced-techniques)
8. [Common Pitfalls & Solutions](#common-pitfalls--solutions)

---

## Core Performance Principles

### 1. Minimize Bridge Calls

The react-native-bottom-sheet library uses Reanimated's worklets to run animations on the UI thread. In pure JS, we must minimize bridge crossings:

**❌ DON'T DO THIS:**
```typescript
// This causes multiple bridge calls
const handleGesture = (event) => {
  setPositionX(event.nativeEvent.pageX);
  setPositionY(event.nativeEvent.pageY);
  updateDimensions();
  checkBoundaries();
};
```

**✅ DO THIS INSTEAD:**
```typescript
// Use Animated.event to handle gestures directly
const panResponder = PanResponder.create({
  onPanResponderMove: Animated.event(
    [null, { dx: animatedX, dy: animatedY }],
    { 
      useNativeDriver: false, // Set to true when possible
      listener: (event, gestureState) => {
        // Batch updates using RAF
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(() => {
            // Process all updates at once
            processGestureUpdate(gestureState);
            animationFrameRef.current = null;
          });
        }
      }
    }
  ),
});
```

### 2. Use Native Driver When Possible

The library heavily relies on native driver animations. For pure JS:

**✅ OPTIMAL APPROACH:**
```typescript
// For transform properties, always use native driver
Animated.timing(animatedValue, {
  toValue: targetValue,
  duration: 250,
  useNativeDriver: true, // Critical for performance
  easing: Easing.out(Easing.exp), // Match the library's easing
}).start();

// For layout properties, batch them
const animateLayout = () => {
  Animated.parallel([
    Animated.timing(heightAnim, {
      toValue: newHeight,
      duration: 250,
      useNativeDriver: false, // Required for height
    }),
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true, // Can use native for opacity
    }),
  ]).start();
};
```

---

## Animation Optimization

### 1. Spring vs Timing Animations

The library uses platform-specific animation configs:

```typescript
// iOS: Spring animations for natural feel
const IOS_SPRING_CONFIG = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

// Android: Timing animations for consistency
const ANDROID_TIMING_CONFIG = {
  duration: 250,
  easing: Easing.out(Easing.exp),
};

// Apply platform-specific config
const animationConfig = Platform.select({
  ios: { ...IOS_SPRING_CONFIG, useNativeDriver: true },
  android: { ...ANDROID_TIMING_CONFIG, useNativeDriver: true },
});
```

### 2. Velocity-Based Animations & Snap Point Selection

**✅ ENHANCED SNAP POINT CALCULATION WITH VELOCITY:**
```typescript
// Normalize snap points once on layout/keyboard change
function normalizeSnapPoints(
  snapPoints: (number | `${number}%`)[], 
  containerHeight: number
): number[] {
  if (!snapPoints || snapPoints.length === 0) return [];
  
  const normalized = snapPoints.map(point => {
    if (typeof point === 'string' && point.endsWith('%')) {
      const percentage = parseFloat(point) / 100;
      return containerHeight * (1 - percentage); // Convert to position from top
    }
    return containerHeight - point; // Convert absolute height to position
  });
  
  // Sort in ascending order (top-most positions first)
  return normalized.sort((a, b) => a - b);
}

// Calculate snap point with velocity lookahead
const calculateSnapPoint = (
  currentPosition: number, 
  velocity: number, 
  snapPoints: number[],
  velocityLookahead: number = 180 // ms of velocity projection
) => {
  // Project position based on velocity (platform-tuned lookahead)
  const projectedPosition = currentPosition + velocity * velocityLookahead;
  
  // Find closest snap point to projected position
  let closestPoint = snapPoints[0];
  let minDistance = Math.abs(projectedPosition - closestPoint);
  
  for (const point of snapPoints) {
    const distance = Math.abs(projectedPosition - point);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = point;
    }
  }
  
  return closestPoint;
};

// Platform-specific velocity lookahead tuning
const VELOCITY_LOOKAHEAD = Platform.select({
  ios: 180,     // iOS: more responsive to velocity
  android: 150, // Android: slightly less velocity influence
});
```

### 3. Interpolation Optimization

**✅ EFFICIENT INTERPOLATION:**
```typescript
// Pre-calculate interpolation ranges
const interpolationConfig = useMemo(() => ({
  inputRange: [0, 1],
  outputRange: [SCREEN_HEIGHT, 0],
  extrapolate: 'clamp',
}), []);

// Use interpolation for smooth transitions
const translateY = animatedValue.interpolate(interpolationConfig);

// For complex interpolations, memoize them
const complexInterpolation = useMemo(() => {
  return {
    opacity: animatedPosition.interpolate({
      inputRange: [0, 100, 200],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    }),
    scale: animatedPosition.interpolate({
      inputRange: [0, 100],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    }),
  };
}, [animatedPosition]);
```

---

## Gesture Handling

### 1. PanResponder Optimization

**✅ OPTIMIZED GESTURE HANDLER:**
```typescript
const createOptimizedPanResponder = () => {
  let startPosition = { x: 0, y: 0 };
  let accumulator = { x: 0, y: 0 };
  
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only capture if movement exceeds threshold
      return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
    },
    
    onPanResponderGrant: (evt, gestureState) => {
      // Store initial position
      startPosition = {
        x: evt.nativeEvent.pageX,
        y: evt.nativeEvent.pageY,
      };
      
      // Stop any ongoing animations
      animatedX.stopAnimation();
      animatedY.stopAnimation();
      
      // Extract current values without bridge call
      animatedX.setOffset(animatedX._value);
      animatedY.setOffset(animatedY._value);
      animatedX.setValue(0);
      animatedY.setValue(0);
    },
    
    onPanResponderMove: Animated.event(
      [null, { dx: animatedX, dy: animatedY }],
      {
        useNativeDriver: false,
        listener: (evt, gestureState) => {
          // Throttle non-critical updates
          throttledUpdate(gestureState);
        },
      }
    ),
    
    onPanResponderRelease: (evt, gestureState) => {
      // Calculate final position with velocity
      const finalPosition = calculateSnapPoint(
        currentPosition,
        gestureState.vy,
        snapPoints
      );
      
      // Animate to final position
      Animated.spring(animatedPosition, {
        toValue: finalPosition,
        velocity: gestureState.vy,
        useNativeDriver: true,
        ...SPRING_CONFIG,
      }).start();
      
      // Clear offsets
      animatedX.flattenOffset();
      animatedY.flattenOffset();
    },
  });
};
```

### 2. Gesture Conflict Resolution & Scrollable Coordination

**✅ ENHANCED SCROLLABLE COORDINATION:**
```typescript
// Track scroll offset without re-renders
function useContentOffsetY() {
  const offsetRef = useRef(0);
  const lockedRef = useRef(false);
  
  const onScroll = useCallback((event: any) => {
    offsetRef.current = event.nativeEvent.contentOffset.y;
  }, []);
  
  const isAtTop = useCallback(() => offsetRef.current <= 0, []);
  const lockPosition = useCallback(() => { lockedRef.current = true; }, []);
  const unlockPosition = useCallback(() => { lockedRef.current = false; }, []);
  
  return { 
    get: () => offsetRef.current,
    isAtTop,
    isLocked: () => lockedRef.current,
    lockPosition,
    unlockPosition,
    onScroll,
  };
}

// Intelligent gesture gating
const createScrollAwarePanResponder = (scrollableRef: any) => {
  const { get: getOffsetY, isAtTop, lockPosition, unlockPosition } = useContentOffsetY();
  
  return PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      const isVertical = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      const atTop = isAtTop();
      
      // Sheet takes over when:
      // 1. Pulling down at scroll top
      // 2. Dragging up from handle (not content)
      // 3. Horizontal drag (for dismiss gesture)
      if (atTop && gestureState.dy > 0) {
        lockPosition(); // Lock scrollable while sheet moves
        return true;
      }
      
      if (!atTop && gestureState.dy < 0) {
        return false; // Let ScrollView handle upward scroll
      }
      
      return isVertical && gestureState.dy < 0; // Sheet handles collapse
    },
    
    onPanResponderGrant: () => {
      // Stop any scroll momentum
      scrollableRef.current?.scrollTo({ y: getOffsetY(), animated: false });
    },
    
    onPanResponderRelease: () => {
      unlockPosition(); // Unlock scrollable after gesture
    },
  });
};

// Apply to ScrollView with proper throttling
<Animated.ScrollView
  ref={scrollableRef}
  onScroll={onScroll}
  scrollEventThrottle={16} // 60fps updates
  scrollEnabled={!isLocked()} // Disable during sheet drag
  bounces={false} // Prevent iOS bounce during sheet interaction
  overScrollMode="never" // Prevent Android overscroll glow
/>
```

### 3. Over-Drag Resistance

**✅ IMPLEMENT RESISTANCE:**
```typescript
const applyOverDragResistance = (
  position: number,
  boundary: number,
  factor: number = 2.5
) => {
  if (position < boundary) {
    // Apply resistance formula
    const overdrag = boundary - position;
    return boundary - Math.sqrt(1 + overdrag) * factor;
  }
  return position;
};

// In gesture handler
onPanResponderMove: (evt, gestureState) => {
  let newPosition = startPosition + gestureState.dy;
  
  // Apply resistance at boundaries
  if (newPosition < MIN_POSITION) {
    newPosition = applyOverDragResistance(newPosition, MIN_POSITION);
  } else if (newPosition > MAX_POSITION) {
    newPosition = applyOverDragResistance(newPosition, MAX_POSITION);
  }
  
  animatedPosition.setValue(newPosition);
};
```

---

## State Management

### 1. Minimize Re-renders

**✅ USE REFS FOR NON-VISUAL STATE:**
```typescript
const ModalComponent = () => {
  // Visual state (causes re-render)
  const [isVisible, setIsVisible] = useState(false);
  
  // Non-visual state (no re-render)
  const gestureStateRef = useRef({
    startY: 0,
    velocityY: 0,
    isDragging: false,
  });
  
  const dimensionsRef = useRef({
    width: 0,
    height: 0,
  });
  
  // Update refs without re-render
  const updateGestureState = useCallback((updates) => {
    Object.assign(gestureStateRef.current, updates);
  }, []);
};
```

### 2. Batch State Updates

**✅ BATCH MULTIPLE UPDATES:**
```typescript
const batchedUpdate = useCallback(() => {
  // Use unstable_batchedUpdates for React Native < 0.65
  ReactNative.unstable_batchedUpdates(() => {
    setHeight(newHeight);
    setWidth(newWidth);
    setPosition({ x: newX, y: newY });
  });
  
  // Or use functional updates
  setState(prevState => ({
    ...prevState,
    height: newHeight,
    width: newWidth,
    position: { x: newX, y: newY },
  }));
}, []);
```

### 3. Memoization Strategy

**✅ STRATEGIC MEMOIZATION:**
```typescript
const BottomSheet = memo(({ children, snapPoints, ...props }) => {
  // Memoize expensive calculations
  const calculatedSnapPoints = useMemo(() => {
    return snapPoints.map(point => {
      if (typeof point === 'string' && point.endsWith('%')) {
        return (parseFloat(point) / 100) * SCREEN_HEIGHT;
      }
      return point;
    });
  }, [snapPoints]); // Only recalculate when snapPoints change
  
  // Memoize callbacks that are passed to children
  const handleClose = useCallback(() => {
    Animated.timing(animatedPosition, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      props.onClose?.();
    });
  }, [props.onClose]); // Minimal dependencies
  
  // DON'T memoize everything
  const style = {
    transform: [{ translateY: animatedPosition }],
  }; // This is cheap to recreate
  
  return <Animated.View style={style}>{children}</Animated.View>;
});
```

---

## Rendering Optimizations

### 1. Component Structure

**✅ OPTIMIZE COMPONENT HIERARCHY:**
```typescript
// Separate animated and static parts
const BottomSheet = () => {
  return (
    <>
      {/* Static backdrop - separate component */}
      <Backdrop />
      
      {/* Animated container */}
      <Animated.View style={animatedStyles}>
        {/* Static header - memoized */}
        <Header />
        
        {/* Dynamic content */}
        <Content />
      </Animated.View>
    </>
  );
};

// Memoize static components
const Header = memo(() => {
  return <View>{/* Header content */}</View>;
});

const Backdrop = memo(({ onPress }) => {
  return <Pressable onPress={onPress} />;
});
```

### 2. Use Animated Components

**✅ PREFER ANIMATED COMPONENTS:**
```typescript
// Instead of updating state for animations
const BadExample = () => {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(prev => prev + 0.1);
    }, 16);
  }, []);
  
  return <View style={{ opacity }} />;
};

// Use Animated API
const GoodExample = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return <Animated.View style={{ opacity }} />;
};
```

### 3. Optimize List Rendering

**✅ FOR SCROLLABLE CONTENT:**
```typescript
const OptimizedScrollView = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  return (
    <Animated.ScrollView
      scrollEventThrottle={16} // For 60fps
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      // Optimize for large lists
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
    >
      {children}
    </Animated.ScrollView>
  );
};
```

---

## Keyboard Integration

### Enhanced Keyboard Handling

**✅ KEYBOARD-AWARE LAYOUT WITH SNAP POINT RECALCULATION:**
```typescript
function useKeyboardAwareLayout(
  containerHeight: number,
  snapPoints: (number | `${number}%`)[],
  onHeightChange: (height: number) => void
) {
  const keyboardHeightRef = useRef(0);
  const normalizedSnapPointsRef = useRef<number[]>([]);
  
  useEffect(() => {
    const showEvent = Platform.select({
      ios: 'keyboardWillShow',     // iOS: Use Will events for smoother animation
      android: 'keyboardDidShow',   // Android: Only Did events available
    });
    
    const hideEvent = Platform.select({
      ios: 'keyboardWillHide',
      android: 'keyboardDidHide',
    });
    
    const handleKeyboardShow = Keyboard.addListener(showEvent, (e) => {
      keyboardHeightRef.current = e.endCoordinates.height;
      const effectiveHeight = containerHeight - e.endCoordinates.height;
      
      // Recalculate snap points with new container height
      normalizedSnapPointsRef.current = normalizeSnapPoints(snapPoints, effectiveHeight);
      onHeightChange(effectiveHeight);
      
      // Clamp current position if needed
      if (Platform.OS === 'ios') {
        // iOS: Animate with keyboard using duration from event
        Animated.timing(containerHeightAnim, {
          toValue: effectiveHeight,
          duration: e.duration || 250,
          easing: Easing.keyboard,
          useNativeDriver: false,
        }).start();
      }
    });
    
    const handleKeyboardHide = Keyboard.addListener(hideEvent, (e) => {
      keyboardHeightRef.current = 0;
      
      // Restore original snap points
      normalizedSnapPointsRef.current = normalizeSnapPoints(snapPoints, containerHeight);
      onHeightChange(containerHeight);
      
      if (Platform.OS === 'ios') {
        Animated.timing(containerHeightAnim, {
          toValue: containerHeight,
          duration: e?.duration || 250,
          easing: Easing.keyboard,
          useNativeDriver: false,
        }).start();
      }
    });
    
    return () => {
      handleKeyboardShow.remove();
      handleKeyboardHide.remove();
    };
  }, [containerHeight, snapPoints, onHeightChange]);
  
  return {
    keyboardHeight: keyboardHeightRef.current,
    adjustedSnapPoints: normalizedSnapPointsRef.current,
  };
}

// Keyboard dismiss behavior during gestures
const handleKeyboardDuringGesture = (gestureState: any) => {
  const shouldDismiss = Platform.select({
    ios: gestureState.dy > 50,     // iOS: Interactive dismiss
    android: gestureState.dy > 10,  // Android: Quick dismiss
  });
  
  if (shouldDismiss) {
    Keyboard.dismiss();
  }
};
```

## Platform-Specific Optimizations

### 1. iOS Optimizations

```typescript
const iosOptimizations = {
  // Use iOS-specific scroll deceleration
  decelerationRate: Platform.select({
    ios: 0.998, // iOS native feel
    default: 'normal',
  }),
  
  // iOS rubber-band effect
  bounces: true,
  bouncesZoom: true,
  
  // Optimize keyboard handling
  keyboardDismissMode: 'interactive',
  keyboardShouldPersistTaps: 'handled',
};
```

### 2. Android Optimizations

```typescript
const androidOptimizations = {
  // Disable overscroll effect on Android
  overScrollMode: 'never',
  
  // Android-specific elevation for shadows
  elevation: 8,
  
  // Optimize for Android gesture navigation
  statusBarTranslucent: true,
  
  // Use hardware acceleration
  renderToHardwareTextureAndroid: true,
  
  // Prevent view collapsing
  collapsable: false,
};
```

### 3. Conditional Features

```typescript
const PlatformOptimizedModal = () => {
  const animationConfig = Platform.select({
    ios: {
      type: 'spring',
      config: IOS_SPRING_CONFIG,
    },
    android: {
      type: 'timing',
      config: ANDROID_TIMING_CONFIG,
    },
  });
  
  // Platform-specific gesture thresholds
  const GESTURE_THRESHOLD = Platform.select({
    ios: 5,     // More sensitive on iOS
    android: 10, // Less sensitive on Android
  });
  
  return <Modal {...animationConfig} />;
};
```

---

## Advanced Techniques

### 1. Stable View Hierarchy (Critical for Performance)

**✅ NEVER CONDITIONALLY RENDER CORE COMPONENTS:**
```typescript
// ❌ BAD - Causes reconciliation and layout thrashing
const Modal = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <>
      {showBackdrop && <Backdrop />}
      {showHandle && <Handle />}
      <Content />
    </>
  );
};

// ✅ GOOD - Stable tree with visibility via styles
const Modal = ({ visible }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0.5, 0],
    extrapolate: 'clamp',
  });
  
  return (
    <>
      <Animated.View 
        style={{ opacity: backdropOpacity }}
        pointerEvents={visible ? 'auto' : 'none'}>
        <Backdrop />
      </Animated.View>
      
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Handle />
        <Content />
        <Footer />
      </Animated.View>
    </>
  );
};
```

### 2. Request Animation Frame (RAF) Throttling

**✅ IMPLEMENT RAF THROTTLING:**
```typescript
class RAFThrottler {
  private frameId: number | null = null;
  private lastArgs: any[] = [];
  
  constructor(private callback: Function) {}
  
  throttle = (...args: any[]) => {
    this.lastArgs = args;
    
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(() => {
        this.callback(...this.lastArgs);
        this.frameId = null;
      });
    }
  };
  
  cancel = () => {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  };
}

// Usage
const throttledUpdate = useMemo(
  () => new RAFThrottler(updatePosition),
  [updatePosition]
);

// In gesture handler
onPanResponderMove: (evt, gestureState) => {
  throttledUpdate.throttle(gestureState.dx, gestureState.dy);
};
```

### 2. Transform Preview for Resize (Avoids Layout Thrashing)

**✅ USE TRANSFORM DURING RESIZE, COMMIT LAYOUT ON RELEASE:**
```typescript
// For 4-corner resizing without jank
function useCornerResize(
  initialWidth: number,
  initialHeight: number,
  onCommit: (w: number, h: number) => void
) {
  const previewScaleX = useRef(new Animated.Value(1)).current;
  const previewScaleY = useRef(new Animated.Value(1)).current;
  const startDimensions = useRef({ w: initialWidth, h: initialHeight });
  
  const panResponder = PanResponder.create({
    onPanResponderGrant: () => {
      startDimensions.current = { w: initialWidth, h: initialHeight };
      previewScaleX.setValue(1);
      previewScaleY.setValue(1);
    },
    
    onPanResponderMove: (_, gestureState) => {
      // Use transform scale for preview - NO layout changes during drag
      const scaleX = 1 + gestureState.dx / Math.max(120, startDimensions.current.w);
      const scaleY = 1 + gestureState.dy / Math.max(120, startDimensions.current.h);
      
      previewScaleX.setValue(scaleX);
      previewScaleY.setValue(scaleY);
    },
    
    onPanResponderRelease: (_, gestureState) => {
      const newWidth = Math.max(120, startDimensions.current.w + gestureState.dx);
      const newHeight = Math.max(120, startDimensions.current.h + gestureState.dy);
      
      // Commit actual layout change ONCE on release
      onCommit(newWidth, newHeight);
      
      // Animate scale back to 1
      Animated.parallel([
        Animated.timing(previewScaleX, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(previewScaleY, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    },
  });
  
  const previewStyle = {
    transform: [
      { scaleX: previewScaleX },
      { scaleY: previewScaleY },
    ],
  };
  
  return { panResponder, previewStyle };
}
```

### 3. Deferred Updates

**✅ DEFER NON-CRITICAL UPDATES:**
```typescript
const useDeferredValue = (value: any, delay: number = 100) => {
  const [deferredValue, setDeferredValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDeferredValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return deferredValue;
};

// Usage
const Modal = ({ height }) => {
  const deferredHeight = useDeferredValue(height, 200);
  
  // Use immediate value for animation
  const animatedHeight = useRef(new Animated.Value(height)).current;
  
  // Use deferred value for expensive operations
  useEffect(() => {
    calculateLayout(deferredHeight);
  }, [deferredHeight]);
};
```

### 3. Portal-Based Modal Provider (No RN Modal)

**✅ IMPLEMENT MODAL STACK WITHOUT REACT NATIVE MODAL:**
```typescript
// Modal provider with portal pattern for better performance
type ModalEntry = { 
  key: string; 
  component: React.ReactNode;
  priority?: number;
};

const ModalContext = React.createContext({
  present: (component: React.ReactNode, key?: string) => '',
  dismiss: (key?: string) => {},
  minimize: (key?: string) => {},
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  // Use ref to avoid re-renders on stack changes
  const stackRef = useRef<ModalEntry[]>([]);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  
  const present = useCallback((component: React.ReactNode, key = `modal-${Date.now()}`) => {
    stackRef.current.push({ key, component });
    forceUpdate();
    return key;
  }, []);
  
  const dismiss = useCallback((key?: string) => {
    if (!stackRef.current.length) return;
    
    if (key) {
      const index = stackRef.current.findIndex(e => e.key === key);
      if (index >= 0) stackRef.current.splice(index, 1);
    } else {
      stackRef.current.pop();
    }
    forceUpdate();
  }, []);
  
  const minimize = useCallback((key?: string) => {
    // Animate to middle snap point instead of dismissing
    const modal = key 
      ? stackRef.current.find(e => e.key === key)
      : stackRef.current[stackRef.current.length - 1];
      
    if (modal) {
      // Trigger minimize animation via ref or context
      // Keep modal in stack but visually minimized
    }
  }, []);
  
  return (
    <ModalContext.Provider value={{ present, dismiss, minimize }}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
      
      {/* Portal container - always mounted */}
      <View 
        pointerEvents="box-none" 
        style={StyleSheet.absoluteFillObject}>
        {stackRef.current.map(entry => (
          <View 
            key={entry.key}
            pointerEvents="box-none"
            style={StyleSheet.absoluteFillObject}>
            {entry.component}
          </View>
        ))}
      </View>
    </ModalContext.Provider>
  );
};

// Usage with stable keys
const useModal = () => {
  const { present, dismiss } = useContext(ModalContext);
  const modalKeyRef = useRef<string>();
  
  const showModal = useCallback((content: React.ReactNode) => {
    modalKeyRef.current = present(content);
  }, [present]);
  
  const hideModal = useCallback(() => {
    if (modalKeyRef.current) {
      dismiss(modalKeyRef.current);
      modalKeyRef.current = undefined;
    }
  }, [dismiss]);
  
  return { showModal, hideModal };
};
```

### 4. Measure Performance

**✅ PERFORMANCE MONITORING:**
```typescript
const usePerformanceMonitor = () => {
  const metricsRef = useRef({
    frameDrops: 0,
    lastFrameTime: Date.now(),
    fps: 60,
  });
  
  useEffect(() => {
    let frameId: number;
    
    const measureFrame = () => {
      const now = Date.now();
      const delta = now - metricsRef.current.lastFrameTime;
      
      // Detect frame drops (> 16.67ms for 60fps)
      if (delta > 17) {
        metricsRef.current.frameDrops++;
      }
      
      // Calculate FPS
      metricsRef.current.fps = Math.round(1000 / delta);
      metricsRef.current.lastFrameTime = now;
      
      frameId = requestAnimationFrame(measureFrame);
    };
    
    frameId = requestAnimationFrame(measureFrame);
    
    return () => cancelAnimationFrame(frameId);
  }, []);
  
  return metricsRef.current;
};
```

---

## Common Pitfalls & Solutions

### 1. Layout Thrashing

**❌ PROBLEM:**
```typescript
// Multiple layout recalculations
const handleResize = () => {
  setHeight(newHeight);     // Triggers layout
  setWidth(newWidth);       // Triggers layout again
  updatePosition();         // Another layout
  recalculateBounds();     // Yet another layout
};
```

**✅ SOLUTION:**
```typescript
// Batch layout updates
const handleResize = () => {
  requestAnimationFrame(() => {
    // All updates in single frame
    setState(prev => ({
      ...prev,
      height: newHeight,
      width: newWidth,
      position: newPosition,
      bounds: newBounds,
    }));
  });
};
```

### 2. Memory Leaks

**❌ PROBLEM:**
```typescript
useEffect(() => {
  const listener = Animated.addListener(({ value }) => {
    // Listener not removed
    updateState(value);
  });
});
```

**✅ SOLUTION:**
```typescript
useEffect(() => {
  const listenerId = animatedValue.addListener(({ value }) => {
    updateState(value);
  });
  
  return () => {
    animatedValue.removeListener(listenerId);
  };
}, []);
```

### 3. Excessive Re-renders

**❌ PROBLEM:**
```typescript
const Modal = ({ onHeightChange }) => {
  // Creates new function every render
  const handleHeight = (height) => {
    onHeightChange(height);
  };
  
  // Creates new object every render
  const style = {
    height: animatedHeight,
  };
  
  return <Animated.View style={style} />;
};
```

**✅ SOLUTION:**
```typescript
const Modal = memo(({ onHeightChange }) => {
  // Memoize callback
  const handleHeight = useCallback((height) => {
    onHeightChange(height);
  }, [onHeightChange]);
  
  // Use static styles or memoize
  const style = useMemo(() => ({
    height: animatedHeight,
  }), []); // animatedHeight is a ref, doesn't change
  
  return <Animated.View style={style} />;
});
```

### 4. Gesture Lag on Resize

**❌ PROBLEM:**
```typescript
// Direct state updates cause lag
onPanResponderMove: (evt, gestureState) => {
  setWidth(startWidth + gestureState.dx);
  setHeight(startHeight + gestureState.dy);
};
```

**✅ SOLUTION:**
```typescript
// Use Animated values for smooth updates
const animatedWidth = useRef(new Animated.Value(initialWidth)).current;
const animatedHeight = useRef(new Animated.Value(initialHeight)).current;

onPanResponderMove: Animated.event(
  [null, { dx: animatedWidth, dy: animatedHeight }],
  { useNativeDriver: false }
);

// Sync state after gesture ends
onPanResponderRelease: () => {
  const finalWidth = animatedWidth._value;
  const finalHeight = animatedHeight._value;
  
  // Single state update
  setState({ width: finalWidth, height: finalHeight });
};
```

---

## Implementation Checklist

### Performance Optimization Checklist

- [ ] **Animation System**
  - [ ] Use native driver for transforms and opacity
  - [ ] Implement platform-specific animation configs
  - [ ] Add velocity-based animations for natural feel
  - [ ] Use Animated.event for gesture handling

- [ ] **Gesture Handling**
  - [ ] Implement PanResponder with proper thresholds
  - [ ] Add over-drag resistance at boundaries
  - [ ] Handle gesture conflicts with scrollables
  - [ ] Track velocity for momentum scrolling

- [ ] **State Management**
  - [ ] Use refs for non-visual state
  - [ ] Batch multiple state updates
  - [ ] Implement proper memoization strategy
  - [ ] Avoid unnecessary re-renders

- [ ] **Rendering**
  - [ ] Separate static and animated components
  - [ ] Use Animated components instead of state-based animations
  - [ ] Optimize list rendering with proper props
  - [ ] Implement virtualization for long lists

- [ ] **Platform Optimizations**
  - [ ] Apply iOS-specific spring animations
  - [ ] Apply Android-specific timing animations
  - [ ] Handle platform-specific gesture thresholds
  - [ ] Optimize keyboard behavior per platform

- [ ] **Advanced Optimizations**
  - [ ] Implement RAF throttling for updates
  - [ ] Add deferred updates for non-critical changes
  - [ ] Monitor performance metrics
  - [ ] Profile and eliminate bottlenecks

---

## Performance Tuning Guide

### Optimal Configuration Values

**✅ PLATFORM-SPECIFIC TUNING PARAMETERS:**
```typescript
const PERFORMANCE_CONFIG = {
  // Spring configurations (iOS preferred)
  spring: {
    ios: {
      tension: 180,
      friction: 22,
      velocity: 0,
    },
    android: {
      tension: 150,
      friction: 25,
      velocity: 0,
    },
  },
  
  // Timing configurations (Android preferred)
  timing: {
    duration: Platform.select({ ios: 250, android: 200 }),
    easing: Easing.out(Easing.exp),
  },
  
  // Gesture thresholds
  gesture: {
    velocityLookahead: Platform.select({ ios: 180, android: 150 }), // ms
    overdragResistance: Platform.select({ ios: 2.5, android: 2.0 }),
    panThreshold: Platform.select({ ios: 5, android: 10 }), // px
    velocityThreshold: 0.3, // Minimum velocity to trigger snap
  },
  
  // Scrollable configuration
  scrollable: {
    scrollEventThrottle: 16, // 60fps
    decelerationRate: Platform.select({ ios: 0.998, android: 0.985 }),
    windowSize: 10,
    maxToRenderPerBatch: 5,
    updateCellsBatchingPeriod: 50,
    removeClippedSubviews: true,
  },
  
  // Keyboard
  keyboard: {
    dismissThreshold: Platform.select({ ios: 50, android: 10 }), // px
    animationDuration: Platform.select({ ios: 250, android: 0 }), // ms
  },
};
```

### Complete Minimal Implementation

**✅ FULLY WIRED PURE JS BOTTOM SHEET:**
```typescript
import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PureJSBottomSheetProps {
  snapPoints: (number | `${number}%`)[];
  children: React.ReactNode;
  onClose?: () => void;
}

export const PureJSBottomSheet: React.FC<PureJSBottomSheetProps> = ({
  snapPoints,
  children,
  onClose,
}) => {
  // Core animated values
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const velocityY = useRef(0);
  
  // State refs (no re-renders)
  const containerHeight = useRef(SCREEN_HEIGHT);
  const normalizedSnapPoints = useRef<number[]>([]);
  const currentIndex = useRef(0);
  const gestureContext = useRef({ startY: 0, startTranslateY: 0 });
  
  // Normalize snap points once
  const updateSnapPoints = useCallback(() => {
    normalizedSnapPoints.current = snapPoints.map(point => {
      if (typeof point === 'string' && point.endsWith('%')) {
        const percentage = parseFloat(point) / 100;
        return containerHeight.current * (1 - percentage);
      }
      return containerHeight.current - point;
    }).sort((a, b) => a - b);
  }, [snapPoints]);
  
  // Animate to snap point
  const snapToIndex = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(normalizedSnapPoints.current.length - 1, index));
    const destination = normalizedSnapPoints.current[clampedIndex];
    currentIndex.current = clampedIndex;
    
    Animated.spring(translateY, {
      toValue: destination,
      velocity: velocityY.current,
      tension: 180,
      friction: 22,
      useNativeDriver: true,
    }).start(() => {
      if (clampedIndex === normalizedSnapPoints.current.length - 1) {
        onClose?.();
      }
    });
  }, [translateY, onClose]);
  
  // Pan responder with all optimizations
  const panResponder = useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      
      onPanResponderGrant: () => {
        gestureContext.current = {
          startY: 0,
          startTranslateY: (translateY as any).__getValue(),
        };
        dragY.setValue(0);
        
        // Stop any ongoing animation
        translateY.stopAnimation();
      },
      
      onPanResponderMove: Animated.event(
        [null, { dy: dragY }],
        {
          useNativeDriver: false,
          listener: (_, gestureState) => {
            velocityY.current = gestureState.vy;
            
            // Apply overdrag resistance
            const raw = gestureContext.current.startTranslateY + gestureState.dy;
            const min = Math.min(...normalizedSnapPoints.current);
            const max = Math.max(...normalizedSnapPoints.current);
            
            let resisted = raw;
            if (raw < min) {
              resisted = min - Math.sqrt(Math.abs(min - raw)) * 2.5;
            } else if (raw > max) {
              resisted = max + Math.sqrt(raw - max) * 2.5;
            }
            
            translateY.setValue(resisted);
          },
        }
      ),
      
      onPanResponderRelease: () => {
        const currentPosition = (translateY as any).__getValue();
        const projectedPosition = currentPosition + velocityY.current * 180;
        
        // Find nearest snap point
        let nearestIndex = 0;
        let minDistance = Math.abs(projectedPosition - normalizedSnapPoints.current[0]);
        
        normalizedSnapPoints.current.forEach((point, index) => {
          const distance = Math.abs(projectedPosition - point);
          if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = index;
          }
        });
        
        snapToIndex(nearestIndex);
        dragY.setValue(0);
      },
    }),
    [translateY, dragY, snapToIndex]
  );
  
  // Initialize on mount
  useEffect(() => {
    updateSnapPoints();
    snapToIndex(normalizedSnapPoints.current.length - 1); // Start closed
  }, [updateSnapPoints, snapToIndex]);
  
  // Backdrop opacity interpolation
  const backdropOpacity = translateY.interpolate({
    inputRange: [0, SCREEN_HEIGHT],
    outputRange: [0.5, 0],
    extrapolate: 'clamp',
  });
  
  return (
    <>
      {/* Backdrop - always mounted */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'black', opacity: backdropOpacity },
        ]}
        pointerEvents={currentIndex.current === normalizedSnapPoints.current.length - 1 ? 'none' : 'auto'}
      />
      
      {/* Sheet - always mounted */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
```

## Conclusion

By implementing these optimization techniques derived from react-native-bottom-sheet, you can achieve near-native performance with pure JavaScript. The key is to:

1. **Minimize bridge calls** through batching and native driver usage
2. **Use the Animated API effectively** instead of state-based animations
3. **Implement proper gesture handling** with velocity and resistance
4. **Optimize rendering** through component structure and memoization
5. **Apply platform-specific optimizations** for the best user experience

Remember that performance optimization is an iterative process. Start with the core optimizations and gradually add advanced techniques based on your specific use case and performance requirements.

## Additional Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Animated API Documentation](https://reactnative.dev/docs/animated)
- [PanResponder Documentation](https://reactnative.dev/docs/panresponder)
- [Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code)