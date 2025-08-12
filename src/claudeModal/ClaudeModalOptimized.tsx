/**
 * ClaudeModalOptimized - Performance-optimized version with stable callbacks
 * Implements Phase 2.1 optimizations from the todo list
 * 
 * Improvements:
 * - Stable callback pattern to prevent re-renders
 * - Proper RAF cancellation
 * - Optimized animated value updates
 * - Memoized styles and components
 */

import React, {
  ReactNode,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
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
import { useStableCallback } from "./hooks/useStableCallback";

// ============================================================================
// Types (reuse from original)
// ============================================================================

export type ModalMode = "bottomSheet" | "floating";

export interface ModalDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface ModalHeaderConfig {
  title?: string;
  customContent?: ReactNode;
  subtitle?: string;
  showToggleButton?: boolean;
  hideCloseButton?: boolean;
}

export interface ModalStyles {
  container?: ViewStyle;
  modal?: ViewStyle;
  header?: ViewStyle;
  headerTitle?: TextStyle;
  headerSubtitle?: TextStyle;
  content?: ViewStyle;
  dragIndicator?: ViewStyle;
}

export interface ClaudeModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  persistenceKey?: string;
  header?: ModalHeaderConfig;
  initialMode?: ModalMode;
  styles?: ModalStyles;
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  enablePersistence?: boolean;
  onModeChange?: (mode: ModalMode) => void;
  onDimensionsChange?: (dimensions: ModalDimensions) => void;
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
// Utilities
// ============================================================================

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

const getSafeAreaInsets = () => {
  const isIOS = Platform.OS === "ios";
  const isAndroid = Platform.OS === "android";

  let top = 0;
  let bottom = 0;

  if (isIOS) {
    const { height } = Dimensions.get("window");
    const hasNotch = height >= 812;
    top = hasNotch ? 44 : 20;
    bottom = hasNotch ? 34 : 0;
  } else if (isAndroid) {
    top = StatusBar.currentHeight || 24;
    bottom = 0;
  }

  return { top, bottom, left: 0, right: 0 };
};

// ============================================================================
// Storage (simplified for performance)
// ============================================================================

class ModalStorage {
  private static memoryCache: Record<string, any> = {};

  static async save(key: string, value: any): Promise<void> {
    this.memoryCache[key] = value;
  }

  static async load(key: string): Promise<any> {
    return this.memoryCache[key] || null;
  }
}

// ============================================================================
// Icon Components (Memoized)
// ============================================================================

const MaximizeIcon = memo(({ color = "#E5E7EB", size = 16 }: { color?: string; size?: number }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: "absolute",
        top: 2,
        left: 2,
        width: size - 4,
        height: size - 4,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2,
      }}
    />
  </View>
));

const MinimizeIcon = memo(({ color = "#E5E7EB", size = 16 }: { color?: string; size?: number }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: "absolute",
        top: 4,
        left: 4,
        width: size - 8,
        height: size - 8,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2,
      }}
    />
  </View>
));

const CloseIcon = memo(({ color = "#FFFFFF", size = 16 }: { color?: string; size?: number }) => (
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
));

// ============================================================================
// Sub-components (Memoized)
// ============================================================================

interface DragIndicatorProps {
  isResizing: boolean;
  style?: ViewStyle;
}

const DragIndicator = memo<DragIndicatorProps>(({ isResizing, style }) => (
  <View style={[defaultStyles.dragIndicatorContainer, style]}>
    <View
      style={[
        defaultStyles.dragIndicator,
        isResizing && defaultStyles.dragIndicatorActive,
      ]}
    />
  </View>
));

interface ModalHeaderProps {
  mode: ModalMode;
  isResizing: boolean;
  config?: ModalHeaderConfig;
  panHandlers?: any;
  onToggleMode: () => void;
  onClose: () => void;
  styles?: ModalStyles;
}

