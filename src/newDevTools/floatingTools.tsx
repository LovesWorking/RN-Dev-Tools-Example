import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
  createContext,
  useCallback,
  Children,
} from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  type ViewStyle,
  type TextStyle,
} from "react-native";
// Using Views to render grip dots; no react-native-svg dependency

// =============================
// Safe Area Helper with optional react-native-safe-area-context
// =============================
let SafeAreaModule: any = null;
let hasCheckedSafeArea = false;

function initializeSafeAreaContext(): void {
  if (hasCheckedSafeArea) return;
  hasCheckedSafeArea = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    SafeAreaModule = require("react-native-safe-area-context");
  } catch {
    // Silent fallback - react-native-safe-area-context not installed
  }
}

// Fallback safe area detection when react-native-safe-area-context is not available
function getFallbackSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  // Default safe area insets
  let insets = { top: 0, bottom: 0, left: 0, right: 0 };

  if (Platform.OS === "ios") {
    // Check for iPhone with notch/dynamic island
    const { height, width } = Dimensions.get("window");
    const aspectRatio = height / width;

    // iPhone X and later with notch/dynamic island have specific aspect ratios
    // iPhone X/XS/11 Pro: 2436x1125 (2.165)
    // iPhone XR/11: 1792x828 (2.164)
    // iPhone 12/13/14/15: 2532x1170 (2.164) or 2778x1284 (2.163)
    // iPhone 14 Pro/15 Pro with Dynamic Island: 2556x1179 (2.168) or 2796x1290 (2.167)
    const hasNotch = aspectRatio > 2.15;

    if (hasNotch) {
      // Typical safe area values for iPhones with notch/dynamic island
      insets = {
        top: 59, // Status bar + notch/dynamic island area
        bottom: 34, // Home indicator area
        left: 0,
        right: 0,
      };
    } else {
      // Older iPhones without notch
      insets = {
        top: 20, // Just status bar
        bottom: 0,
        left: 0,
        right: 0,
      };
    }
  } else if (Platform.OS === "android") {
    // Android - use StatusBar height for top inset
    insets = {
      top: StatusBar.currentHeight || 24,
      bottom: 0, // Most Android devices don't need bottom safe area
      left: 0,
      right: 0,
    };
  }

  return insets;
}

// Hook to get safe area insets (tries react-native-safe-area-context first, falls back to custom)
function useFloatingToolsSafeArea(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  // Initialize on first use
  useEffect(() => {
    initializeSafeAreaContext();
  }, []);

  // Default fallback insets
  const [fallbackInsets, setFallbackInsets] = useState(
    getFallbackSafeAreaInsets
  );

  // Update fallback insets on dimension changes
  useEffect(() => {
    const updateInsets = () => {
      setFallbackInsets(getFallbackSafeAreaInsets());
    };

    const subscription = Dimensions.addEventListener("change", updateInsets);
    return () => subscription?.remove();
  }, []);

  // If safe area context is available, use it directly (not as a hook since we can't call hooks conditionally)
  // We'll access the current frame insets instead
  if (SafeAreaModule && SafeAreaModule.initialWindowMetrics) {
    // Use the initial window metrics which are static
    const metrics = SafeAreaModule.initialWindowMetrics;
    if (metrics && metrics.insets) {
      return metrics.insets;
    }
  }

  return fallbackInsets;
}

// Non-hook version for use outside of components
function getSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  // Initialize if needed
  if (!hasCheckedSafeArea) {
    initializeSafeAreaContext();
  }

  // For non-hook contexts, we can't use useSafeAreaInsets, so use fallback
  return getFallbackSafeAreaInsets();
}

// =============================
// Local Types (self-contained)
// =============================
export type Environment = "local" | "dev" | "qa" | "staging" | "prod";
export type UserRole = "admin" | "internal" | "user";

