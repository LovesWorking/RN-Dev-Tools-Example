import { ReactNode, useState, useRef } from "react";
import { View, ViewStyle, Pressable, Animated, StyleSheet } from "react-native";

interface CyberpunkButtonOutlineProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  accentColor?: string;
  index?: number;
}

export function CyberpunkButtonOutline({
  children,
  onPress,
  style,
  accentColor = "#00ff88",
  index: _index = 0,
}: CyberpunkButtonOutlineProps) {
  const [, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animatedBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [accentColor + "40", accentColor],
  });

  const animatedShadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.4],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {/* Animated border effect */}
        <Animated.View
          style={[
            styles.borderEffect,
            {
              borderColor: animatedBorderColor,
              shadowColor: accentColor,
              shadowOpacity: animatedShadowOpacity,
            },
          ]}
        />

        {/* Corner accents */}
        <View style={[styles.cornerTL, { backgroundColor: accentColor }]} />
        <View style={[styles.cornerTR, { backgroundColor: accentColor }]} />
        <View style={[styles.cornerBL, { backgroundColor: accentColor }]} />
        <View style={[styles.cornerBR, { backgroundColor: accentColor }]} />

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    height: 64,
  },
  pressable: {
    flex: 1,
    position: "relative",
  },
  borderEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "rgba(0, 255, 136, 0.02)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  cornerTL: {
    position: "absolute",
    top: -1,
    left: -1,
    width: 8,
    height: 2,
  },
  cornerTR: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 8,
    height: 2,
  },
  cornerBL: {
    position: "absolute",
    bottom: -1,
    left: -1,
    width: 2,
    height: 8,
  },
  cornerBR: {
    position: "absolute",
    bottom: -1,
    right: -1,
    width: 2,
    height: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
  },
});