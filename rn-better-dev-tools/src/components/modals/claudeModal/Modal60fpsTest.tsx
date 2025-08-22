/**
 * Modal60fpsTest
 * 
 * A CLEAN implementation that completely separates native and non-native animations
 * to avoid any mixing errors.
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
  Dimensions,
  PanResponder,
  Animated,
  ScrollView,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "@/rn-better-dev-tools/src/shared/hooks/useSafeAreaInsets";

const SCREEN = Dimensions.get("window");
const MIN_HEIGHT = 100;
const DEFAULT_HEIGHT = 400;

interface Modal60fpsTestProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: {
    title?: string;
    subtitle?: string;
  };
  styles?: any;
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  animatedHeight?: Animated.Value; // External animated height for performance testing
}

// Icons
const CloseIcon = memo(() => (
  <View style={{ width: 16, height: 16 }}>
    <View style={[styles.iconLine, { transform: [{ rotate: "45deg" }] }]} />
    <View style={[styles.iconLine, { transform: [{ rotate: "-45deg" }] }]} />
  </View>
));

const DragIndicator = memo(({ isResizing }: { isResizing: boolean }) => (
  <View style={styles.dragIndicatorContainer}>
    <View style={[styles.dragIndicator, isResizing && styles.dragIndicatorActive]} />
  </View>
));

// Header
const ModalHeader = memo(({ header, onClose, isResizing }: any) => (
  <View style={styles.header}>
    <DragIndicator isResizing={isResizing} />
    <View style={styles.headerContent}>
      {header?.title && <Text style={styles.headerTitle}>{header.title}</Text>}
      {header?.subtitle && <Text style={styles.headerSubtitle}>{header.subtitle}</Text>}
    </View>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
      <CloseIcon />
    </TouchableOpacity>
  </View>
));

// Main component
export const Modal60fpsTest: React.FC<Modal60fpsTestProps> = ({
  visible,
  onClose,
  children,
  header,
  styles: customStyles = {},
  minHeight = MIN_HEIGHT,
  maxHeight,
  initialHeight = DEFAULT_HEIGHT,
  animatedHeight: externalAnimatedHeight,
}) => {
  const insets = useSafeAreaInsets();
  const [isResizing, setIsResizing] = useState(false);
  
  // SEPARATE animated values - NEVER mix them!
  // For height (non-native) - use external if provided
  const internalAnimatedHeight = useRef(new Animated.Value(initialHeight)).current;
  const animatedHeight = externalAnimatedHeight || internalAnimatedHeight;
  
  // For position (native)
  const animatedY = useRef(new Animated.Value(SCREEN.height)).current;
  
  // For backdrop (native)
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  
  // Refs for values
  const currentHeightRef = useRef(initialHeight);
  const startHeightRef = useRef(initialHeight);
  
  const effectiveMaxHeight = maxHeight || SCREEN.height - insets.top - 50;
  const isExternallyControlled = !!externalAnimatedHeight;
  
  // Sync with external height if provided
  useEffect(() => {
    // Height sync effect
    if (externalAnimatedHeight && !isResizing) {
      currentHeightRef.current = initialHeight;
      externalAnimatedHeight.setValue(initialHeight);
      // Set external height
    }
  }, [externalAnimatedHeight, initialHeight, isResizing]);
  
  // Cleanup on unmount
  useEffect(() => {
    // Mount/Unmount effect
    return () => {
      // Stop all animations and reset when component unmounts
      animatedY.stopAnimation();
      animatedOpacity.stopAnimation();
      animatedHeight.stopAnimation();
      animatedY.setValue(SCREEN.height);
      animatedOpacity.setValue(0);
      animatedHeight.setValue(initialHeight);
    };
  }, []);
  
  // Open/close - ONLY animates Y position and opacity (both native)
  useEffect(() => {
    // Visibility effect
    let openAnimation: Animated.CompositeAnimation | null = null;
    let closeAnimation: Animated.CompositeAnimation | null = null;
    
    if (visible) {
      // Reset position if needed and then open
      animatedY.setValue(SCREEN.height);
      animatedOpacity.setValue(0);
      
      // Open
      openAnimation = Animated.parallel([
        Animated.spring(animatedY, {
          toValue: 0,
          tension: 180,
          friction: 22,
          useNativeDriver: true, // ✅ Native for translateY
        }),
        Animated.timing(animatedOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true, // ✅ Native for opacity
        }),
      ]);
      openAnimation.start();
    } else {
      // Close
      closeAnimation = Animated.parallel([
        Animated.spring(animatedY, {
          toValue: SCREEN.height,
          tension: 180,
          friction: 22,
          useNativeDriver: true, // ✅ Native for translateY
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true, // ✅ Native for opacity
        }),
      ]);
      closeAnimation.start();
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
  }, [visible]); // Only re-run when visible changes, not on height changes
  
  // Resize handler - ONLY touches height (non-native)
  const resizePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !isExternallyControlled,
        onMoveShouldSetPanResponder: (evt, gestureState) => 
          !isExternallyControlled && Math.abs(gestureState.dy) > 5,
          
        onPanResponderGrant: () => {
          setIsResizing(true);
          startHeightRef.current = currentHeightRef.current;
        },
        
        onPanResponderMove: (evt, gestureState) => {
          const newHeight = startHeightRef.current - gestureState.dy;
          const clampedHeight = Math.max(
            minHeight,
            Math.min(effectiveMaxHeight, newHeight)
          );
          
          currentHeightRef.current = clampedHeight;
          
          // Direct update - no animation
          animatedHeight.setValue(clampedHeight);
        },
        
        onPanResponderRelease: (evt, gestureState) => {
          setIsResizing(false);
          
          const finalHeight = currentHeightRef.current;
          
          // Optional: Spring to snap points
          Animated.spring(animatedHeight, {
            toValue: finalHeight,
            tension: 180,
            friction: 22,
            useNativeDriver: false, // ❌ MUST be false for height
          }).start();
          
          // Close if dragged down too much
          if (gestureState.dy > 150 && finalHeight <= minHeight) {
            onClose();
          }
        },
        
        onPanResponderTerminate: () => {
          setIsResizing(false);
        },
      }),
    [minHeight, effectiveMaxHeight, onClose, isExternallyControlled]
  );
  
  // Render nothing if not visible (but hooks have already been called)
  if (!visible) {
    return null;
  }
  
  return (
    <>
      {/* Backdrop - uses native opacity */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: animatedOpacity }, // Native
        ]}
        pointerEvents="auto"
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>
      
      {/* Container for translateY - uses native */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              { translateY: animatedY }, // Native
            ],
          },
        ]}
        pointerEvents="box-none"
      >
        {/* Inner view for height - uses non-native */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: animatedHeight, // Non-native
            },
            customStyles.container,
          ]}
        >
          <View {...resizePanResponder.panHandlers}>
            <ModalHeader
              header={header}
              onClose={onClose}
              isResizing={isResizing}
            />
          </View>
          
          <ScrollView style={[styles.content, customStyles.content]}>
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
  headerContent: {
    paddingHorizontal: 16,
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
  closeButton: {
    position: "absolute",
    top: 8,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
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
    backgroundColor: "#2A2A2A",
  },
});

export default memo(Modal60fpsTest);