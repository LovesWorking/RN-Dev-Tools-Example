import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  PanResponder,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  Animated as RNAnimated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { CornerResizeHandle } from "@/src/_components/floating-bubble/modal/components/CornerResizeHandle";

/**
 * ChatGPTModal — A single-file, reusable modal with bottom sheet and floating window modes.
 *
 * Goals achieved:
 * - Stable component tree: Dedicated specialized subcomponents for each mode; router renders both and each returns null when not visible.
 * - Composition over configuration: Small, focused props; render props for custom header and actions.
 * - SRP: Internal hooks for state, resize, and persistence; header/controls isolated.
 * - Persistence: Size, position, mode, and optional visibility persistence via pluggable storage driver.
 * - Portability: Single file, no repo edits required.
 *
 * Usage example:
 * ```tsx
 * import { ChatGPTModal, useChatGPTModalPersistence } from "../chatgptModal/ChatGPTModal";
 *
 * export function Example() {
 *   const { visible, setVisible, restoreState } = useChatGPTModalPersistence({
 *     storageKey: "example-modal",
 *     autoRestoreVisible: true, // Re-open on app restart if it was open
 *   });
 *
 *   useEffect(() => { restoreState(); }, [restoreState]);
 *
 *   return (
 *     <>
 *       <Pressable onPress={() => setVisible(true)}><Text>Open</Text></Pressable>
 *       <ChatGPTModal
 *         key="example-modal" // stable key
 *         visible={visible}
 *         onClose={() => setVisible(false)}
 *         storageKey="example-modal"
 *         title="Queries"
 *         subtitle="Swipe or detach to float"
 *       >
 *         <View />
 *       </ChatGPTModal>
 *     </>
 *   );
 * }
 * ```
 */

// =======================
// Types and Interfaces
// =======================

export type ChatGPTModalMode = "sheet" | "floating";

export interface ChatGPTModalProps {
  // Visibility
  visible: boolean;
  onClose: () => void;

  // Identity and persistence
  storageKey?: string; // Enables persistence for dimensions/mode/visibility
  storage?: StorageDriver; // Optional custom storage backend

  // Header content
  title?: string;
  subtitle?: string;
  renderHeader?: () => React.ReactNode; // Overrides title/subtitle
  headerRight?: React.ReactNode; // Extra actions (e.g., buttons)
  showToggleButton?: boolean; // Toggle sheet/floating button
  hideCloseButton?: boolean; // Hide close button

  // Mode and sizing
  initialMode?: ChatGPTModalMode; // Default when no persisted state
  minWidth?: number;
  minHeight?: number;
  defaultSheetHeight?: number; // Default bottom sheet height

  // Styling overrides
  panelStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;

