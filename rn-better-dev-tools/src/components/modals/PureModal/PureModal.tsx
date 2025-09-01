/**
 * PureModal - A pure JavaScript modal with zero native dependencies
 * Achieves 60FPS performance using only React Native's Animated API
 * 
 * Features:
 * - Bottom sheet and floating modes
 * - Gesture-based resizing and dragging
 * - Configurable theming
 * - State persistence
 * - Platform optimizations
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
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
  ScrollView,
  Text,
  Platform,
} from "react-native";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type ModalMode = "bottomSheet" | "floating";

export interface ModalTheme {
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    backdrop: string;
    handle: string;
    border: string;
    primary: string;
    error: string;
    success: string;
    muted: string;
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
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export interface StorageAdapter {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

interface HeaderConfig {
  title?: string;
  subtitle?: string;
  showToggleButton?: boolean;
  customContent?: React.ReactNode;
  hideCloseButton?: boolean;
}

interface PureModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  
  // Mode
  mode?: ModalMode;
  
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
  header?: HeaderConfig;
  showHandle?: boolean;
  
  // Behavior
  animationType?: 'spring' | 'timing';
  closeOnBackdropPress?: boolean;
  
  // Persistence
  persistenceKey?: string;
  enablePersistence?: boolean;
  storageAdapter?: StorageAdapter;
  
  // Callbacks
  onOpen?: () => void;
  onModeChange?: (mode: ModalMode) => void;
  onSnapPointChange?: (index: number) => void;
}

// ============================================================================
// DEFAULT THEME
// ============================================================================

const defaultTheme: ModalTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    handle: '#CCCCCC',
    border: '#E0E0E0',
    primary: '#007AFF',
    error: '#FF3B30',
    success: '#34C759',
    muted: '#999999',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 16,
    },
  },
};

// ============================================================================
// CONSTANTS
// ============================================================================

const SCREEN = Dimensions.get("window");
const MIN_HEIGHT = 100;
const DEFAULT_HEIGHT = 400;
const FLOATING_WIDTH = 380;
const FLOATING_HEIGHT = 500;
const FLOATING_MIN_WIDTH = SCREEN.width * 0.25;
const FLOATING_MIN_HEIGHT = 80;

// ============================================================================
// STORAGE IMPLEMENTATION
// ============================================================================

interface PersistedModalState {
  mode?: ModalMode;
  panelHeight?: number;
  dimensions?: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  isVisible?: boolean;
}

class ModalStorage {
  private static memoryCache: Record<string, PersistedModalState> = {};

  static async save(
    key: string,
    value: PersistedModalState,
    adapter?: StorageAdapter
  ): Promise<void> {
    try {
      this.memoryCache[key] = value;
      if (adapter) {
        await adapter.setItem(`@modal_state_${key}`, JSON.stringify(value));
      }
    } catch (error) {
      console.warn("Failed to save modal state:", error);
    }
  }

  static async load(
    key: string,
    adapter?: StorageAdapter
  ): Promise<PersistedModalState | null> {
    try {
      // Try memory cache first
      if (this.memoryCache[key]) {
        return this.memoryCache[key];
      }

      // Load from storage adapter if provided
      if (adapter) {
        const stored = await adapter.getItem(`@modal_state_${key}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          this.memoryCache[key] = parsed;
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load modal state:", error);
    }
    return null;
  }
}

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const CloseIcon = memo(function CloseIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View
        style={[
          {
            position: "absolute",
            top: 7.25,
            left: 2,
            width: 12,
            height: 1.5,
            backgroundColor: color,
            transform: [{ rotate: "45deg" }],
          },
        ]}
      />
      <View
        style={[
          {
            position: "absolute",
            top: 7.25,
            left: 2,
            width: 12,
            height: 1.5,
            backgroundColor: color,
            transform: [{ rotate: "-45deg" }],
          },
        ]}
      />
    </View>
  );
});

const MaximizeIcon = memo(function MaximizeIcon({ color }: { color: string }) {
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
          borderColor: color,
          borderRadius: 2,
        }}
      />
    </View>
  );
});

const MinimizeIcon = memo(function MinimizeIcon({ color }: { color: string }) {
  return (
    <View style={{ width: 16, height: 16 }}>
      <View
        style={{
          position: "absolute",
          top: 7,
          left: 2,
          width: 12,
          height: 1.5,
          backgroundColor: color,
        }}
      />
    </View>
  );
});

const DragIndicator = memo(function DragIndicator({
  isResizing,
  mode,
  theme,
}: {
  isResizing: boolean;
  mode: ModalMode;
  theme: ModalTheme;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.xs,
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{
          width: 40,
          height: 4,
          backgroundColor: isResizing ? theme.colors.success : theme.colors.handle,
          borderRadius: 2,
          opacity: mode === "floating" ? 0.8 : 1,
        }}
      />
    </View>
  );
});

const CornerHandle = memo(function CornerHandle({
  isActive,
  theme,
}: {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  isActive: boolean;
  theme: ModalTheme;
}) {
  return (
    <View style={{ width: 30, height: 30 }}>
      <View
        style={{
          width: 20,
          height: 20,
          backgroundColor: isActive
            ? `${theme.colors.success}1A`
            : "transparent",
          borderRadius: 10,
          borderWidth: isActive ? 2 : 0,
          borderColor: theme.colors.success,
        }}
      />
    </View>
  );
});

// ============================================================================
// MODAL HEADER
// ============================================================================

interface ModalHeaderProps {
  header?: HeaderConfig;
  onClose: () => void;
  onToggleMode: () => void;
  isResizing: boolean;
  mode: ModalMode;
  theme: ModalTheme;
  panHandlers?: any;
}

const ModalHeader = memo(function ModalHeader({
  header,
  onClose,
  onToggleMode,
  isResizing,
  mode,
  theme,
  panHandlers,
}: ModalHeaderProps) {
  const headerProps = panHandlers ? panHandlers : {};

  if (header?.customContent) {
    return (
      <View
        style={{
          borderTopLeftRadius: theme.radii.md,
          borderTopRightRadius: theme.radii.md,
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          minHeight: 60,
        }}
      >
        <View {...headerProps}>
          <DragIndicator isResizing={isResizing} mode={mode} theme={theme} />
        </View>
        {header.customContent}
      </View>
    );
  }

  return (
    <View
      style={{
        borderTopLeftRadius: theme.radii.md,
        borderTopRightRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        minHeight: 60,
      }}
    >
      <View {...headerProps}>
        <DragIndicator isResizing={isResizing} mode={mode} theme={theme} />
      </View>
      
      <View style={{ 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        flex: 1,
      }}>
        {/* Left side - Title and subtitle (draggable in floating mode) */}
        <View style={{ flex: 1 }} {...(mode === "floating" ? headerProps : {})}>
          {header?.title && (
            <Text style={{ 
              fontSize: 18, 
              fontWeight: "700", 
              color: theme.colors.text,
              letterSpacing: -0.3,
            }}>
              {header.title}
            </Text>
          )}
          {header?.subtitle && (
            <Text style={{ 
              fontSize: 12, 
              color: theme.colors.textSecondary, 
              marginTop: 2,
              letterSpacing: 0.2,
            }}>
              {header.subtitle}
            </Text>
          )}
        </View>

        {/* Right side - Action buttons */}
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={onToggleMode}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: `${theme.colors.primary}20`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: theme.spacing.xs,
            }}
          >
            {mode === "floating" ? (
              <MaximizeIcon color={theme.colors.primary} />
            ) : (
              <MinimizeIcon color={theme.colors.primary} />
            )}
          </TouchableOpacity>
          {!header?.hideCloseButton && (
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: `${theme.colors.error}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloseIcon color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PureModal: React.FC<PureModalProps> = ({
  visible,
  onClose,
  children,
  mode = "bottomSheet",
  snapPoints = ["50%"],
  initialSnapIndex = 0,
  enablePanDownToClose = true,
  enableOverDrag = true,
  overDragResistanceFactor = 2.5,
  draggable = true,
  resizable = true,
  initialPosition,
  initialSize,
  theme = defaultTheme,
  header,
  showHandle = true,
  animationType = Platform.select({ ios: "spring", android: "timing" }),
  closeOnBackdropPress = true,
  persistenceKey,
  enablePersistence = false,
  storageAdapter,
  onOpen,
  onModeChange,
  onSnapPointChange,
}) => {
  // State
  const [isStateLoaded, setIsStateLoaded] = useState(!enablePersistence);
  const [currentMode, setCurrentMode] = useState<ModalMode>(mode);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [panelHeight, setPanelHeight] = useState(DEFAULT_HEIGHT);
  const [dimensions, setDimensions] = useState({
    width: initialSize?.width || FLOATING_WIDTH,
    height: initialSize?.height || FLOATING_HEIGHT,
    top: initialPosition?.y || (SCREEN.height - FLOATING_HEIGHT) / 2,
    left: initialPosition?.x || (SCREEN.width - FLOATING_WIDTH) / 2,
  });

  // Animated values
  const visibilityProgress = useRef(new Animated.Value(0)).current;
  const bottomSheetTranslateY = useRef(new Animated.Value(SCREEN.height)).current;
  const animatedBottomPosition = useRef(new Animated.Value(DEFAULT_HEIGHT)).current;
  const floatingPosition = useRef(
    new Animated.ValueXY({
      x: dimensions.left,
      y: dimensions.top,
    })
  ).current;
  const floatingScale = useRef(new Animated.Value(0)).current;
  const animatedWidth = useRef(new Animated.Value(dimensions.width)).current;
  const animatedFloatingHeight = useRef(new Animated.Value(dimensions.height)).current;

  // Refs
  const currentHeightRef = useRef(DEFAULT_HEIGHT);
  const currentDimensionsRef = useRef(dimensions);
  const initialPositionRef = useRef(DEFAULT_HEIGHT);

  // Load persisted state
  useEffect(() => {
    if (!enablePersistence || !persistenceKey) {
      setIsStateLoaded(true);
      return;
    }

    let mounted = true;
    const loadState = async () => {
      const savedState = await ModalStorage.load(persistenceKey, storageAdapter);
      if (mounted && savedState) {
        if (savedState.mode) {
          setCurrentMode(savedState.mode);
          onModeChange?.(savedState.mode);
        }
        if (savedState.panelHeight) {
          setPanelHeight(savedState.panelHeight);
          currentHeightRef.current = savedState.panelHeight;
          animatedBottomPosition.setValue(savedState.panelHeight);
        }
        if (savedState.dimensions) {
          setDimensions(savedState.dimensions);
          floatingPosition.setValue({
            x: savedState.dimensions.left,
            y: savedState.dimensions.top,
          });
          animatedWidth.setValue(savedState.dimensions.width);
          animatedFloatingHeight.setValue(savedState.dimensions.height);
        }
      }
      if (mounted) setIsStateLoaded(true);
    };

    loadState();
    return () => {
      mounted = false;
    };
  }, [persistenceKey, enablePersistence]);

  // Save state with debounce
  useEffect(() => {
    if (!enablePersistence || !persistenceKey || !isStateLoaded) return;

    const timeoutId = setTimeout(() => {
      ModalStorage.save(
        persistenceKey,
        {
          mode: currentMode,
          panelHeight: currentHeightRef.current,
          dimensions,
          isVisible: visible,
        },
        storageAdapter
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentMode, panelHeight, dimensions, visible, persistenceKey, enablePersistence, isStateLoaded]);

  // Mode toggle
  const toggleMode = useCallback(() => {
    const newMode = currentMode === "bottomSheet" ? "floating" : "bottomSheet";
    setCurrentMode(newMode);
    onModeChange?.(newMode);
    
    // Save state after mode change
    if (enablePersistence && persistenceKey) {
      setTimeout(() => {
        const state = {
          mode: newMode,
          position: { x: dimensions.left, y: dimensions.top },
          size: { width: dimensions.width, height: dimensions.height },
          bottomSheetHeight: panelHeight,
        };
        storageManager.saveState(persistenceKey, state);
      }, 100);
    }
  }, [currentMode, onModeChange, enablePersistence, persistenceKey, dimensions, panelHeight]);

  // Visibility animations
  useEffect(() => {
    if (visible) {
      bottomSheetTranslateY.setValue(SCREEN.height);
      visibilityProgress.setValue(0);

      if (currentMode === "bottomSheet") {
        Animated.parallel([
          Animated.spring(bottomSheetTranslateY, {
            toValue: 0,
            tension: 180,
            friction: 22,
            useNativeDriver: true,
          }),
          Animated.timing(visibilityProgress, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onOpen?.());
      } else {
        floatingScale.setValue(1);
        Animated.timing(visibilityProgress, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => onOpen?.());
      }
    } else {
      if (currentMode === "bottomSheet") {
        Animated.parallel([
          Animated.spring(bottomSheetTranslateY, {
            toValue: SCREEN.height,
            tension: 180,
            friction: 22,
            useNativeDriver: true,
          }),
          Animated.timing(visibilityProgress, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.timing(visibilityProgress, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [visible, currentMode]);

  // Bottom sheet pan responder
  const bottomSheetPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => currentMode === "bottomSheet",
        onMoveShouldSetPanResponder: (evt, gestureState) =>
          currentMode === "bottomSheet" && Math.abs(gestureState.dy) > 5,
        onPanResponderGrant: () => {
          setIsResizing(true);
          initialPositionRef.current = currentHeightRef.current;
        },
        onPanResponderMove: (evt, gestureState) => {
          const draggedPosition = initialPositionRef.current - gestureState.dy;
          const clampedPosition = Math.max(
            MIN_HEIGHT,
            Math.min(draggedPosition, SCREEN.height - 100)
          );
          animatedBottomPosition.setValue(clampedPosition);
          currentHeightRef.current = clampedPosition;
          setPanelHeight(clampedPosition);
        },
        onPanResponderRelease: (evt, gestureState) => {
          setIsResizing(false);
          const finalHeight = currentHeightRef.current;
          const velocity = gestureState.vy;

          const shouldClose =
            (velocity > 0.8 && gestureState.dy > 50) ||
            (gestureState.dy > 150 && finalHeight <= MIN_HEIGHT);

          if (shouldClose && enablePanDownToClose) {
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
            Animated.spring(animatedBottomPosition, {
              toValue: finalHeight,
              tension: 180,
              friction: 22,
              useNativeDriver: false,
            }).start(() => {
              setPanelHeight(finalHeight);
            });
          }
        },
      }),
    [currentMode, enablePanDownToClose]
  );

  // Create resize handlers for corners
  const createResizeHandler = useCallback(
    (corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight") => {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => currentMode === "floating" && resizable,
        onMoveShouldSetPanResponder: () => currentMode === "floating" && resizable,
        onPanResponderGrant: () => {
          setIsResizing(true);
        },
        onPanResponderMove: (evt, gestureState) => {
          const currentDims = currentDimensionsRef.current;
          let newWidth = currentDims.width;
          let newHeight = currentDims.height;
          let newLeft = currentDims.left;
          let newTop = currentDims.top;

          switch (corner) {
            case "topLeft":
              newWidth = Math.max(FLOATING_MIN_WIDTH, currentDims.width - gestureState.dx);
              newHeight = Math.max(FLOATING_MIN_HEIGHT, currentDims.height - gestureState.dy);
              newLeft = currentDims.left + (currentDims.width - newWidth);
              newTop = currentDims.top + (currentDims.height - newHeight);
              break;
            case "topRight":
              newWidth = Math.max(FLOATING_MIN_WIDTH, currentDims.width + gestureState.dx);
              newHeight = Math.max(FLOATING_MIN_HEIGHT, currentDims.height - gestureState.dy);
              newTop = currentDims.top + (currentDims.height - newHeight);
              break;
            case "bottomLeft":
              newWidth = Math.max(FLOATING_MIN_WIDTH, currentDims.width - gestureState.dx);
              newHeight = Math.max(FLOATING_MIN_HEIGHT, currentDims.height + gestureState.dy);
              newLeft = currentDims.left + (currentDims.width - newWidth);
              break;
            case "bottomRight":
              newWidth = Math.max(FLOATING_MIN_WIDTH, currentDims.width + gestureState.dx);
              newHeight = Math.max(FLOATING_MIN_HEIGHT, currentDims.height + gestureState.dy);
              break;
          }

          // Update dimensions
          setDimensions({
            width: newWidth,
            height: newHeight,
            left: newLeft,
            top: newTop,
          });
          
          // Update animated values
          animatedWidth.setValue(newWidth);
          animatedFloatingHeight.setValue(newHeight);
          floatingPosition.setValue({ x: newLeft, y: newTop });
        },
        onPanResponderRelease: () => {
          setIsResizing(false);
          // Store final dimensions
          currentDimensionsRef.current = dimensions;
        },
      });
    },
    [currentMode, resizable, dimensions]
  );

  const resizeHandlers = useMemo(() => ({
    topLeft: createResizeHandler("topLeft"),
    topRight: createResizeHandler("topRight"),
    bottomLeft: createResizeHandler("bottomLeft"),
    bottomRight: createResizeHandler("bottomRight"),
  }), [createResizeHandler]);

  // Floating drag pan responder
  const floatingDragPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => currentMode === "floating" && draggable,
        onMoveShouldSetPanResponder: () => currentMode === "floating" && draggable,
        onPanResponderGrant: () => {
          setIsDragging(true);
          floatingPosition.extractOffset();
        },
        onPanResponderMove: (evt, gestureState) => {
          floatingPosition.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        },
        onPanResponderRelease: () => {
          setIsDragging(false);
          floatingPosition.flattenOffset();
          const currentX = (floatingPosition.x as any).__getValue();
          const currentY = (floatingPosition.y as any).__getValue();
          const clampedX = Math.max(0, Math.min(currentX, SCREEN.width - currentDimensionsRef.current.width));
          const clampedY = Math.max(0, Math.min(currentY, SCREEN.height - currentDimensionsRef.current.height));
          floatingPosition.setValue({ x: clampedX, y: clampedY });
          setDimensions({
            ...currentDimensionsRef.current,
            left: clampedX,
            top: clampedY,
          });
        },
      }),
    [currentMode, draggable]
  );

  // Update refs
  useEffect(() => {
    currentDimensionsRef.current = dimensions;
  }, [dimensions]);

  // Opacity interpolation
  const modalOpacity = visibilityProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Render nothing if not visible
  if (!visible) {
    return null;
  }

  // Render floating mode
  if (currentMode === "floating") {
    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            width: dimensions.width,
            height: dimensions.height,
            opacity: modalOpacity,
            transform: [{ translateX: floatingPosition.x }, { translateY: floatingPosition.y }],
            backgroundColor: theme.colors.background,
            borderRadius: theme.radii.md,
            ...theme.shadows.lg,
            zIndex: 1000,
          },
          (isDragging || isResizing) && {
            borderColor: theme.colors.success,
            borderWidth: 2,
          },
        ]}
      >
        <View style={{ borderTopLeftRadius: theme.radii.md, borderTopRightRadius: theme.radii.md }}>
          <ModalHeader
            header={header}
            onClose={onClose}
            onToggleMode={toggleMode}
            isResizing={isDragging || isResizing}
            mode={currentMode}
            theme={theme}
            panHandlers={floatingDragPanResponder.panHandlers}
          />
        </View>

        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {children}
          </ScrollView>
        </View>

        {resizable && (
          <>
            <View 
              {...resizeHandlers.topLeft.panHandlers}
              style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40 }}
            >
              <CornerHandle position="topLeft" isActive={isDragging || isResizing} theme={theme} />
            </View>
            <View 
              {...resizeHandlers.topRight.panHandlers}
              style={{ position: "absolute", top: 0, right: 0, width: 40, height: 40 }}
            >
              <CornerHandle position="topRight" isActive={isDragging || isResizing} theme={theme} />
            </View>
            <View 
              {...resizeHandlers.bottomLeft.panHandlers}
              style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40 }}
            >
              <CornerHandle position="bottomLeft" isActive={isDragging || isResizing} theme={theme} />
            </View>
            <View 
              {...resizeHandlers.bottomRight.panHandlers}
              style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40 }}
            >
              <CornerHandle position="bottomRight" isActive={isDragging || isResizing} theme={theme} />
            </View>
          </>
        )}
      </Animated.View>
    );
  }

  // Render bottom sheet mode
  return (
    <View style={[StyleSheet.absoluteFillObject, { zIndex: 1000 }]} pointerEvents="box-none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={closeOnBackdropPress ? onClose : undefined}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.colors.backdrop,
              opacity: modalOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            opacity: modalOpacity,
            transform: [{ translateY: bottomSheetTranslateY }],
          },
        ]}
      >
        <Animated.View
          style={[
            {
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.radii.md,
              borderTopRightRadius: theme.radii.md,
              ...theme.shadows.lg,
              height: animatedBottomPosition,
            },
          ]}
        >
          <View {...bottomSheetPanResponder.panHandlers}>
            <ModalHeader
              header={header}
              onClose={onClose}
              onToggleMode={toggleMode}
              isResizing={isResizing}
              mode={currentMode}
              theme={theme}
            />
          </View>

          <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {children}
            </ScrollView>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default memo(PureModal);