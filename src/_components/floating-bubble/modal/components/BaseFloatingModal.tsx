import { ReactNode, useRef, useEffect } from "react";
import { Animated } from "react-native";
import { useModalState, useModalResize } from "../hooks";
import { FloatingModalContent } from "./FloatingModalContent";
import { PanelDimensions } from "../../../../_sections/react-query/utils/modalStorageOperations";

interface BaseFloatingModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  storagePrefix: string; // Unique prefix for storing modal state
  showToggleButton?: boolean; // Whether to show the floating mode toggle
  customHeaderContent?: ReactNode; // Custom content to render in header
  headerSubtitle?: string; // Optional subtitle to show below the main header content
  hideCloseButton?: boolean; // Whether to hide the close button
}

export function BaseFloatingModal({
  visible,
  onClose,
  children,
  storagePrefix,
  showToggleButton = true,
  customHeaderContent,
  headerSubtitle,
  hideCloseButton,
}: BaseFloatingModalProps) {
  // Extract all state management to custom hook
  const modalState = useModalState({ storagePrefix });

  // Extract resize functionality to custom hook
  const { panHandlers, animatedPanelStyle } = useModalResize({
    isFloatingMode: modalState.isFloatingMode,
    panelHeight: modalState.panelHeight,
    isResizing: modalState.isResizing,
    setIsResizing: modalState.setIsResizing,
    updatePanelHeight: modalState.updatePanelHeight,
  });

  // Animated values for border style feedback
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const borderWidthAnim = useRef(new Animated.Value(1)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(0.3)).current;
  const shadowRadiusAnim = useRef(new Animated.Value(8)).current;

  // Animate border style based on drag/resize state
  useEffect(() => {
    const isActive =
      modalState.isFloatingMode &&
      (modalState.isDragging || modalState.isResizing);

    Animated.parallel([
      Animated.timing(borderColorAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderWidthAnim, {
        toValue: isActive ? 2 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: isActive ? 0.8 : 0.3,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadiusAnim, {
        toValue: isActive ? 12 : 8,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [
    modalState.isFloatingMode,
    modalState.isDragging,
    modalState.isResizing,
    borderColorAnim,
    borderWidthAnim,
    shadowOpacityAnim,
    shadowRadiusAnim,
  ]);

  // Animated border style for drag/resize feedback (only for floating mode)
  const animatedBorderStyle = {
    borderColor: borderColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(255, 255, 255, 0.1)", "rgba(34, 197, 94, 1)"],
    }),
    borderWidth: borderWidthAnim,
    shadowColor: borderColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#000", "rgba(34, 197, 94, 0.6)"],
    }),
    shadowOpacity: shadowOpacityAnim,
    shadowRadius: shadowRadiusAnim,
    elevation: borderColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 20],
    }),
  };

  // Event handlers for drag/resize operations
  const handleDragEnd = (dimensions: PanelDimensions) => {
    const newDimensions: PanelDimensions = {
      ...modalState.panelDimensions,
      top: dimensions.top,
      left: dimensions.left,
    };
    modalState.updatePanelDimensions(newDimensions);
    modalState.setIsDragging(false);
  };

  const handleResizeEnd = (dimensions: PanelDimensions) => {
    modalState.updatePanelDimensions(dimensions);
    modalState.setIsResizing(false);
  };

  const handleDragStart = () => {
    modalState.setIsDragging(true);
  };

  const handleResizeStart = () => {
    modalState.setIsResizing(true);
  };

  if (!visible || !modalState.isStateLoaded) return null;

  return (
    <FloatingModalContent
      isFloatingMode={modalState.isFloatingMode}
      isDragging={modalState.isDragging}
      isResizing={modalState.isResizing}
      showToggleButton={showToggleButton}
      customHeaderContent={customHeaderContent}
      headerSubtitle={headerSubtitle}
      panelDimensions={modalState.panelDimensions}
      containerBounds={modalState.containerBounds}
      panHandlers={panHandlers}
      animatedPanelStyle={animatedPanelStyle}
      animatedBorderStyle={animatedBorderStyle}
      onToggleFloatingMode={modalState.toggleFloatingMode}
      onClose={onClose}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onResizeStart={handleResizeStart}
      onResizeEnd={handleResizeEnd}
      onContainerLayout={modalState.setContainerBounds}
      hideCloseButton={hideCloseButton}
    >
      {children}
    </FloatingModalContent>
  );
}