  // Events
  onModeChange?: (mode: ChatGPTModalMode) => void;
  onPositionChange?: (pos: { left: number; top: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;

  // Content
  children: React.ReactNode;
}

// Persisted state model
type PersistedPanelDimensions = {
  width: number;
  height: number;
  top: number;
  left: number;
};

type PersistedState = {
  mode: ChatGPTModalMode;
  floatingDimensions: PersistedPanelDimensions;
  sheetHeight: number;
  visible?: boolean; // Optional – only used by helper hook
};

// =======================
// Storage Driver
// =======================

export interface StorageDriver {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

// Default storage: prefers AsyncStorage if available; falls back to in-memory.
const createDefaultStorage = (): StorageDriver => {
  // In-memory fallback
  const memory = new Map<string, string>();
  const memoryDriver: StorageDriver = {
    async getItem(key) {
      return memory.has(key) ? memory.get(key)! : null;
    },
    async setItem(key, value) {
      memory.set(key, value);
    },
    async removeItem(key) {
      memory.delete(key);
    },
  };

  try {
    const mod = require("@react-native-async-storage/async-storage");
    const AsyncStorage = mod?.default ?? mod;
    if (
      AsyncStorage &&
      typeof AsyncStorage.getItem === "function" &&
      typeof AsyncStorage.setItem === "function"
    ) {
      const asyncStorageDriver: StorageDriver = {
        async getItem(key) {
          return await AsyncStorage.getItem(key);
        },
        async setItem(key, value) {
          await AsyncStorage.setItem(key, value);
        },
        async removeItem(key) {
          await AsyncStorage.removeItem(key);
        },
      };
      return asyncStorageDriver;
    }
  } catch (_err) {
    // ignore – use memory fallback
  }

  return memoryDriver;
};

// =======================
// Constants
// =======================

const MIN_HEIGHT_DEFAULT = 150;
const MIN_WIDTH_DEFAULT = 300;
const SHEET_DEFAULT_HEIGHT = 400;

const STORAGE_KEYS = {
  state: (key: string) => `${key}:state`,
};

// =======================
// Helper: clamp
// =======================

const clamp = (value: number, lowerBound: number, upperBound: number) => {
  "worklet";
  return Math.min(Math.max(lowerBound, value), upperBound);
};

// =======================
// Internal: useModalInternalState
// =======================

interface UseModalInternalStateArgs {
  storageKey?: string;
  storage: StorageDriver;
  initialMode: ChatGPTModalMode;
  minWidth: number;
  minHeight: number;
  defaultSheetHeight: number;
}

function useModalInternalState({
  storageKey,
  storage,
  initialMode,
  minWidth,
  minHeight,
  defaultSheetHeight,
}: UseModalInternalStateArgs) {
  const insets = useSafeAreaInsets();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");

  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<ChatGPTModalMode>(initialMode);
  const [floatingDimensions, setFloatingDimensions] =
    useState<PersistedPanelDimensions>({
      width: Math.max(minWidth, SCREEN_WIDTH - 40),
      height: Math.max(minHeight, SHEET_DEFAULT_HEIGHT),
      top: 100,
      left: 20,
    });
  const [sheetHeight, setSheetHeight] = useState(
    Math.max(
      minHeight,
      Math.min(defaultSheetHeight, SCREEN_HEIGHT - insets.top)
    )
  );

  // Load persisted state
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!storageKey) {
        setIsLoaded(true);
        return;
      }
      try {
        const raw = await storage.getItem(STORAGE_KEYS.state(storageKey));
        if (!raw) {
          setIsLoaded(true);
          return;
        }
        const parsed = JSON.parse(raw) as PersistedState;
        if (cancelled) return;

        // Validate dimensions within screen bounds
        const safeDims: PersistedPanelDimensions = {
          width: Math.max(
            minWidth,
            Math.min(parsed.floatingDimensions.width, SCREEN_WIDTH)
          ),
          height: Math.max(
            minHeight,
            Math.min(parsed.floatingDimensions.height, SCREEN_HEIGHT)
          ),
          top: Math.max(
            0,
            Math.min(parsed.floatingDimensions.top, SCREEN_HEIGHT - minHeight)
          ),
          left: Math.max(
            0,
            Math.min(parsed.floatingDimensions.left, SCREEN_WIDTH - minWidth)
          ),
        };

        setMode(parsed.mode ?? initialMode);
        setFloatingDimensions(safeDims);
        setSheetHeight(
          Math.max(
            minHeight,
            Math.min(
              parsed.sheetHeight ?? defaultSheetHeight,
              SCREEN_HEIGHT - insets.top
            )
          )
        );
      } catch (_err) {
        // ignore and continue with defaults
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    storageKey,
    storage,
    initialMode,
    minWidth,
    minHeight,
    defaultSheetHeight,
    insets.top,
  ]);

  // Save state (debounced for sheetHeight)
  const saveState = useCallback(
    async (next?: Partial<PersistedState>) => {
      if (!storageKey) return;
      const state: PersistedState = {
        mode,
        floatingDimensions,
        sheetHeight,
      };
      const toSave = { ...state, ...(next ?? {}) } as PersistedState;
      try {
        await storage.setItem(
          STORAGE_KEYS.state(storageKey),
          JSON.stringify(toSave)
        );
      } catch (_err) {
        // ignore
      }
    },
    [storageKey, storage, mode, floatingDimensions, sheetHeight]
  );

  const saveStateDebouncedRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const saveDebounced = useCallback(
    (next?: Partial<PersistedState>) => {
      if (saveStateDebouncedRef.current)
        clearTimeout(saveStateDebouncedRef.current);
      saveStateDebouncedRef.current = setTimeout(() => {
        saveState(next);
      }, 400);
    },
    [saveState]
  );

  // Respond to dimension changes (screen rotate)
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      const newWidth = Math.max(
        minWidth,
        Math.min(floatingDimensions.width, window.width)
      );
      const newHeight = Math.max(
        minHeight,
        Math.min(floatingDimensions.height, window.height)
      );
      const newLeft = Math.max(
        0,
        Math.min(floatingDimensions.left, window.width - minWidth)
      );
      const newTop = Math.max(
        0,
        Math.min(floatingDimensions.top, window.height - minHeight)
      );
      const dims = {
        width: newWidth,
        height: newHeight,
        left: newLeft,
        top: newTop,
      };
      setFloatingDimensions(dims);
      saveDebounced({ floatingDimensions: dims });

      const maxSheet = window.height - insets.top;
      const newSheetHeight = Math.max(
        minHeight,
        Math.min(sheetHeight, maxSheet)
      );
      if (newSheetHeight !== sheetHeight) {
        setSheetHeight(newSheetHeight);
        saveDebounced({ sheetHeight: newSheetHeight });
      }
    });
    return () => sub?.remove();
  }, [
    floatingDimensions,
    insets.top,
    minHeight,
    minWidth,
    saveDebounced,
    sheetHeight,
  ]);

  return {
    isLoaded,
    mode,
    setMode: (m: ChatGPTModalMode) => {
      setMode(m);
      saveDebounced({ mode: m });
    },
    floatingDimensions,
    setFloatingDimensions: (dims: PersistedPanelDimensions) => {
      setFloatingDimensions(dims);
      saveDebounced({ floatingDimensions: dims });
    },
    sheetHeight,
    setSheetHeight: (h: number) => {
      setSheetHeight(h);
      saveDebounced({ sheetHeight: h });
    },
  };
}

