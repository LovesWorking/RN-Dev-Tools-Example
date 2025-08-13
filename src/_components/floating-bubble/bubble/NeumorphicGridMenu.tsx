import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from "@/src/_shared/icons/lucide-icons";
// Removed BlurView import - not available

interface NeumorphicGridMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function NeumorphicGridMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: NeumorphicGridMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // 3D grid configuration
  const gridSize = 56;
  const gridSpacing = 16;
  const gridColumns = 3;
  const gridRows = 2;
  const totalWidth = gridSize * gridColumns + gridSpacing * (gridColumns - 1);
  const totalHeight = gridSize * gridRows + gridSpacing * (gridRows - 1);

  // Calculate position
  const menuPosition = {
    x: Math.min(buttonPosition.x, screenWidth - totalWidth - 20),
    y: Math.min(buttonPosition.y + 30, screenHeight - totalHeight - 20),
  };

  // Master animations
  const containerScale = useSharedValue(0.8);
  const containerRotation = useSharedValue(-5);
  const backdropOpacity = useSharedValue(0);

  // Individual item animations
  const itemAnimations = [
    {
      scale: useSharedValue(0),
      translateY: useSharedValue(-20),
      brightness: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      translateY: useSharedValue(-20),
      brightness: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      translateY: useSharedValue(-20),
      brightness: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      translateY: useSharedValue(-20),
      brightness: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      translateY: useSharedValue(-20),
      brightness: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      translateY: useSharedValue(-20),
      brightness: useSharedValue(0),
    },
  ];

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.85, { duration: 250 });
    containerScale.value = withSpring(1, {
      damping: 12,
      stiffness: 150,
      mass: 0.8,
    });
    containerRotation.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });

    // Wave animation for items
    itemAnimations.forEach((anim, index) => {
      const row = Math.floor(index / gridColumns);
      const col = index % gridColumns;
      const delay = (row + col) * 50;

      anim.scale.value = withDelay(
        delay,
        withSpring(1, {
          damping: 10,
          stiffness: 200,
          mass: 0.5,
        })
      );

      anim.translateY.value = withDelay(
        delay,
        withSpring(0, {
          damping: 12,
          stiffness: 150,
        })
      );

      anim.brightness.value = withDelay(
        delay,
        withTiming(1, { duration: 300 })
      );
    });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: containerScale.value },
      { perspective: 1000 },
      { rotateY: `${containerRotation.value}deg` },
    ],
    opacity: interpolate(
      containerScale.value,
      [0.8, 1],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Pre-create animated styles for all items
  const itemAnimatedStyles = itemAnimations.map((anim) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: anim.scale.value },
        { translateY: anim.translateY.value },
      ],
      opacity: anim.brightness.value,
    }));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const innerGlow = useAnimatedStyle(() => ({
      opacity: interpolate(
        anim.scale.value,
        [0, 0.9, 1],
        [0, 0.8, 0.4],
        Extrapolate.CLAMP
      ),
    }));

    return { itemStyle, innerGlow };
  });

  const menuItems = [
    {
      onPress: onQueryPress,
      icon: (
        <View style={styles.tanstackWrapper}>
          <TanstackLogo />
        </View>
      ),
      gradient: ["#FF6B6B", "#FF8E8E"],
      shadow: "rgba(255, 107, 107, 0.5)",
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={24} color="white" />,
      gradient: ["#10B981", "#34D399"],
      shadow: "rgba(16, 185, 129, 0.5)",
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={24} color="white" />,
      gradient: ["#EF4444", "#F87171"],
      shadow: "rgba(239, 68, 68, 0.5)",
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={24} color="white" />,
      gradient: ["#3B82F6", "#60A5FA"],
      shadow: "rgba(59, 130, 246, 0.5)",
    },
    {
      onPress: onWifiToggle,
      icon: isWifiEnabled ? (
        <WifiIcon size={24} color="white" />
      ) : (
        <WifiOffIcon size={24} color="white" />
      ),
      gradient: isWifiEnabled ? ["#8B5CF6", "#A78BFA"] : ["#6B7280", "#9CA3AF"],
      shadow: isWifiEnabled
        ? "rgba(139, 92, 246, 0.5)"
        : "rgba(107, 114, 128, 0.5)",
    },
    {
      onPress: onClose,
      icon: <XIcon size={24} color="white" />,
      gradient: ["#EC4899", "#F472B6"],
      shadow: "rgba(236, 72, 153, 0.5)",
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.gridContainer,
          containerStyle,
          {
            right: menuPosition.x,
            bottom: menuPosition.y,
          },
        ]}
      >
        <View style={styles.blurContainer}>
          <View style={styles.gridInner}>
            {menuItems.map((item, index) => {
              const { itemStyle, innerGlow } = itemAnimatedStyles[index];
              return (
                <Animated.View
                  key={index}
                  style={[styles.itemContainer, itemStyle]}
                >
                  <Pressable
                    onPress={item.onPress}
                    onPressIn={() => {
                      itemAnimations[index].scale.value = withSpring(0.92);
                      itemAnimations[index].translateY.value = withSpring(-5);
                    }}
                    onPressOut={() => {
                      itemAnimations[index].scale.value = withSpring(1);
                      itemAnimations[index].translateY.value = withSpring(0);
                    }}
                    style={styles.pressable}
                  >
                    {/* Neumorphic layers */}
                    <View
                      style={[
                        styles.neumorphicOuter,
                        {
                          shadowColor: item.shadow,
                          backgroundColor: item.gradient[0],
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.neumorphicInner,
                          { backgroundColor: item.gradient[1] },
                        ]}
                      >
                        <Animated.View
                          style={[
                            styles.innerGlow,
                            innerGlow,
                            { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                          ]}
                        />
                        {item.icon}
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  gridContainer: {
    position: "absolute",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
  },
  blurContainer: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(20, 20, 20, 0.95)",
  },
  gridInner: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
    backgroundColor: "rgba(20, 20, 20, 0.8)",
  },
  itemContainer: {
    width: 56,
    height: 56,
  },
  pressable: {
    width: "100%",
    height: "100%",
  },
  neumorphicOuter: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    padding: 3,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 12,
  },
  neumorphicInner: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  innerGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 13,
  },
  tanstackWrapper: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
});
