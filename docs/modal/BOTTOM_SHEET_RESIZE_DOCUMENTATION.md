# Bottom Sheet Drag-to-Resize Implementation Guide

This document provides a comprehensive explanation of how the bottom sheet modal's drag-to-resize functionality works, tracing through all the code involved in handling the gesture to resize the modal height.

## Table of Contents
1. [Overview](#overview)
2. [Key Components](#key-components)
3. [Gesture Setup Flow](#gesture-setup-flow)
4. [Gesture Event Handlers](#gesture-event-handlers)
5. [Position Calculation Logic](#position-calculation-logic)
6. [Animation and Snapping](#animation-and-snapping)

## Overview

The drag-to-resize functionality allows users to grab the handle at the top of the bottom sheet and drag it vertically to change its height. The system uses React Native Gesture Handler for gesture detection and Reanimated for smooth animations.

### Key Files Involved:
- `src/components/bottomSheetHandleContainer/BottomSheetHandleContainer.tsx` - Handle UI component with gesture detector
- `src/hooks/useGestureEventsHandlersDefault.tsx` - Core gesture handling logic
- `src/hooks/useGestureHandler.ts` - Gesture handler wrapper
- `src/components/bottomSheetGestureHandlersProvider/BottomSheetGestureHandlersProvider.tsx` - Context provider for gesture handlers
- `src/utilities/snapPoint.ts` - Snap point calculation utility

## Key Components

### 1. Gesture Source Types
The system distinguishes between different gesture sources:

```typescript
// From src/constants.ts
enum GESTURE_SOURCE {
  UNDETERMINED = 0,
  SCROLLABLE = 1,
  HANDLE = 2,  // <-- This is used for handle dragging
  CONTENT = 3,
}
```

### 2. Animation Sources
Different triggers for animations:

```typescript
// From src/constants.ts
enum ANIMATION_SOURCE {
  NONE = 0,
  MOUNT = 1,
  GESTURE = 2,  // <-- Used when animation is triggered by gesture
  USER = 3,
  CONTAINER_RESIZE = 4,
  SNAP_POINT_CHANGE = 5,
  KEYBOARD = 6,
}
```

## Gesture Setup Flow

### Step 1: Handle Container Setup
The `BottomSheetHandleContainer` component sets up the Pan gesture on the handle:

```typescript
// From src/components/bottomSheetHandleContainer/BottomSheetHandleContainer.tsx (lines 56-92)
const panGesture = useMemo(() => {
  let gesture = Gesture.Pan()
    .enabled(enableHandlePanningGesture)
    .shouldCancelWhenOutside(false)
    .runOnJS(false)
    .onStart(handlePanGestureHandler.handleOnStart)
    .onChange(handlePanGestureHandler.handleOnChange)
    .onEnd(handlePanGestureHandler.handleOnEnd)
    .onFinalize(handlePanGestureHandler.handleOnFinalize);

  if (waitFor) {
    gesture = gesture.requireExternalGestureToFail(waitFor);
  }

  if (simultaneousHandlers) {
    gesture = gesture.simultaneousWithExternalGesture(
      simultaneousHandlers as never
    );
  }

  if (activeOffsetX) {
    gesture = gesture.activeOffsetX(activeOffsetX);
  }

  if (activeOffsetY) {
    gesture = gesture.activeOffsetY(activeOffsetY);
  }

  if (failOffsetX) {
    gesture = gesture.failOffsetX(failOffsetX);
  }

  if (failOffsetY) {
    gesture = gesture.failOffsetY(failOffsetY);
  }

  return gesture;
}, [
  activeOffsetX,
  activeOffsetY,
  enableHandlePanningGesture,
  failOffsetX,
  failOffsetY,
  simultaneousHandlers,
  waitFor,
  handlePanGestureHandler.handleOnChange,
  handlePanGestureHandler.handleOnEnd,
  handlePanGestureHandler.handleOnFinalize,
  handlePanGestureHandler.handleOnStart,
]);
```

The gesture is then applied to the handle view:

```typescript
// From src/components/bottomSheetHandleContainer/BottomSheetHandleContainer.tsx (lines 137-152)
return HandleComponent !== null ? (
  <GestureDetector gesture={panGesture}>
    <Animated.View
      key="BottomSheetHandleContainer"
      onLayout={handleContainerLayout}
      style={styles.container}
    >
      <HandleComponent
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        style={_providedHandleStyle}
        indicatorStyle={_providedIndicatorStyle}
      />
    </Animated.View>
  </GestureDetector>
) : null;
```

### Step 2: Gesture Handlers Provider
The `BottomSheetGestureHandlersProvider` creates and provides the gesture handlers:

```typescript
// From src/components/bottomSheetGestureHandlersProvider/BottomSheetGestureHandlersProvider.tsx (lines 31-49)
const contentPanGestureHandler = useGestureHandler(
  GESTURE_SOURCE.CONTENT,
  animatedContentGestureState,
  animatedGestureSource,
  handleOnStart,
  handleOnChange,
  handleOnEnd,
  handleOnFinalize
);

const handlePanGestureHandler = useGestureHandler(
  GESTURE_SOURCE.HANDLE,  // <-- Handle gesture source
  animatedHandleGestureState,
  animatedGestureSource,
  handleOnStart,
  handleOnChange,
  handleOnEnd,
  handleOnFinalize
);
```

### Step 3: Gesture Handler Wrapper
The `useGestureHandler` hook wraps the gesture event handlers:

```typescript
// From src/hooks/useGestureHandler.ts (lines 25-78)
const handleOnStart = useWorkletCallback(
  (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    state.value = State.BEGAN;
    gestureSource.value = source;

    onStart(source, event);
    return;
  },
  [state, gestureSource, source, onStart]
);

const handleOnChange = useWorkletCallback(
  (
    event: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >
  ) => {
    if (gestureSource.value !== source) {
      return;
    }

    state.value = event.state;
    onChange(source, event);
  },
  [state, gestureSource, source, onChange]
);

const handleOnEnd = useWorkletCallback(
  (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (gestureSource.value !== source) {
      return;
    }

    state.value = event.state;
    gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

    onEnd(source, event);
  },
  [state, gestureSource, source, onEnd]
);

const handleOnFinalize = useWorkletCallback(
  (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (gestureSource.value !== source) {
      return;
    }

    state.value = event.state;
    gestureSource.value = GESTURE_SOURCE.UNDETERMINED;

    onFinalize(source, event);
  },
  [state, gestureSource, source, onFinalize]
);
```

## Gesture Event Handlers

The core gesture handling logic is in `useGestureEventsHandlersDefault`:

### handleOnStart - When Drag Begins
```typescript
// From src/hooks/useGestureEventsHandlersDefault.tsx (lines 73-113)
const handleOnStart: GestureEventHandlerCallbackType = useWorkletCallback(
  function handleOnStart(__, _) {
    // cancel current animation
    stopAnimation();

    let initialKeyboardState = animatedKeyboardState.value;
    // blur the keyboard when user start dragging the bottom sheet
    if (
      enableBlurKeyboardOnGesture &&
      initialKeyboardState === KEYBOARD_STATE.SHOWN
    ) {
      initialKeyboardState = KEYBOARD_STATE.HIDDEN;
      runOnJS(dismissKeyboard)();
    }

    // store current animated position
    context.value = {
      ...context.value,
      initialPosition: animatedPosition.value,  // <-- Stores starting position
      initialKeyboardState: animatedKeyboardState.value,
    };

    /**
     * if the scrollable content is scrolled, then
     * we lock the position.
     */
    if (animatedScrollableContentOffsetY.value > 0) {
      context.value = {
        ...context.value,
        isScrollablePositionLocked: true,
      };
    }
  },
  [
    stopAnimation,
    enableBlurKeyboardOnGesture,
    animatedPosition,
    animatedKeyboardState,
    animatedScrollableContentOffsetY,
  ]
);
```

### handleOnChange - During Drag (THIS IS WHERE RESIZING HAPPENS)
```typescript
// From src/hooks/useGestureEventsHandlersDefault.tsx (lines 114-269)
const handleOnChange: GestureEventHandlerCallbackType = useWorkletCallback(
  function handleOnChange(source, { translationY }) {
    let highestSnapPoint = animatedHighestSnapPoint.value;

    /**
     * if keyboard is shown, then we set the highest point to the current
     * position which includes the keyboard height.
     */
    if (
      isInTemporaryPosition.value &&
      context.value.initialKeyboardState === KEYBOARD_STATE.SHOWN
    ) {
      highestSnapPoint = context.value.initialPosition;
    }

    /**
     * if current position is out of provided `snapPoints` and smaller then
     * highest snap pont, then we set the highest point to the current position.
     */
    if (
      isInTemporaryPosition.value &&
      context.value.initialPosition < highestSnapPoint
    ) {
      highestSnapPoint = context.value.initialPosition;
    }

    const lowestSnapPoint = enablePanDownToClose
      ? animatedContainerHeight.value
      : animatedSnapPoints.value[0];

    /**
     * if scrollable is refreshable and sheet position at the highest
     * point, then do not interact with current gesture.
     */
    if (
      source === GESTURE_SOURCE.CONTENT &&
      isScrollableRefreshable.value &&
      animatedPosition.value === highestSnapPoint
    ) {
      return;
    }

    /**
     * a negative scrollable content offset to be subtracted from accumulated
     * current position and gesture translation Y to allow user to drag the sheet,
     * when scrollable position at the top.
     * a negative scrollable content offset when the scrollable is not locked.
     */
    const negativeScrollableContentOffset =
      (context.value.initialPosition === highestSnapPoint &&
        source === GESTURE_SOURCE.CONTENT) ||
      !context.value.isScrollablePositionLocked
        ? animatedScrollableContentOffsetY.value * -1
        : 0;

    /**
     * an accumulated value of starting position with gesture translation y.
     */
    const draggedPosition = context.value.initialPosition + translationY;  // <-- KEY CALCULATION

    /**
     * an accumulated value of dragged position and negative scrollable content offset,
     * this will insure locking sheet position when user is scrolling the scrollable until,
     * they reach to the top of the scrollable.
     */
    const accumulatedDraggedPosition =
      draggedPosition + negativeScrollableContentOffset;

    /**
     * a clamped value of the accumulated dragged position, to insure keeping the dragged
     * position between the highest and lowest snap points.
     */
    const clampedPosition = clamp(
      accumulatedDraggedPosition,
      highestSnapPoint,
      lowestSnapPoint
    );

    /**
     * if scrollable position is locked and the animated position
     * reaches the highest point, then we unlock the scrollable position.
     */
    if (
      context.value.isScrollablePositionLocked &&
      source === GESTURE_SOURCE.CONTENT &&
      animatedPosition.value === highestSnapPoint
    ) {
      context.value = {
        ...context.value,
        isScrollablePositionLocked: false,
      };
    }

    /**
     * over-drag implementation.
     */
    if (enableOverDrag) {
      if (
        (source === GESTURE_SOURCE.HANDLE ||
          animatedScrollableType.value === SCROLLABLE_TYPE.VIEW) &&
        draggedPosition < highestSnapPoint
      ) {
        const resistedPosition =
          highestSnapPoint -
          Math.sqrt(1 + (highestSnapPoint - draggedPosition)) *
            overDragResistanceFactor;
        animatedPosition.value = resistedPosition;  // <-- Updates position with resistance
        return;
      }

      if (
        source === GESTURE_SOURCE.HANDLE &&
        draggedPosition > lowestSnapPoint
      ) {
        const resistedPosition =
          lowestSnapPoint +
          Math.sqrt(1 + (draggedPosition - lowestSnapPoint)) *
            overDragResistanceFactor;
        animatedPosition.value = resistedPosition;  // <-- Updates position with resistance
        return;
      }

      if (
        source === GESTURE_SOURCE.CONTENT &&
        draggedPosition + negativeScrollableContentOffset > lowestSnapPoint
      ) {
        const resistedPosition =
          lowestSnapPoint +
          Math.sqrt(
            1 +
              (draggedPosition +
                negativeScrollableContentOffset -
                lowestSnapPoint)
          ) *
            overDragResistanceFactor;
        animatedPosition.value = resistedPosition;  // <-- Updates position with resistance
        return;
      }
    }

    animatedPosition.value = clampedPosition;  // <-- FINAL POSITION UPDATE
  },
  [
    enableOverDrag,
    enablePanDownToClose,
    overDragResistanceFactor,
    isInTemporaryPosition,
    isScrollableRefreshable,
    animatedHighestSnapPoint,
    animatedContainerHeight,
    animatedSnapPoints,
    animatedPosition,
    animatedScrollableType,
    animatedScrollableContentOffsetY,
  ]
);
```

### handleOnEnd - When Drag Ends
```typescript
// From src/hooks/useGestureEventsHandlersDefault.tsx (lines 270-402)
const handleOnEnd: GestureEventHandlerCallbackType = useWorkletCallback(
  function handleOnEnd(source, { translationY, absoluteY, velocityY }) {
    const highestSnapPoint = animatedHighestSnapPoint.value;
    const isSheetAtHighestSnapPoint =
      animatedPosition.value === highestSnapPoint;

    /**
     * if scrollable is refreshable and sheet position at the highest
     * point, then do not interact with current gesture.
     */
    if (
      source === GESTURE_SOURCE.CONTENT &&
      isScrollableRefreshable.value &&
      isSheetAtHighestSnapPoint
    ) {
      return;
    }

    /**
     * if the sheet is in a temporary position and the gesture ended above
     * the current position, then we snap back to the temporary position.
     */
    if (
      isInTemporaryPosition.value &&
      context.value.initialPosition >= animatedPosition.value
    ) {
      if (context.value.initialPosition > animatedPosition.value) {
        animateToPosition(
          context.value.initialPosition,
          ANIMATION_SOURCE.GESTURE,
          velocityY / 2
        );
      }
      return;
    }

    /**
     * close keyboard if current position is below the recorded
     * start position and keyboard still shown.
     */
    const isScrollable =
      animatedScrollableType.value !== SCROLLABLE_TYPE.UNDETERMINED &&
      animatedScrollableType.value !== SCROLLABLE_TYPE.VIEW;

    /**
     * if keyboard is shown and the sheet is dragged down,
     * then we dismiss the keyboard.
     */
    if (
      context.value.initialKeyboardState === KEYBOARD_STATE.SHOWN &&
      animatedPosition.value > context.value.initialPosition
    ) {
      /**
       * if the platform is ios, current content is scrollable and
       * the end touch point is below the keyboard position then
       * we exit the method.
       *
       * because the the keyboard dismiss is interactive in iOS.
       */
      if (
        !(
          Platform.OS === 'ios' &&
          isScrollable &&
          absoluteY > WINDOW_HEIGHT - animatedKeyboardHeight.value
        )
      ) {
        runOnJS(dismissKeyboard)();
      }
    }

    /**
     * reset isInTemporaryPosition value
     */
    if (isInTemporaryPosition.value) {
      isInTemporaryPosition.value = false;
    }

    /**
     * clone snap points array, and insert the container height
     * if pan down to close is enabled.
     */
    const snapPoints = animatedSnapPoints.value.slice();
    if (enablePanDownToClose) {
      snapPoints.unshift(animatedClosedPosition.value);
    }

    /**
     * calculate the destination point, using redash.
     */
    const destinationPoint = snapPoint(
      translationY + context.value.initialPosition,
      velocityY,
      snapPoints
    );

    /**
     * if destination point is the same as the current position,
     * then no need to perform animation.
     */
    if (destinationPoint === animatedPosition.value) {
      return;
    }

    const wasGestureHandledByScrollView =
      source === GESTURE_SOURCE.CONTENT &&
      animatedScrollableContentOffsetY.value > 0;
    /**
     * prevents snapping from top to middle / bottom with repeated interrupted scrolls
     */
    if (wasGestureHandledByScrollView && isSheetAtHighestSnapPoint) {
      return;
    }

    animateToPosition(
      destinationPoint,
      ANIMATION_SOURCE.GESTURE,
      velocityY / 2
    );
  },
  [
    enablePanDownToClose,
    isInTemporaryPosition,
    isScrollableRefreshable,
    animatedClosedPosition,
    animatedHighestSnapPoint,
    animatedKeyboardHeight,
    animatedPosition,
    animatedScrollableType,
    animatedSnapPoints,
    animatedScrollableContentOffsetY,
    animateToPosition,
  ]
);
```

## Position Calculation Logic

### Core Formula
The key calculation happens in `handleOnChange`:

```typescript
const draggedPosition = context.value.initialPosition + translationY;
```

Where:
- `context.value.initialPosition` = The position when the drag started (stored in handleOnStart)
- `translationY` = The vertical distance dragged from the starting point
- `draggedPosition` = The new position for the bottom sheet

### Clamping
The position is clamped between the highest and lowest snap points:

```typescript
const clampedPosition = clamp(
  accumulatedDraggedPosition,
  highestSnapPoint,
  lowestSnapPoint
);
```

### Over-drag Resistance
When `enableOverDrag` is true, dragging beyond limits applies resistance:

```typescript
// For dragging above the highest point
const resistedPosition =
  highestSnapPoint -
  Math.sqrt(1 + (highestSnapPoint - draggedPosition)) *
    overDragResistanceFactor;
```

## Animation and Snapping

### Snap Point Calculation
When the gesture ends, the sheet snaps to the nearest snap point:

```typescript
// From src/utilities/snapPoint.ts
export const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>
): number => {
  'worklet';
  const point = value + 0.2 * velocity;  // Factor in velocity for momentum
  const deltas = points.map(p => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter(p => Math.abs(point - p) === minDelta)[0];
};
```

The function:
1. Adds 20% of the velocity to the current position (for momentum-based snapping)
2. Calculates distances to all snap points
3. Returns the closest snap point

### Animating to Final Position
After calculating the destination snap point, the sheet animates to it:

```typescript
animateToPosition(
  destinationPoint,
  ANIMATION_SOURCE.GESTURE,
  velocityY / 2  // Half the velocity is passed for smoother animation
);
```

## Summary of the Resize Flow

1. **User touches the handle** → `handleOnStart` is called
   - Current position is stored as `initialPosition`
   - Any running animations are stopped

2. **User drags the handle** → `handleOnChange` is called repeatedly
   - New position calculated: `initialPosition + translationY`
   - Position is clamped between min/max bounds
   - Over-drag resistance applied if enabled
   - `animatedPosition.value` is updated in real-time

3. **User releases the handle** → `handleOnEnd` is called
   - Velocity and final position are used to calculate nearest snap point
   - Sheet animates to the calculated snap point

The entire system runs on the UI thread using Reanimated worklets for 60fps performance, with the position value (`animatedPosition`) driving the actual visual height of the bottom sheet through animated styles.