const ModalHeader = memo<ModalHeaderProps>(({
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
                {mode === "floating" ? <MinimizeIcon /> : <MaximizeIcon />}
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
});

// ============================================================================
// Main Component with Optimizations
// ============================================================================

export const ClaudeModalOptimized: React.FC<ClaudeModalProps> = memo(({
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
  const insets = useMemo(() => getSafeAreaInsets(), []);
  const effectiveMaxHeight = maxHeight || SCREEN.height - insets.top;

  // State
  const [isStateLoaded, setIsStateLoaded] = useState(!enablePersistence);
  const [mode, setMode] = useState<ModalMode>(initialMode);
  const [isResizing, setIsResizing] = useState(false);
  const [panelHeight, setPanelHeight] = useState(initialHeight);
  const [dimensions, setDimensions] = useState<ModalDimensions>({
    width: SCREEN.width - 40,
    height: DEFAULT_HEIGHT,
    top: 100,
    left: 20,
  });

  // Refs for animations - using useRef to prevent re-creation
  const animatedHeight = useRef(new Animated.Value(panelHeight)).current;
  const animatedPosition = useRef(
    new Animated.ValueXY({ x: dimensions.left, y: dimensions.top })
  ).current;
  const animatedWidth = useRef(new Animated.Value(dimensions.width)).current;
  const animatedFloatingHeight = useRef(
    new Animated.Value(dimensions.height)
  ).current;

  // Refs for tracking values
  const startHeightRef = useRef(panelHeight);
  const currentHeightRef = useRef(panelHeight);
  const lastUpdateTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  // Load persisted state
  useEffect(() => {
    if (!enablePersistence || !persistenceKey) {
      setIsStateLoaded(true);
      return;
    }

    let mounted = true;
    const loadState = async () => {
      const savedState = await ModalStorage.load(persistenceKey);
      if (mounted && savedState) {
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
      if (mounted) setIsStateLoaded(true);
    };

    loadState();
    return () => { mounted = false; };
  }, [persistenceKey, enablePersistence, animatedHeight, animatedPosition]);

  // Save state with debounce
  useEffect(() => {
    if (!enablePersistence || !persistenceKey || !isStateLoaded) return;

    const timeoutId = setTimeout(() => {
      ModalStorage.save(persistenceKey, {
        mode,
        panelHeight,
        dimensions,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [mode, panelHeight, dimensions, persistenceKey, enablePersistence, isStateLoaded]);

  // Stable callbacks using our custom hook
  const handleClose = useStableCallback(() => {
    onClose();
  });

  const toggleMode = useStableCallback(() => {
    const newMode = mode === "bottomSheet" ? "floating" : "bottomSheet";
    setMode(newMode);
    onModeChange?.(newMode);
  });

  const throttledUpdateHeight = useStableCallback((height: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current >= THROTTLE_MS) {
      // Use RAF for smooth updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(() => {
        setPanelHeight(height);
        animationFrameRef.current = null;
      });
      lastUpdateTimeRef.current = now;
    }
  });

  // Optimized resize PanResponder for bottom sheet
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
    [mode, minHeight, effectiveMaxHeight, throttledUpdateHeight, dimensions, onDimensionsChange, animatedHeight]
  );

  // Memoized animated styles
  const animatedBorderStyle = useMemo(() => ({
    borderColor: isResizing ? "rgba(34, 197, 94, 1)" : "rgba(255, 255, 255, 0.1)",
    borderWidth: isResizing ? 2 : 1,
    shadowColor: isResizing ? "rgba(34, 197, 94, 0.6)" : "#000",
    shadowOpacity: isResizing ? 0.8 : 0.3,
    shadowRadius: isResizing ? 12 : 8,
    elevation: isResizing ? 20 : 16,
  }), [isResizing]);

  // Don't render if not visible or state not loaded
  if (!visible || !isStateLoaded) return null;

  // Render bottom sheet mode (simplified for performance testing)
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
          onClose={handleClose}
          styles={customStyles}
        />
        <View style={[defaultStyles.content, customStyles.content]}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
});

// ============================================================================
// Styles
// ============================================================================

const defaultStyles = StyleSheet.create({
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
});

export default ClaudeModalOptimized;