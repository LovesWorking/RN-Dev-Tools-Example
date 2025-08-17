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
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from "@/src/_shared/icons/lucide-icons";
import { TanstackLogo } from "@/src/_sections/react-query/components/query-browser/svgs";
import DialIcon from "./DialIcon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
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
  onClose?: () => void;
  isWifiEnabled?: boolean;
}

const DialDevTools: React.FC<DialDevToolsProps> = ({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
}) => {
  const [selectedIcon, setSelectedIcon] = React.useState(-1);

  // React Native Animated values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const dialScale = useRef(new Animated.Value(0)).current;
  const dialRotation = useRef(new Animated.Value(0)).current;
  const centerButtonScale = useRef(new Animated.Value(0)).current;
  const iconsProgress = useRef(new Animated.Value(0)).current;
  const glitchOffset = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  // Animation tracking refs
  const glitchIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const icons: IconType[] = [
    {
      name: "Query",
      icon: (
        <View style={styles.tanstackContainer}>
          <TanstackLogo />
        </View>
      ),
      color: "#00FFFF",
      onPress: onQueryPress,
    },
    {
      name: "Env",
      icon: <ServerIcon size={24} color="#00FFFF" />,
      color: "#00FFFF",
      onPress: onEnvPress,
    },
    {
      name: "Sentry",
      icon: <BugIcon size={24} color="#FF1744" />,
      color: "#FF1744",
      onPress: onSentryPress,
    },
    {
      name: "Storage",
      icon: <DatabaseIcon size={24} color="#00FF88" />,
      color: "#00FF88",
      onPress: onStoragePress,
    },
    {
      name: "WiFi",
      icon: isWifiEnabled ? (
        <WifiIcon size={24} color="#E040FB" />
      ) : (
        <WifiOffIcon size={24} color="#616161" />
      ),
      color: isWifiEnabled ? "#E040FB" : "#616161",
      onPress: onWifiToggle,
    },
    {
      name: "Close",
      icon: <XIcon size={24} color="#9E9E9E" />,
      color: "#424242",
      onPress: () => {
        // Empty function - handleIconPress will handle the close animation
      },
    },
  ];

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

    // Check if it's the close button (last item)
    const isCloseButton = icons[index].name === "Close";

    if (isCloseButton) {
      // For close button, just trigger the close animation
      setTimeout(() => {
        handleClose();
      }, 50);
    } else {
      // For other buttons, trigger action then close
      setTimeout(() => {
        icons[index].onPress();
        handleClose();
      }, 50);
    }
  };

  // Animated styles
  const backdropAnimatedStyle = {
    opacity: backdropOpacity,
  };

  const dialAnimatedStyle = {
    transform: [
      { scale: dialScale },
      {
        rotate: dialRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  const glitchAnimatedStyle = {
    transform: [{ translateX: glitchOffset }],
  };

  const centerButtonAnimatedStyle = {
    transform: [{ scale: centerButtonScale }],
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
          },
          dialAnimatedStyle,
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
              key={i}
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
                  onPress={() => handleClose()}
                  style={styles.buttonPressable}
                >
                  <Text style={styles.centerText}>RN BETTER</Text>
                  <Text style={styles.centerText}>DEV TOOLS</Text>
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default DialDevTools;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    opacity: 0.8,
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
    borderColor: "rgba(0, 255, 255, 0.2)",
    shadowColor: "#00FFFF",
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
    backgroundColor: "rgba(0,0,0,0.95)",
    overflow: "hidden",
  },
  gradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,20,0.98)",
    opacity: 0.9,
  },
  gradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,10,0.95)",
    opacity: 0.7,
    top: "30%",
    left: "30%",
  },
  gradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,30,0.9)",
    opacity: 0.5,
    top: "50%",
    left: "50%",
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
    backgroundColor: "rgba(0, 255, 255, 0.1)",
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
    backgroundColor: "rgba(0,0,0,0.95)",
    position: "relative",
    overflow: "hidden",
  },
  buttonGradientLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,20,0.98)",
    opacity: 0.8,
    borderRadius: BUTTON_SIZE,
  },
  buttonGradientLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,10,0.95)",
    opacity: 0.6,
    top: "20%",
    left: "20%",
    borderRadius: BUTTON_SIZE,
  },
  buttonGradientLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,30,0.9)",
    opacity: 0.4,
    top: "40%",
    left: "40%",
    borderRadius: BUTTON_SIZE,
  },
  buttonBorder: {
    backgroundColor: "rgba(0, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    width: BUTTON_SIZE * 1.2,
    height: BUTTON_SIZE * 1.2,
    borderRadius: BUTTON_SIZE * 0.6,
    borderWidth: 2,
    borderColor: "rgba(0, 255, 255, 0.3)",
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
  tanstackContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
    fontFamily: "monospace",
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
    textShadowColor: "#00FFFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
