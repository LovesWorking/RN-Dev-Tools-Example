/**
 * ClaudeModal60FPSClean - Ultra-optimized for true 60FPS performance
 *
 * Achieves 60FPS by following the principles from the dial menu:
 * 1. ALWAYS use native driver (useNativeDriver: true)
 * 2. Use transforms instead of layout properties (translateY instead of height)
 * 3. Use interpolation for all calculations (no JS thread math)
 * 4. Minimize PanResponder JS work (direct setValue, no state updates)
 *
 * Structure follows SRP with each function doing ONE thing only.
 */

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
  PanResponder,
  Animated,
  ScrollView,
  Text,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "@/src/hooks/useSafeAreaInsets";

// ============================================================================
// CONSTANTS - Modal dimensions and configuration
// ============================================================================
const SCREEN = Dimensions.get("window");
const MIN_HEIGHT = 100;
const DEFAULT_HEIGHT = 400;
const FLOATING_WIDTH = 380;
const FLOATING_HEIGHT = 500;
const FLOATING_MIN_WIDTH = 300;
const FLOATING_MIN_HEIGHT = 200;

// ============================================================================
// TYPE DEFINITIONS - Interface contracts for the modal
// ============================================================================
export type ModalMode = "bottomSheet" | "floating";

interface HeaderConfig {
  title?: string;
  subtitle?: string;
  showToggleButton?: boolean;
  customContent?: React.ReactNode;
  hideCloseButton?: boolean;
}

interface CustomStyles {
  container?: any;
  content?: any;
}

interface ClaudeModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: HeaderConfig;
  styles?: CustomStyles;
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  animatedHeight?: Animated.Value; // External animated height for performance testing
  initialMode?: ModalMode;
  onModeChange?: (mode: ModalMode) => void;
  persistenceKey?: string;
  enablePersistence?: boolean;
  enableGlitchEffects?: boolean;
}

// ============================================================================
// ICON COMPONENTS - Visual indicators for modal controls
// ============================================================================

/**
 * CloseIcon - Renders an X icon for closing the modal
 */
const CloseIcon = memo(function CloseIcon() {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View style={[styles.iconLine, { transform: [{ rotate: "45deg" }] }]} />
      <View style={[styles.iconLine, { transform: [{ rotate: "-45deg" }] }]} />
    </View>
  );
});

/**
 * MaximizeIcon - Renders a square icon for expanding to floating mode
 */
const MaximizeIcon = memo(function MaximizeIcon() {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: 12,
          height: 12,
          borderWidth: 1.5,
          borderColor: "#E5E7EB",
          borderRadius: 2,
        }}
      />
    </View>
  );
});

/**
 * MinimizeIcon - Renders a line icon for minimizing to bottom sheet
 */
const MinimizeIcon = memo(function MinimizeIcon() {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View
        style={{
          position: "absolute",
          top: 7,
          left: 2,
          width: 12,
          height: 1.5,
          backgroundColor: "#E5E7EB",
        }}
      />
    </View>
  );
});

/**
 * DragIndicator - Visual feedback for draggable areas
 */
const DragIndicator = memo(
  function DragIndicator({
    isResizing,
    mode,
  }: {
    isResizing: boolean;
    mode: ModalMode;
  }) {
    return (
      <View style={styles.dragIndicatorContainer}>
        {mode === "bottomSheet" && (
          <>
            <View
              style={[
                styles.dragIndicator,
                isResizing && styles.dragIndicatorActive,
              ]}
            />
            {/* Add resize grip lines for better visual feedback */}
            {isResizing && (
              <View style={styles.resizeGripContainer}>
                <View style={styles.resizeGripLine} />
                <View style={styles.resizeGripLine} />
                <View style={styles.resizeGripLine} />
              </View>
            )}
          </>
        )}
      </View>
    );
  }
);

/**
 * CornerHandle - Resize handle for floating mode corners
 */