// =======================
// Internal: useBottomSheetResize (PanResponder + RN Animated)
// =======================

function useBottomSheetResize({
  enabled,
  height,
  setHeight,
  minHeight,
}: {
  enabled: boolean;
  height: number;
  setHeight: (h: number) => void;
  minHeight: number;
}) {
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

  const animatedHeight = useRef(new RNAnimated.Value(height)).current;
  const startHeightRef = useRef(height);
  const currentHeightRef = useRef(height);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    currentHeightRef.current = height;
    animatedHeight.setValue(height);
  }, [height, animatedHeight]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !enabledRef.current,
        onMoveShouldSetPanResponder: () => !enabledRef.current,
        onPanResponderGrant: () => {
          startHeightRef.current = currentHeightRef.current;
        },
        onPanResponderMove: (_evt, gestureState) => {
          const maxHeight = SCREEN_HEIGHT - insets.top;
          const newHeight = startHeightRef.current - gestureState.dy;
          const clamped = Math.max(minHeight, Math.min(newHeight, maxHeight));
          animatedHeight.setValue(clamped);
          currentHeightRef.current = clamped;
        },
        onPanResponderRelease: () => {
          setHeight(currentHeightRef.current);
        },
        onPanResponderTerminate: () => {
          // no-op
        },
      }),
    [SCREEN_HEIGHT, insets.top, minHeight, setHeight]
  );

  return {
    panHandlers: panResponder.panHandlers,
    animatedPanelStyle: { height: animatedHeight },
  };
}

// =======================
// Internal: DragResizable (Reanimated + RNGH)
// =======================

type DragResizableHandlers =
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight";

