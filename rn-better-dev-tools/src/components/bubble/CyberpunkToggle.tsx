import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

interface CyberpunkToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  size?: "small" | "medium";
}

export const CyberpunkToggle: React.FC<CyberpunkToggleProps> = ({
  value,
  onValueChange,
  activeColor = gameUIColors.primary,
  inactiveColor = gameUIColors.muted,
  size = "small",
}) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animatedValue, {
        toValue: value ? 1 : 0,
        friction: 8,
        tension: 40,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [value]);

  const isSmall = size === "small";
  const width = isSmall ? 56 : 72;
  const height = isSmall ? 24 : 30;
  const fontSize = isSmall ? 8 : 10;

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [gameUIColors.blackTint2, activeColor + "20"],
  });

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor + "40", activeColor],
  });

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={[styles.container, { width, height }]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor,
            borderColor,
            height,
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            styles.glow,
            {
              backgroundColor: activeColor,
              opacity: glowOpacity,
            },
          ]}
        />

        {/* ON/OFF Text */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              styles.textOff,
              { fontSize },
              !value && styles.textActive,
            ]}
          >
            OFF
          </Text>
          <Text
            style={[
              styles.text,
              styles.textOn,
              { fontSize },
              value && styles.textActive,
            ]}
          >
            ON
          </Text>
        </View>

        {/* Sliding indicator */}
        <Animated.View
          style={[
            styles.indicator,
            {
              width: height - 4,
              height: height - 4,
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [2, width - height + 2],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.indicatorInner,
              {
                backgroundColor: value ? activeColor : inactiveColor,
              },
            ]}
          />
        </Animated.View>

        {/* Corner decorations */}
        <View style={[styles.corner, styles.cornerTopLeft]} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  track: {
    borderRadius: 4,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  text: {
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
    opacity: 0.3,
  },
  textOff: {
    color: gameUIColors.muted,
  },
  textOn: {
    color: gameUIColors.primary,
  },
  textActive: {
    opacity: 1,
  },
  indicator: {
    position: "absolute",
    top: 2,
    backgroundColor: gameUIColors.blackTint1,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: gameUIColors.border + "60",
  },
  indicatorInner: {
    flex: 1,
    borderRadius: 1,
    margin: 2,
  },
  corner: {
    position: "absolute",
    width: 4,
    height: 4,
    borderColor: gameUIColors.primary + "40",
  },
  cornerTopLeft: {
    top: -1,
    left: -1,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerTopRight: {
    top: -1,
    right: -1,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  cornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  cornerBottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
});