// =============================
// Icons (self-contained)
// =============================
function GripVerticalIcon({
  size = 24,
  color = "rgba(156, 163, 175, 0.8)",
}: {
  size?: number;
  color?: string;
}) {
  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };

  const dotSize = Math.max(2, Math.round(size / 6));
  const columnGap = Math.max(2, Math.round(size / 12));
  const rowGap = Math.max(2, Math.round(size / 12));

  const columnStyle: ViewStyle = {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: columnGap / 2,
  };

  const dotStyle: ViewStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: color,
    marginVertical: rowGap / 2,
  };

  return (
    <View style={containerStyle}>
      <View style={columnStyle}>
        <View style={dotStyle} />
        <View style={dotStyle} />
        <View style={dotStyle} />
      </View>
      <View style={columnStyle}>
        <View style={dotStyle} />
        <View style={dotStyle} />
        <View style={dotStyle} />
      </View>
    </View>
  );
}

// =============================
// Storage helper (self-contained)
// Optional AsyncStorage; falls back to memory
// =============================
type AsyncStorageType = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem?: (key: string) => Promise<void>;
};

let AsyncStorageImpl: AsyncStorageType | null = null;
let hasInitializedStorage = false;
const memoryStorage: Record<string, string> = {};

function initializeStorage(): void {
  if (hasInitializedStorage) return;
  hasInitializedStorage = true;
  try {
    const asyncStorageModule = require("@react-native-async-storage/async-storage");
    AsyncStorageImpl = asyncStorageModule.default || asyncStorageModule;
  } catch {
    // Silent fallback - AsyncStorage not installed
  }
}

async function setStorageItem(key: string, value: string): Promise<void> {
  try {
    if (AsyncStorageImpl) {
      await AsyncStorageImpl.setItem(key, value);
    } else {
      memoryStorage[key] = value;
    }
  } catch (error) {
    console.warn(`[FloatingTools] Failed to save ${key}:`, error);
  }
}

async function getStorageItem(key: string): Promise<string | null> {
  try {
    if (AsyncStorageImpl) {
      return await AsyncStorageImpl.getItem(key);
    }
    return memoryStorage[key] ?? null;
  } catch (error) {
    console.warn(`[FloatingTools] Failed to load ${key}:`, error);
    return null;
  }
}

const STORAGE_KEYS = {
  BUBBLE_POSITION_X: "@floating_tools_bubble_position_x",
  BUBBLE_POSITION_Y: "@floating_tools_bubble_position_y",
} as const;

