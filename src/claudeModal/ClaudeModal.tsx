/**
 * ClaudeModal - A highly flexible, draggable, and resizable modal component for React Native
 * 
 * Features:
 * - Bottom sheet mode (default)
 * - Floating/detached mode (draggable and resizable)
 * - Persistent state across app restarts
 * - Customizable header with title or custom components
 * - Smooth animations and gestures
 * - TypeScript support with comprehensive types
 * 
 * @author Claude
 * @version 1.0.0
 */

import React, {
  ReactNode,
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DragResizable } from '@/src/_components/floating-bubble/modal/components/DragResizable';
import { CornerResizeHandle } from '@/src/_components/floating-bubble/modal/components/CornerResizeHandle';

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Modal display modes
 */
export type ModalMode = 'bottomSheet' | 'floating';

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
      const module = await import('@react-native-async-storage/async-storage');
      return module.default;
    } catch {
      return null;
    }
  }
}

// ============================================================================
// Constants
// ============================================================================

const SCREEN = Dimensions.get('window');
const MIN_HEIGHT = 150;
const DEFAULT_HEIGHT = 400;
const THROTTLE_MS = 16; // ~60fps
const HIT_SLOP = { top: 6, bottom: 6, left: 6, right: 6 };

// ============================================================================
// Utility Functions
// ============================================================================

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

// ============================================================================
// Icon Components
// ============================================================================

const MaximizeIcon = ({ color = '#E5E7EB', size = 16 }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: 'absolute',
        top: 2,
        left: 2,
        width: size - 4,
        height: size - 4,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 2,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 5,
        width: 2,
        height: 2,
        backgroundColor: color,
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: 5,
        left: 0,
        width: 2,
        height: 2,
        backgroundColor: color,
      }}
    />
  </View>
);

const MinimizeIcon = ({ color = '#E5E7EB', size = 16 }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: 'absolute',
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
);

const CloseIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <View style={{ width: size, height: size }}>
    <View
      style={{
        position: 'absolute',
        top: size / 2 - 0.75,
        left: 2,
        width: size - 4,
        height: 1.5,
        backgroundColor: color,
        transform: [{ rotate: '45deg' }],
      }}
    />
    <View
      style={{
        position: 'absolute',
        top: size / 2 - 0.75,
        left: 2,
        width: size - 4,
        height: 1.5,
        backgroundColor: color,
        transform: [{ rotate: '-45deg' }],
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

  const headerProps = mode === 'bottomSheet' && panHandlers ? panHandlers : {};

  return (
    <View style={[defaultStyles.header, styles.header]} {...headerProps}>
      <DragIndicator isResizing={isResizing} style={styles.dragIndicator} />
      <View style={defaultStyles.headerContent}>
        <View style={defaultStyles.headerRow}>
          {customContent ? (
            <View style={defaultStyles.customHeaderContent}>{customContent}</View>
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
                style={[defaultStyles.controlButton, defaultStyles.toggleButton]}
                hitSlop={HIT_SLOP}
              >
                {mode === 'floating' ? <MinimizeIcon /> : <MaximizeIcon />}
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


// ============================================================================
// Main Component
// ============================================================================

export const ClaudeModal: React.FC<ClaudeModalProps> = ({
  visible,
  onClose,
  children,
  persistenceKey,
  header,
  initialMode = 'bottomSheet',
  styles: customStyles = {},
  minHeight = MIN_HEIGHT,
  maxHeight,
  initialHeight = DEFAULT_HEIGHT,
  enablePersistence = true,
  onModeChange,
  onDimensionsChange,
}) => {
  const insets = useSafeAreaInsets();
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
  const startHeightRef = useRef(panelHeight);
  const currentHeightRef = useRef(panelHeight);
  const lastUpdateTimeRef = useRef(0);

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
        if (savedState.dimensions) setDimensions(savedState.dimensions);
      }
      setIsStateLoaded(true);
    };

    loadState();
  }, [persistenceKey, enablePersistence, animatedHeight]);

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
  }, [mode, panelHeight, dimensions, persistenceKey, enablePersistence, isStateLoaded]);

  // Update animated values
  useEffect(() => {
    currentHeightRef.current = panelHeight;
    animatedHeight.setValue(panelHeight);
  }, [panelHeight, animatedHeight]);

  // Throttled update function
  const throttledUpdateHeight = useCallback((height: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current >= THROTTLE_MS) {
      setPanelHeight(height);
      lastUpdateTimeRef.current = now;
    }
  }, []);

  // Create resize PanResponder for bottom sheet
  const resizePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => mode === 'bottomSheet',
        onMoveShouldSetPanResponder: () => mode === 'bottomSheet',
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



  // Toggle mode
  const toggleMode = useCallback(() => {
    const newMode = mode === 'bottomSheet' ? 'floating' : 'bottomSheet';
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
    borderColor: isDragging || isResizing ? 'rgba(34, 197, 94, 1)' : 'rgba(255, 255, 255, 0.1)',
    borderWidth: isDragging || isResizing ? 2 : 1,
    shadowColor: isDragging || isResizing ? 'rgba(34, 197, 94, 0.6)' : '#000',
    shadowOpacity: isDragging || isResizing ? 0.8 : 0.3,
    shadowRadius: isDragging || isResizing ? 12 : 8,
    elevation: isDragging || isResizing ? 20 : 16,
  };

  // Render floating mode
  if (mode === 'floating') {
    return (
      <View
        style={[defaultStyles.container, customStyles.container]}
        onLayout={handleContainerLayout}
        pointerEvents="box-none"
      >
        <DragResizable
          heightBound={containerBounds.height}
          widthBound={containerBounds.width}
          left={dimensions.left}
          top={dimensions.top}
          topInset={insets.top}
          width={dimensions.width}
          height={dimensions.height}
          minWidth={minHeight}
          minHeight={minHeight}
          isDraggable={true}
          isResizable={true}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(state) => {
            setIsDragging(false);
            const newDimensions = {
              width: state.width,
              height: state.height,
              left: state.left,
              top: state.top,
            };
            setDimensions(newDimensions);
            onDimensionsChange?.(newDimensions);
          }}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={(state) => {
            setIsResizing(false);
            const newDimensions = {
              width: state.width,
              height: state.height,
              left: state.left,
              top: state.top,
            };
            setDimensions(newDimensions);
            onDimensionsChange?.(newDimensions);
          }}
          style={[
            defaultStyles.floatingModal,
            customStyles.modal,
            animatedBorderStyle,
          ]}
          renderHandler={({ handler }) => (
            <CornerResizeHandle
              handler={handler}
              isActive={isDragging || isResizing}
            />
          )}
        >
          <View style={{ flex: 1 }}>
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
        </DragResizable>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    elevation: 2000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 2000,
    elevation: 2000,
  },
  bottomSheetModal: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    overflow: 'hidden',
  },
  floatingModal: {
    position: 'absolute',
    backgroundColor: '#2A2A2A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
    overflow: 'hidden',
  },
  header: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#171717',
  },
  dragIndicatorContainer: {
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171717',
  },
  dragIndicator: {
    width: 32,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 1.5,
  },
  dragIndicatorActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.8)',
    height: 4,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#171717',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '400',
    paddingTop: 4,
    paddingBottom: 2,
  },
  customHeaderContent: {
    flex: 1,
    minHeight: 32,
    justifyContent: 'center',
  },
  headerControls: {
    flexDirection: 'row',
    gap: 6,
    paddingRight: 4,
    marginLeft: 12,
  },
  controlButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  toggleButton: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderColor: 'rgba(156, 163, 175, 0.2)',
  },
  closeButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#2A2A2A',
  },
});

// ============================================================================
// Exports
// ============================================================================

export default ClaudeModal;