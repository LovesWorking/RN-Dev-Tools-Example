import React, { useRef, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Dimensions,
  Text,
  Animated,
  Easing,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.85, 340);
const ICON_SIZE = 70;

export type IconType = {
  name: string;
  icon: React.ReactNode;
  primaryColor: string;
  secondaryColor: string;
  onPress: () => void;
};

interface Dial2IconProps {
  selectedIcon: number;
  onPress: (index: number) => void;
  icon: IconType;
  index: number;
  totalIcons: number;
  iconsProgress: Animated.Value;
}

const Dial2Icon: React.FC<Dial2IconProps> = ({
  selectedIcon,
  onPress,
  icon,
  index,
  totalIcons,
  iconsProgress,
}) => {
  // Calculate position on the circle - properly centered
  const angle = (index * 2 * Math.PI) / totalIcons - Math.PI / 2;
  const radius = CIRCLE_SIZE / 2 - 50; // Adjusted radius for better fit
  
  // Icon-specific animations
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconGlow = useRef(new Animated.Value(0)).current;
  const hoverScale = useRef(new Animated.Value(1)).current;
  const particleOpacity = useRef(new Animated.Value(0)).current;
  const hologramOffset = useRef(new Animated.Value(0)).current;
  const borderRotation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Staggered icon appearance
    const delay = index * 100;
    
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(iconScale, {
        toValue: 1,
        damping: 10,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Icon glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconGlow, {
          toValue: 1,
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(iconGlow, {
          toValue: 0,
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Holographic float effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(hologramOffset, {
          toValue: 5,
          duration: 3000 + index * 100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(hologramOffset, {
          toValue: -5,
          duration: 3000 + index * 100,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Border rotation
    Animated.loop(
      Animated.timing(borderRotation, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    // Particle effect initialization
    if (index % 2 === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particleOpacity, {
            toValue: 0.8,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particleOpacity, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);
  
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(hoverScale, {
        toValue: 0.9,
        damping: 15,
        stiffness: 400,
        useNativeDriver: true,
      }),
      Animated.timing(iconGlow, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(hoverScale, {
        toValue: 1,
        damping: 10,
        stiffness: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconGlow, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    onPress(index);
  };
  
  // Animated position based on progress
  const animatedX = iconsProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.cos(angle) * radius],
  });
  
  const animatedY = iconsProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.sin(angle) * radius],
  });
  
  const animatedOpacity = iconsProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 1],
  });
  
  const animatedScale = Animated.multiply(
    iconsProgress,
    Animated.multiply(iconScale, hoverScale)
  );
  
  const glowOpacity = iconGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });
  
  const borderRotationStyle = borderRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const isSelected = selectedIcon === index;
  
  return (
    <Animated.View
      style={[
        styles.iconContainer,
        {
          position: 'absolute',
          left: CIRCLE_SIZE / 2 - ICON_SIZE / 2,
          top: CIRCLE_SIZE / 2 - ICON_SIZE / 2,
          transform: [
            { translateX: animatedX },
            { translateY: animatedY },
            { translateY: hologramOffset },
            { scale: animatedScale },
          ],
          opacity: animatedOpacity,
        },
      ]}
    >
      {/* Particle effects */}
      <Animated.View
        style={[
          styles.particleContainer,
          { opacity: particleOpacity },
        ]}
        pointerEvents="none"
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: icon.primaryColor,
                transform: [
                  { rotate: `${i * 120}deg` },
                  { translateX: 25 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>
      
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            borderColor: icon.primaryColor,
            opacity: glowOpacity,
            shadowColor: icon.primaryColor,
          },
        ]}
      />
      
      {/* Rotating border */}
      <Animated.View
        style={[
          styles.rotatingBorder,
          {
            borderColor: icon.secondaryColor,
            transform: [{ rotate: borderRotationStyle }],
          },
        ]}
      >
        {/* Border accents */}
        {Array.from({ length: 4 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.borderAccent,
              {
                backgroundColor: icon.primaryColor,
                transform: [
                  { rotate: `${i * 90}deg` },
                  { translateX: ICON_SIZE / 2 - 2 },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>
      
      {/* Main button */}
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.iconButton,
          {
            backgroundColor: `rgba(0, 10, 20, 0.95)`,
            borderColor: isSelected ? icon.primaryColor : "rgba(255, 255, 255, 0.1)",
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        {/* Holographic background layers */}
        <View style={[styles.hologramBg, { backgroundColor: `${icon.primaryColor}10` }]} />
        <View style={[styles.hologramBg2, { backgroundColor: `${icon.secondaryColor}08` }]} />
        
        {/* Icon content */}
        <View style={styles.iconContent}>
          {icon.icon}
          <Text style={[styles.iconLabel, { color: icon.primaryColor }]}>
            {icon.name}
          </Text>
        </View>
        
        {/* Scan line effect */}
        <View
          style={[
            styles.scanLine,
            { backgroundColor: `${icon.primaryColor}30` },
          ]}
        />
      </Pressable>
      
      {/* Selection indicator */}
      {isSelected && (
        <View style={[styles.selectionRing, { borderColor: icon.primaryColor }]}>
          <View style={[styles.selectionDot, { backgroundColor: icon.primaryColor }]} />
        </View>
      )}
    </Animated.View>
  );
};

export default Dial2Icon;

const styles = StyleSheet.create({
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  particleContainer: {
    position: "absolute",
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  glowRing: {
    position: "absolute",
    width: ICON_SIZE + 20,
    height: ICON_SIZE + 20,
    borderRadius: (ICON_SIZE + 20) / 2,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  rotatingBorder: {
    position: "absolute",
    width: ICON_SIZE + 10,
    height: ICON_SIZE + 10,
    borderRadius: (ICON_SIZE + 10) / 2,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  borderAccent: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  iconButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  hologramBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ICON_SIZE / 2,
  },
  hologramBg2: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: ICON_SIZE / 2,
    transform: [{ scale: 0.9 }],
  },
  iconContent: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  iconLabel: {
    fontSize: 9,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 1,
    marginTop: 4,
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  selectionRing: {
    position: "absolute",
    width: ICON_SIZE + 30,
    height: ICON_SIZE + 30,
    borderRadius: (ICON_SIZE + 30) / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
    top: -3,
  },
});