// =============================
// Position persistence hook
// Extracted logic dedicated to state/IO
// =============================
function useFloatingToolsPosition({
  animatedPosition,
  bubbleWidth = 100,
  bubbleHeight = 32,
  enabled = true,
  visibleHandleWidth = 32,
}: {
  animatedPosition: Animated.ValueXY;
  bubbleWidth?: number;
  bubbleHeight?: number;
  enabled?: boolean;
  visibleHandleWidth?: number;
}) {
  const isInitialized = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (enabled) initializeStorage();
  }, [enabled]);

  const savePosition = useCallback(
    async (x: number, y: number) => {
      if (!enabled) return;
      try {
        await Promise.all([
          setStorageItem(STORAGE_KEYS.BUBBLE_POSITION_X, x.toString()),
          setStorageItem(STORAGE_KEYS.BUBBLE_POSITION_Y, y.toString()),
        ]);
      } catch (error) {
        console.warn("[FloatingTools] Failed to save position:", error);
      }
    },
    [enabled]
  );

  const debouncedSavePosition = useCallback(
    (x: number, y: number) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => savePosition(x, y), 500) as any;
    },
    [savePosition]
  );

  const loadPosition = useCallback(async (): Promise<{
    x: number;
    y: number;
  } | null> => {
    if (!enabled) return null;
    try {
      const [xStr, yStr] = await Promise.all([
        getStorageItem(STORAGE_KEYS.BUBBLE_POSITION_X),
        getStorageItem(STORAGE_KEYS.BUBBLE_POSITION_Y),
      ]);
      if (xStr !== null && yStr !== null) {
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        if (!Number.isNaN(x) && !Number.isNaN(y)) return { x, y };
      }
    } catch (error) {
      console.warn("[FloatingTools] Failed to load position:", error);
    }
    return null;
  }, [enabled]);

  const validatePosition = useCallback(
    (position: { x: number; y: number }) => {
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get("window");
      const safeArea = getSafeAreaInsets();
      // Prevent going off left, top, and bottom edges with safe area
      // Allow pushing off-screen to the right so only the grab handle remains visible
      const minX = safeArea.left; // Respect safe area left
      const maxX = screenWidth - visibleHandleWidth; // no right padding, ensure handle is visible
      const minY = safeArea.top; // Respect safe area top
      const maxY = screenHeight - bubbleHeight - safeArea.bottom; // Respect safe area bottom
      const clamped = {
        x: Math.max(minX, Math.min(position.x, maxX)),
        y: Math.max(minY, Math.min(position.y, maxY)),
      } as const;
      return clamped;
    },
    [visibleHandleWidth, bubbleHeight, bubbleWidth]
  );

  useEffect(() => {
    if (!enabled || isInitialized.current) return;
    const restore = async () => {
      const saved = await loadPosition();
      if (saved) {
        const validated = validatePosition(saved);
        animatedPosition.setValue(validated);
      } else {
        const { width: screenWidth } = Dimensions.get("window");
        const safeArea = getSafeAreaInsets();
        animatedPosition.setValue({
          x: screenWidth - bubbleWidth - 20,
          y: Math.max(100, safeArea.top + 20), // Ensure it's below safe area
        });
      }
      isInitialized.current = true;
    };
    restore();
  }, [enabled, animatedPosition, loadPosition, validatePosition, bubbleWidth]);

  useEffect(() => {
    if (!enabled || !isInitialized.current) return;
    const listener = animatedPosition.addListener((value) => {
      debouncedSavePosition(value.x, value.y);
    });
    return () => {
      animatedPosition.removeListener(listener);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [enabled, animatedPosition, debouncedSavePosition]);

  return {
    savePosition,
    loadPosition,
    isInitialized: isInitialized.current,
  } as const;
}

// =============================
// UI-only leaf components
// =============================
export function Divider() {
  const dividerStyle: ViewStyle = {
    width: 1,
    height: 12,
    backgroundColor: "rgba(107, 114, 128, 0.4)",
    flexShrink: 0,
  };
  return <View style={dividerStyle} />;
}

function getEnvironmentConfig(environment: Environment): {
  label: string;
  backgroundColor: string;
} {
  switch (environment) {
    case "local":
      return { label: "LOCAL", backgroundColor: "#06B6D4" };
    case "dev":
      return { label: "DEV", backgroundColor: "#F97316" };
    case "qa":
      return { label: "QA", backgroundColor: "#8B5CF6" };
    case "staging":
      return { label: "STAGING", backgroundColor: "#10B981" };
    case "prod":
      return { label: "PROD", backgroundColor: "#DC2626" };
    default:
      return { label: "LOCAL", backgroundColor: "#06B6D4" };
  }
}

export function EnvironmentIndicator({
  environment,
}: {
  environment: Environment;
}) {
  const env = getEnvironmentConfig(environment);
  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexShrink: 0,
  };
  const dotStyle: ViewStyle = {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: env.backgroundColor,
    marginRight: 6,
    shadowColor: env.backgroundColor,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  };
  const textStyle: TextStyle = {
    fontSize: 11,
    fontWeight: "600",
    color: "#F9FAFB",
    letterSpacing: 0.5,
  };
  return (
    <View style={containerStyle}>
      <View style={dotStyle} />
      <Text style={textStyle}>{env.label}</Text>
    </View>
  );
}

function getUserStatusConfig(userRole: UserRole) {
  switch (userRole) {
    case "admin":
      return { label: "Admin", dotColor: "#10B981", textColor: "#10B981" };
    case "internal":
      return { label: "Internal", dotColor: "#6366F1", textColor: "#A5B4FC" };
    case "user":
    default:
      return { label: "User", dotColor: "#6B7280", textColor: "#9CA3AF" };
  }
}

