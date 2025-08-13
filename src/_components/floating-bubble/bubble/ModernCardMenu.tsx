import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  ChevronRightIcon,
} from "@/src/_shared/icons/lucide-icons";

interface ModernCardMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function ModernCardMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: ModernCardMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const menuWidth = 320;
  const cardHeight = 72;
  const menuHeight = cardHeight * 5 + 32 + 16; // 5 cards + padding

  // Center the menu with slight offset
  const menuPosition = {
    x: (screenWidth - menuWidth) / 2,
    y: (screenHeight - menuHeight) / 2 - 20,
  };

  // Animations
  const backdropOpacity = useSharedValue(0);

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.7, { duration: 200 });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const menuItems = [
    {
      onPress: onQueryPress,
      icon: (
        <View style={styles.tanstackWrapper}>
          <TanstackLogo />
        </View>
      ),
      label: "React Query",
      stats: "Monitor data fetching",
      color: "#FF6B6B",
      bgColor: "rgba(255, 107, 107, 0.1)",
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={24} color="#10B981" />,
      label: "Environment",
      stats: "Manage variables",
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={24} color="#EF4444" />,
      label: "Sentry",
      stats: "Track errors",
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={24} color="#3B82F6" />,
      label: "Storage",
      stats: "Browse local data",
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      onPress: onWifiToggle,
      icon: isWifiEnabled ? (
        <WifiIcon size={24} color="#8B5CF6" />
      ) : (
        <WifiOffIcon size={24} color="#6B7280" />
      ),
      label: "Network",
      stats: isWifiEnabled ? "Online" : "Offline",
      color: isWifiEnabled ? "#8B5CF6" : "#6B7280",
      bgColor: isWifiEnabled
        ? "rgba(139, 92, 246, 0.1)"
        : "rgba(107, 114, 128, 0.1)",
    },
  ];

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      <View
        style={[
          styles.menu,
          {
            left: menuPosition.x,
            top: menuPosition.y,
          },
        ]}
      >
        {menuItems.map((item, index) => (
          <MenuCard
            key={index}
            index={index}
            icon={item.icon}
            label={item.label}
            stats={item.stats}
            bgColor={item.bgColor}
            onPress={item.onPress}
          />
        ))}
      </View>
    </View>
  );
}

interface MenuCardProps {
  index: number;
  icon: React.ReactNode;
  label: string;
  stats: string;
  bgColor: string;
  onPress: () => void;
}

function MenuCard({
  index,
  icon,
  label,
  stats,
  bgColor,
  onPress,
}: MenuCardProps) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      index * 50,
      withSpring(0, { damping: 18, stiffness: 250 })
    );
    opacity.value = withDelay(index * 50, withTiming(1, { duration: 200 }));
  }, [index, opacity, translateY]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={cardStyle}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          {icon}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{label}</Text>
          <Text style={styles.cardStats}>{stats}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <ChevronRightIcon size={18} color="rgba(255, 255, 255, 0.3)" />
        </View>
      </Pressable>
    </Animated.View>
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
    width: 320,
    padding: 16,
    gap: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(26, 26, 26, 0.95)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(75, 85, 99, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardPressed: {
    backgroundColor: "rgba(26, 26, 26, 0.98)",
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardStats: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  tanstackWrapper: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});