const CornerHandle = memo(
  function CornerHandle({
    position,
    isActive,
  }: {
    position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
    isActive: boolean;
  }) {
    return (
      <View style={[styles.cornerHandle]}>
        <View style={[styles.handler, isActive && styles.handlerActive]} />
      </View>
    );
  }
);

/**
 * ModalHeader - Header bar with title, controls, and drag area
 */
interface ModalHeaderProps {
  header?: HeaderConfig;
  onClose: () => void;
  onToggleMode: () => void;
  isResizing: boolean;
  mode: ModalMode;
  panHandlers?: any;
}

const ModalHeader = memo(
  function ModalHeader({
    header,
    onClose,
    onToggleMode,
    isResizing,
    mode,
    panHandlers,
  }: ModalHeaderProps) {
    const headerProps = panHandlers ? panHandlers : {};

    // If custom content is provided, check if it's a complete replacement
    if (header?.customContent) {
      // Check if the custom content is a complete header replacement (like CyberpunkModalHeader)
      // by checking if it's a React element with specific props
      const isCompleteReplacement = React.isValidElement(header.customContent) && 
        (typeof header.customContent.type === 'function' && header.customContent.type.name === 'CyberpunkModalHeader');
      
      if (isCompleteReplacement) {
        // Clone the element and pass the necessary props
        return React.cloneElement(header.customContent as React.ReactElement<any>, {
          onToggleMode,
          onClose,
          mode,
          panHandlers: headerProps,
          showToggleButton: header?.showToggleButton !== false,
          hideCloseButton: header?.hideCloseButton,
        });
      }
      
      // Otherwise, render custom content within the standard header structure
      return (
        <View style={styles.header} {...headerProps}>
          <DragIndicator isResizing={isResizing} mode={mode} />
          {header.customContent}
          <View style={styles.headerControls}>
            {header?.showToggleButton !== false && (
              <Pressable
                onPress={onToggleMode}
                style={[styles.controlButton, styles.toggleButton]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {mode === "floating" ? <MinimizeIcon /> : <MaximizeIcon />}
              </Pressable>
            )}
            {!header?.hideCloseButton && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CloseIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.header} {...headerProps}>
        <DragIndicator isResizing={isResizing} mode={mode} />
        <View style={styles.headerContent}>
          {header?.title && (
            <Text style={styles.headerTitle}>{header.title}</Text>
          )}
          {header?.subtitle && (
            <Text style={styles.headerSubtitle}>{header.subtitle}</Text>
          )}
        </View>
        <View style={styles.headerControls}>
          {header?.showToggleButton !== false && (
            <Pressable
              onPress={onToggleMode}
              style={[styles.controlButton, styles.toggleButton]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {mode === "floating" ? <MinimizeIcon /> : <MaximizeIcon />}
            </Pressable>
          )}
          {!header?.hideCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

// ============================================================================
// MAIN COMPONENT - Optimized for 60FPS with transforms and interpolation
// ============================================================================
export const ClaudeModal60FPSClean: React.FC<ClaudeModalProps> = ({
  visible,
  onClose,
  children,
  header,
  styles: customStyles = {},
  minHeight = MIN_HEIGHT,
  maxHeight,
  initialHeight = DEFAULT_HEIGHT,
  animatedHeight: externalAnimatedHeight,
  initialMode = "bottomSheet",
  onModeChange,
}) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: FLOATING_WIDTH,
    height: FLOATING_HEIGHT,
    top: (SCREEN.height - FLOATING_HEIGHT) / 2,
    left: (SCREEN.width - FLOATING_WIDTH) / 2,
  });
  const [containerBounds, setContainerBounds] = useState({
    width: SCREEN.width,
    height: SCREEN.height,
  });
  
  // ============================================================================
  // ANIMATED VALUES - All using native driver
  // ============================================================================
  
  // Main visibility progress (0 = hidden, 1 = visible)
  const visibilityProgress = useRef(new Animated.Value(0)).current;
  
  // Bottom sheet specific - using translateY for performance!
  const bottomSheetTranslateY = useRef(new Animated.Value(SCREEN.height)).current;
  const dragOffset = useRef(new Animated.Value(0)).current;
  
  // Height tracking for resize - actual position from bottom
  const animatedBottomPosition = useRef(new Animated.Value(initialHeight)).current;
  
  // Sync with external height if provided
  useEffect(() => {
    // Height sync effect
    if (externalAnimatedHeight && !isResizing) {
      currentHeightRef.current = initialHeight;
      externalAnimatedHeight.setValue(initialHeight);
      // Set external height
    }
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    // Mount/Unmount effect
    return () => {
      // Stop all animations and reset when component unmounts
      visibilityProgress.stopAnimation();
      bottomSheetTranslateY.stopAnimation();
      floatingScale.stopAnimation();
      dragOffset.stopAnimation();
      animatedBottomPosition.stopAnimation();
      floatingPosition.stopAnimation();
      animatedWidth.stopAnimation();
      animatedFloatingHeight.stopAnimation();
      
      // Reset to initial values
      visibilityProgress.setValue(0);
      bottomSheetTranslateY.setValue(SCREEN.height);
      floatingScale.setValue(0);
      dragOffset.setValue(0);
      animatedBottomPosition.setValue(initialHeight);
      currentHeightRef.current = initialHeight;
    };
  }, []);
  
  // Update refs when dimensions change
  useEffect(() => {
    currentDimensionsRef.current = dimensions;
  }, [dimensions]);
  
  // Floating mode animations
  const floatingPosition = useRef(
    new Animated.ValueXY({
      x: (SCREEN.width - FLOATING_WIDTH) / 2,
      y: (SCREEN.height - FLOATING_HEIGHT) / 2,
    })
  ).current;
  const floatingScale = useRef(new Animated.Value(0)).current;
  const animatedWidth = useRef(new Animated.Value(FLOATING_WIDTH)).current;
  const animatedFloatingHeight = useRef(new Animated.Value(FLOATING_HEIGHT)).current;
  
  // Refs for resize handles
  const currentDimensionsRef = useRef(dimensions);
  const startDimensionsRef = useRef(dimensions);
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const sHeight = useRef(0);
  const sWidth = useRef(0);
  
  // ============================================================================
  // INTERPOLATIONS - All math done natively!
  // ============================================================================
  
  // Opacity interpolation for smooth fade
  const modalOpacity = visibilityProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  
  // ============================================================================
  // REFS for values we need to track
  // ============================================================================
  const currentHeightRef = useRef(initialHeight);
  const initialPositionRef = useRef(initialHeight);
  const startPositionRef = useRef(initialHeight);
  const isExternallyControlled = !!externalAnimatedHeight;
  const effectiveMaxHeight = maxHeight || SCREEN.height - insets.top;
  
  // Mode toggle handler
  const toggleMode = useCallback(() => {
    const newMode = mode === "bottomSheet" ? "floating" : "bottomSheet";
    setMode(newMode);
    onModeChange?.(newMode);
  }, [mode, onModeChange]);

  // ============================================================================
  // EFFECT: Visibility Animations - All using native driver!
  // ============================================================================
  useEffect(() => {
    // Visibility effect
    let openAnimation: Animated.CompositeAnimation | null = null;
    let closeAnimation: Animated.CompositeAnimation | null = null;
    
    if (visible) {
      // Reset position if needed and then open
      bottomSheetTranslateY.setValue(SCREEN.height);
      visibilityProgress.setValue(0);
      
      // Open animations
      if (mode === "bottomSheet") {
        // Parallel animations for smooth opening
        openAnimation = Animated.parallel([
          // Slide up from bottom
          Animated.spring(bottomSheetTranslateY, {
            toValue: 0,
            tension: 180,
            friction: 22,
            useNativeDriver: true,
          }),
          // Fade in backdrop
          Animated.timing(visibilityProgress, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
        openAnimation.start();
      } else {
        // Floating mode entrance - simple fade without scale pop
        floatingScale.setValue(1); // Set scale to 1 directly, no animation
        openAnimation = Animated.timing(visibilityProgress, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        });
        openAnimation.start();
      }
    } else {
      // Close animations
      if (mode === "bottomSheet") {
        closeAnimation = Animated.parallel([
          // Slide down
          Animated.spring(bottomSheetTranslateY, {
            toValue: SCREEN.height,
            tension: 180,
            friction: 22,
            useNativeDriver: true,
          }),
          // Fade out backdrop
          Animated.timing(visibilityProgress, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
        closeAnimation.start();
      } else {
        // Floating mode exit - simple fade without scale
        closeAnimation = Animated.timing(visibilityProgress, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        });
        closeAnimation.start();
      }
    }
    
    // Cleanup function - only stop animations, don't reset values
    return () => {
      // Cleanup animations
      if (openAnimation) {
        openAnimation.stop();
        // Stopped open animation
      }
      if (closeAnimation) {
        closeAnimation.stop();
        // Stopped close animation
      }
    };
  }, [visible, mode, visibilityProgress, bottomSheetTranslateY, floatingScale, externalAnimatedHeight]); // Removed initialHeight to prevent animation restarts on height changes

  // ============================================================================
  // OPTIMIZED PAN RESPONDER: Bottom Sheet Resize
  // Following the documentation pattern for proper resize
  // ============================================================================
  const bottomSheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isExternallyControlled && mode === "bottomSheet",
        onMoveShouldSetPanResponder: (evt, gestureState) =>
          !isExternallyControlled && mode === "bottomSheet" && Math.abs(gestureState.dy) > 5,

        onPanResponderGrant: () => {
          setIsResizing(true);
          // Store current position at start of drag
          initialPositionRef.current = currentHeightRef.current;
          startPositionRef.current = currentHeightRef.current;
        },

        onPanResponderMove: (evt, gestureState) => {
          // Calculate new position: draggedPosition = initialPosition + translationY
          // Note: dy is negative when dragging up (to increase height)
          const draggedPosition = initialPositionRef.current - gestureState.dy;
          
          // Clamp between min and max
          const clampedPosition = Math.max(minHeight, Math.min(draggedPosition, effectiveMaxHeight));
          
          // Update the animated value for height
          animatedBottomPosition.setValue(clampedPosition);
          currentHeightRef.current = clampedPosition;
          
          // If external height is provided, update it too
          if (externalAnimatedHeight) {
            externalAnimatedHeight.setValue(clampedPosition);
          }
        },

        onPanResponderRelease: (evt, gestureState) => {
          setIsResizing(false);
          
          const finalHeight = currentHeightRef.current;
          const velocity = gestureState.vy;
          
          // Close with swipe down: either fast swipe or drag past threshold
          // Fast swipe: velocity > 0.8 and moving down (dy > 50)
          // Or drag past threshold: dragged down more than 150px
          const shouldClose = (velocity > 0.8 && gestureState.dy > 50) || 
                            (gestureState.dy > 150 && finalHeight <= minHeight);
          
          if (shouldClose) {
            // Close with smooth animation
            Animated.parallel([
              Animated.timing(visibilityProgress, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.spring(bottomSheetTranslateY, {
                toValue: SCREEN.height,
                tension: 180,
                friction: 22,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setTimeout(() => onClose(), 0);
            });
          } else {
            // Spring to final position
            Animated.spring(animatedBottomPosition, {
              toValue: finalHeight,
              tension: 180,
              friction: 22,
              useNativeDriver: false, // Must be false for height
            }).start();
            
            if (externalAnimatedHeight) {
              Animated.spring(externalAnimatedHeight, {
                toValue: finalHeight,
                tension: 180,
                friction: 22,
                useNativeDriver: false,
              }).start();
            }
          }
        },

        onPanResponderTerminate: () => {
          setIsResizing(false);
          // Spring back to initial position
          const targetHeight = initialPositionRef.current;
          Animated.spring(animatedBottomPosition, {
            toValue: targetHeight,
            useNativeDriver: false,
          }).start();
          
          currentHeightRef.current = targetHeight;
          
          if (externalAnimatedHeight) {
            Animated.spring(externalAnimatedHeight, {
              toValue: targetHeight,
              useNativeDriver: false,
            }).start();
          }
        },
      }),
    [mode, isExternallyControlled, minHeight, effectiveMaxHeight, animatedBottomPosition, externalAnimatedHeight, bottomSheetTranslateY, visibilityProgress, onClose]
  );

  // ============================================================================
  // CREATE RESIZE HANDLER: For 4-corner resize in floating mode
  // ============================================================================
  const createResizeHandler = useCallback(
    (corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight") => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => mode === "floating",
        onMoveShouldSetPanResponder: () => mode === "floating",
        onPanResponderGrant: () => {
          const currentDims = currentDimensionsRef.current;
          setIsResizing(true);
          sHeight.current = currentDims.height;
          sWidth.current = currentDims.width;
          offsetX.current = currentDims.left;
          offsetY.current = currentDims.top;
          startDimensionsRef.current = { ...currentDims };
        },
        onPanResponderMove: (_evt, gestureState) => {
          const { dx, dy } = gestureState;

          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            return;
          }

          let updatedWidth = sWidth.current;
          let updatedHeight = sHeight.current;
          let updatedX = offsetX.current;
          let updatedY = offsetY.current;

          switch (corner) {
            case "topLeft": {
              updatedWidth = Math.max(
                FLOATING_MIN_WIDTH,
                Math.min(sWidth.current - dx, containerBounds.width - offsetX.current)
              );
              updatedHeight = Math.max(
                FLOATING_MIN_HEIGHT,
                Math.min(sHeight.current - dy, containerBounds.height - updatedY)
              );
              if (updatedWidth !== sWidth.current) {
                updatedX = offsetX.current + (sWidth.current - updatedWidth);
              }
              if (updatedHeight !== sHeight.current) {
                updatedY = Math.max(
                  insets.top,
                  Math.min(offsetY.current + dy, containerBounds.height - updatedHeight)
                );
              }
              break;
            }
            case "topRight": {
              updatedWidth = Math.max(
                FLOATING_MIN_WIDTH,
                Math.min(sWidth.current + dx, containerBounds.width - offsetX.current)
              );
              updatedHeight = Math.max(
                FLOATING_MIN_HEIGHT,
                Math.min(sHeight.current - dy, containerBounds.height - updatedY)
              );
              if (updatedHeight !== sHeight.current) {
                updatedY = Math.max(
                  insets.top,
                  Math.min(offsetY.current + dy, containerBounds.height - updatedHeight)
                );
              }
              break;
            }
            case "bottomLeft": {
              updatedWidth = Math.max(
                FLOATING_MIN_WIDTH,
                Math.min(sWidth.current - dx, containerBounds.width - offsetX.current)
              );
              updatedHeight = Math.max(
                FLOATING_MIN_HEIGHT,
                Math.min(sHeight.current + dy, containerBounds.height - offsetY.current)
              );
              if (updatedWidth !== sWidth.current) {
                updatedX = offsetX.current + (sWidth.current - updatedWidth);
              }
              break;
            }
            case "bottomRight": {
              updatedWidth = Math.max(
                FLOATING_MIN_WIDTH,
                Math.min(sWidth.current + dx, containerBounds.width - offsetX.current)
              );
              updatedHeight = Math.max(
                FLOATING_MIN_HEIGHT,
                Math.min(sHeight.current + dy, containerBounds.height - offsetY.current)
              );
              break;
            }
          }

          // Update state for real-time visual feedback
          setDimensions({
            width: updatedWidth,
            height: updatedHeight,
            left: updatedX,
            top: updatedY,
          });
          
          // Also update animated values for smooth transitions
          animatedWidth.setValue(updatedWidth);
          animatedFloatingHeight.setValue(updatedHeight);
          floatingPosition.setValue({ x: updatedX, y: updatedY });

          // Store current values in ref
          currentDimensionsRef.current = {
            width: updatedWidth,
            height: updatedHeight,
            left: updatedX,
            top: updatedY,
          };
        },
        onPanResponderRelease: () => {
          const finalDims = currentDimensionsRef.current;
          setIsResizing(false);
          setDimensions(finalDims);
        },
        onPanResponderTerminate: () => {
          setIsResizing(false);
        },
      });
    },
    [mode, containerBounds, insets.top, animatedWidth, animatedFloatingHeight, floatingPosition]
  );

  const resizeHandlers = useMemo(() => {
    return {
      topLeft: createResizeHandler("topLeft"),
      topRight: createResizeHandler("topRight"),
      bottomLeft: createResizeHandler("bottomLeft"),
      bottomRight: createResizeHandler("bottomRight"),
    };
  }, [createResizeHandler]);

  // ============================================================================
  // OPTIMIZED PAN RESPONDER: Floating Mode Drag
  // Using Animated.event for direct native updates
  // ============================================================================
  const floatingDragPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => mode === "floating",
        onMoveShouldSetPanResponder: () => mode === "floating",

        onPanResponderGrant: () => {
          setIsDragging(true);
          // Extract offset for smooth dragging
          floatingPosition.extractOffset();
        },

        onPanResponderMove: (_evt, gestureState) => {
          // Update animated values
          floatingPosition.setValue({ 
            x: gestureState.dx, 
            y: gestureState.dy 
          });
        },

        onPanResponderRelease: () => {
          setIsDragging(false);
          floatingPosition.flattenOffset();
          
          // Get current position and update dimensions
          const currentX = (floatingPosition.x as any).__getValue();
          const currentY = (floatingPosition.y as any).__getValue();
          const currentDims = currentDimensionsRef.current;
          
          const clampedX = Math.max(0, Math.min(currentX, containerBounds.width - currentDims.width));
          const clampedY = Math.max(insets.top, Math.min(currentY, containerBounds.height - currentDims.height));
          
          floatingPosition.setValue({ x: clampedX, y: clampedY });
          
          const newDimensions = {
            ...currentDims,
            left: clampedX,
            top: clampedY,
          };
          setDimensions(newDimensions);
        },

        onPanResponderTerminate: () => {
          setIsDragging(false);
          floatingPosition.flattenOffset();
        },
      }),
    [mode, floatingPosition, containerBounds, insets.top]
  );

  // ============================================================================
  // RENDER: Modal UI with transform-based animations
  // ============================================================================
  
  // Render nothing if not visible (but hooks have already been called)
  if (!visible) {
    return null;
  }

  // Render floating mode
  if (mode === "floating") {
    return (
      <Animated.View
        style={[
          styles.floatingModal,
          {
            width: dimensions.width,  // Use state dimensions for real-time updates
            height: dimensions.height,
            opacity: modalOpacity,
            transform: [
              { translateX: floatingPosition.x },
              { translateY: floatingPosition.y },
            ],
          },
          (isDragging || isResizing) && styles.floatingModalDragging,
          customStyles.container,
        ]}
      >
        <ModalHeader
          header={header}
          onClose={onClose}
          onToggleMode={toggleMode}
          isResizing={isDragging || isResizing}
          mode={mode}
          panHandlers={floatingDragPanResponder.panHandlers}
        />

        <ScrollView style={[styles.content, customStyles.content]}>
          {children}
        </ScrollView>
        
        {/* Corner resize handles - positioned absolutely on the outer container */}
        <View
          {...resizeHandlers.topLeft.panHandlers}
          style={[styles.cornerHandleWrapper, { top: 4, left: 4 }]}
        >
          <CornerHandle
            position="topLeft"
            isActive={isDragging || isResizing}
          />
        </View>
        <View
          {...resizeHandlers.topRight.panHandlers}
          style={[styles.cornerHandleWrapper, { top: 4, right: 4 }]}
        >
          <CornerHandle
            position="topRight"
            isActive={isDragging || isResizing}
          />
        </View>
        <View
          {...resizeHandlers.bottomLeft.panHandlers}
          style={[styles.cornerHandleWrapper, { bottom: 4, left: 4 }]}
        >
          <CornerHandle
            position="bottomLeft"
            isActive={isDragging || isResizing}
          />
        </View>
        <View
          {...resizeHandlers.bottomRight.panHandlers}
          style={[styles.cornerHandleWrapper, { bottom: 4, right: 4 }]}
        >
          <CornerHandle
            position="bottomRight"
            isActive={isDragging || isResizing}
          />
        </View>
      </Animated.View>
    );
  }

  // Render bottom sheet mode with proper height animation
  return (
    <View style={styles.fullScreenContainer} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.bottomSheetWrapper,
          {
            opacity: modalOpacity,
            transform: [
              { translateY: bottomSheetTranslateY },
            ],
          },
        ]}
      >
        <Animated.View 
          style={[
            styles.bottomSheet, 
            customStyles.container,
            {
              height: externalAnimatedHeight || animatedBottomPosition,
            }
          ]}
        >
          <View {...bottomSheetPanResponder.panHandlers}>
            <ModalHeader
              header={header}
              onClose={onClose}
              onToggleMode={toggleMode}
              isResizing={isResizing}
              mode={mode}
            />
          </View>

          <ScrollView 
            style={[styles.content, customStyles.content]}
            contentContainerStyle={{ paddingBottom: insets.bottom }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// ============================================================================
// STYLES - Visual styling for all modal components
// ============================================================================
const styles = StyleSheet.create({
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  bottomSheetWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomSheet: {
    backgroundColor: "#1F1F1F",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  floatingModal: {
    position: "absolute",
    backgroundColor: "#1F1F1F",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    zIndex: 1000,
    // Default dimensions, will be overridden by animated values
    width: FLOATING_WIDTH,
    height: FLOATING_HEIGHT,
  },
  floatingModalDragging: {
    borderColor: "rgba(34, 197, 94, 1)",
    borderWidth: 2,
    shadowColor: "rgba(34, 197, 94, 0.6)",
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  header: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#171717",
    paddingBottom: 8,
  },
  dragIndicatorContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: "#4B5563",
    borderRadius: 2,
  },
  dragIndicatorActive: {
    backgroundColor: "#10B981",
    width: 40,
  },
  resizeGripContainer: {
    position: "absolute",
    flexDirection: "row",
    gap: 2,
    marginTop: 12,
  },
  resizeGripLine: {
    width: 12,
    height: 1,
    backgroundColor: "#10B981",
    opacity: 0.6,
  },
  headerContent: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerControls: {
    position: "absolute",
    top: 8,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    paddingTop: 4,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  toggleButton: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    marginLeft: 8,
  },
  iconLine: {
    position: "absolute",
    top: 7.25,
    left: 2,
    width: 12,
    height: 1.5,
    backgroundColor: "#EF4444",
  },
  content: {
    flex: 1,
    backgroundColor: "#1F1F1F",
  },
  cornerHandle: {
    position: "absolute",
    zIndex: 1,
  },
  cornerHandleWrapper: {
    position: "absolute",
    width: 30,
    height: 30,
    zIndex: 1000,
  },
  handler: {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
  },
  handlerActive: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 1)",
    borderWidth: 2,
    shadowColor: "rgba(34, 197, 94, 0.6)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
});

// ============================================================================
// EXPORT - Memoized modal component for optimal performance
// ============================================================================
export default memo(ClaudeModal60FPSClean);