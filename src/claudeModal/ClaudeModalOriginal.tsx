/**
 * ClaudeModalOriginal - The original unoptimized version
 * This is the baseline version without any performance optimizations
 * Used for comparison to show performance improvements
 */

import React, {
  ReactNode,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Pressable,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  Platform,
  StatusBar,
} from "react-native";

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Modal display modes
 */
export type ModalMode = "bottomSheet" | "floating";

/**
 * Position and dimensions for the modal in floating mode
 */
export interface ModalDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * Header configuration options
 */
export interface ModalHeaderConfig {
  /** Title text to display in the header */
  title?: string;
  /** Custom header content (overrides title) */
  customContent?: ReactNode;
  /** Subtitle text below the main header */
  subtitle?: string;
  /** Whether to show the floating mode toggle button */
  showToggleButton?: boolean;
  /** Whether to hide the close button */
  hideCloseButton?: boolean;
}

/**
 * Style customization options
 */
export interface ModalStyles {
  /** Container style */
  container?: ViewStyle;
  /** Modal panel style */
  modal?: ViewStyle;
  /** Header container style */
  header?: ViewStyle;
  /** Header title style */
  headerTitle?: TextStyle;
  /** Header subtitle style */
  headerSubtitle?: TextStyle;
  /** Content container style */
  content?: ViewStyle;
  /** Drag indicator style */
  dragIndicator?: ViewStyle;
}

/**
 * Main props for ClaudeModal component
 */
export interface ClaudeModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Content to render inside the modal */
  children: ReactNode;
  /** Unique key for persisting modal state (optional) */
  persistenceKey?: string;
  /** Header configuration */
  header?: ModalHeaderConfig;
  /** Initial mode (bottomSheet or floating) */
  initialMode?: ModalMode;
  /** Custom styles */
  styles?: ModalStyles;
  /** Minimum height for the modal */
  minHeight?: number;
  /** Maximum height for the modal */
  maxHeight?: number;
  /** Initial height for bottom sheet mode */
  initialHeight?: number;
  /** Whether to enable persistence */
  enablePersistence?: boolean;
  /** Callback when mode changes */
  onModeChange?: (mode: ModalMode) => void;
  /** Callback when dimensions change */
  onDimensionsChange?: (dimensions: ModalDimensions) => void;
}

// ============================================================================
// Safe Area Insets (Pure JS implementation)
// ============================================================================

const getSafeAreaInsets = () => {
  // Default safe area insets for different platforms
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  let top = 0;
  let bottom = 0;

  if (isIOS) {
    // iPhone X and later models have notch/dynamic island
    const { height } = Dimensions.get("window");
    const hasNotch = height >= 812; // iPhone X and later
    top = hasNotch ? 44 : 20;
    bottom = hasNotch ? 34 : 0;
  } else if (isAndroid) {
    // Android status bar height
    top = StatusBar.currentHeight || 24;
    bottom = 0;
  }

  return { top, bottom, left: 0, right: 0 };
};

// ============================================================================
// Storage Operations
// ============================================================================

class ModalStorage {
  private static memoryCache: Record<string, any> = {};

  static async save(key: string, value: any): Promise<void> {
    try {
      // Try AsyncStorage if available
      const AsyncStorage = await this.getAsyncStorage();
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } else {
        // Fallback to memory
        this.memoryCache[key] = value;
      }
    } catch {
      this.memoryCache[key] = value;
    }
  }

  static async load(key: string): Promise<any> {
    try {
      const AsyncStorage = await this.getAsyncStorage();
      if (AsyncStorage) {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
      return this.memoryCache[key] || null;
    } catch {
      return this.memoryCache[key] || null;
    }
  }

  private static async getAsyncStorage() {
    try {
      const module = await import("@react-native-async-storage/async-storage");
      return module.default;
    } catch {
      return null;
    }
  }
}

// ============================================================================
// Constants
// ============================================================================

const SCREEN = Dimensions.get("window");
const MIN_HEIGHT = 150;
const DEFAULT_HEIGHT = 400;
const THROTTLE_MS = 16; // ~60fps
const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

// ============================================================================
// Utility Functions
// ============================================================================

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

// ============================================================================
// Icon Components
// ============================================================================

