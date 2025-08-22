import { useEffect, useRef, useMemo, useCallback, useState } from "react";
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
import {
  TanstackLogo,
  CyberpunkBorderBox,
  AnimatedCyberpunkBorderBox,
} from "@/rn-better-dev-tools/src/features/react-query/components/query-browser/svgs";
import {
  DatabaseIcon,
  BugIcon,
  ServerIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon,
} from "@/rn-better-dev-tools/src/shared/icons/lucide-icons";

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

const { height: screenHeight } = Dimensions.get("window");

const HEX_POSITIONS = (() => {
  const positions = [];
  const radius = 120;
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    positions.push({
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    });
  }
  return positions;
})();

export function ClaudeGridMenuSVGGlitch({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onClose,
  isWifiEnabled = true,
  buttonPosition = { x: 30, y: 30 },
}: MagneticGridMenuProps) {
  // Core animations - create outside of useRef to avoid freezing
  const [items] = useState(() =>
    Array.from({ length: 6 }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      rotation: new Animated.Value(0), // Add rotation for spinning effect
      opacity: new Animated.Value(0),
      pressScale: new Animated.Value(1),
      pulse: new Animated.Value(0),
      // Glitch effects for button 11 and 17
      splitOpacity: new Animated.Value(0),
      leftX: new Animated.Value(0),
      rightX: new Animated.Value(0),
      doubleOpacity1: new Animated.Value(0),
      doubleOpacity2: new Animated.Value(0),
      distortScale: new Animated.Value(1),
      scanlineY: new Animated.Value(-30),
      scanlineOpacity: new Animated.Value(0),
      shakeY: new Animated.Value(0), // For vertical split effect
    }))
  );

  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [scanlineY] = useState(() => new Animated.Value(-100));

  const menuItems = useMemo(
    () => [
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
        glitchColor1: "#00FFFF",
        glitchColor2: "#FFFF00",
      },
      {
        onPress: onEnvPress,
        icon: <ServerIcon size={18} color="#00FFFF" />,
        label: "ENV",
        sublabel: "SYSTEM",
        primaryColor: "#00FFFF",
        secondaryColor: "#00E5FF",
        accentColor: "#84FFFF",
        glitchColor1: "#FF00FF",
        glitchColor2: "#00FF00",
      },
      {
        onPress: onSentryPress,
        icon: <BugIcon size={18} color="#FF1744" />,
        label: "SENTRY",
        sublabel: "DEBUG",
        primaryColor: "#FF1744",
        secondaryColor: "#FF5252",
        accentColor: "#FF8A80",
        glitchColor1: "#00FFFF",
        glitchColor2: "#FFFF00",
      },
      {
        onPress: onStoragePress,
        icon: <DatabaseIcon size={18} color="#00FF88" />,
        label: "STORAGE",
        sublabel: "MEMORY",
        primaryColor: "#00FF88",
        secondaryColor: "#00E676",
        accentColor: "#69F0AE",
        glitchColor1: "#FF00FF",
        glitchColor2: "#00FFFF",
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
        glitchColor1: "#00FFFF",
        glitchColor2: "#FF00FF",
      },
      {
        onPress: onClose,
        icon: <XIcon size={18} color="#9E9E9E" />,
        label: "EXIT",
        sublabel: "CLOSE",
        primaryColor: "#424242",
        secondaryColor: "#616161",
        accentColor: "#757575",
        glitchColor1: "#00FFFF",
        glitchColor2: "#00FF00",
      },
    ],
    [
      onQueryPress,
      onEnvPress,
      onSentryPress,
      onStoragePress,
      onWifiToggle,
      onClose,
      isWifiEnabled,
    ]
  );

  // Trigger glitch animation - only effects 11 and 17 from test lab
  const triggerGlitch = useCallback(
    (index: number) => {
      const item = items[index];

      // Stop any existing animations on this item to prevent conflicts
      item.splitOpacity.stopAnimation();
      item.leftX.stopAnimation();
      item.shakeY.stopAnimation();
      item.doubleOpacity1.stopAnimation();

      // Randomly choose between effect 11 and 17
      const useEffect11 = Math.random() > 0.5;

      if (useEffect11) {
        // Effect 11: Split + Double combo
        Animated.parallel([
          Animated.timing(item.splitOpacity, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(item.leftX, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(item.doubleOpacity1, {
            toValue: 0.5,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(item.splitOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(item.leftX, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(item.doubleOpacity1, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start();
          }, 50);
        });
      } else {
        // Effect 17: Vertical split
        Animated.parallel([
          Animated.timing(item.splitOpacity, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(item.shakeY, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(item.splitOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(item.shakeY, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
            ]).start();
          }, 50);
        });
      }
    },
    [items]
  );

  const handleOpen = useCallback(() => {
    // Backdrop fade in
    Animated.timing(backdropOpacity, {
      toValue: 0.9,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scanline animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanlineY, {
          toValue: screenHeight + 100,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanlineY, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Matrix-style falling animation - EXACT copy of CyberpunkGridMenu behavior
    items.forEach((item, index) => {
      const pos = HEX_POSITIONS[index];
      const delay = index * 80; // Staggered delay for cascade effect

      // Set initial position (X at final position, Y above screen)
      item.translateX.setValue(pos.x);
      item.translateY.setValue(-screenHeight); // Start from above screen
      item.scale.setValue(0);
      item.opacity.setValue(0);
      item.rotation.setValue(0);

      // Epic Matrix-style entrance animation sequence
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          // 1. FALLING ANIMATION: Falls PAST target, then springs back UP
          Animated.sequence([
            // Fall down PAST the target position (overshoot by 100px)
            Animated.timing(item.translateY, {
              toValue: pos.y + 100, // Goes 100px BELOW final position
              duration: 400,
              easing: Easing.in(Easing.quad), // Accelerate as it falls
              useNativeDriver: true,
            }),
            // Spring BACK UP to final position
            Animated.spring(item.translateY, {
              toValue: pos.y, // Bounces back UP to correct position
              damping: 6,
              stiffness: 120,
              mass: 0.4,
              velocity: 10,
              useNativeDriver: true,
            }),
          ]),

          // 2. ROTATION: Spin 720 degrees (2 full rotations) while falling
          Animated.sequence([
            Animated.timing(item.rotation, {
              toValue: 720, // 2 full rotations
              duration: 500,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            // Instantly reset to 0 after spinning
            Animated.timing(item.rotation, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),

          // 3. SCALE: Grow big → shrink small → settle to normal
          Animated.sequence([
            Animated.timing(item.scale, {
              toValue: 1.5, // Grow to 1.5x
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(item.scale, {
              toValue: 0.8, // Shrink to 0.8x
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.spring(item.scale, {
              toValue: 1, // Spring to normal size
              damping: 8,
              stiffness: 180,
              useNativeDriver: true,
            }),
          ]),

          // 4. OPACITY: Digital glitch flicker effect
          Animated.sequence([
            Animated.timing(item.opacity, {
              toValue: 0.2,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(item.opacity, {
              toValue: 1,
              duration: 30,
              useNativeDriver: true,
            }),
            Animated.timing(item.opacity, {
              toValue: 0.4,
              duration: 40,
              useNativeDriver: true,
            }),
            Animated.timing(item.opacity, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(item.opacity, {
              toValue: 0.6,
              duration: 30,
              useNativeDriver: true,
            }),
            Animated.timing(item.opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();

      // Pulse animation
      if (index < 2) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(item.pulse, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(item.pulse, {
              toValue: 0,
              duration: 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    });
  }, [items, backdropOpacity, scanlineY]);

  useEffect(() => {
    handleOpen();

    return () => {
      // Safe cleanup - check if animations exist before stopping
      items.forEach((item) => {
        if (item.scale) item.scale.stopAnimation();
        if (item.translateX) item.translateX.stopAnimation();
        if (item.translateY) item.translateY.stopAnimation();
        if (item.rotation) item.rotation.stopAnimation();
        if (item.opacity) item.opacity.stopAnimation();
        if (item.pressScale) item.pressScale.stopAnimation();
        if (item.pulse) item.pulse.stopAnimation();
        if (item.splitOpacity) item.splitOpacity.stopAnimation();
        if (item.leftX) item.leftX.stopAnimation();
        if (item.rightX) item.rightX.stopAnimation();
        if (item.doubleOpacity1) item.doubleOpacity1.stopAnimation();
        if (item.doubleOpacity2) item.doubleOpacity2.stopAnimation();
        if (item.distortScale) item.distortScale.stopAnimation();
        if (item.scanlineY) item.scanlineY.stopAnimation();
        if (item.scanlineOpacity) item.scanlineOpacity.stopAnimation();
        if (item.shakeY) item.shakeY.stopAnimation();
      });
      if (backdropOpacity) backdropOpacity.stopAnimation();
      if (scanlineY) scanlineY.stopAnimation();
    };
  }, [handleOpen, items, backdropOpacity, scanlineY]);

  const handlePressIn = useCallback(
    (index: number) => {
      const item = items[index];

      // Scale down animation for press feedback
      Animated.parallel([
        Animated.spring(item.pressScale, {
          toValue: 0.85,
          damping: 15,
          stiffness: 400,
          useNativeDriver: true,
        }),
        Animated.timing(item.scale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [items]
  );

  const handleClose = useCallback(() => {
    // Fast close animation - all buttons at once with slight stagger
    const animations: Animated.CompositeAnimation[] = [];
    
    items.forEach((item, index) => {
      const delay = index * 30; // Much smaller stagger (30ms vs 50ms)
      const pos = HEX_POSITIONS[index];

      animations.push(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            // Quick scale and fade
            Animated.timing(item.scale, {
              toValue: 0,
              duration: 200, // Faster than 300ms
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(item.opacity, {
              toValue: 0,
              duration: 150, // Faster than 250ms
              useNativeDriver: true,
            }),
            // Optional: slight upward movement from current position
            Animated.timing(item.translateY, {
              toValue: pos.y - 50, // Move up 50px from final position
              duration: 200,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    // Run all animations in parallel
    Animated.parallel([
      ...animations,
      // Fade out backdrop quickly
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200, // Faster than 300ms
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Close immediately after animations
      if (onClose) {
        onClose();
      }
    });
  }, [items, backdropOpacity, onClose]);

  const handlePressOut = useCallback(
    (index: number, onPress: () => void) => {
      const item = items[index];

      // Quick press feedback animation (don't wait for it)
      Animated.timing(item.pressScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      // Execute action immediately for better responsiveness
      if (onPress === onClose) {
        handleClose();
      } else {
        onPress();
        // Small delay before closing to let the user see the action happened
        setTimeout(() => {
          handleClose();
        }, 50);
      }
    },
    [items, handleClose, onClose]
  );

  // Track which buttons are currently animating with SVG border effects
  const [animatingButtons, setAnimatingButtons] = useState<{
    [key: number]: string;
  }>({});

  // Track scrambled text for each button
  const [scrambledTexts, setScrambledTexts] = useState<{
    [key: number]: { label: string; sublabel: string };
  }>({});

  // Utility to get a random character from the character set
  const getRandomChar = useCallback((chars: string) => {
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  // Create a bitmap-based text scrambler
  const createTextBitmap = useCallback((text: string) => {
    return text.split("").map(() => 1);
  }, []);

  // Render text based on bitmap (1 = scrambled, 0 = revealed)
  const renderScrambledText = useCallback(
    (text: string, bitmap: number[], chars: string) => {
      return text
        .split("")
        .map((char, idx) => {
          if (char === " ") return " ";
          return bitmap[idx] ? getRandomChar(chars) : char;
        })
        .join("");
    },
    [getRandomChar]
  );

  // Scramble text animation using bitmap approach
  const scrambleText = useCallback(
    (buttonIndex: number, originalLabel: string, originalSublabel: string) => {
      const chars = "#$_№:0@}-?=.,^!%:%|{f[4'1_0<]>'42";
      const scrambleSpeed = 30; // Update frequency in ms
      const revealSpeed = 60; // Speed of revealing characters
      const scrambleDuration = 600; // How long to scramble before revealing

      // Initialize bitmaps (all 1s = all scrambled)
      let labelBitmap = createTextBitmap(originalLabel);
      let sublabelBitmap = createTextBitmap(originalSublabel);

      // Phase 1: Full scramble animation
      const scrambleInterval = setInterval(() => {
        const scrambledLabel = renderScrambledText(
          originalLabel,
          labelBitmap,
          chars
        );
        const scrambledSublabel = renderScrambledText(
          originalSublabel,
          sublabelBitmap,
          chars
        );

        setScrambledTexts((prev) => ({
          ...prev,
          [buttonIndex]: {
            label: scrambledLabel,
            sublabel: scrambledSublabel,
          },
        }));
      }, scrambleSpeed);

      // Phase 2: Typewriter reveal (left to right)
      setTimeout(() => {
        let revealIndex = 0;
        const maxLength = Math.max(
          originalLabel.length,
          originalSublabel.length
        );

        const revealInterval = setInterval(() => {
          if (revealIndex < maxLength) {
            // Reveal character at current index for both texts
            if (revealIndex < labelBitmap.length) {
              labelBitmap[revealIndex] = 0;
            }
            if (revealIndex < sublabelBitmap.length) {
              sublabelBitmap[revealIndex] = 0;
            }
            revealIndex++;
          } else {
            // All characters revealed - clean up
            clearInterval(scrambleInterval);
            clearInterval(revealInterval);
            setScrambledTexts((prev) => {
              const newState = { ...prev };
              delete newState[buttonIndex];
              return newState;
            });
          }
        }, revealSpeed);
      }, scrambleDuration);
    },
    [createTextBitmap, renderScrambledText]
  );

  // Single controller for all effects - only 1-2 buttons animate at once
  // Use useRef to avoid re-renders affecting the background
  const effectLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    const effectLoop = () => {
      effectLoopRef.current = setTimeout(() => {
        // Only animate occasionally to reduce performance impact
        if (Math.random() > 0.3) { // 70% chance to show effect
          // Animate 1-2 buttons instead of 2-3
          const numButtons = Math.random() > 0.7 ? 2 : 1;

          // Pick random buttons
          const availableIndices = [0, 1, 2, 3, 4, 5];
          const selectedButtons: { [key: number]: string } = {};

          for (let i = 0; i < numButtons; i++) {
            if (availableIndices.length > 0) {
              const randomIndex = Math.floor(
                Math.random() * availableIndices.length
              );
              const buttonIndex = availableIndices[randomIndex];
              availableIndices.splice(randomIndex, 1);

              // Force scramble effect for testing
              const effectType = "scramble";
              selectedButtons[buttonIndex] = effectType;
            }
          }

          // Apply effects with requestAnimationFrame to avoid blocking
          requestAnimationFrame(() => {
            setAnimatingButtons(selectedButtons);

            // Trigger scramble animations for buttons with scramble effect
            Object.entries(selectedButtons).forEach(([index, effect]) => {
              if (effect === "scramble") {
                const buttonIdx = parseInt(index);
                const menuItem = menuItems[buttonIdx];
                scrambleText(buttonIdx, menuItem.label, menuItem.sublabel);
              }
            });

            // Clear effects after brief duration (except scramble which handles itself)
            setTimeout(() => {
              setAnimatingButtons({});
            }, 200);
          });
        }

        // Schedule next check with longer delay
        effectLoop();
      }, 5000 + Math.random() * 7000); // 5-12 seconds between effects
    };

    // Start the loop with initial delay
    effectLoopRef.current = setTimeout(effectLoop, 2000);

    return () => {
      if (effectLoopRef.current) {
        clearTimeout(effectLoopRef.current);
      }
    };
  }, [menuItems, scrambleText]);

  const renderGlitchedButton = (menuItem: any, index: number) => {
    const currentAnimation = animatingButtons[index];
    const scrambledText = scrambledTexts[index];

    return (
      <View style={styles.svgContainer}>
        {/* Use animated borders with random effects */}
        {currentAnimation ? (
          <AnimatedCyberpunkBorderBox
            color={menuItem.primaryColor}
            secondaryColor={menuItem.secondaryColor}
            accentColor={menuItem.accentColor}
            animationType={currentAnimation}
          />
        ) : (
          <CyberpunkBorderBox
            color={menuItem.primaryColor}
            secondaryColor={menuItem.secondaryColor}
            accentColor={menuItem.accentColor}
          />
        )}

        {/* Content on top of border */}
        <View style={styles.contentOverlay}>
          {/* Main content */}
          <View style={styles.contentContainer}>
            <View style={styles.iconWrapper}>{menuItem.icon}</View>
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.label,
                  {
                    color: menuItem.primaryColor,
                    textShadowColor: menuItem.primaryColor,
                  },
                ]}
              >
                {scrambledText ? scrambledText.label : menuItem.label}
              </Text>
              <Text
                style={[
                  styles.sublabel,
                  {
                    color: `${menuItem.primaryColor}99`,
                  },
                ]}
              >
                {scrambledText ? scrambledText.sublabel : menuItem.sublabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Pressable overlay for interaction */}
        <Pressable
          onPressIn={() => handlePressIn(index)}
          onPressOut={() => handlePressOut(index, menuItem.onPress)}
          style={[StyleSheet.absoluteFillObject, { zIndex: 10 }]}
          hitSlop={4}
        />
      </View>
    );
  };

  const pulseInterpolation = (pulse: Animated.Value) =>
    pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.05],
    });

  // Memoize the background component to prevent re-renders
  const MemoizedBackground = useMemo(() => <CyberpunkGlitchBackground />, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
      </Animated.View>

      {MemoizedBackground}

      <Animated.View
        style={[
          styles.scanline,
          {
            transform: [{ translateY: scanlineY }],
          },
        ]}
        pointerEvents="none"
      />

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
          const hasPulse = index < 2;

          const animatedStyle = {
            transform: [
              { translateX: item.translateX },
              { translateY: item.translateY },
              {
                rotate: item.rotation.interpolate({
                  inputRange: [0, 720],
                  outputRange: ["0deg", "720deg"],
                }),
              },
              {
                scale: hasPulse 
                  ? Animated.multiply(
                      Animated.multiply(item.scale, item.pressScale),
                      pulseInterpolation(item.pulse)
                    )
                  : Animated.multiply(item.scale, item.pressScale),
              },
            ],
            opacity: item.opacity,
          };

          return (
            <Animated.View
              key={index}
              style={[styles.itemWrapper, animatedStyle]}
            >
              {/* Shadow layer */}
              <View
                style={[
                  styles.shadowLayer,
                  {
                    shadowColor: menuItem.primaryColor,
                    shadowOpacity: 0.6,
                    shadowRadius: 30,
                  },
                ]}
              />

              {/* Render button with SVG glitch slices */}
              {renderGlitchedButton(menuItem, index)}
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
    backgroundColor: "rgba(0, 255, 255, 0.2)",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
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
  svgContainer: {
    width: 105,
    height: 65,
    position: "relative",
  },
  hexItem: {
    width: 105,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  contentOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  shadowLayer: {
    position: "absolute",
    width: 105,
    height: 65,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 0 },
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
    textShadowRadius: 15,
  },
  sublabel: {
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "monospace",
    opacity: 0.8,
    marginTop: 2, // Changed from -2 to 2 for more spacing
  },
  tanstackContainer: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  glitchContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
