import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from "@/src/_shared/icons/lucide-icons";

interface CyberCascadeMenuProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  buttonPosition?: { x: number; y: number };
}

export function CyberCascadeMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: CyberCascadeMenuProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  // Menu dimensions
  const menuWidth = 240;
  const itemHeight = 65;
  const totalHeight = itemHeight * 6 + 40;

  // Smart positioning - position menu above the button
  const menuX = screenWidth - buttonPosition.x - menuWidth - 20;
  const menuY = buttonPosition.y + 60; // Position above the floating button

  // Core animations
  const backdropOpacity = useSharedValue(0);
  const containerScale = useSharedValue(0);
  const glitchEffect = useSharedValue(0);
  const scanlinePosition = useSharedValue(0);
  const matrixRain = useSharedValue(0);

  // Cascade item animations with cyberpunk enhancements
  const items = Array.from({ length: 6 }, () => ({
    translateX: useSharedValue(-100),
    translateY: useSharedValue(0),
    opacity: useSharedValue(0),
    scale: useSharedValue(0.8),
    rotation: useSharedValue(-15),
    glowIntensity: useSharedValue(0),
    borderGlow: useSharedValue(0),
    glitchX: useSharedValue(0),
    glitchOpacity: useSharedValue(0),
  }));

  // Data stream animations
  const dataStreams = Array.from({ length: 3 }, () => ({
    position: useSharedValue(0),
    opacity: useSharedValue(0),
  }));

  const handleOpen = () => {
    // Backdrop fade in
    backdropOpacity.value = withTiming(0.95, { duration: 300 });
    
    // Container scale with bounce
    containerScale.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );

    // Start continuous effects
    scanlinePosition.value = withRepeat(
      withTiming(1, { 
        duration: 3000,
        easing: Easing.inOut(Easing.quad)
      }),
      -1,
      false
    );

    matrixRain.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      false
    );

    // Glitch effect periodically
    glitchEffect.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2800 }),
        withTiming(1, { duration: 50 }),
        withTiming(0, { duration: 30 }),
        withTiming(0.8, { duration: 40 }),
        withTiming(0, { duration: 80 })
      ),
      -1,
      false
    );

    // Cascading cyberpunk entrance
    items.forEach((item, index) => {
      const delay = index * 80;

      // Slide in from left with rotation
      item.translateX.value = withDelay(
        delay,
        withSequence(
          withTiming(20, { duration: 200 }),
          withSpring(0, { damping: 10, stiffness: 150 })
        )
      );

      // Bounce effect on Y axis
      item.translateY.value = withDelay(
        delay,
        withSequence(
          withTiming(-5, { duration: 150 }),
          withSpring(0, { damping: 8, stiffness: 200 })
        )
      );

      // Fade in with flicker
      item.opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(0.3, { duration: 50 }),
          withTiming(1, { duration: 30 }),
          withTiming(0.5, { duration: 40 }),
          withTiming(1, { duration: 100 })
        )
      );

      // Scale with overshoot
      item.scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1.15, { duration: 150 }),
          withSpring(1, { damping: 10, stiffness: 180 })
        )
      );

      // Rotation unwind
      item.rotation.value = withDelay(
        delay,
        withSpring(0, { damping: 12, stiffness: 120 })
      );

      // Glow pulse
      item.glowIntensity.value = withDelay(
        delay + 200,
        withSequence(
          withTiming(1, { duration: 300 }),
          withTiming(0.3, { duration: 400 })
        )
      );

      // Border glow animation
      item.borderGlow.value = withDelay(
        delay + 100,
        withRepeat(
          withSequence(
            withTiming(0.8, { duration: 1500 }),
            withTiming(0.2, { duration: 1500 })
          ),
          -1,
          true
        )
      );

      // Occasional glitch
      if (index % 2 === 0) {
        item.glitchOpacity.value = withDelay(
          1000 + index * 500,
          withRepeat(
            withSequence(
              withTiming(0, { duration: 2000 }),
              withTiming(1, { duration: 30 }),
              withTiming(0, { duration: 50 })
            ),
            -1,
            false
          )
        );

        item.glitchX.value = withRepeat(
          withSequence(
            withTiming(0, { duration: 2500 }),
            withTiming(5, { duration: 20 }),
            withTiming(-5, { duration: 20 }),
            withTiming(0, { duration: 20 })
          ),
          -1,
          false
        );
      }
    });

    // Start data streams
    dataStreams.forEach((stream, i) => {
      stream.opacity.value = withDelay(
        i * 300,
        withTiming(0.6, { duration: 500 })
      );
      stream.position.value = withDelay(
        i * 300,
        withRepeat(
          withTiming(1, { duration: 3000 }),
          -1,
          false
        )
      );
    });
  };

  useEffect(() => {
    handleOpen();
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: containerScale.value },
      {
        translateX: interpolate(
          glitchEffect.value,
          [0, 0.5, 1],
          [0, -3, 3]
        ),
      },
    ],
    opacity: containerScale.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const scanlineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scanlinePosition.value,
          [0, 1],
          [-itemHeight, totalHeight]
        ),
      },
    ],
    opacity: 0.4,
  }));

  // Pre-create animated styles for items
  const itemAnimatedStyles = items.map((item, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const itemStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: item.translateX.value },
        { translateY: item.translateY.value },
        { scale: item.scale.value },
        { rotate: `${item.rotation.value}deg` },
      ],
      opacity: item.opacity.value,
    }));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const glowStyle = useAnimatedStyle(() => ({
      shadowOpacity: item.glowIntensity.value * 0.8,
      borderColor: `rgba(0, 255, 255, ${item.borderGlow.value})`,
    }));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const glitchStyle = useAnimatedStyle(() => ({
      opacity: item.glitchOpacity.value,
      transform: [{ translateX: item.glitchX.value }],
    }));

    return { itemStyle, glowStyle, glitchStyle };
  });

  const menuItems = [
    {
      onPress: onQueryPress,
      icon: (
        <View style={styles.tanstackWrapper}>
          <TanstackLogo />
        </View>
      ),
      label: "QUERY",
      sublabel: "DATABASE",
      primaryColor: "#FF006E",
      secondaryColor: "#FF4081",
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={18} color="#00FFFF" />,
      label: "ENV",
      sublabel: "SYSTEM",
      primaryColor: "#00FFFF",
      secondaryColor: "#00E5FF",
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={18} color="#FF1744" />,
      label: "SENTRY",
      sublabel: "DEBUG",
      primaryColor: "#FF1744",
      secondaryColor: "#FF5252",
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={18} color="#00FF88" />,
      label: "STORAGE",
      sublabel: "MEMORY",
      primaryColor: "#00FF88",
      secondaryColor: "#00E676",
    },
    {
      onPress: onWifiToggle,
      icon: isWifiEnabled ? (
        <WifiIcon size={18} color="#E040FB" />
      ) : (
        <WifiOffIcon size={18} color="#616161" />
      ),
      label: isWifiEnabled ? "ONLINE" : "OFFLINE",
      sublabel: isWifiEnabled ? "CONNECTED" : "DISABLED",
      primaryColor: isWifiEnabled ? "#E040FB" : "#616161",
      secondaryColor: isWifiEnabled ? "#D500F9" : "#757575",
    },
    {
      onPress: onClose,
      icon: <XIcon size={18} color="#9E9E9E" />,
      label: "EXIT",
      sublabel: "CLOSE",
      primaryColor: "#424242",
      secondaryColor: "#616161",
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
          {
            right: buttonPosition.x + 20,
            bottom: buttonPosition.y + 60,
          },
        ]}
      >
        {/* Matrix rain background effect */}
        <View style={styles.matrixRain}>
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.matrixColumn,
                { left: i * 30, opacity: 0.05 },
              ]}
            >
              <Text style={styles.matrixText}>
                {Math.random() > 0.5 ? "01" : "10"}
              </Text>
            </View>
          ))}
        </View>

        {/* Scanning line */}
        <Animated.View style={[styles.scanline, scanlineStyle]} />

        {/* Gradient background */}
        <LinearGradient
          colors={["rgba(0,0,0,0.98)", "rgba(10,10,10,0.95)", "rgba(20,20,20,0.92)"]}
          style={styles.gradientBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Menu items */}
        <View style={styles.menuInner}>
          {menuItems.map((item, index) => {
            const { itemStyle, glowStyle, glitchStyle } = itemAnimatedStyles[index];

            return (
              <Animated.View key={index} style={[styles.itemWrapper, itemStyle]}>
                {/* Glitch overlay */}
                <Animated.View
                  style={[
                    styles.glitchOverlay,
                    glitchStyle,
                    { backgroundColor: `${item.primaryColor}20` },
                  ]}
                  pointerEvents="none"
                />

                <Pressable
                  onPress={item.onPress}
                  onPressIn={() => {
                    items[index].scale.value = withSpring(0.95);
                    items[index].glowIntensity.value = withTiming(1, { duration: 100 });
                    items[index].glitchOpacity.value = withSequence(
                      withTiming(1, { duration: 20 }),
                      withTiming(0, { duration: 30 })
                    );
                    items[index].glitchX.value = withSequence(
                      withTiming(8, { duration: 20 }),
                      withTiming(-8, { duration: 20 }),
                      withTiming(0, { duration: 20 })
                    );
                  }}
                  onPressOut={() => {
                    items[index].scale.value = withSpring(1);
                    items[index].glowIntensity.value = withTiming(0.3, { duration: 200 });
                  }}
                  style={[
                    styles.menuItem,
                    glowStyle,
                    { shadowColor: item.primaryColor },
                  ]}
                >
                  {/* Cyber border corners */}
                  <View style={[styles.cornerAccent, styles.cornerTL, { backgroundColor: item.primaryColor }]} />
                  <View style={[styles.cornerAccent, styles.cornerTR, { backgroundColor: item.secondaryColor }]} />
                  <View style={[styles.cornerAccent, styles.cornerBL, { backgroundColor: item.secondaryColor }]} />
                  <View style={[styles.cornerAccent, styles.cornerBR, { backgroundColor: item.primaryColor }]} />

                  {/* Content */}
                  <View style={styles.itemContent}>
                    <View style={[styles.iconBox, { borderColor: `${item.primaryColor}40` }]}>
                      {item.icon}
                    </View>

                    <View style={styles.labelContainer}>
                      <Text style={[styles.label, { color: item.primaryColor }]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.sublabel, { color: `${item.primaryColor}99` }]}>
                        {item.sublabel}
                      </Text>
                    </View>

                    {/* Data indicator */}
                    <View style={styles.dataIndicator}>
                      <View style={[styles.dataDot, { backgroundColor: item.primaryColor }]} />
                      <View style={[styles.dataDot, { backgroundColor: item.secondaryColor }]} />
                      <View style={[styles.dataDot, { backgroundColor: item.primaryColor }]} />
                    </View>
                  </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  menu: {
    position: "absolute",
    width: 240,
    backgroundColor: "#0A0A0A",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 255, 0.3)",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
    overflow: "hidden",
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  matrixRain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  matrixColumn: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 20,
  },
  matrixText: {
    color: "#00FF00",
    fontSize: 10,
    fontFamily: "monospace",
    lineHeight: 12,
  },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#00FFFF",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 10,
  },
  menuInner: {
    padding: 8,
    zIndex: 1,
  },
  itemWrapper: {
    marginBottom: 6,
  },
  glitchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    zIndex: 10,
  },
  menuItem: {
    height: 65,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.2)",
    position: "relative",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 10,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 12,
  },
  cornerAccent: {
    position: "absolute",
    width: 12,
    height: 2,
  },
  cornerTL: {
    top: 0,
    left: 0,
    width: 2,
    height: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    width: 2,
    height: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0, 255, 255, 0.05)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: "monospace",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sublabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "monospace",
    marginTop: -2,
  },
  dataIndicator: {
    flexDirection: "row",
    gap: 3,
  },
  dataDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.8,
  },
  tanstackWrapper: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});