function DragResizable({
  heightBound,
  widthBound,
  minWidth = 50,
  minHeight = 50,
  height = 50,
  width = 150,
  left,
  top,
  topInset = 0,
  isDraggable = true,
  isResizable = true,
  showHandles = true,
  onDragStart,
  onDragEnd,
  onResizeStart,
  onResizeEnd,
  onTap,
  scale = 1,
  children,
  style,
  resizeHandlers = [
    "bottomLeft",
    "bottomRight",
    "topLeft",
    "topRight",
  ] as DragResizableHandlers[],
  renderHandler = ({ handler }: { handler: DragResizableHandlers }) => (
    <Reanimated.View style={[dragStyles.cornerHandle, dragStyles[handler]]}>
      <View style={[dragStyles.handler]} />
    </Reanimated.View>
  ),
}: {
  heightBound: number;
  widthBound: number;
  minWidth?: number;
  minHeight?: number;
  height?: number;
  width?: number;
  left: number;
  top: number;
  topInset?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
  showHandles?: boolean;
  onDragStart?: () => void;
  onDragEnd?: (state: PersistedPanelDimensions) => void;
  onResizeStart?: () => void;
  onResizeEnd?: (state: PersistedPanelDimensions) => void;
  onTap?: () => void;
  scale?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  resizeHandlers?: DragResizableHandlers[];
  renderHandler?: (prop: { handler: DragResizableHandlers }) => React.ReactNode;
}) {
  const boxX = useSharedValue(left);
  const boxY = useSharedValue(top);
  const boxHeight = useSharedValue(height);
  const boxWidth = useSharedValue(width);

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const sHeight = useSharedValue(0);
  const sWidth = useSharedValue(0);

  const gestureHandler = Gesture.Pan()
    .enabled(isDraggable)
    .onStart(() => {
      "worklet";
      offsetX.value = boxX.value;
      offsetY.value = boxY.value;
      if (onDragStart) runOnJS(onDragStart)();
    })
    .onUpdate((ev) => {
      "worklet";
      boxX.value = clamp(
        offsetX.value + ev.translationX / scale,
        0,
        widthBound - boxWidth.value
      );
      boxY.value = clamp(
        offsetY.value + ev.translationY / scale,
        topInset,
        heightBound - boxHeight.value
      );
    })
    .onEnd(() => {
      "worklet";
      if (onDragEnd) {
        runOnJS(onDragEnd)({
          width: boxWidth.value,
          height: boxHeight.value,
          left: boxX.value,
          top: boxY.value,
        });
      }
    })
    .minDistance(10)
    .minPointers(1)
    .maxPointers(1);

  const tapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      "worklet";
      if (onTap) runOnJS(onTap)();
    });

  const createResizeHandler = useCallback(
    (corner: DragResizableHandlers) => {
      return Gesture.Pan()
        .enabled(isResizable)
        .onStart(() => {
          "worklet";
          sHeight.value = boxHeight.value;
          sWidth.value = boxWidth.value;
          offsetX.value = boxX.value;
          offsetY.value = boxY.value;
          if (onResizeStart) runOnJS(onResizeStart)();
        })
        .onUpdate((ev) => {
          "worklet";
          let updatedWidth = sWidth.value;
          let updatedHeight = sHeight.value;
          let updatedX = offsetX.value;
          let updatedY = offsetY.value;

          switch (corner) {
            case "topLeft": {
              updatedWidth = clamp(
                sWidth.value - ev.translationX / scale,
                minWidth,
                widthBound - offsetX.value
              );
              updatedHeight = clamp(
                sHeight.value - ev.translationY / scale,
                minHeight,
                heightBound - updatedY
              );
              if (updatedWidth !== sWidth.value) {
                updatedX = offsetX.value + (sWidth.value - updatedWidth);
              }
              if (updatedHeight !== sHeight.value) {
                updatedY = clamp(
                  offsetY.value + ev.translationY / scale,
                  topInset,
                  heightBound - updatedHeight
                );
              }
              break;
            }
            case "topRight": {
              updatedWidth = clamp(
                sWidth.value + ev.translationX / scale,
                minWidth,
                widthBound - offsetX.value
              );
              updatedHeight = clamp(
                sHeight.value - ev.translationY / scale,
                minHeight,
                heightBound - updatedY
              );
              if (updatedHeight !== sHeight.value) {
                updatedY = clamp(
                  offsetY.value + ev.translationY / scale,
                  topInset,
                  heightBound - updatedHeight
                );
              }
              break;
            }
            case "bottomLeft": {
              updatedWidth = clamp(
                sWidth.value - ev.translationX / scale,
                minWidth,
                widthBound - offsetX.value
              );
              updatedHeight = clamp(
                sHeight.value + ev.translationY / scale,
                minHeight,
                heightBound - offsetY.value
              );
              if (updatedWidth !== sWidth.value) {
                updatedX = offsetX.value + (sWidth.value - updatedWidth);
              }
              break;
            }
            case "bottomRight": {
              updatedWidth = clamp(
                sWidth.value + ev.translationX / scale,
                minWidth,
                widthBound - offsetX.value
              );
              updatedHeight = clamp(
                sHeight.value + ev.translationY / scale,
                minHeight,
                heightBound - offsetY.value
              );
              break;
            }
          }

          boxWidth.value = updatedWidth;
          boxHeight.value = updatedHeight;
          boxX.value = updatedX;
          boxY.value = updatedY;
        })
        .onEnd(() => {
          "worklet";
          if (onResizeEnd) {
            runOnJS(onResizeEnd)({
              width: boxWidth.value,
              height: boxHeight.value,
              left: boxX.value,
              top: boxY.value,
            });
          }
        })
        .minDistance(0)
        .minPointers(1)
        .maxPointers(1);
    },
    [
      onResizeStart,
      scale,
      minWidth,
      widthBound,
      minHeight,
      heightBound,
      onResizeEnd,
      topInset,
    ]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: boxX.value }, { translateY: boxY.value }],
    height: boxHeight.value,
    width: boxWidth.value,
    position: "absolute",
  }));

  return (
    <Reanimated.View style={[animatedStyle, style]}>
      <GestureDetector
        gesture={Gesture.Simultaneous(gestureHandler, tapGesture)}
      >
        {children}
      </GestureDetector>
      {isResizable && showHandles
        ? resizeHandlers.map((handler) => (
            <GestureDetector
              key={handler}
              gesture={createResizeHandler(handler)}
            >
              {renderHandler?.({ handler })}
            </GestureDetector>
          ))
        : null}
    </Reanimated.View>
  );
}