// Context to avoid brittle prop threading and keep API composable
const FloatingToolsContext = createContext<{ isDragging: boolean }>({
  isDragging: false,
});

export function UserStatus({
  userRole,
  onPress,
}: {
  userRole: UserRole;
  onPress?: () => void;
}) {
  const { isDragging } = useContext(FloatingToolsContext);
  const config = getUserStatusConfig(userRole);
  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexShrink: 0,
  };
  const dotStyle: ViewStyle = {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: config.dotColor,
    marginRight: 4,
  };
  const textStyle: TextStyle = {
    fontSize: 10,
    fontWeight: "500",
    color: config.textColor,
    letterSpacing: 0.3,
  };
  if (!onPress) {
    return (
      <View style={containerStyle}>
        <View style={dotStyle} />
        <Text style={textStyle}>{config.label}</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      disabled={isDragging}
      activeOpacity={0.85}
      style={containerStyle}
    >
      <View style={dotStyle} />
      <Text style={textStyle}>{config.label}</Text>
    </TouchableOpacity>
  );
}

// =============================
// Helpers
// =============================
function interleaveWithDividers(
  childrenArray: React.ReactNode[]
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  childrenArray.forEach((child, index) => {
    if (child == null || child === false) return;
    result.push(child);
    if (index < childrenArray.length - 1)
      result.push(<Divider key={`divider-${index}`} />);
  });
  return result;
}

// =============================
// Main Component (presentation only)
// =============================
export type FloatingToolsProps = {
  enablePositionPersistence?: boolean;
  children?: React.ReactNode;
};

