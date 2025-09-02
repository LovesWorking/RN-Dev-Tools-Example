import React, { useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  Dimensions,
  Text,
  Animated,
  Easing,
} from "react-native";
import {
  Globe,
  EnvLaptopIcon,
  WifiCircuitIcon,
  StorageStackIcon,
  ReactQueryIcon,
} from "@/rn-better-dev-tools/icons";
import { SentryBugIcon } from "@/rn-better-dev-tools/icons/SentryBugIcon";
import { DialIcon } from "./DialIcon";
import {
  gameUIColors,
  getThemedDialColors,
  THEME_ACCENT,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import {
  DevToolsSettingsModal,
  type DevToolsSettings,
  useDevToolsSettings,
} from "../DevToolsSettingsModal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(SCREEN_WIDTH * 0.75, 320); // Max 320px for better fit
const BUTTON_SIZE = 80; // Fixed button size

export type IconType = {
  name: string;
  icon: React.ReactNode;
  color: string;
  onPress: () => void;
};

interface DialDevToolsProps {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onNetworkPress?: () => void;
  onClose?: () => void;
  onSettingsPress?: () => void;
  isWifiEnabled?: boolean;
  settings?: DevToolsSettings;
  autoOpenSettings?: boolean;
}

const DialDevTools: React.FC<DialDevToolsProps> = ({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onNetworkPress,
  onClose,
  onSettingsPress,
  isWifiEnabled = true,
  settings: externalSettings,
  autoOpenSettings = false,
}) => {
  const [selectedIcon, setSelectedIcon] = React.useState(-1);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const { settings: hookSettings, refreshSettings } = useDevToolsSettings();
  // Initialize with external settings if provided, otherwise use hook settings
  const [localSettings, setLocalSettings] = React.useState(
    externalSettings || hookSettings
  );

  // Always use localSettings (which can be updated by the modal)
  const settings = localSettings;

  // Update local settings when external settings change
  React.useEffect(() => {
    if (externalSettings) {
      setLocalSettings(externalSettings);
    }
  }, [externalSettings]);

  // Update local settings when hook settings change (if no external settings)
  React.useEffect(() => {
    if (!externalSettings) {
      setLocalSettings(hookSettings);
    }
  }, [hookSettings, externalSettings]);

  // Auto-open settings modal when prop is true
  React.useEffect(() => {
    if (autoOpenSettings && !isSettingsModalOpen) {
      setIsSettingsModalOpen(true);
    }
  }, [autoOpenSettings, isSettingsModalOpen]);

  // React Native Animated values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dialScale = useRef(new Animated.Value(0)).current;
  const dialRotation = useRef(new Animated.Value(0)).current;
  const centerButtonScale = useRef(new Animated.Value(0)).current;
  const iconsProgress = useRef(new Animated.Value(0)).current;
  const glitchOffset = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  // Subtle animations
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const breathingScale = useRef(new Animated.Value(1)).current;
  const circuitOpacity = useRef(new Animated.Value(0)).current;

  // Animation tracking refs
  const glitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const allIcons: IconType[] = [
    {
      name: "Query",
      icon: (
        <ReactQueryIcon
          size={32}
          color={gameUIColors.query}
          glowColor={gameUIColors.query}
          noBackground={true}
        />
      ),
      color: gameUIColors.query,
      onPress: onQueryPress,
    },
    {
      name: "Env",
      icon: (
        <EnvLaptopIcon
          size={32}
          color={gameUIColors.env}
          glowColor={gameUIColors.env}
          noBackground={true}
        />
      ),
      color: gameUIColors.env,
      onPress: onEnvPress,
    },
    {
      name: "Sentry",
      icon: (
        <SentryBugIcon
          size={32}
          color={gameUIColors.debug}
          glowColor={gameUIColors.debug}
          noBackground={true}
        />
      ),
      color: gameUIColors.debug,
      onPress: onSentryPress,
    },
    {
      name: "Storage",
      icon: (
        <StorageStackIcon
          size={32}
          color={gameUIColors.storage}
          glowColor={gameUIColors.storage}
          noBackground={true}
        />
      ),
      color: gameUIColors.storage,
      onPress: onStoragePress,
    },
    {
      name: "WiFi",
      icon: (
        <WifiCircuitIcon
          size={32}
          color={isWifiEnabled ? gameUIColors.network : gameUIColors.muted}
          glowColor={isWifiEnabled ? gameUIColors.network : gameUIColors.muted}
          strength={isWifiEnabled ? 4 : 0}
          noBackground={true}
        />
      ),
      color: isWifiEnabled ? gameUIColors.network : gameUIColors.muted,
      onPress: onWifiToggle,
    },
    {
      name: "Network",
      icon: <Globe size={32} color={gameUIColors.network} />,
      color: gameUIColors.network,
      onPress: onNetworkPress || (() => {}),
    },
  ];

  // Create icons array with empty spots for disabled tools
  const icons = allIcons.map((icon) => {
    if (!settings) {
      return icon; // If no settings, show all icons
    }

    let isEnabled = true;
    switch (icon.name) {
      case "Query":
        isEnabled = settings.dialTools.query;
        break;
      case "Env":
        isEnabled = settings.dialTools.env;
        break;
      case "Sentry":
        isEnabled = settings.dialTools.sentry;
        break;
      case "Storage":
        isEnabled = settings.dialTools.storage;
        break;
      case "WiFi":
        isEnabled = settings.dialTools.wifi;
        break;
      case "Network":
        isEnabled = settings.dialTools.network;
        break;
    }

    console.log(`[DialDevTools] Icon ${icon.name} enabled: ${isEnabled}`);

    // Return empty spot for disabled tools
    if (!isEnabled) {
      return {
        name: `empty-${icon.name}`,
        icon: null,
        color: "transparent",
        onPress: () => {}, // No-op for empty spots
      };
    }

    return icon;
  });

  console.log(
    "[DialDevTools] Final icons array:",
    icons.map((i) => i.name)
  );

  // Initialize animations on mount
  useEffect(() => {
    // Entrance animation sequence
    Animated.timing(backdropOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.spring(dialScale, {
      toValue: 1,
      damping: 15,
      stiffness: 150,
      mass: 1,
      useNativeDriver: true,
    }).start();

    Animated.sequence([
      Animated.timing(dialRotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(dialRotation, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(300),
      Animated.spring(centerButtonScale, {
        toValue: 1,
        damping: 10,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(500),
      Animated.timing(iconsProgress, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Subtle glitch effect
    const glitchAnimation = () => {
      Animated.sequence([
        Animated.timing(glitchOffset, {
          toValue: 2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOffset, {
          toValue: -2,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOffset, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    };

    glitchIntervalRef.current = setInterval(glitchAnimation, 3000);

    // Pulse animation
    const startPulse = () => {
      pulseAnimationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.02,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 0.98,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimationRef.current.start();
    };

    startPulse();

    // Subtle floating animation for the dial
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -8,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle breathing effect for center button
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathingScale, {
          toValue: 1.05,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathingScale, {
          toValue: 0.98,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Circuit traces fade in
    Animated.timing(circuitOpacity, {
      toValue: 1,
      duration: 1000,
      delay: 600,
      useNativeDriver: true,
    }).start();

    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
      }
    };
  }, []);

  const handleClose = () => {
    // Stop any ongoing animations first
    if (pulseAnimationRef.current) {
      pulseAnimationRef.current.stop();
    }

    // Exit animation sequence - reverse order of entrance
    Animated.sequence([
      // First animate icons back to center
      Animated.timing(iconsProgress, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      // Then scale down center button and dial
      Animated.parallel([
        Animated.timing(centerButtonScale, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(dialScale, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Finally fade out backdrop
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Use setTimeout to defer the state update to the next tick
      // This avoids the useInsertionEffect warning
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 0);
      }
    });
  };

  const handleIconPress = (index: number) => {
    setSelectedIcon(index);

    // Pulse animation on selection
    Animated.sequence([
      Animated.spring(centerButtonScale, {
        toValue: 0.9,
        damping: 15,
        stiffness: 500,
        useNativeDriver: true,
      }),
      Animated.spring(centerButtonScale, {
        toValue: 1,
        damping: 10,
        stiffness: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Trigger action
    setTimeout(() => {
      icons[index].onPress();
      // Only close if it's not the WiFi toggle
      if (icons[index].name !== "WiFi") {
        handleClose();
      }
    }, 50);
  };

  // Animated styles
  const backdropAnimatedStyle = {
    opacity: backdropOpacity,
  };

  const glitchAnimatedStyle = {
    transform: [{ translateX: glitchOffset }],
  };

  const centerButtonAnimatedStyle = {
    transform: [
      {
        scale: Animated.multiply(centerButtonScale, breathingScale),
      },
    ],
  };

  const pulseAnimatedStyle = {
    transform: [{ scale: selectedIcon >= 0 ? 1 : pulseScale }],
  };

  return (
    <View style={styles.container}>
      {/* Dark overlay backdrop */}
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.parent,
          {
            position: "absolute",
            left: (SCREEN_WIDTH - CIRCLE_SIZE) / 2,
            bottom: 80,
            transform: [
              { translateY: floatingAnim },
              { scale: dialScale },
              {
                rotate: dialRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        {/* Cyberpunk dial background with glitch */}
        <Animated.View style={[styles.circle, glitchAnimatedStyle]}>
          {/* Gradient background using layered Views */}
          <View style={styles.gradientBackground}>
            <View style={styles.gradientLayer1} />
            <View style={styles.gradientLayer2} />
            <View style={styles.gradientLayer3} />

            {/* Matrix grid pattern */}
            <View style={styles.gridPattern}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.gridLine,
                    {
                      transform: [{ rotate: `${i * 60}deg` }],
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Icon items */}
          {icons.map((icon, i) => (
            <DialIcon
              selectedIcon={selectedIcon}
              onPress={handleIconPress}
              iconsProgress={iconsProgress}
              icon={icon}
              key={`${i}-${icon.name}`}
              index={i}
              totalIcons={icons.length}
            />
          ))}
        </Animated.View>

        {/* Center button */}
        <Animated.View
          style={[styles.buttonContainer, centerButtonAnimatedStyle]}
        >
          <View style={styles.buttonGradient}>
            <View style={styles.buttonGradientLayer1} />
            <View style={styles.buttonGradientLayer2} />
            <View style={styles.buttonGradientLayer3} />

            <View style={styles.buttonBorder}>
              <Animated.View style={[styles.button, pulseAnimatedStyle]}>
                <Pressable
                  onPress={() => {
                    if (isSettingsModalOpen) {
                      // Close settings modal
                      setIsSettingsModalOpen(false);
                    } else {
                      // Open internal settings modal
                      setIsSettingsModalOpen(true);
                      // Also call external handler if provided
                      if (onSettingsPress) {
                        onSettingsPress();
                      }
                    }
                  }}
                  style={styles.buttonPressable}
                >
                  {isSettingsModalOpen ? (
                    <>
                      <Text style={[styles.centerText, styles.closeTextTop]}>
                        CLOSE
                      </Text>
                      <Text style={[styles.centerText, styles.closeTextBottom]}>
                        SETTINGS
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.centerText}>RN BETTER</Text>
                      <Text style={styles.centerText}>DEV TOOLS</Text>
                    </>
                  )}
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Settings Modal - Part of dial component for proper z-index */}
      <DevToolsSettingsModal
        visible={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
          refreshSettings(); // Refresh from storage
        }}
        onSettingsChange={(newSettings) => {
          console.log(
            "[DialDevTools] onSettingsChange called with:",
            newSettings
          );
          // Immediately update local settings for instant feedback
          setLocalSettings(newSettings);
          console.log(
            "[DialDevTools] Called setLocalSettings with new settings"
          );
        }}
      />
    </View>
  );
};

export default DialDevTools;

// Get themed colors based on the global theme accent
const themedDialColors = getThemedDialColors(THEME_ACCENT);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Darker overlay for better contrast without games
  },
  parent: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: themedDialColors.dialBorder,
    shadowColor: themedDialColors.dialShadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    borderRadius: CIRCLE_SIZE / 2,
    position: "relative",
    backgroundColor: themedDialColors.dialBackground,
    overflow: "hidden",
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themedDialColors.dialGradient1,
    opacity: 0.6,
    borderRadius: CIRCLE_SIZE / 2,
  },
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themedDialColors.dialGradient2,
    opacity: 0.4,
    top: "30%",
    left: "30%",
    borderRadius: CIRCLE_SIZE / 2,
  },
  gradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themedDialColors.dialGradient3,
    opacity: 0.3,
    top: "50%",
    left: "50%",
    borderRadius: CIRCLE_SIZE / 2,
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  gridLine: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: 1,
    backgroundColor: themedDialColors.dialGridLine,
  },
  buttonContainer: {
    zIndex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: BUTTON_SIZE * 1.5,
    height: BUTTON_SIZE * 1.5,
    borderRadius: BUTTON_SIZE,
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    backgroundColor: themedDialColors.dialBackground,
    position: "relative",
    overflow: "hidden",
  },
  buttonGradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themedDialColors.dialGradient1,
    opacity: 0.5,
    borderRadius: BUTTON_SIZE,
  },
  buttonGradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themedDialColors.dialGradient2,
    opacity: 0.3,
    top: "20%",
    left: "20%",
    borderRadius: BUTTON_SIZE,
  },
  buttonGradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themedDialColors.dialGradient3,
    opacity: 0.2,
    top: "40%",
    left: "40%",
    borderRadius: BUTTON_SIZE,
  },
  buttonBorder: {
    backgroundColor: themedDialColors.dialGridLine,
    alignItems: "center",
    justifyContent: "center",
    width: BUTTON_SIZE * 1.2,
    height: BUTTON_SIZE * 1.2,
    borderRadius: BUTTON_SIZE * 0.6,
    borderWidth: 2,
    borderColor: themedDialColors.dialBorder,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonPressable: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    color: gameUIColors.primary,
    fontSize: 10,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: gameUIColors.info,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  closeTextTop: {
    marginBottom: -2,
  },
  closeTextBottom: {
    marginTop: -2,
  },
});
