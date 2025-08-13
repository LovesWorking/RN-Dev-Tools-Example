import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
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

interface MagneticGridMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function MagneticGridMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: MagneticGridMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Grid configuration - hexagonal layout
  const centerX = screenWidth - buttonPosition.x;
  const centerY = screenHeight - buttonPosition.y;

  // Animation values for each item
  const items = [
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      translateX: useSharedValue(0),
      translateY: useSharedValue(0),
      opacity: useSharedValue(0),
      magnetX: useSharedValue(0),
      magnetY: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      translateX: useSharedValue(0),
      translateY: useSharedValue(0),
      opacity: useSharedValue(0),
      magnetX: useSharedValue(0),
      magnetY: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      translateX: useSharedValue(0),
      translateY: useSharedValue(0),
      opacity: useSharedValue(0),
      magnetX: useSharedValue(0),
      magnetY: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      translateX: useSharedValue(0),
      translateY: useSharedValue(0),
      opacity: useSharedValue(0),
      magnetX: useSharedValue(0),
      magnetY: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      translateX: useSharedValue(0),
      translateY: useSharedValue(0),
      opacity: useSharedValue(0),
      magnetX: useSharedValue(0),
      magnetY: useSharedValue(0),
    },
    {
      scale: useSharedValue(0),
      rotation: useSharedValue(0),
      translateX: useSharedValue(0),
      translateY: useSharedValue(0),
      opacity: useSharedValue(0),
      magnetX: useSharedValue(0),
      magnetY: useSharedValue(0),
    },
  ];

  const backdropOpacity = useSharedValue(0);
  const centralPulse = useSharedValue(1);

  // Hexagon positions around center
  const getHexPosition = (index: number) => {
    const angle = (index * Math.PI * 2) / 6;
    const radius = 80;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.7, { duration: 200 });

    // Central pulse effect
    centralPulse.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );

    // Staggered magnetic appearance
    items.forEach((item, index) => {
      const pos = getHexPosition(index);
      const delay = index * 40;

      // Start from random positions
      item.translateX.value = (Math.random() - 0.5) * 200;
      item.translateY.value = (Math.random() - 0.5) * 200;

      // Magnetic attraction to final position
      item.translateX.value = withDelay(
        delay,
        withSpring(pos.x, {
          damping: 12,
          stiffness: 180,
          mass: 0.5,
        })
      );

      item.translateY.value = withDelay(
        delay,
        withSpring(pos.y, {
          damping: 12,
          stiffness: 180,
          mass: 0.5,
        })
      );

      item.scale.value = withDelay(
        delay,
        withSpring(1, {
          damping: 10,
          stiffness: 200,
        })
      );

      item.rotation.value = withDelay(
        delay,
        withSequence(
          withTiming(360, { duration: 400 }),
          withTiming(0, { duration: 0 })
        )
      );

      item.opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Pre-create animated styles for all items
  const itemAnimatedStyles = items.map((item, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: item.translateX.value + item.magnetX.value },
          { translateY: item.translateY.value + item.magnetY.value },
          { scale: item.scale.value },
          { rotate: `${item.rotation.value}deg` },
        ],
        opacity: item.opacity.value,
      };
    });

    return { animatedStyle };
  });

  const menuItems = [
    {
      onPress: onQueryPress,
      icon: (
        <View style={styles.tanstackContainer}>
          <TanstackLogo />
        </View>
      ),
      label: "Query",
      color: "#FF6B6B",
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={20} color="#10B981" />,
      label: "Env",
      color: "#10B981",
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={20} color="#EF4444" />,
      label: "Sentry",
      color: "#EF4444",
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={20} color="#3B82F6" />,
      label: "Storage",
      color: "#3B82F6",
    },
    {
      onPress: onWifiToggle,
      icon: isWifiEnabled ? (
        <WifiIcon size={20} color="#8B5CF6" />
      ) : (
        <WifiOffIcon size={20} color="#6B7280" />
      ),
      label: isWifiEnabled ? "WiFi" : "Offline",
      color: isWifiEnabled ? "#8B5CF6" : "#6B7280",
    },
    {
      onPress: onClose,
      icon: <XIcon size={20} color="#64748B" />,
      label: "Close",
      color: "#64748B",
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <View
        style={[
          styles.menuContainer,
          {
            right: buttonPosition.x - 40,
            bottom: buttonPosition.y - 40,
          },
        ]}
      >
        {menuItems.map((item, index) => {
          const { animatedStyle } = itemAnimatedStyles[index];

          return (
            <Animated.View
              key={index}
              style={[styles.itemWrapper, animatedStyle]}
            >
              <Pressable
                onPress={item.onPress}
                onPressIn={() => {
                  items[index].scale.value = withSpring(0.9);
                  items[index].magnetX.value = withSpring(
                    (Math.random() - 0.5) * 4
                  );
                  items[index].magnetY.value = withSpring(
                    (Math.random() - 0.5) * 4
                  );
                }}
                onPressOut={() => {
                  items[index].scale.value = withSpring(1);
                  items[index].magnetX.value = withSpring(0);
                  items[index].magnetY.value = withSpring(0);
                }}
                style={styles.hexItem}
              >
                <View style={styles.iconWrapper}>{item.icon}</View>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  menuContainer: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  itemWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  hexItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  tanstackContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