export function FloatingTools({
  enablePositionPersistence = true,
  children,
}: FloatingToolsProps) {
  // Animated position and drag state
  const animatedPosition = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const [bubbleSize, setBubbleSize] = useState({ width: 100, height: 32 });
  const [isHidden, setIsHidden] = useState(false);

  // Get safe area insets (will use react-native-safe-area-context if available)
  const safeAreaInsets = useFloatingToolsSafeArea();

  // Position persistence (state/IO extracted to hook)
  const { savePosition } = useFloatingToolsPosition({
    animatedPosition,
    bubbleWidth: bubbleSize.width,
    bubbleHeight: bubbleSize.height,
    enabled: enablePositionPersistence,
    visibleHandleWidth: 32,
  });

  // Check if bubble is in hidden position on load
  useEffect(() => {
    if (!enablePositionPersistence) return;

    const checkHiddenState = () => {
      const currentX = (animatedPosition.x as any).__getValue();
      const { width: screenWidth } = Dimensions.get("window");
      // Check if bubble is at the hidden position (showing only grabber)
      if (currentX >= screenWidth - 32 - 5) {
        setIsHidden(true);
      }
    };
    // Delay check to ensure position is loaded
    const timer = setTimeout(checkHiddenState, 100);
    return () => clearTimeout(timer);
  }, [enablePositionPersistence, animatedPosition]);

  // Default position when persistence disabled
  useEffect(() => {
    if (!enablePositionPersistence) {
      const { width: screenWidth } = Dimensions.get("window");
      animatedPosition.setValue({
        x: screenWidth - bubbleSize.width - 20,
        y: Math.max(100, safeAreaInsets.top + 20), // Ensure it's below safe area
      });
    }
  }, [
    enablePositionPersistence,
    animatedPosition,
    bubbleSize.width,
    safeAreaInsets.top,
  ]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsDragging(true);
          animatedPosition.setOffset({
            x: (animatedPosition.x as any).__getValue(),
            y: (animatedPosition.y as any).__getValue(),
          });
          animatedPosition.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event(
          [null, { dx: animatedPosition.x, dy: animatedPosition.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
          setIsDragging(false);
          animatedPosition.flattenOffset();
          let currentX = (animatedPosition.x as any).__getValue();
          let currentY = (animatedPosition.y as any).__getValue();
          const { width: screenWidth, height: screenHeight } =
            Dimensions.get("window");

          // Prevent dragging off left, top, and bottom edges with safe area
          const minX = safeAreaInsets.left;
          const minY = safeAreaInsets.top; // Respect safe area top
          const maxY = screenHeight - bubbleSize.height - safeAreaInsets.bottom; // Respect safe area bottom

          // Clamp Y position to prevent going off top/bottom
          currentY = Math.max(minY, Math.min(currentY, maxY));

          // Check if bubble is more than 50% over the right edge
          const bubbleMidpoint = currentX + bubbleSize.width / 2;
          const shouldHide = bubbleMidpoint > screenWidth;

          if (shouldHide) {
            // Animate to hidden position (only grabber visible)
            const hiddenX = screenWidth - 32; // Only show the 32px grabber
            setIsHidden(true);
            Animated.timing(animatedPosition, {
              toValue: { x: hiddenX, y: currentY },
              duration: 200,
              useNativeDriver: false,
            }).start(() => {
              savePosition(hiddenX, currentY);
            });
          } else {
            // Clamp X position to prevent going off left edge
            currentX = Math.max(minX, currentX);

            // Check if we're in hidden state and user is pulling it back
            if (isHidden && currentX < screenWidth - 32 - 10) {
              setIsHidden(false);
            }

            // Animate to the clamped position if needed
            if (
              currentX !== (animatedPosition.x as any).__getValue() ||
              currentY !== (animatedPosition.y as any).__getValue()
            ) {
              Animated.timing(animatedPosition, {
                toValue: { x: currentX, y: currentY },
                duration: 100,
                useNativeDriver: false,
              }).start(() => {
                savePosition(currentX, currentY);
              });
            } else {
              savePosition(currentX, currentY);
            }
          }
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
          animatedPosition.flattenOffset();
        },
      }),
    [
      animatedPosition,
      savePosition,
      bubbleSize.width,
      bubbleSize.height,
      isHidden,
      safeAreaInsets,
    ]
  );

  // Stable styles
  const bubbleStyle: Animated.WithAnimatedObject<ViewStyle> = useMemo(
    () => ({
      position: "absolute",
      zIndex: 1001,
      transform: animatedPosition.getTranslateTransform(),
    }),
    [animatedPosition]
  );

  const containerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#171717",
    borderRadius: 6,
    borderWidth: isDragging ? 2 : 1,
    borderColor: isDragging ? "rgba(34, 197, 94, 1)" : "rgba(75, 85, 99, 0.4)",
    overflow: "hidden",
    elevation: 8,
    shadowColor: isDragging ? "rgba(34, 197, 94, 0.6)" : "#000",
    shadowOffset: { width: 0, height: isDragging ? 6 : 4 },
    shadowOpacity: isDragging ? 0.6 : 0.3,
    shadowRadius: isDragging ? 12 : 8,
  };

  const dragHandleStyle: ViewStyle = {
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: "rgba(107, 114, 128, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    borderRightWidth: 1,
    borderRightColor: "rgba(75, 85, 99, 0.4)",
  };

  const contentStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingRight: 8,
  };

  // Compose actions row with automatic dividers
  const actions = useMemo(
    () => interleaveWithDividers(Children.toArray(children)),
    [children]
  );

  return (
    <Animated.View style={bubbleStyle}>
      <View
        style={containerStyle}
        {...panResponder.panHandlers}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setBubbleSize({ width, height });
        }}
      >
        <View style={dragHandleStyle}>
          <GripVerticalIcon size={12} color="rgba(156, 163, 175, 0.8)" />
        </View>
        <FloatingToolsContext.Provider value={{ isDragging }}>
          <View style={contentStyle}>{actions}</View>
        </FloatingToolsContext.Provider>
      </View>
    </Animated.View>
  );
}
