import React, { useEffect } from "react";
import { StyleSheet, Pressable, View, Text, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { IconType } from "./DialDevTools";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIEW_SIZE = 60;
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 320);
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const START_ANGLE = (-1 * Math.PI) / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  index: number;
  icon: IconType;
  iconsProgress: Animated.SharedValue<number>;
  onPress: (index: number) => void;
  selectedIcon: number;
  totalIcons: number;
};

const DialIcon: React.FC<Props> = ({
  index,
  icon,
  iconsProgress,
  onPress,
  selectedIcon,
  totalIcons,
}) => {
  const ANGLE_PER_VIEW = (2 * Math.PI) / totalIcons;
  const angle = START_ANGLE + ANGLE_PER_VIEW * index;
  
  // Animation values
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  
  const isSelected = selectedIcon === index;
  
  // Handle selection animation
  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.15, {
        damping: 12,
        stiffness: 180,
      });
      glowOpacity.value = withTiming(1, { duration: 300 });
      rotation.value = withSpring(10, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 200,
      });
      glowOpacity.value = withTiming(0, { duration: 300 });
      rotation.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [isSelected]);
  
  // Calculate final position
  const finalX = CIRCLE_RADIUS + (CIRCLE_RADIUS - VIEW_SIZE / 2 - 20) * Math.cos(angle) - VIEW_SIZE / 2;
  const finalY = CIRCLE_RADIUS + (CIRCLE_RADIUS - VIEW_SIZE / 2 - 20) * Math.sin(angle) - VIEW_SIZE / 2;
  
  // Main animated style for position and appearance
  const animatedStyle = useAnimatedStyle(() => {
    const progress = iconsProgress.value;
    
    // Staggered entrance with spiral effect
    const staggerDelay = index * 0.1;
    const staggeredProgress = Math.max(0, Math.min(1, (progress - staggerDelay) / (1 - staggerDelay)));
    
    // Interpolate from center with rotation
    const spiralAngle = angle + (1 - staggeredProgress) * Math.PI * 2;
    const distance = interpolate(staggeredProgress, [0, 1], [0, CIRCLE_RADIUS - VIEW_SIZE / 2 - 20]);
    
    const x = CIRCLE_RADIUS + distance * Math.cos(spiralAngle) - VIEW_SIZE / 2;
    const y = CIRCLE_RADIUS + distance * Math.sin(spiralAngle) - VIEW_SIZE / 2;
    
    return {
      position: 'absolute' as const,
      left: x,
      top: y,
      opacity: interpolate(staggeredProgress, [0, 0.5, 1], [0, 0.3, 1]),
      transform: [
        { scale: scale.value * staggeredProgress },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });
  
  // Glow effect style
  const glowStyle = useAnimatedStyle(() => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: icon.color,
    opacity: glowOpacity.value * 0.2,
    borderRadius: VIEW_SIZE / 2,
    transform: [{ scale: 1.5 }],
  }));
  
  // Hover animation on press in
  const handlePressIn = () => {
    'worklet';
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 400,
    });
  };
  
  const handlePressOut = () => {
    'worklet';
    scale.value = withSpring(isSelected ? 1.15 : 1, {
      damping: 15,
      stiffness: 400,
    });
  };

  return (
    <Animated.View style={[styles.view, animatedStyle]}>
      {/* Glow effect behind icon */}
      <Animated.View style={glowStyle} pointerEvents="none" />
      
      <AnimatedPressable
        onPress={() => onPress(index)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.pressable,
          {
            backgroundColor: isSelected ? icon.color + "20" : "rgba(0,0,0,0.5)",
            borderColor: isSelected ? icon.color : "rgba(0, 255, 255, 0.2)",
            borderWidth: isSelected ? 2 : 1,
          }
        ]}
      >
        {/* Icon with cyberpunk styling */}
        <View style={styles.iconWrapper}>
          {icon.icon}
        </View>
        
        {/* Label with neon effect */}
        <Text style={[
          styles.label,
          { 
            color: isSelected ? icon.color : "#9CA3AF",
            textShadowColor: isSelected ? icon.color : "transparent",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: isSelected ? 8 : 0,
          }
        ]}>
          {icon.name.toUpperCase()}
        </Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  view: {
    width: VIEW_SIZE,
    height: VIEW_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    width: "100%",
    height: "100%",
    borderRadius: VIEW_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  iconWrapper: {
    marginBottom: 2,
  },
  label: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
    fontFamily: "monospace",
    marginTop: 2,
  },
});

export default DialIcon;