const dragStyles = StyleSheet.create({
  cornerHandle: {
    position: "absolute",
    zIndex: 1,
  },
  topLeft: { left: 6, top: 6 },
  topRight: { right: 6, top: 6 },
  bottomLeft: { left: 6, bottom: 6 },
  bottomRight: { right: 6, bottom: 6 },
  handler: {
    width: 16,
    height: 16,
    backgroundColor: "#22C55E",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// =======================
// Header & Controls
// =======================

function Header({
  isFloating,
  isResizing,
  onToggleMode,
  onClose,
  title,
  subtitle,
  renderHeader,
  headerRight,
  headerStyle,
  panHandlers,
  showToggleButton,
  hideCloseButton,
}: {
  isFloating: boolean;
  isResizing: boolean;
  onToggleMode: () => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  renderHeader?: () => React.ReactNode;
  headerRight?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  panHandlers?: any;
  showToggleButton: boolean;
  hideCloseButton?: boolean;
}) {
  const headerProps = !isFloating && panHandlers ? panHandlers : {};
  return (
    <View style={[styles.header, headerStyle]} {...headerProps}>
      <View style={styles.dragIndicator}>
        <View
          style={[styles.resizeGrip, isResizing && styles.resizeGripActive]}
        />
      </View>
      <View style={styles.headerContent}>
        <View style={styles.mainHeaderRow}>
          <View style={styles.customHeaderContent}>
            {renderHeader ? (
              renderHeader()
            ) : (
              <>
                {!!title && <Text style={styles.headerTitle}>{title}</Text>}
                {!!subtitle && (
                  <Text style={styles.headerSubtitleText}>{subtitle}</Text>
                )}
              </>
            )}
          </View>
          <View style={styles.headerControls}>
            {showToggleButton && (
              <Pressable
                accessibilityLabel="Toggle floating mode"
                onPress={onToggleMode}
                style={[styles.controlButton, styles.controlButtonSecondary]}
                hitSlop={HIT_SLOP}
              >
                <Text style={styles.controlIcon}>{isFloating ? "▣" : "▢"}</Text>
              </Pressable>
            )}
            {headerRight}
            {!hideCloseButton && (
              <Pressable
                accessibilityLabel="Close"
                onPress={onClose}
                style={[styles.controlButton, styles.controlButtonDanger]}
                hitSlop={HIT_SLOP}
              >
                <Text style={styles.controlIcon}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 } as const;

// =======================
// Specialized Mode Components (Stable Trees)
// =======================

function FloatingWindow({
  visible,
  bounds,
  dims,
  setDims,
  children,
  header,
  panelStyle,
  contentStyle,
}: {
  visible: boolean;
  bounds: { width: number; height: number };
  dims: PersistedPanelDimensions;
  setDims: (d: PersistedPanelDimensions) => void;
  children: React.ReactNode;
  header: React.ReactNode;
  panelStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const isActive = isDragging || isResizing;
  return (
    <View style={[styles.container]} pointerEvents="box-none" key="floating">
      <DragResizable
        heightBound={bounds.height}
        widthBound={bounds.width}
        left={dims.left}
        top={dims.top}
        topInset={insets.top}
        width={dims.width}
        height={dims.height}
        minWidth={MIN_WIDTH_DEFAULT}
        minHeight={MIN_HEIGHT_DEFAULT}
        isDraggable
        isResizable
        showHandles={isActive}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(d) => {
          setIsDragging(false);
          setDims(d);
        }}
        onResizeStart={() => setIsResizing(true)}
        onResizeEnd={(d) => {
          setIsResizing(false);
          setDims(d);
        }}
        style={styles.dragResizableContainer}
        renderHandler={({ handler }) => (
          <Reanimated.View
            style={[dragStyles.cornerHandle, dragStyles[handler]]}
          >
            <View
              style={[
                dragStyles.handler,
                isActive && { backgroundColor: "#22C55E" },
              ]}
            />
          </Reanimated.View>
        )}
      >
        <Reanimated.View
          style={[
            styles.panel,
            styles.panelFloating,
            isActive && styles.panelActive,
            panelStyle,
          ]}
        >
          {React.cloneElement(header as React.ReactElement<any>, {
            isResizing,
          })}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Reanimated.View>
      </DragResizable>
    </View>
  );
}

function BottomSheet({
  visible,
  height,
  setHeight,
  header,
  children,
  panelStyle,
  contentStyle,
}: {
  visible: boolean;
  height: number;
  setHeight: (h: number) => void;
  header: React.ReactNode;
  children: React.ReactNode;
  panelStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const { animatedPanelStyle, panHandlers } = useBottomSheetResize({
    enabled: false, // pan enabled when not floating; provided through header
    height,
    setHeight,
    minHeight: MIN_HEIGHT_DEFAULT,
  });
  if (!visible) return null;
  return (
    <View
      style={[styles.overlay, { paddingTop: insets.top }]}
      pointerEvents="box-none"
      key="sheet"
    >
      <RNAnimated.View
        style={[
          styles.panel,
          styles.panelBottomSheet,
          animatedPanelStyle,
          panelStyle,
        ]}
      >
        {React.cloneElement(header as React.ReactElement<any>, { panHandlers })}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </RNAnimated.View>
    </View>
  );
}

// =======================
// Public Component: ChatGPTModal
// =======================

export function ChatGPTModal({
  visible,
  onClose,
  storageKey,
  storage: storageProp,
  title,
  subtitle,
  renderHeader,
  headerRight,
  showToggleButton = true,
  hideCloseButton,
  initialMode = "sheet",
  minWidth = MIN_WIDTH_DEFAULT,
  minHeight = MIN_HEIGHT_DEFAULT,
  defaultSheetHeight = SHEET_DEFAULT_HEIGHT,
  panelStyle,
  headerStyle,
  contentStyle,
  onModeChange,
  onPositionChange,
  onSizeChange,
  children,
}: ChatGPTModalProps) {
  const storage = useMemo(
    () => storageProp ?? createDefaultStorage(),
    [storageProp]
  );
  const [bounds, setBounds] = useState(() => {
    const { width, height } = Dimensions.get("window");
    const insets = { top: 0, bottom: 0 };
    return { width, height: height - insets.top - insets.bottom };
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setBounds({ width: window.width, height: window.height - insets.top });
    });
    return () => sub?.remove();
  }, [insets.top]);

  const {
    isLoaded,
    mode,
    setMode,
    floatingDimensions,
    setFloatingDimensions,
    sheetHeight,
    setSheetHeight,
  } = useModalInternalState({
    storageKey,
    storage,
    initialMode,
    minWidth,
    minHeight,
    defaultSheetHeight,
  });

  // Event relays
  const handleToggleMode = useCallback(() => {
    const next = mode === "sheet" ? "floating" : "sheet";
    setMode(next);
    onModeChange?.(next);
  }, [mode, onModeChange, setMode]);

  const handleDims = useCallback(
    (d: PersistedPanelDimensions) => {
      setFloatingDimensions(d);
      onPositionChange?.({ left: d.left, top: d.top });
      onSizeChange?.({ width: d.width, height: d.height });
    },
    [onPositionChange, onSizeChange, setFloatingDimensions]
  );

  // Common header element instance (kept stable per render)
  const headerEl = (
    <Header
      isFloating={mode === "floating"}
      isResizing={false}
      onToggleMode={handleToggleMode}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      renderHeader={renderHeader}
      headerRight={headerRight}
      headerStyle={headerStyle}
      showToggleButton={showToggleButton}
      hideCloseButton={hideCloseButton}
    />
  );

  // Stable router structure per RN Fabric guidance
  if (!visible || !isLoaded) return null;

  return (
    <View
      key="chatgpt-modal-router"
      style={StyleSheet.absoluteFill}
      pointerEvents="box-none"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setBounds({ width, height });
      }}
    >
      <BottomSheet
        visible={mode === "sheet"}
        height={sheetHeight}
        setHeight={setSheetHeight}
        header={headerEl}
        panelStyle={panelStyle}
        contentStyle={contentStyle}
      >
        {children}
      </BottomSheet>

      <FloatingWindow
        visible={mode === "floating"}
        bounds={bounds}
        dims={floatingDimensions}
        setDims={handleDims}
        header={headerEl}
        panelStyle={panelStyle}
        contentStyle={contentStyle}
      >
        {children}
      </FloatingWindow>
    </View>
  );
}

// =======================
// Optional: visibility persistence helper
// =======================

export function useChatGPTModalPersistence({
  storageKey,
  storage,
  autoRestoreVisible = false,
}: {
  storageKey: string;
  storage?: StorageDriver;
  autoRestoreVisible?: boolean;
}) {
  const storageDriver = useMemo(
    () => storage ?? createDefaultStorage(),
    [storage]
  );
  const [visible, setVisible] = useState(false);
  const restoreState = useCallback(async () => {
    try {
      const raw = await storageDriver.getItem(STORAGE_KEYS.state(storageKey));
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedState;
      if (autoRestoreVisible && parsed.visible) setVisible(true);
    } catch (_err) {
      // ignore
    }
  }, [autoRestoreVisible, storageDriver, storageKey]);

  // Persist visibility alongside other state
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw =
          (await storageDriver.getItem(STORAGE_KEYS.state(storageKey))) || "{}";
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        const next = { ...parsed, visible } as PersistedState;
        if (!mounted) return;
        await storageDriver.setItem(
          STORAGE_KEYS.state(storageKey),
          JSON.stringify(next)
        );
      } catch {
        /* ignore */
      }
    })();
    return () => {
      mounted = false;
    };
  }, [storageDriver, storageKey, visible]);

  return { visible, setVisible, restoreState } as const;
}

