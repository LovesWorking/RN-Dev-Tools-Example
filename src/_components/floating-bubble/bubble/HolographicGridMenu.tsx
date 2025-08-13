import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  Extrapolate,
} from "react-native-reanimated";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  ZapIcon,
} from "@/src/_shared/icons/lucide-icons";
// Removed expo-linear-gradient - not available

interface HolographicGridMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function HolographicGridMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: HolographicGridMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Futuristic grid layout
  const gridSize = 60;
  const gridGap = 12;
  const totalWidth = gridSize * 3 + gridGap * 2;
  const totalHeight = gridSize * 2 + gridGap;

  const menuPosition = {
    x: Math.min(buttonPosition.x, screenWidth - totalWidth - 30),
    y: Math.min(buttonPosition.y + 40, screenHeight - totalHeight - 30),
  };

  // Core animations
  const backdropOpacity = useSharedValue(0);
  const hologramPhase = useSharedValue(0);
  const scanlinePosition = useSharedValue(0);
  const glitchOffset = useSharedValue(0);

  // Item animations
  const items = [
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      opacity: useSharedValue(0),
      hologramIntensity: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      opacity: useSharedValue(0),
      hologramIntensity: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      opacity: useSharedValue(0),
      hologramIntensity: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      opacity: useSharedValue(0),
      hologramIntensity: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      opacity: useSharedValue(0),
      hologramIntensity: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      opacity: useSharedValue(0),
      hologramIntensity: useSharedValue(0),
    },
  ];

  const startHolographicEffect = () => {
    // Continuous hologram animation
    hologramPhase.value = withRepeat(
      withTiming(360, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Scanline effect
    scanlinePosition.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Occasional glitch
    const glitchAnimation = () => {
      glitchOffset.value = withSequence(
        withTiming(5, { duration: 50 }),
        withTiming(-5, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      setTimeout(glitchAnimation, Math.random() * 3000 + 2000);
    };
    setTimeout(glitchAnimation, 1000);
  };

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.9, { duration: 300 });
    startHolographicEffect();

    // Staggered holographic materialization
    items.forEach((item, index) => {
      const delay = index * 80;

      item.rotation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(720, {
          duration: 600 + delay,
          easing: Easing.out(Easing.cubic),
        })
      );

      item.scale.value = withDelay(
        delay,
        withSpring(1, {
          damping: 8,
          stiffness: 150,
          mass: 0.5,
          velocity: 2,
        })
      );

      item.opacity.value = withDelay(
        delay,
        withTiming(1, {
          duration: 400,
        })
      );

      item.hologramIntensity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.7, { duration: 500 })
        ),
        -1,
        true
      );
    });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scanlinePosition.value,
          [0, 1],
          [-totalHeight, totalHeight],
          Extrapolate.CLAMP
        ),
      },
    ],
    opacity: 0.3,
  }));

  const glitchStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: glitchOffset.value }],
  }));

  // Pre-create animated styles for all items
  const itemAnimatedStyles = items.map((item, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemStyle = useAnimatedStyle(() => {
      const phase = interpolate(
        hologramPhase.value,
        [0, 360],
        [0, Math.PI * 2]
      );

      return {
        transform: [
          { scale: item.scale.value },
          { rotateY: `${item.rotation.value}deg` },
          { rotateZ: `${Math.sin(phase + index) * 3}deg` },
        ],
        opacity: item.opacity.value,
      };
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const hologramStyle = useAnimatedStyle(() => ({
      opacity: item.hologramIntensity.value * 0.6,
    }));

    return { itemStyle, hologramStyle };
  });

  const menuItems = [
    {
      onPress: onQueryPress,
      icon: (
        <View style={styles.tanstackWrapper}>
          <TanstackLogo />
        </View>
      ),
      colors: ["#FF00FF", "#00FFFF", "#FF00FF"],
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={26} color="white" />,
      colors: ["#00FF00", "#00FFFF", "#00FF00"],
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={26} color="white" />,
      colors: ["#FF0000", "#FF00FF", "#FF0000"],
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={26} color="white" />,
      colors: ["#0080FF", "#00FFFF", "#0080FF"],
    },
    {
      onPress: onWifiToggle,
      icon: isWifiEnabled ? (
        <WifiIcon size={26} color="white" />
      ) : (
        <WifiOffIcon size={26} color="white" />
      ),
      colors: isWifiEnabled
        ? ["#8000FF", "#FF00FF", "#8000FF"]
        : ["#808080", "#C0C0C0", "#808080"],
    },
    {
      onPress: onClose,
      icon: <ZapIcon size={26} color="white" />,
      colors: ["#FFFF00", "#00FFFF", "#FFFF00"],
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.hologramContainer,
          glitchStyle,
          {
            right: menuPosition.x,
            bottom: menuPosition.y,
          },
        ]}
      >
        {/* Holographic frame */}
        <View style={styles.hologramFrame}>
          <View style={styles.hologramGradient} />

          {/* Scanline */}
          <Animated.View style={[styles.scanline, scanlineStyle]} />

          {/* Grid items */}
          <View style={styles.grid}>
            {menuItems.map((item, index) => {
              const { itemStyle, hologramStyle } = itemAnimatedStyles[index];
              return (
                <Animated.View
                  key={index}
                  style={[styles.itemContainer, itemStyle]}
                >
                  <Pressable
                    onPress={item.onPress}
                    onPressIn={() => {
                      items[index].scale.value = withSpring(0.85);
                    }}
                    onPressOut={() => {
                      items[index].scale.value = withSpring(1);
                    }}
                    style={styles.itemPressable}
                  >
                    <View
                      style={[
                        styles.itemGradient,
                        { borderColor: item.colors[0] },
                      ]}
                    >
                      <View style={styles.itemInner}>{item.icon}</View>

                      {/* Holographic overlay */}
                      <Animated.View
                        style={[styles.hologramOverlay, hologramStyle]}
                      >
                        <View
                          style={[
                            StyleSheet.absoluteFillObject,
                            { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                          ]}
                        />
                      </Animated.View>
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
  hologramContainer: {
    position: "absolute",
  },
  hologramFrame: {
    borderRadius: 20,
    padding: 3,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.3)",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 25,
  },
  hologramGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 17,
    opacity: 0.3,
    backgroundColor: "rgba(0, 255, 255, 0.1)",
  },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(0, 255, 255, 0.5)",
    zIndex: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
    backgroundColor: "transparent",
  },
  itemContainer: {
    width: 60,
    height: 60,
  },
  itemPressable: {
    width: "100%",
    height: "100%",
  },
  itemGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
  },
  itemInner: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  hologramOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  tanstackWrapper: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
