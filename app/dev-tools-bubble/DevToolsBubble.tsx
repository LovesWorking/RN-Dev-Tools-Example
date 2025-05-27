import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import DevTools from "./DevTools";
import { TanstackLogo } from "./_components/devtools/svgs";
import { ClipboardFunction, CopyContext } from "./context/CopyContext";

interface DevToolsBubbleProps {
  bubbleStyle?: StyleProp<ViewStyle>;
  onCopy?: ClipboardFunction;
}

export function DevToolsBubble({ bubbleStyle, onCopy }: DevToolsBubbleProps) {
  const [showDevTools, setShowDevTools] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);

  // Get screen dimensions
  const screenHeight = Dimensions.get("window").height;
  const expandedHeight = screenHeight * 0.75;
  const defaultHeight = 350;
  const minHeight = 200; // Minimum height for the panel
  const maxHeight = screenHeight * 0.9; // Maximum height (90% of screen)

  // Animated value for height
  const heightAnim = useRef(
    new Animated.Value(hasSelection ? expandedHeight : defaultHeight)
  ).current;
  const [currentHeight, setCurrentHeight] = useState(
    hasSelection ? expandedHeight : defaultHeight
  );
  const currentHeightRef = useRef(
    hasSelection ? expandedHeight : defaultHeight
  );

  // Update height when selection changes
  React.useEffect(() => {
    const targetHeight = hasSelection ? expandedHeight : defaultHeight;
    setCurrentHeight(targetHeight);
    currentHeightRef.current = targetHeight;
    Animated.timing(heightAnim, {
      toValue: targetHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [hasSelection, expandedHeight, defaultHeight, heightAnim]);

  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical movements
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 10
        );
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animations and sync the ref with current animated value
        heightAnim.stopAnimation((value) => {
          setCurrentHeight(value);
          currentHeightRef.current = value;
          heightAnim.setValue(value);
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        // Use the ref value which is always current
        const newHeight = currentHeightRef.current - gestureState.dy;

        // Clamp the height between min and max
        const clampedHeight = Math.max(
          minHeight,
          Math.min(maxHeight, newHeight)
        );
        heightAnim.setValue(clampedHeight);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Calculate the final height using the ref
        const finalHeight = Math.max(
          minHeight,
          Math.min(maxHeight, currentHeightRef.current - gestureState.dy)
        );

        // Update both state and ref immediately
        setCurrentHeight(finalHeight);
        currentHeightRef.current = finalHeight;

        // Animate to the final height and ensure sync
        Animated.timing(heightAnim, {
          toValue: finalHeight,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          // Ensure the animated value and state are perfectly synced after animation
          heightAnim.setValue(finalHeight);
          setCurrentHeight(finalHeight);
          currentHeightRef.current = finalHeight;
        });
      },
    })
  ).current;

  return (
    <CopyContext.Provider value={{ onCopy }}>
      <View>
        {showDevTools ? (
          <Animated.View style={[styles.devTools, { height: heightAnim }]}>
            <DevTools
              setShowDevTools={setShowDevTools}
              onSelectionChange={setHasSelection}
              panResponder={panResponder}
            />
          </Animated.View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setShowDevTools(true);
            }}
            style={[
              styles.touchableOpacityBase,
              Platform.OS === "ios"
                ? styles.touchableOpacityIOS
                : styles.touchableOpacityAndroid,
              bubbleStyle,
            ]}
          >
            <TanstackLogo />
          </TouchableOpacity>
        )}
      </View>
    </CopyContext.Provider>
  );
}

const styles = StyleSheet.create({
  devTools: {
    position: "absolute",
    right: 0,
    bottom: 0,
    zIndex: 50,
    width: "100%",
    // height is now dynamic, controlled by Animated.Value
  },
  touchableOpacityBase: {
    position: "absolute",
    right: 1,
    zIndex: 50,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#A4C200",
  },
  touchableOpacityIOS: {
    bottom: 96,
  },
  touchableOpacityAndroid: {
    bottom: 64,
  },
  text: {
    zIndex: 10,
    color: "white",
    fontSize: 40,
    padding: 24,
  },
});
