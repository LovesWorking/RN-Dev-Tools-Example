import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
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
  ChevronRightIcon,
  ZapIcon,
} from "@/src/_shared/icons/lucide-icons";

interface CascadingDropdownProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function CascadingDropdown({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: CascadingDropdownProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const menuWidth = 190;
  const itemHeight = 48;
  const totalHeight = itemHeight * 5 + 32;

  // Smart positioning
  const getMenuPosition = () => {
    const buttonX = screenWidth - buttonPosition.x;
    const buttonY = screenHeight - buttonPosition.y;

    let menuX = buttonPosition.x + 20;
    let menuY = buttonPosition.y + 20;

    if (buttonX > screenWidth - menuWidth - 30) {
      menuX = buttonPosition.x + menuWidth - 10;
    }

    if (buttonY < totalHeight + 30) {
      menuY = buttonPosition.y - totalHeight + 10;
    }

    return { x: menuX, y: menuY };
  };

  const menuPosition = getMenuPosition();

  // Core animations
  const backdropOpacity = useSharedValue(0);
  const containerHeight = useSharedValue(0);
  const borderAnimation = useSharedValue(0);

  // Item cascade animations
  const items = [
    {
      translateY: useSharedValue(-20),
      translateX: useSharedValue(-10),
      opacity: useSharedValue(0),
      scale: useSharedValue(0.8),
      rotation: useSharedValue(-5),
    },
    {
      translateY: useSharedValue(-20),
      translateX: useSharedValue(-10),
      opacity: useSharedValue(0),
      scale: useSharedValue(0.8),
      rotation: useSharedValue(-5),
    },
    {
      translateY: useSharedValue(-20),
      translateX: useSharedValue(-10),
      opacity: useSharedValue(0),
      scale: useSharedValue(0.8),
      rotation: useSharedValue(-5),
    },
    {
      translateY: useSharedValue(-20),
      translateX: useSharedValue(-10),
      opacity: useSharedValue(0),
      scale: useSharedValue(0.8),
      rotation: useSharedValue(-5),
    },
    {
      translateY: useSharedValue(-20),
      translateX: useSharedValue(-10),
      opacity: useSharedValue(0),
      scale: useSharedValue(0.8),
      rotation: useSharedValue(-5),
    },
  ];

  // Floating particles
  const particles = [
    {
      x: useSharedValue(0),
      y: useSharedValue(0),
      opacity: useSharedValue(0),
    },
    {
      x: useSharedValue(0),
      y: useSharedValue(0),
      opacity: useSharedValue(0),
    },
    {
      x: useSharedValue(0),
      y: useSharedValue(0),
      opacity: useSharedValue(0),
    },
  ];

  const startParticles = () => {
    particles.forEach((particle, i) => {
      const delay = i * 200;
      particle.opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(0.6, { duration: 300 }),
          withTiming(0, { duration: 1000 })
        )
      );
      particle.x.value = withDelay(
        delay,
        withTiming((Math.random() - 0.5) * 100, { duration: 1300 })
      );
      particle.y.value = withDelay(
        delay,
        withTiming(-50 - Math.random() * 50, { duration: 1300 })
      );
    });
  };

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.7, { duration: 200 });
    containerHeight.value = withSpring(totalHeight, {
      damping: 12,
      stiffness: 180,
    });
    borderAnimation.value = withTiming(1, { duration: 600 });

    // Cascading wave effect
    items.forEach((item, index) => {
      const delay = index * 70;

      item.translateY.value = withDelay(
        delay,
        withSpring(0, {
          damping: 14,
          stiffness: 200,
          velocity: 2,
        })
      );

      item.translateX.value = withDelay(
        delay,
        withSpring(0, {
          damping: 16,
          stiffness: 180,
        })
      );

      item.opacity.value = withDelay(delay, withTiming(1, { duration: 250 }));

      item.scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.05, { damping: 8, stiffness: 200 }),
          withSpring(1, { damping: 12, stiffness: 180 })
        )
      );

      item.rotation.value = withDelay(
        delay,
        withSpring(0, { damping: 10, stiffness: 150 })
      );
    });

    startParticles();
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    height: containerHeight.value,
    opacity: interpolate(
      containerHeight.value,
      [0, totalHeight],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuBorderStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(255, 255, 255, ${interpolate(
      borderAnimation.value,
      [0, 1],
      [0, 0.3],
      Extrapolate.CLAMP
    )})`,
  }));

  // Pre-create animated styles for particles
  const particleAnimatedStyles = particles.map((particle) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const particleStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: particle.x.value },
        { translateY: particle.y.value },
      ],
      opacity: particle.opacity.value,
    }));
    return particleStyle;
  });

  // Pre-create animated styles for menu items
  const itemAnimatedStyles = items.map((item) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemStyle = useAnimatedStyle(() => ({
      transform: [
        { translateY: item.translateY.value },
        { translateX: item.translateX.value },
        { scale: item.scale.value },
        { rotate: `${item.rotation.value}deg` },
      ],
      opacity: item.opacity.value,
    }));
    return itemStyle;
  });

  const menuItems = [
    {
      onPress: onQueryPress,
      icon: (
        <View style={styles.tanstackWrapper}>
          <TanstackLogo />
        </View>
      ),
      label: "React Query",
      badge: "●",
      badgeColor: "#10B981",
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={17} color="#10B981" />,
      label: "Environment",
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={17} color="#EF4444" />,
      label: "Sentry",
      badge: "3",
      badgeColor: "#EF4444",
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={17} color="#3B82F6" />,
      label: "Storage",
    },
    {
      onPress: onWifiToggle,
      icon: isWifiEnabled ? (
        <WifiIcon size={17} color="#8B5CF6" />
      ) : (
        <WifiOffIcon size={17} color="#6B7280" />
      ),
      label: isWifiEnabled ? "Disable WiFi" : "Enable WiFi",
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.menu,
          containerStyle,
          menuBorderStyle,
          {
            right: menuPosition.x,
            bottom: menuPosition.y,
          },
        ]}
      >
        {/* Floating particles */}
        {particles.map((particle, i) => {
          const particleStyle = particleAnimatedStyles[i];
          return (
            <Animated.View key={i} style={[styles.particle, particleStyle]}>
              <ZapIcon size={12} color="#FFD700" />
            </Animated.View>
          );
        })}

        <View style={styles.menuInner}>
          {menuItems.map((item, index) => {
            const itemStyle = itemAnimatedStyles[index];
            return (
              <Animated.View key={index} style={itemStyle}>
                <Pressable
                  onPress={item.onPress}
                  onPressIn={() => {
                    items[index].scale.value = withSpring(0.95);
                    items[index].translateX.value = withSpring(2);
                  }}
                  onPressOut={() => {
                    items[index].scale.value = withSpring(1);
                    items[index].translateX.value = withSpring(0);
                  }}
                  style={({ pressed }) => [
                    styles.menuItem,
                    pressed && styles.menuItemPressed,
                    index === 0 && styles.firstItem,
                    index === menuItems.length - 1 && styles.lastItem,
                  ]}
                >
                  <View style={styles.iconBox}>{item.icon}</View>

                  <Text style={styles.label}>{item.label}</Text>

                  {item.badge && (
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: item.badgeColor },
                      ]}
                    >
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}

                  <ChevronRightIcon
                    size={12}
                    color="rgba(255, 255, 255, 0.3)"
                  />
                </Pressable>
              </Animated.View>
            );
          })}
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
  menu: {
    position: "absolute",
    width: 190,
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
    overflow: "hidden",
  },
  menuInner: {
    padding: 6,
  },
  particle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    marginBottom: 4,
  },
  menuItemPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  firstItem: {
    marginTop: 0,
  },
  lastItem: {
    marginBottom: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    marginTop: 4,
    paddingTop: 4,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  label: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  tanstackWrapper: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
