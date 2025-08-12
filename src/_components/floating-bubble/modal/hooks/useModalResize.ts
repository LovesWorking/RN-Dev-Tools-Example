import { useRef, useMemo, useEffect, useCallback } from "react";
import { Animated, PanResponder, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MIN_HEIGHT = 150;
const THROTTLE_MS = 16; // ~60fps

interface UseModalResizeProps {
  isFloatingMode: boolean;
  panelHeight: number;
  isResizing: boolean;
  setIsResizing: (resizing: boolean) => void;
  updatePanelHeight: (height: number) => void;
}

export const useModalResize = ({
  isFloatingMode,
  panelHeight,
  setIsResizing,
  updatePanelHeight,
}: UseModalResizeProps) => {
  const insets = useSafeAreaInsets();
  const MAX_HEIGHT = SCREEN_HEIGHT - insets.top;

  // Use Animated.Value for smooth height transitions
  const animatedHeight = useRef(new Animated.Value(panelHeight)).current;
  
  // Use refs to track values without causing re-renders
  const startHeightRef = useRef(panelHeight);
  const currentHeightRef = useRef(panelHeight);
  const isFloatingModeRef = useRef(isFloatingMode);
  const setIsResizingRef = useRef(setIsResizing);
  const updatePanelHeightRef = useRef(updatePanelHeight);
  const lastUpdateTimeRef = useRef(0);

  // Update refs when values change
  useEffect(() => {
    currentHeightRef.current = panelHeight;
    animatedHeight.setValue(panelHeight);
  }, [panelHeight, animatedHeight]);

  useEffect(() => {
    isFloatingModeRef.current = isFloatingMode;
  }, [isFloatingMode]);

  useEffect(() => {
    setIsResizingRef.current = setIsResizing;
  }, [setIsResizing]);

  useEffect(() => {
    updatePanelHeightRef.current = updatePanelHeight;
  }, [updatePanelHeight]);

  // Throttled update function to reduce React state updates
  const throttledUpdateHeight = useCallback((height: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current >= THROTTLE_MS) {
      updatePanelHeightRef.current(height);
      lastUpdateTimeRef.current = now;
    }
  }, []);

  // Create PanResponder ONCE and never recreate it
  const panResponder = useMemo(
    () => {
      return PanResponder.create({
        onStartShouldSetPanResponder: (_evt, _gestureState) => {
          return !isFloatingModeRef.current;
        },
        onMoveShouldSetPanResponder: (_evt, _gestureState) => {
          return !isFloatingModeRef.current;
        },
        onPanResponderGrant: (_evt, _gestureState) => {
          setIsResizingRef.current(true);
          // Capture the current height at the start of gesture
          startHeightRef.current = currentHeightRef.current;
        },
        onPanResponderMove: (_evt, gestureState) => {
          // Bottom sheet: dragging up (negative dy) increases height
          const newHeight = startHeightRef.current - gestureState.dy;
          const clampedHeight = Math.max(
            MIN_HEIGHT,
            Math.min(newHeight, MAX_HEIGHT)
          );
          
          // Always update animated value for smooth visual feedback
          animatedHeight.setValue(clampedHeight);
          currentHeightRef.current = clampedHeight;
          
          // Throttle React state updates to improve performance
          throttledUpdateHeight(clampedHeight);
        },
        onPanResponderRelease: (_evt, _gestureState) => {
          setIsResizingRef.current(false);
          // Ensure final height is saved
          updatePanelHeightRef.current(currentHeightRef.current);
        },
        onPanResponderTerminate: (_evt, _gestureState) => {
          setIsResizingRef.current(false);
        },
      });
    },
    [animatedHeight, MAX_HEIGHT, throttledUpdateHeight] // Only depend on stable values
  );

  // Return pan handlers and animated style
  return {
    panHandlers: panResponder.panHandlers,
    animatedPanelStyle: {
      height: animatedHeight,
    },
  };
};