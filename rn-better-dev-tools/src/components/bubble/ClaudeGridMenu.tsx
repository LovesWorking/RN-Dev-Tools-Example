import React, { useEffect, useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
  Easing,
} from "react-native";
import { CyberpunkGlitchBackground } from "./CyberpunkGlitchBackground";
import { TanstackLogo } from "@/rn-better-dev-tools/src/features/react-query/components/query-browser/svgs";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from "@/rn-better-dev-tools/src/shared/icons/lucide-icons";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

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

export function ClaudeGridMenu({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: MagneticGridMenuProps) {
  const { height: screenHeight } = Dimensions.get("window");

  // Create animated values for each item using pure React Native
  const items = useRef(
    Array.from({ length: 6 }, () => ({
      scale: new Animated.Value(0),
      rotation: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      glitch: new Animated.Value(0),
      magnetX: new Animated.Value(0),
      magnetY: new Animated.Value(0),
      pulse: new Animated.Value(0),
      shadowIntensity: new Animated.Value(0),
      matrixGlow: new Animated.Value(0),
      glitchX: new Animated.Value(0),
      glitchY: new Animated.Value(0),
      glitchOpacity: new Animated.Value(0),
      glitchScale: new Animated.Value(1),
    }))
  ).current;

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scanlinePosition = useRef(new Animated.Value(0)).current;
  const glitchEffect = useRef(new Animated.Value(0)).current;

  const getHexPosition = (index: number) => {
    const angle = (index * Math.PI * 2) / 6;
    const radius = 120; // Increased spacing between buttons
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const handleOpen = () => {
    // Backdrop fade in
    Animated.timing(backdropOpacity, {
      toValue: 0.9,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Start scanline animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanlinePosition, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(scanlinePosition, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Periodic glitch effect
    Animated.loop(
      Animated.sequence([
        Animated.delay(3000),
        Animated.timing(glitchEffect, {
          toValue: 1,
          duration: 30,
          useNativeDriver: false,
        }),
        Animated.timing(glitchEffect, {
          toValue: 0,
          duration: 20,
          useNativeDriver: false,
        }),
        Animated.timing(glitchEffect, {
          toValue: 1,
          duration: 40,
          useNativeDriver: false,
        }),
        Animated.timing(glitchEffect, {
          toValue: 0,
          duration: 30,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Staggered cyber appearance with Matrix-style entry
    items.forEach((item, index) => {
      const pos = getHexPosition(index);
      const delay = index * 80;

      // Set initial position
      item.translateX.setValue(pos.x);
      item.translateY.setValue(-screenHeight);

      // Epic entrance animation
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          // Y position animation
          Animated.sequence([
            Animated.timing(item.translateY, {
              toValue: pos.y + 100,
              duration: 400,
              easing: Easing.in(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.spring(item.translateY, {
              toValue: pos.y,
              damping: 6,
              stiffness: 120,
              mass: 0.4,
              velocity: 10,
              useNativeDriver: false,
            }),
          ]),
          // Scale animation
          Animated.sequence([
            Animated.timing(item.scale, {
              toValue: 1.5,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(item.scale, {
              toValue: 0.8,
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.spring(item.scale, {
              toValue: 1,
              damping: 8,
              stiffness: 180,
              useNativeDriver: false,
            }),
          ]),
          // Rotation animation
          Animated.sequence([
            Animated.timing(item.rotation, {
              toValue: 720,
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(item.rotation, {
              toValue: 0,
              duration: 0,
              useNativeDriver: false,
            }),
          ]),
          // Opacity flicker animation
          Animated.sequence([
            Animated.timing(item.opacity, {
              toValue: 0.2,
              duration: 50,
              useNativeDriver: false,
            }),
            Animated.timing(item.opacity, {
              toValue: 1,
              duration: 30,
              useNativeDriver: false,
            }),
            Animated.timing(item.opacity, {
              toValue: 0.4,
              duration: 40,
              useNativeDriver: false,
            }),
            Animated.timing(item.opacity, {
              toValue: 1,
              duration: 50,
              useNativeDriver: false,
            }),
            Animated.timing(item.opacity, {
              toValue: 0.6,
              duration: 30,
              useNativeDriver: false,
            }),
            Animated.timing(item.opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: false,
            }),
          ]),
        ]),
      ]).start();

      // Shadow intensity animation
      Animated.sequence([
        Animated.delay(delay + 200),
        Animated.spring(item.shadowIntensity, {
          toValue: 1,
          damping: 10,
          stiffness: 100,
          useNativeDriver: false,
        }),
      ]).start();

      // Simplified pulse - only for first 3 items
      if (index < 3) {
        Animated.sequence([
          Animated.delay(delay + 300),
          Animated.loop(
            Animated.sequence([
              Animated.timing(item.pulse, {
                toValue: 1,
                duration: 2000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: false,
              }),
              Animated.timing(item.pulse, {
                toValue: 0,
                duration: 2000,
                easing: Easing.inOut(Easing.sin),
                useNativeDriver: false,
              }),
            ])
          ),
        ]).start();
      }

      // Simplified Matrix glow - less frequent
      if (index === 0 || index === 3) {
        Animated.sequence([
          Animated.delay(delay + 400),
          Animated.loop(
            Animated.sequence([
              Animated.delay(4000),
              Animated.timing(item.matrixGlow, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
              }),
              Animated.timing(item.matrixGlow, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }),
            ])
          ),
        ]).start();
      }

      // Advanced glitch effect animation
      Animated.sequence([
        Animated.delay(delay + 500),
        Animated.loop(
          Animated.sequence([
            Animated.delay(3000 + index * 500),
            Animated.timing(item.glitchOpacity, {
              toValue: 1,
              duration: 50,
              useNativeDriver: false,
            }),
            Animated.timing(item.glitchOpacity, {
              toValue: 0,
              duration: 30,
              useNativeDriver: false,
            }),
            Animated.timing(item.glitchOpacity, {
              toValue: 0.8,
              duration: 40,
              useNativeDriver: false,
            }),
            Animated.timing(item.glitchOpacity, {
              toValue: 0,
              duration: 20,
              useNativeDriver: false,
            }),
            Animated.timing(item.glitchOpacity, {
              toValue: 0.6,
              duration: 30,
              useNativeDriver: false,
            }),
            Animated.timing(item.glitchOpacity, {
              toValue: 0,
              duration: 50,
              useNativeDriver: false,
            }),
          ])
        ),
      ]).start();

      // Glitch displacement animation
      Animated.loop(
        Animated.sequence([
          Animated.delay(4000 + index * 300),
          Animated.timing(item.glitchX, {
            toValue: 5,
            duration: 20,
            useNativeDriver: false,
          }),
          Animated.timing(item.glitchX, {
            toValue: -5,
            duration: 20,
            useNativeDriver: false,
          }),
          Animated.timing(item.glitchX, {
            toValue: 3,
            duration: 20,
            useNativeDriver: false,
          }),
          Animated.timing(item.glitchX, {
            toValue: 0,
            duration: 20,
            useNativeDriver: false,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.delay(3500 + index * 400),
          Animated.timing(item.glitchY, {
            toValue: -3,
            duration: 30,
            useNativeDriver: false,
          }),
          Animated.timing(item.glitchY, {
            toValue: 2,
            duration: 20,
            useNativeDriver: false,
          }),
          Animated.timing(item.glitchY, {
            toValue: 0,
            duration: 30,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Glitch scale effect
      Animated.loop(
        Animated.sequence([
          Animated.delay(5000 + index * 200),
          Animated.timing(item.glitchScale, {
            toValue: 1.02,
            duration: 20,
            useNativeDriver: false,
          }),
          Animated.timing(item.glitchScale, {
            toValue: 0.98,
            duration: 20,
            useNativeDriver: false,
          }),
          Animated.timing(item.glitchScale, {
            toValue: 1,
            duration: 20,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  };

  useEffect(() => {
    handleOpen();
  }, []);

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
      primaryColor: gameUIColors.query,
      secondaryColor: gameUIColors.info,
      accentColor: gameUIColors.query,
    },
    {
      onPress: onEnvPress,
      icon: <ServerIcon size={18} color={gameUIColors.env} />,
      label: "ENV",
      sublabel: "SYSTEM",
      primaryColor: gameUIColors.env,
      secondaryColor: gameUIColors.success,
      accentColor: gameUIColors.env,
    },
    {
      onPress: onSentryPress,
      icon: <BugIcon size={18} color={gameUIColors.debug} />,
      label: "SENTRY",
      sublabel: "DEBUG",
      primaryColor: gameUIColors.debug,
      secondaryColor: gameUIColors.error,
      accentColor: gameUIColors.debug,
    },
    {
      onPress: onStoragePress,
      icon: <DatabaseIcon size={18} color={gameUIColors.storage} />,
      label: "STORAGE",
      sublabel: "MEMORY",
      primaryColor: gameUIColors.storage,
      secondaryColor: gameUIColors.warning,
      accentColor: gameUIColors.storage,
    },
    {
      onPress: onWifiToggle,
      icon: isWifiEnabled ? (
        <WifiIcon size={18} color={gameUIColors.network} />
      ) : (
        <WifiOffIcon size={18} color={gameUIColors.muted} />
      ),
      label: isWifiEnabled ? "ONLINE" : "OFFLINE",
      sublabel: isWifiEnabled ? "CONNECTED" : "DISABLED",
      primaryColor: isWifiEnabled ? gameUIColors.network : gameUIColors.muted,
      secondaryColor: isWifiEnabled ? gameUIColors.optional : gameUIColors.secondary,
      accentColor: isWifiEnabled ? gameUIColors.network : gameUIColors.muted,
    },
    {
      onPress: onClose,
      icon: <XIcon size={18} color={gameUIColors.secondary} />,
      label: "EXIT",
      sublabel: "CLOSE",
      primaryColor: gameUIColors.muted,
      secondaryColor: gameUIColors.secondary,
      accentColor: gameUIColors.muted,
    },
  ];

  const handlePressIn = (index: number) => {
    const item = items[index];

    // Animate scale
    Animated.sequence([
      Animated.timing(item.scale, {
        toValue: 0.85,
        duration: 50,
        useNativeDriver: false,
      }),
      Animated.timing(item.scale, {
        toValue: 1.15,
        duration: 60,
        useNativeDriver: false,
      }),
      Animated.timing(item.scale, {
        toValue: 0.92,
        duration: 40,
        useNativeDriver: false,
      }),
    ]).start();

    // Animate magnet effect
    Animated.spring(item.magnetX, {
      toValue: (Math.random() - 0.5) * 10,
      useNativeDriver: false,
    }).start();

    Animated.spring(item.magnetY, {
      toValue: (Math.random() - 0.5) * 10,
      useNativeDriver: false,
    }).start();

    // Matrix glow burst
    Animated.sequence([
      Animated.timing(item.matrixGlow, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(item.matrixGlow, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // Intense glitch on press
    Animated.sequence([
      Animated.timing(item.glitchOpacity, {
        toValue: 1,
        duration: 20,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchOpacity, {
        toValue: 0,
        duration: 30,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchOpacity, {
        toValue: 0.9,
        duration: 20,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchOpacity, {
        toValue: 0,
        duration: 40,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchOpacity, {
        toValue: 0.7,
        duration: 30,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchOpacity, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }),
    ]).start();

    // Glitch X displacement
    Animated.sequence([
      Animated.timing(item.glitchX, {
        toValue: 8,
        duration: 20,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchX, {
        toValue: -8,
        duration: 20,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchX, {
        toValue: 5,
        duration: 20,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchX, {
        toValue: 0,
        duration: 30,
        useNativeDriver: false,
      }),
    ]).start();

    // Glitch scale
    Animated.sequence([
      Animated.timing(item.glitchScale, {
        toValue: 1.05,
        duration: 20,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchScale, {
        toValue: 0.95,
        duration: 20,
        useNativeDriver: false,
      }),
      Animated.timing(item.glitchScale, {
        toValue: 1,
        duration: 30,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = (index: number) => {
    const item = items[index];

    Animated.spring(item.scale, {
      toValue: 1,
      useNativeDriver: false,
    }).start();

    Animated.spring(item.magnetX, {
      toValue: 0,
      useNativeDriver: false,
    }).start();

    Animated.spring(item.magnetY, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Background with Matrix Bubbles */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {/* Cyberpunk glitch background */}
      <CyberpunkGlitchBackground />

      <View
        style={[
          styles.menuContainer,
          {
            right: buttonPosition.x + 20,
            bottom: buttonPosition.y + 20,
          },
        ]}
      >
        {menuItems.map((menuItem, index) => {
          const item = items[index];

          // Create interpolations for animations
          const pulseScale = item.pulse.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.05],
          });

          const shadowRadius = item.shadowIntensity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          });

          const glowRadius = item.matrixGlow.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 50],
          });

          const glowOpacity = item.matrixGlow.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          });

          // Combine all transforms
          const animatedStyle = {
            transform: [
              { translateX: Animated.add(item.translateX, item.magnetX) },
              { translateY: Animated.add(item.translateY, item.magnetY) },
              { scale: Animated.multiply(item.scale, pulseScale) },
              {
                rotate: item.rotation.interpolate({
                  inputRange: [0, 720],
                  outputRange: ["0deg", "720deg"],
                }),
              },
            ],
            opacity: item.opacity,
          };

          const glitchStyle = {
            opacity: item.glitchOpacity,
            transform: [
              { translateX: item.glitchX },
              { translateY: item.glitchY },
              { scale: item.glitchScale },
            ],
          };

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
                  {
                    shadowColor: gameUIColors.background,
                    shadowRadius,
                    shadowOpacity: item.shadowIntensity,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.shadowLayer,
                  styles.shadowLayerLight,
                  {
                    shadowColor: menuItem.primaryColor,
                    shadowRadius,
                    shadowOpacity: Animated.multiply(item.shadowIntensity, 0.4),
                  },
                ]}
              />

              {/* Multi-layer neo-morphic glow effect */}
              <Animated.View
                style={[
                  styles.outerGlow,
                  {
                    shadowColor: menuItem.primaryColor,
                    backgroundColor: `${menuItem.primaryColor}08`,
                    shadowRadius: glowRadius,
                    shadowOpacity: glowOpacity,
                  },
                ]}
              />

              {/* Additional glow ring */}
              <Animated.View
                style={[
                  styles.glowRing,
                  {
                    borderColor: `${menuItem.primaryColor}40`,
                    shadowColor: menuItem.primaryColor,
                    shadowRadius: Animated.add(
                      10,
                      item.matrixGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 20],
                      })
                    ),
                    shadowOpacity: glowOpacity,
                  },
                ]}
              />

              <Pressable
                onPress={menuItem.onPress}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
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
                        backgroundColor: `${menuItem.primaryColor}20`,
                        borderColor: menuItem.primaryColor,
                      },
                    ]}
                    pointerEvents="none"
                  >
                    <View style={styles.glitchContent}>
                      {menuItem.icon}
                      <Text
                        style={[
                          styles.glitchText,
                          { color: menuItem.primaryColor },
                        ]}
                      >
                        {"_"}
                        {menuItem.label}
                        {"_"}
                      </Text>
                    </View>
                  </Animated.View>

                  {/* Cyber border with corner accents */}
                  <View
                    style={[
                      styles.cyberBorder,
                      {
                        borderColor: `${menuItem.primaryColor}80`,
                        shadowColor: menuItem.primaryColor,
                      },
                    ]}
                  >
                    {/* Corner accent pieces */}
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerTL,
                        { backgroundColor: menuItem.primaryColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerTR,
                        { backgroundColor: menuItem.secondaryColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerBL,
                        { backgroundColor: menuItem.secondaryColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.cornerAccent,
                        styles.cornerBR,
                        { backgroundColor: menuItem.primaryColor },
                      ]}
                    />

                    {/* Scanning line effect */}
                    <View
                      style={[
                        styles.scanEffect,
                        { backgroundColor: `${menuItem.accentColor}30` },
                      ]}
                    />

                    {/* Content container */}
                    <View style={styles.contentContainer}>
                      {/* Icon without background, just glow */}
                      <View style={styles.iconWrapper}>{menuItem.icon}</View>

                      {/* Matrix-style text labels */}
                      <View style={styles.labelContainer}>
                        <Text
                          style={[
                            styles.label,
                            { color: menuItem.primaryColor },
                          ]}
                        >
                          {menuItem.label}
                        </Text>
                        <Text
                          style={[
                            styles.sublabel,
                            { color: menuItem.accentColor },
                          ]}
                        >
                          {menuItem.sublabel}
                        </Text>
                      </View>
                    </View>

                    {/* Data stream effect */}
                    <View style={styles.dataStream}>
                      <Text
                        style={[
                          styles.dataStreamText,
                          { color: `${menuItem.primaryColor}40` },
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
    backgroundColor: gameUIColors.background + "F2",
  },
  scanline: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: gameUIColors.info,
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    opacity: 0.02,
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
    backgroundColor: gameUIColors.background,
    position: "relative",
  },
  gradientLayer1: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: gameUIColors.panel,
    opacity: 0.7,
  },
  gradientLayer2: {
    position: "absolute",
    top: "30%",
    left: "30%",
    right: 0,
    bottom: 0,
    backgroundColor: gameUIColors.panel + "EB",
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
    marginTop: -2,
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
