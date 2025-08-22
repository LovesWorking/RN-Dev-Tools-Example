import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIEW_SIZE = 6;
const VIEW_HEIGHT = VIEW_SIZE * 3;
const BUTTON_SIZE = 80;
const CIRCLE_RADIUS = BUTTON_SIZE / 2;
const START_ANGLE = (-1 * Math.PI) / 2;
const PADDING = 15;

interface Props {
  selectedIcon: Animated.SharedValue<number>;
}

const DialIndicator: React.FC<Props> = ({ selectedIcon }) => {
  const ANGLE_PER_VIEW = (2 * Math.PI) / 6; // 6 icons with close button
  
  const animatedStyle = useAnimatedStyle(() => {
    const angle = START_ANGLE + ANGLE_PER_VIEW * selectedIcon.value;
    const x =
      CIRCLE_RADIUS +
      (CIRCLE_RADIUS - VIEW_HEIGHT / 2 - PADDING) * Math.cos(angle) -
      VIEW_SIZE / 2;
    const y =
      CIRCLE_RADIUS +
      (CIRCLE_RADIUS - VIEW_HEIGHT / 2 - PADDING) * Math.sin(angle) -
      VIEW_HEIGHT / 2;
    const rotation = angle + Math.PI / 2;

    return {
      top: withSpring(y, { damping: 15, stiffness: 200 }),
      left: withSpring(x, { damping: 15, stiffness: 200 }),
      transform: [{ rotate: rotation + "rad" }],
    };
  });

  return (
    <>
      {/* Main indicator */}
      <Animated.View style={[styles.view, animatedStyle]} />
      
      {/* Glow effect */}
      <Animated.View style={[styles.viewGlow, animatedStyle]} />
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    width: VIEW_SIZE,
    height: VIEW_HEIGHT,
    backgroundColor: "#00FFFF",
    position: "absolute",
    borderRadius: VIEW_SIZE / 2,
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  viewGlow: {
    width: VIEW_SIZE * 1.5,
    height: VIEW_HEIGHT * 1.2,
    backgroundColor: "rgba(0, 255, 255, 0.3)",
    position: "absolute",
    borderRadius: VIEW_SIZE,
    left: -VIEW_SIZE * 0.25,
    top: -VIEW_HEIGHT * 0.1,
  },
});

export default DialIndicator;