// Windows-style maximize icon (single square outline)
const MaximizeIcon = ({ color = "#E5E7EB", size = 16 }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: "absolute",
        top: 3,
        left: 3,
        width: size - 6,
        height: size - 6,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 0,
      }}
    />
  </View>
);

// Windows-style restore/minimize icon (overlapping squares)
const RestoreIcon = ({ color = "#E5E7EB", size = 16 }) => (
  <View style={{ width: size, height: size }}>
    {/* Back square */}
    <View
      style={{
        position: "absolute",
        top: 2,
        right: 2,
        width: size - 7,
        height: size - 7,
        borderTopWidth: 1.5,
        borderRightWidth: 1.5,
        borderColor: color,
      }}
    />
    {/* Front square */}
    <View
      style={{
        position: "absolute",
        bottom: 2,
        left: 2,
        width: size - 7,
        height: size - 7,
        borderWidth: 1.5,
        borderColor: color,
        backgroundColor: "#2A2A2A", // Fill to hide overlap
      }}
    />
  </View>
);

const CloseIcon = ({ color = "#FFFFFF", size = 16 }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: "absolute",
        top: size / 2 - 0.75,
        left: 2,
        width: size - 4,
        height: 1.5,
        backgroundColor: color,
        transform: [{ rotate: "45deg" }],
      }}
    />
    <View
      style={{
        position: "absolute",
        top: size / 2 - 0.75,
        left: 2,
        width: size - 4,
        height: 1.5,
        backgroundColor: color,
        transform: [{ rotate: "-45deg" }],
      }}
    />
  </View>
);

// ============================================================================
// Sub-components
// ============================================================================

interface DragIndicatorProps {
  isResizing: boolean;
  style?: ViewStyle;
}

const DragIndicator: React.FC<DragIndicatorProps> = ({ isResizing, style }) => (
  <View style={[defaultStyles.dragIndicatorContainer, style]}>
    <View
      style={[
        defaultStyles.dragIndicator,
        isResizing && defaultStyles.dragIndicatorActive,
      ]}
    />
  </View>
);