// =======================
// Styles
// =======================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    pointerEvents: "box-none",
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
    backgroundColor: "transparent",
    pointerEvents: "box-none",
    zIndex: 2000,
    elevation: 2000,
  },
  dragResizableContainer: {
    backgroundColor: "transparent",
  },
  panel: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
  panelFloating: {
    flex: 1,
  },
  panelActive: {
    borderColor: "rgba(34, 197, 94, 1)",
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 20,
    shadowColor: "rgba(34, 197, 94, 0.6)",
  },
  panelBottomSheet: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    shadowOffset: { width: 0, height: -4 },
  },
  content: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#2A2A2A",
  },
  header: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: "hidden",
    backgroundColor: "#171717",
  },
  dragIndicator: {
    height: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#171717",
  },
  resizeGrip: {
    width: 32,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 1.5,
  },
  resizeGripActive: {
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
  mainHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
    gap: 8,
  },
  customHeaderContent: {
    flex: 1,
    minHeight: 32,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
  },
  headerSubtitleText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  headerControls: {
    flexDirection: "row",
    gap: 6,
    zIndex: 1001,
    paddingRight: 4,
    marginLeft: 12,
    alignItems: "center",
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(156, 163, 175, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.2)",
  },
  controlButtonSecondary: {
    backgroundColor: "rgba(156, 163, 175, 0.1)",
    borderColor: "rgba(156, 163, 175, 0.2)",
  },
  controlButtonDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  controlIcon: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 14,
  },
});

// =======================
// API Summary (for intellisense):
//
// <ChatGPTModal
//   visible
//   onClose
//   storageKey?               // enable persistence (size/position/mode/visibility via helper)
//   storage?                  // custom storage driver (getItem/setItem/removeItem)
//   initialMode?              // "sheet" | "floating" (default: sheet)
//   title? | subtitle?        // or renderHeader={() => ReactNode}
//   headerRight?              // action area on the right
//   showToggleButton?         // toggle sheet/floating (default: true)
//   hideCloseButton?          // hide close control
//   minWidth? | minHeight?    // size guards
//   defaultSheetHeight?       // default bottom sheet height (px)
//   panelStyle? | headerStyle? | contentStyle?
//   onModeChange?             // callback when user toggles mode
//   onPositionChange?         // floating window on drag end
//   onSizeChange?             // floating window on resize end
// >
//   children
// </ChatGPTModal>
//
// useChatGPTModalPersistence({ storageKey, autoRestoreVisible? }) => { visible, setVisible, restoreState }
// =======================
