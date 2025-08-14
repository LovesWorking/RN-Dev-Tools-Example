import React, { useEffect } from "react";
import { View, Pressable, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { CyberpunkGlitchBackground } from "./CyberpunkGlitchBackground";
import { TanstackLogo, ReactQueryButtonNative } from "@/src/_sections/react-query/components/query-browser/svgs";
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

export function CyberpunkGridMenu({
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

  const centerX = screenWidth - buttonPosition.x;
  const centerY = screenHeight - buttonPosition.y;

  const items = Array.from({ length: 6 }, () => ({
    scale: useSharedValue(0),
    rotation: useSharedValue(0),
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    opacity: useSharedValue(0),
    glitch: useSharedValue(0),
    magnetX: useSharedValue(0),
    magnetY: useSharedValue(0),
    pulse: useSharedValue(0),
    shadowIntensity: useSharedValue(0),
    matrixGlow: useSharedValue(0),
    glitchX: useSharedValue(0),
    glitchY: useSharedValue(0),
    glitchOpacity: useSharedValue(0),
    glitchScale: useSharedValue(1),
  }));

  const backdropOpacity = useSharedValue(0);
  const scanlinePosition = useSharedValue(0);
  const glitchEffect = useSharedValue(0);

  const getHexPosition = (index: number) => {
    const angle = (index * Math.PI * 2) / 6;
    const radius = 120; // Increased spacing between buttons
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const handleOpen = () => {
    backdropOpacity.value = withTiming(0.9, { duration: 300 });

    // Start scanline animation
    scanlinePosition.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true
    );

    // Periodic glitch effect
    glitchEffect.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 3000 }),
        withTiming(1, { duration: 30 }),
        withTiming(0, { duration: 20 }),
        withTiming(1, { duration: 40 }),
        withTiming(0, { duration: 30 })
      ),
      -1,
      false
    );

    // Staggered cyber appearance with Matrix-style entry
    items.forEach((item, index) => {
      const pos = getHexPosition(index);
      const delay = index * 80;

      // Matrix digital rain entry
      item.translateX.value = pos.x;
      item.translateY.value = -screenHeight;

      // Epic entrance animation
      item.translateY.value = withDelay(
        delay,
        withSequence(
          withTiming(pos.y + 100, {
            duration: 400,
            easing: Easing.in(Easing.quad),
          }),
          withSpring(pos.y, {
            damping: 6,
            stiffness: 120,
            mass: 0.4,
            velocity: 10,
          })
        )
      );

      item.scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1.5, { duration: 200 }),
          withTiming(0.8, { duration: 100 }),
          withSpring(1, {
            damping: 8,
            stiffness: 180,
          })
        )
      );

      item.rotation.value = withDelay(
        delay,
        withSequence(
          withTiming(720, { duration: 500, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 0 })
        )
      );

      item.opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(0.2, { duration: 50 }),
          withTiming(1, { duration: 30 }),
          withTiming(0.4, { duration: 40 }),
          withTiming(1, { duration: 50 }),
          withTiming(0.6, { duration: 30 }),
          withTiming(1, { duration: 100 })
        )
      );

      // Shadow intensity animation
      item.shadowIntensity.value = withDelay(
        delay + 200,
        withSpring(1, {
          damping: 10,
          stiffness: 100,
        })
      );

      // Simplified pulse - only for first 3 items
      if (index < 3) {
        item.pulse.value = withDelay(
          delay + 300,
          withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
          )
        );
      }

      // Simplified Matrix glow - less frequent
      if (index === 0 || index === 3) {
        // Only glow 2 items
        item.matrixGlow.value = withDelay(
          delay + 400,
          withRepeat(
            withSequence(
              withTiming(0, { duration: 4000 }),
              withTiming(1, { duration: 300 }),
              withTiming(0, { duration: 300 })
            ),
            -1,
            false
          )
        );
      }

      // Advanced glitch effect animation
      item.glitchOpacity.value = withDelay(
        delay + 500,
        withRepeat(
          withSequence(
            withTiming(0, { duration: 3000 + index * 500 }),
            withTiming(1, { duration: 50 }),
            withTiming(0, { duration: 30 }),
            withTiming(0.8, { duration: 40 }),
            withTiming(0, { duration: 20 }),
            withTiming(0.6, { duration: 30 }),
            withTiming(0, { duration: 50 })
          ),
          -1,
          false
        )
      );

      // Glitch displacement animation
      item.glitchX.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 4000 + index * 300 }),
          withTiming(5, { duration: 20 }),
          withTiming(-5, { duration: 20 }),
          withTiming(3, { duration: 20 }),
          withTiming(0, { duration: 20 })
        ),
        -1,
        false
      );

      item.glitchY.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 3500 + index * 400 }),
          withTiming(-3, { duration: 30 }),
          withTiming(2, { duration: 20 }),
          withTiming(0, { duration: 30 })
        ),
        -1,
        false
      );

      // Glitch scale effect
      item.glitchScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 5000 + index * 200 }),
          withTiming(1.02, { duration: 20 }),
          withTiming(0.98, { duration: 20 }),
          withTiming(1, { duration: 20 })
        ),
        -1,
        false
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
          [-100, screenHeight + 100]
        ),
      },
    ],
    opacity: 0.3,
  }));

  const itemAnimatedStyles = items.map((item) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const animatedStyle = useAnimatedStyle(() => {
      const pulseScale = interpolate(item.pulse.value, [0, 1], [1, 1.05]);

      return {
        transform: [
          { translateX: item.translateX.value + item.magnetX.value },
          { translateY: item.translateY.value + item.magnetY.value },
          { scale: item.scale.value * pulseScale },
          { rotate: `${item.rotation.value}deg` },
        ],
        opacity: item.opacity.value,
      };
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const shadowStyle = useAnimatedStyle(() => {
      const intensity = item.shadowIntensity.value;
      const glow = item.matrixGlow.value;

      return {
        shadowOpacity: intensity * (0.8 + glow * 0.2),
        shadowRadius: 20 + glow * 30,
        elevation: 15 + glow * 10,
      };
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const glitchStyle = useAnimatedStyle(() => {
      return {
        opacity: item.glitchOpacity.value,
        transform: [
          { translateX: item.glitchX.value },
          { translateY: item.glitchY.value },
          { scale: item.glitchScale.value },
        ],
      };
    });

    return { animatedStyle, shadowStyle, glitchStyle };
  });

  const menuItems = [
    {
      onPress: onQueryPress,
      icon: (
        <View style={styles.tanstackContainer}>
          <TanstackLogo />
        </View>
      ),
      label: "QUERY",
      sublabel: "DATABASE",
      primaryColor: "#FF006E",
      secondaryColor: "#FF4081",
      accentColor: "#FF80AB",
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={18} color="#00FFFF" />,
      label: "ENV",
      sublabel: "SYSTEM",
      primaryColor: "#00FFFF",
      secondaryColor: "#00E5FF",
      accentColor: "#84FFFF",
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={18} color="#FF1744" />,
      label: "SENTRY",
      sublabel: "DEBUG",
      primaryColor: "#FF1744",
      secondaryColor: "#FF5252",
      accentColor: "#FF8A80",
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={18} color="#00FF88" />,
      label: "STORAGE",
      sublabel: "MEMORY",
      primaryColor: "#00FF88",
      secondaryColor: "#00E676",
      accentColor: "#69F0AE",
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
      accentColor: isWifiEnabled ? "#EA80FC" : "#9E9E9E",
    },
    {
      onPress: onClose,
      icon: <XIcon size={18} color="#9E9E9E" />,
      label: "EXIT",
      sublabel: "CLOSE",
      primaryColor: "#424242",
      secondaryColor: "#616161",
      accentColor: "#757575",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Background with Matrix Bubbles */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* Cyberpunk glitch background */}
      <CyberpunkGlitchBackground />

      <View
        style={[
          styles.menuContainer,
          {
            right: buttonPosition.x + 20, // Keep menu fully on screen
            bottom: buttonPosition.y + 20,
          },
        ]}
      >
        {/* Test ReactQueryButton in center */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: 105,
              height: 65,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Pressable
            onPress={() => {
              console.log("ReactQueryButton pressed!");
              onQueryPress();
            }}
            style={{ width: 105, height: 65 }}
          >
            <ReactQueryButtonNative />
          </Pressable>
        </Animated.View>

        {menuItems.map((item, index) => {
          const { animatedStyle, shadowStyle, glitchStyle } =
            itemAnimatedStyles[index];

          return (
            <Animated.View
              key={index}
              style={[styles.itemWrapper, animatedStyle]}
            >
              {/* Epic neo-morphic shadow layers */}
              <Animated.View
                style={[
                  styles.shadowLayer,
                  styles.shadowLayerDark,
                  shadowStyle,
                  {
                    shadowColor: "#000000",
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.shadowLayer,
                  styles.shadowLayerLight,
                  shadowStyle,
                  {
                    shadowColor: item.primaryColor,
                  },
                ]}
              />

              {/* Multi-layer neo-morphic glow effect */}
              <Animated.View
                style={[
                  styles.outerGlow,
                  shadowStyle,
                  {
                    shadowColor: item.primaryColor,
                    backgroundColor: `${item.primaryColor}08`,
                  },
                ]}
              />

              {/* Additional glow ring */}
              <Animated.View
                style={[
                  styles.glowRing,
                  shadowStyle,
                  {
                    borderColor: `${item.primaryColor}40`,
                    shadowColor: item.primaryColor,
                  },
                ]}
              />

              <Pressable
                onPress={item.onPress}
                onPressIn={() => {
                  items[index].scale.value = withSequence(
                    withTiming(0.85, { duration: 50 }),
                    withTiming(1.15, { duration: 60 }),
                    withTiming(0.92, { duration: 40 })
                  );
                  items[index].magnetX.value = withSpring(
                    (Math.random() - 0.5) * 10
                  );
                  items[index].magnetY.value = withSpring(
                    (Math.random() - 0.5) * 10
                  );
                  items[index].matrixGlow.value = withSequence(
                    withTiming(1, { duration: 100 }),
                    withTiming(0, { duration: 400 })
                  );
                  // Intense glitch on press
                  items[index].glitchOpacity.value = withSequence(
                    withTiming(1, { duration: 20 }),
                    withTiming(0, { duration: 30 }),
                    withTiming(0.9, { duration: 20 }),
                    withTiming(0, { duration: 40 }),
                    withTiming(0.7, { duration: 30 }),
                    withTiming(0, { duration: 50 })
                  );
                  items[index].glitchX.value = withSequence(
                    withTiming(8, { duration: 20 }),
                    withTiming(-8, { duration: 20 }),
                    withTiming(5, { duration: 20 }),
                    withTiming(0, { duration: 30 })
                  );
                  items[index].glitchScale.value = withSequence(
                    withTiming(1.05, { duration: 20 }),
                    withTiming(0.95, { duration: 20 }),
                    withTiming(1, { duration: 30 })
                  );
                }}
                onPressOut={() => {
                  items[index].scale.value = withSpring(1);
                  items[index].magnetX.value = withSpring(0);
                  items[index].magnetY.value = withSpring(0);
                }}
                style={styles.hexItem}
              >
                <View style={styles.innerGradient}>
                  {/* Gradient effect layers */}
                  <View style={styles.gradientLayer1} />
                  <View style={styles.gradientLayer2} />

                  {/* Glitch overlay layer */}
                  <Animated.View
                    style={[
                      styles.glitchOverlay,
                      glitchStyle,
                      {
                        backgroundColor: `${item.primaryColor}20`,
                        borderColor: item.primaryColor,
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <View style={styles.glitchContent}>
                      {item.icon}
                      <Text
                        style={[
                          styles.glitchText,
                          { color: item.primaryColor },
                        ]}
                      >
                        {"_"}
                        {item.label}
                        {"_"}
                      </Text>
                    </View>
                  </Animated.View>

                  {/* Cyber border with corner accents */}
                  <View
                    style={[
                      styles.cyberBorder,
                      {
                        borderColor: `${item.primaryColor}80`,
                        shadowColor: item.primaryColor,
                      },
                    ]}
                  >
                    {/* Corner accent pieces */}
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerTL,
                        { backgroundColor: item.primaryColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerTR,
                        { backgroundColor: item.secondaryColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerBL,
                        { backgroundColor: item.secondaryColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerBR,
                        { backgroundColor: item.primaryColor },
                      ]}
                    />

                    {/* Scanning line effect */}
                    <View
                      style={[
                        styles.scanEffect,
                        { backgroundColor: `${item.accentColor}30` },
                      ]}
                    />

                    {/* Content container */}
                    <View style={styles.contentContainer}>
                      {/* Icon without background, just glow */}
                      <View style={styles.iconWrapper}>{item.icon}</View>

                      {/* Matrix-style text labels */}
                      <View style={styles.labelContainer}>
                        <Text
                          style={[styles.label, { color: item.primaryColor }]}
                        >
                          {item.label}
                        </Text>
                        <Text
                          style={[styles.sublabel, { color: item.accentColor }]}
                        >
                          {item.sublabel}
                        </Text>
                      </View>
                    </View>

                    {/* Data stream effect */}
                    <View style={styles.dataStream}>
                      <Text
                        style={[
                          styles.dataStreamText,
                          { color: `${item.primaryColor}40` },
                        ]}
                      >
                        {"010101"}
                      </Text>
                    </View>
                  </View>
                </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.95)",
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
    shadowRadius: 20,
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 0.02,
    backgroundImage: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 30px,
      rgba(0, 255, 255, 0.05) 30px,
      rgba(0, 255, 255, 0.05) 31px
    ), repeating-linear-gradient(
      90deg,
      transparent,
      transparent 30px,
      rgba(255, 0, 110, 0.05) 30px,
      rgba(255, 0, 110, 0.05) 31px
    )`,
  },
  menuContainer: {
    position: "absolute",
    width: 280,
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  itemWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  hexItem: {
    width: 105,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  innerGradient: {
    width: 105,
    height: 65,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.98)",
    position: "relative",
  },
  gradientLayer1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10,10,10,0.95)",
    opacity: 0.7,
  },
  gradientLayer2: {
    position: "absolute",
    top: "30%",
    left: "30%",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20,20,20,0.92)",
    opacity: 0.5,
    borderTopLeftRadius: 50,
  },
  cyberBorder: {
    width: 101,
    height: 61,
    borderWidth: 1.5,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 15,
    overflow: "hidden",
  },
  shadowLayer: {
    position: "absolute",
    width: 105,
    height: 65,
    borderRadius: 8,
  },
  shadowLayerDark: {
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  shadowLayerLight: {
    shadowOffset: { width: -4, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  outerGlow: {
    position: "absolute",
    width: 115,
    height: 75,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
  },
  glowRing: {
    position: "absolute",
    width: 108,
    height: 68,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
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
  scanEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    zIndex: 1,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  labelContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    fontFamily: "monospace",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  sublabel: {
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "monospace",
    opacity: 0.7,
    marginTop: 2, // Increased spacing between label and sublabel
  },
  dataStream: {
    position: "absolute",
    bottom: 2,
    right: 4,
  },
  dataStreamText: {
    fontSize: 6,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  tanstackContainer: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  digitalNoise: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    backgroundColor: "transparent",
    backgroundImage: `repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(0, 255, 255, 0.1) 1deg,
      transparent 2deg,
      rgba(255, 0, 255, 0.1) 3deg,
      transparent 4deg
    )`,
  },
  glitchOverlay: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  glitchContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  glitchText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    fontFamily: "monospace",
    marginLeft: 6,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