interface ModalHeaderProps {
  mode: ModalMode;
  isResizing: boolean;
  config?: ModalHeaderConfig;
  panHandlers?: any;
  onToggleMode: () => void;
  onClose: () => void;
  styles?: ModalStyles;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  mode,
  isResizing,
  config = {},
  panHandlers,
  onToggleMode,
  onClose,
  styles = {},
}) => {
  const {
    title,
    customContent,
    subtitle,
    showToggleButton = true,
    hideCloseButton = false,
  } = config;

  const headerProps = mode === "bottomSheet" && panHandlers ? panHandlers : {};

  return (
    <View style={[defaultStyles.header, styles.header]} {...headerProps}>
      <DragIndicator isResizing={isResizing} style={styles.dragIndicator} />
      <View style={defaultStyles.headerContent}>
        <View style={defaultStyles.headerRow}>
          {customContent ? (
            <View style={defaultStyles.customHeaderContent}>
              {customContent}
            </View>
          ) : title ? (
            <Text style={[defaultStyles.headerTitle, styles.headerTitle]}>
              {title}
            </Text>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <View style={defaultStyles.headerControls}>
            {showToggleButton && (
              <Pressable
                onPress={onToggleMode}
                style={[
                  defaultStyles.controlButton,
                  defaultStyles.toggleButton,
                ]}
                hitSlop={HIT_SLOP}
              >
                {mode === "floating" ? <RestoreIcon /> : <MaximizeIcon />}
              </Pressable>
            )}
            {!hideCloseButton && (
              <Pressable
                onPress={onClose}
                style={[defaultStyles.controlButton, defaultStyles.closeButton]}
                hitSlop={HIT_SLOP}
              >
                <CloseIcon />
              </Pressable>
            )}
          </View>
        </View>
        {subtitle && (
          <Text style={[defaultStyles.headerSubtitle, styles.headerSubtitle]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

// Pure JS Corner Handle Component
const CornerHandle = ({
  position,
  isActive,
}: {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  isActive: boolean;
}) => {
  return (
    <View style={[defaultStyles.cornerHandle, defaultStyles[position]]}>
      <View
        style={[defaultStyles.handler, isActive && defaultStyles.handlerActive]}
      />
    </View>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const ClaudeModalOriginal: React.FC<ClaudeModalProps> = ({
  visible,
  onClose,
  children,
  persistenceKey,
  header,
  initialMode = "bottomSheet",
  styles: customStyles = {},
  minHeight = MIN_HEIGHT,
  maxHeight,
  initialHeight = DEFAULT_HEIGHT,
  enablePersistence = true,
  onModeChange,
  onDimensionsChange,
}) => {
  const insets = getSafeAreaInsets();
  const effectiveMaxHeight = maxHeight || SCREEN.height - insets.top;

  // State
  const [isStateLoaded, setIsStateLoaded] = useState(!enablePersistence);
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [panelHeight, setPanelHeight] = useState(initialHeight);
  const [dimensions, setDimensions] = useState<ModalDimensions>({
    width: SCREEN.width - 40,
    height: DEFAULT_HEIGHT,
    top: 100,
    left: 20,
  });
  const [containerBounds, setContainerBounds] = useState({
    width: SCREEN.width,
    height: SCREEN.height,
  });

  // Refs
  const animatedHeight = useRef(new Animated.Value(panelHeight)).current;
  const animatedPosition = useRef(
    new Animated.ValueXY({ x: dimensions.left, y: dimensions.top })
  ).current;
  const animatedWidth = useRef(new Animated.Value(dimensions.width)).current;
  const animatedFloatingHeight = useRef(
    new Animated.Value(dimensions.height)
  ).current;
  const startHeightRef = useRef(panelHeight);
  const currentHeightRef = useRef(panelHeight);
  const lastUpdateTimeRef = useRef(0);
  const startPositionRef = useRef({ x: dimensions.left, y: dimensions.top });
  const startDimensionsRef = useRef(dimensions);
  const currentDimensionsRef = useRef(dimensions); // Track current dimensions in ref
  const offsetX = useRef(0);
  const offsetY = useRef(0);
  const sHeight = useRef(0);
  const sWidth = useRef(0);
  const animationFrameRef = useRef<number | null>(null); // For RAF throttling
  const pendingAnimationUpdate = useRef<any>(null); // Store pending updates

  // Load persisted state
  useEffect(() => {
    if (!enablePersistence || !persistenceKey) {
      setIsStateLoaded(true);
      return;
    }

    const loadState = async () => {
      const savedState = await ModalStorage.load(persistenceKey);
      if (savedState) {
        if (savedState.mode) setMode(savedState.mode);
        if (savedState.panelHeight) {
          setPanelHeight(savedState.panelHeight);
          currentHeightRef.current = savedState.panelHeight;
          animatedHeight.setValue(savedState.panelHeight);
        }
        if (savedState.dimensions) {
          setDimensions(savedState.dimensions);
          animatedPosition.setValue({
            x: savedState.dimensions.left,
            y: savedState.dimensions.top,
          });
        }
      }
      setIsStateLoaded(true);
    };

    loadState();
  }, [persistenceKey, enablePersistence, animatedHeight, animatedPosition]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Save state on changes
  useEffect(() => {
    if (!enablePersistence || !persistenceKey || !isStateLoaded) return;

    const saveState = async () => {
      await ModalStorage.save(persistenceKey, {
        mode,
        panelHeight,
        dimensions,
      });
    };

    const timeoutId = setTimeout(saveState, 500);
    return () => clearTimeout(timeoutId);
  }, [
    mode,
    panelHeight,
    dimensions,
    persistenceKey,
    enablePersistence,
    isStateLoaded,
  ]);

  // Update animated values
  useEffect(() => {
    currentHeightRef.current = panelHeight;
    animatedHeight.setValue(panelHeight);
  }, [panelHeight, animatedHeight]);

  // Update animated dimensions for floating mode
  useEffect(() => {
    currentDimensionsRef.current = dimensions; // Keep ref in sync
    // Only update if not currently resizing to avoid conflicts
    if (!isResizing && !isDragging) {
      animatedWidth.setValue(dimensions.width);
      animatedFloatingHeight.setValue(dimensions.height);
      animatedPosition.setValue({ x: dimensions.left, y: dimensions.top });
    }
  }, [
    dimensions,
    animatedWidth,
    animatedFloatingHeight,
    animatedPosition,
    isResizing,
    isDragging,
  ]);

  // Throttled update function
  const throttledUpdateHeight = useCallback((height: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current >= THROTTLE_MS) {
      setPanelHeight(height);
      lastUpdateTimeRef.current = now;
    }
  }, []);

  // Optimized animated value update using RAF
  const updateAnimatedValues = useCallback(
    (updates: { x?: number; y?: number; width?: number; height?: number }) => {
      // Store the pending update
      pendingAnimationUpdate.current = updates;

      // If we don't have a frame scheduled, schedule one
      if (!animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => {
          // Apply all pending updates at once
          if (pendingAnimationUpdate.current) {
            const { x, y, width, height } = pendingAnimationUpdate.current;

            // Batch all animated value updates
            if (x !== undefined && y !== undefined) {
              animatedPosition.setValue({ x, y });
            }
            if (width !== undefined) {
              animatedWidth.setValue(width);
            }
            if (height !== undefined) {
              animatedFloatingHeight.setValue(height);
            }
          }

          // Clear the frame reference
          animationFrameRef.current = null;
          pendingAnimationUpdate.current = null;
        });
      }
    },
    [animatedPosition, animatedWidth, animatedFloatingHeight]
  );

  // Create resize PanResponder for bottom sheet
  const resizePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => mode === "bottomSheet",
        onMoveShouldSetPanResponder: () => mode === "bottomSheet",
        onPanResponderGrant: () => {
          setIsResizing(true);
          startHeightRef.current = currentHeightRef.current;
        },
        onPanResponderMove: (_evt, gestureState) => {
          const newHeight = startHeightRef.current - gestureState.dy;
          const clampedHeight = clamp(newHeight, minHeight, effectiveMaxHeight);
          animatedHeight.setValue(clampedHeight);
          currentHeightRef.current = clampedHeight;
          throttledUpdateHeight(clampedHeight);
        },
        onPanResponderRelease: () => {
          setIsResizing(false);
          setPanelHeight(currentHeightRef.current);
          onDimensionsChange?.({
            ...dimensions,
            height: currentHeightRef.current,
          });
        },
        onPanResponderTerminate: () => {
          setIsResizing(false);
        },
      }),
    [
      mode,
      minHeight,
      effectiveMaxHeight,
      throttledUpdateHeight,
      dimensions,
      onDimensionsChange,
      animatedHeight,
    ]
  );

  // Create drag PanResponder for floating mode
  const dragPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => mode === "floating",
        onMoveShouldSetPanResponder: () => mode === "floating",
        onPanResponderGrant: () => {
          setIsDragging(true);
          const currentPos = {
            x: (animatedPosition.x as any).__getValue(),
            y: (animatedPosition.y as any).__getValue(),
          };
          startPositionRef.current = currentPos;
          animatedPosition.setOffset(startPositionRef.current);
          animatedPosition.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event(
          [null, { dx: animatedPosition.x, dy: animatedPosition.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
          setIsDragging(false);
          animatedPosition.flattenOffset();
          const currentX = (animatedPosition.x as any).__getValue();
          const currentY = (animatedPosition.y as any).__getValue();
          const currentDims = currentDimensionsRef.current;

          const clampedX = clamp(
            currentX,
            0,
            containerBounds.width - currentDims.width
          );
          const clampedY = clamp(
            currentY,
            insets.top,
            containerBounds.height - currentDims.height
          );

          animatedPosition.setValue({ x: clampedX, y: clampedY });

          const newDimensions = {
            ...currentDims,
            left: clampedX,
            top: clampedY,
          };
          setDimensions(newDimensions);
          onDimensionsChange?.(newDimensions);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          animatedPosition.flattenOffset();
        },
      }),
    [mode, animatedPosition, containerBounds, insets.top, onDimensionsChange] // Removed dimensions dep
  );

  // Create resize handles for floating mode - matching original DragResizable logic
  const createResizeHandler = useCallback(
    (corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight") => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => mode === "floating",
        onMoveShouldSetPanResponder: () => mode === "floating",
        onPanResponderGrant: () => {
          const currentDims = currentDimensionsRef.current; // Use ref instead of stale closure
          setIsResizing(true);
          // Store initial values like the original implementation
          sHeight.current = currentDims.height;
          sWidth.current = currentDims.width;
          offsetX.current = currentDims.left;
          offsetY.current = currentDims.top;
          startDimensionsRef.current = { ...currentDims };
        },
        onPanResponderMove: (_evt, gestureState) => {
          const { dx, dy } = gestureState;

          // Skip tiny movements to reduce calculations
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            return;
          }

          let updatedWidth = sWidth.current;
          let updatedHeight = sHeight.current;
          let updatedX = offsetX.current;
          let updatedY = offsetY.current;

          switch (corner) {
            case "topLeft": {
              updatedWidth = clamp(
                sWidth.current - dx,
                minHeight,
                containerBounds.width - offsetX.current
              );
              updatedHeight = clamp(
                sHeight.current - dy,
                minHeight,
                containerBounds.height - updatedY
              );

              // Only update position if dimensions actually changed
              if (updatedWidth !== sWidth.current) {
                updatedX = offsetX.current + (sWidth.current - updatedWidth);
              }
              if (updatedHeight !== sHeight.current) {
                updatedY = clamp(
                  offsetY.current + dy,
                  insets.top,
                  containerBounds.height - updatedHeight
                );
              }
              break;
            }
            case "topRight": {
              updatedWidth = clamp(
                sWidth.current + dx,
                minHeight,
                containerBounds.width - offsetX.current
              );
              updatedHeight = clamp(
                sHeight.current - dy,
                minHeight,
                containerBounds.height - updatedY
              );
              if (updatedHeight !== sHeight.current) {
                updatedY = clamp(
                  offsetY.current + dy,
                  insets.top,
                  containerBounds.height - updatedHeight
                );
              }
              break;
            }
            case "bottomLeft": {
              updatedWidth = clamp(
                sWidth.current - dx,
                minHeight,
                containerBounds.width - offsetX.current
              );
              updatedHeight = clamp(
                sHeight.current + dy,
                minHeight,
                containerBounds.height - offsetY.current
              );

              // Only update X if width actually changed
              if (updatedWidth !== sWidth.current) {
                updatedX = offsetX.current + (sWidth.current - updatedWidth);
              }
              break;
            }
            case "bottomRight": {
              updatedWidth = clamp(
                sWidth.current + dx,
                minHeight,
                containerBounds.width - offsetX.current
              );
              updatedHeight = clamp(
                sHeight.current + dy,
                minHeight,
                containerBounds.height - offsetY.current
              );
              break;
            }
          }

          // Use optimized RAF-based update instead of direct setValue
          updateAnimatedValues({
            x: updatedX,
            y: updatedY,
            width: updatedWidth,
            height: updatedHeight,
          });

          // Store current values in ref for release
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
          // Update state only on release to avoid flashing
          setDimensions(finalDims);
          onDimensionsChange?.(finalDims);
        },
        onPanResponderTerminate: () => {
          setIsResizing(false);
        },
      });
    },
    [
      mode,
      minHeight,
      containerBounds,
      insets.top,
      onDimensionsChange,
      updateAnimatedValues,
    ]
  ); // REMOVED dimensions from deps to prevent recreation

  const resizeHandlers = useMemo(() => {
    return {
      topLeft: createResizeHandler("topLeft"),
      topRight: createResizeHandler("topRight"),
      bottomLeft: createResizeHandler("bottomLeft"),
      bottomRight: createResizeHandler("bottomRight"),
    };
  }, [createResizeHandler]);

  // Toggle mode
  const toggleMode = useCallback(() => {
    const newMode = mode === "bottomSheet" ? "floating" : "bottomSheet";
    setMode(newMode);
    onModeChange?.(newMode);
  }, [mode, onModeChange]);

  // Handle container layout
  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerBounds({ width, height });
  }, []);

  // Don't render if not visible or state not loaded
  if (!visible || !isStateLoaded) return null;

  // Animated styles
  const animatedBorderStyle = {
    borderColor:
      isDragging || isResizing
        ? "rgba(34, 197, 94, 1)"
        : "rgba(255, 255, 255, 0.1)",
    borderWidth: isDragging || isResizing ? 2 : 1,
    shadowColor: isDragging || isResizing ? "rgba(34, 197, 94, 0.6)" : "#000",
    shadowOpacity: isDragging || isResizing ? 0.8 : 0.3,
    shadowRadius: isDragging || isResizing ? 12 : 8,
    elevation: isDragging || isResizing ? 20 : 16,
  };

  // Render floating mode
  if (mode === "floating") {
    return (
      <View
        style={[defaultStyles.container, customStyles.container]}
        onLayout={handleContainerLayout}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            defaultStyles.floatingModal,
            customStyles.modal,
            {
              width: animatedWidth,
              height: animatedFloatingHeight,
              transform: [
                { translateX: animatedPosition.x },
                { translateY: animatedPosition.y },
              ],
            },
            animatedBorderStyle,
          ]}
        >
          <View {...dragPanResponder.panHandlers} style={{ flex: 1 }}>
            <ModalHeader
              mode={mode}
              isResizing={isResizing}
              config={header}
              onToggleMode={toggleMode}
              onClose={onClose}
              styles={customStyles}
            />
            <View style={[defaultStyles.content, customStyles.content]}>
              {children}
            </View>
          </View>

          {/* Corner resize handles - matching original DragResizable */}
          <View
            {...resizeHandlers.topLeft.panHandlers}
            style={[defaultStyles.cornerHandleWrapper, { top: -8, left: -8 }]}
          >
            <CornerHandle position="topLeft" isActive={isResizing} />
          </View>
          <View
            {...resizeHandlers.topRight.panHandlers}
            style={[defaultStyles.cornerHandleWrapper, { top: -8, right: -8 }]}
          >
            <CornerHandle position="topRight" isActive={isResizing} />
          </View>
          <View
            {...resizeHandlers.bottomLeft.panHandlers}
            style={[
              defaultStyles.cornerHandleWrapper,
              { bottom: -8, left: -8 },
            ]}
          >
            <CornerHandle position="bottomLeft" isActive={isResizing} />
          </View>
          <View
            {...resizeHandlers.bottomRight.panHandlers}
            style={[
              defaultStyles.cornerHandleWrapper,
              { bottom: -8, right: -8 },
            ]}
          >
            <CornerHandle position="bottomRight" isActive={isResizing} />
          </View>
        </Animated.View>
      </View>
    );
  }

  // Render bottom sheet mode
  return (
    <View
      style={[
        defaultStyles.overlay,
        { paddingTop: insets.top },
        customStyles.container,
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          defaultStyles.bottomSheetModal,
          customStyles.modal,
          { height: animatedHeight },
          animatedBorderStyle,
        ]}
      >
        <ModalHeader
          mode={mode}
          isResizing={isResizing}
          config={header}
          panHandlers={resizePanResponder.panHandlers}
          onToggleMode={toggleMode}
          onClose={onClose}
          styles={customStyles}
        />
        <View style={[defaultStyles.content, customStyles.content]}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

// ============================================================================
// Default Styles
// ============================================================================

const defaultStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    elevation: 2000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
    zIndex: 2000,
    elevation: 2000,
  },
  bottomSheetModal: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    overflow: "hidden",
  },
  floatingModal: {
    position: "absolute",
    backgroundColor: "#2A2A2A",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    overflow: "hidden",
  },
  header: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
    backgroundColor: "#171717",
  },
  dragIndicatorContainer: {
    height: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#171717",
  },
  dragIndicator: {
    width: 32,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 1.5,
  },
  dragIndicatorActive: {
    backgroundColor: "rgba(34, 197, 94, 0.8)",
    height: 4,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "#171717",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    fontWeight: "400",
    paddingTop: 4,
    paddingBottom: 2,
  },
  customHeaderContent: {
    flex: 1,
    minHeight: 32,
    justifyContent: "center",
  },
  headerControls: {
    flexDirection: "row",
    gap: 6,
    paddingRight: 4,
    marginLeft: 12,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  toggleButton: {
    backgroundColor: "rgba(156, 163, 175, 0.1)",
    borderColor: "rgba(156, 163, 175, 0.2)",
  },
  closeButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  content: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#2A2A2A",
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
  topLeft: {
    left: -8,
    top: -8,
  },
  topRight: {
    right: -8,
    top: -8,
  },
  bottomLeft: {
    left: -8,
    bottom: -8,
  },
  bottomRight: {
    right: -8,
    bottom: -8,
  },
  handler: {
    width: 16,
    height: 16,
    backgroundColor: "#0EA5E9", // Match original accent color
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handlerActive: {
    backgroundColor: "#22C55E",
    shadowColor: "#22C55E",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
});

// ============================================================================
// Exports
// ============================================================================

export default ClaudeModalOriginal;
