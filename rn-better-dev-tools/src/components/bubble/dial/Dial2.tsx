import React, { useEffect, useRef, useState } from "react";
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
  ChevronRightIcon,
  LayersIcon,
  GlobeIcon,
} from "@/rn-better-dev-tools/src/shared/icons/lucide-icons";
import {
  getSafeAreaInsets,
  hasNotch as getHasNotch,
} from "@/rn-better-dev-tools/src/shared/hooks/useSafeAreaInsets";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/index";
import { TanstackLogo } from "@/rn-better-dev-tools/src/features/react-query/components/query-browser/svgs";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const insets = getSafeAreaInsets();
const hasNotch = getHasNotch();

// Dynamic safe areas and dimensions
const TOP_SAFE_AREA = insets.top + 10; // Add some padding
const BOTTOM_SAFE_AREA = insets.bottom + 10; // Add some padding

// Calculate available space for menu - use maximum available height
const HUD_TOP_HEIGHT = 60; // Space for top HUD (reduced)
const HUD_BOTTOM_HEIGHT = 60; // Space for bottom stats (reduced)
const MENU_PADDING = 10; // Minimal breathing room

const availableHeight =
  SCREEN_HEIGHT -
  TOP_SAFE_AREA -
  BOTTOM_SAFE_AREA -
  HUD_TOP_HEIGHT -
  HUD_BOTTOM_HEIGHT -
  MENU_PADDING;
const MENU_WIDTH = Math.min(SCREEN_WIDTH * 0.9, 380);
const MENU_HEIGHT = availableHeight; // Use all available height

interface Dial2Props {
  onQueryPress: () => void;
  onEnvPress: () => void;
  onSentryPress: () => void;
  onStoragePress: () => void;
  onWifiToggle: () => void;
  onNetworkPress?: () => void;
  onClose?: () => void;
  isWifiEnabled?: boolean;
  environment?: "local" | "dev" | "qa" | "staging" | "prod";
}

const Dial2: React.FC<Dial2Props> = ({
  onQueryPress,
  onEnvPress,
  onSentryPress,
  onStoragePress,
  onWifiToggle,
  onNetworkPress,
  onClose,
  isWifiEnabled = true,
  environment = "dev",
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [systemStatus] = useState({
    bugs: Math.floor(Math.random() * 40 + 30),
    coffee: Math.floor(Math.random() * 30 + 50),
    sanity: Math.floor(Math.random() * 50 + 20),
  });

  // Core animations
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const menuScale = useRef(new Animated.Value(0.8)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-100)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  // HUD animations
  const hudLeft = useRef(new Animated.Value(-200)).current;
  const hudRight = useRef(new Animated.Value(200)).current;
  const hudTop = useRef(new Animated.Value(-100)).current;
  const hudBottom = useRef(new Animated.Value(100)).current;

  // Glitch and effects
  const glitchAnimation = useRef(new Animated.Value(0)).current;
  const scanlinePosition = useRef(new Animated.Value(0)).current;
  const dataStream = useRef(new Animated.Value(0)).current;
  const warningPulse = useRef(new Animated.Value(0)).current;
  const envPulse = useRef(new Animated.Value(0)).current;

  // Button animations
  const buttonAnimations = useRef(
    Array.from({ length: 7 }, () => ({
      scale: new Animated.Value(0),
      slide: new Animated.Value(-50),
      glow: new Animated.Value(0),
    }))
  ).current;

  const menuItems = [
    {
      title: "REACT QUERY",
      subtitle: "DATA SYNCHRONIZATION",
      icon: <TanstackLogo />,
      onPress: onQueryPress,
      color: gameUIColors.query,
      accentColor: gameUIColors.info,
      stats: { active: 12, cached: 48, stale: 3 },
      level: "LVL 99",
      status: "ACTIVE",
    },
    {
      title: "ENVIRONMENT",
      subtitle: "SYSTEM CONFIGURATION",
      icon: <ServerIcon size={24} color={gameUIColors.env} />,
      onPress: onEnvPress,
      color: gameUIColors.env,
      accentColor: gameUIColors.success,
      stats: { vars: 24, secrets: 8, configs: 16 },
      level: "LVL 87",
      status: "SECURE",
    },
    {
      title: "SENTRY",
      subtitle: "ERROR TRACKING",
      icon: <BugIcon size={24} color={gameUIColors.debug} />,
      onPress: onSentryPress,
      color: gameUIColors.debug,
      accentColor: gameUIColors.error,
      stats: { errors: 0, warnings: 3, logs: 156 },
      level: "LVL 92",
      status: "MONITORING",
    },
    {
      title: "STORAGE",
      subtitle: "DATA PERSISTENCE",
      icon: <DatabaseIcon size={24} color={gameUIColors.storage} />,
      onPress: onStoragePress,
      color: gameUIColors.storage,
      accentColor: gameUIColors.warning,
      stats: { used: "2.4GB", free: "5.6GB", total: "8GB" },
      level: "LVL 78",
      status: "OPTIMAL",
    },
    {
      title: isWifiEnabled ? "NETWORK ONLINE" : "NETWORK OFFLINE",
      subtitle: isWifiEnabled ? "CONNECTION STABLE" : "CONNECTION LOST",
      icon: isWifiEnabled ? (
        <WifiIcon size={24} color={gameUIColors.network} />
      ) : (
        <WifiOffIcon size={24} color={gameUIColors.muted} />
      ),
      onPress: onWifiToggle,
      color: isWifiEnabled ? gameUIColors.network : gameUIColors.muted,
      accentColor: isWifiEnabled
        ? gameUIColors.optional
        : gameUIColors.secondary,
      stats: isWifiEnabled
        ? { ping: "12ms", upload: "45MB/s", download: "120MB/s" }
        : { ping: "---", upload: "---", download: "---" },
      level: isWifiEnabled ? "LVL 95" : "LVL 0",
      status: isWifiEnabled ? "CONNECTED" : "OFFLINE",
    },
    {
      title: "NETWORK MONITOR",
      subtitle: "HTTP TRAFFIC ANALYZER",
      icon: <GlobeIcon size={24} color={gameUIColors.network} />,
      onPress: onNetworkPress || (() => {}),
      color: gameUIColors.network,
      accentColor: gameUIColors.info,
      stats: { requests: 0, pending: 0, failed: 0 },
      level: "LVL 75",
      status: "ACTIVE",
    },
    {
      title: "EXIT INTERFACE",
      subtitle: "CLOSE ADMIN PANEL",
      icon: <XIcon size={24} color={gameUIColors.critical} />,
      onPress: () => {},
      color: gameUIColors.critical,
      accentColor: gameUIColors.error,
      stats: { session: "12:34", actions: 42, score: 9999 },
      level: "MAX",
      status: "LOGOUT",
    },
  ];

  useEffect(() => {
    // Epic entrance sequence
    Animated.sequence([
      // Backdrop fade in with delay
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),

      // Main menu appear with spring
      Animated.parallel([
        Animated.spring(menuScale, {
          toValue: 1,
          damping: 8,
          stiffness: 100,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // HUD elements slide in
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(hudLeft, {
          toValue: 0,
          damping: 10,
          stiffness: 80,
          useNativeDriver: true,
        }),
        Animated.spring(hudRight, {
          toValue: 0,
          damping: 10,
          stiffness: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);

    setTimeout(() => {
      Animated.parallel([
        Animated.spring(hudTop, {
          toValue: 0,
          damping: 10,
          stiffness: 80,
          useNativeDriver: true,
        }),
        Animated.spring(hudBottom, {
          toValue: 0,
          damping: 10,
          stiffness: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Header slide down
    setTimeout(() => {
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 400);

    // Content fade in
    setTimeout(() => {
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Stagger button animations
    buttonAnimations.forEach((anim, index) => {
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(anim.scale, {
            toValue: 1,
            damping: 10,
            stiffness: 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim.slide, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }, 600 + index * 80);
    });

    // Continuous scanline
    Animated.loop(
      Animated.timing(scanlinePosition, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Data stream animation
    Animated.loop(
      Animated.timing(dataStream, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Warning pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(warningPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(warningPulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Environment badge pulse (slower for prod, faster for dev)
    const pulseDuration =
      environment === "prod" ? 2000 : environment === "staging" ? 1500 : 1000;
    Animated.loop(
      Animated.sequence([
        Animated.timing(envPulse, {
          toValue: 1,
          duration: pulseDuration,
          useNativeDriver: true,
        }),
        Animated.timing(envPulse, {
          toValue: 0.3,
          duration: pulseDuration,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        Animated.sequence([
          Animated.timing(glitchAnimation, {
            toValue: 1,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(glitchAnimation, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleClose = () => {
    // Epic exit sequence
    Animated.parallel([
      // Buttons disappear
      ...buttonAnimations
        .map((anim, index) =>
          Animated.sequence([
            Animated.delay(index * 30),
            Animated.parallel([
              Animated.timing(anim.scale, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(anim.slide, {
                toValue: 50,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
          ])
        )
        .flat(),

      // HUD elements slide out
      Animated.timing(hudLeft, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(hudRight, {
        toValue: 200,
        duration: 300,
        useNativeDriver: true,
      }),

      // Menu disappear
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(menuScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),

      // Backdrop fade
      Animated.delay(100),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) {
        setTimeout(onClose, 0);
      }
    });
  };

  const handleItemPress = (index: number) => {
    setSelectedIndex(index);
    const item = menuItems[index];

    // Pulse animation
    Animated.sequence([
      Animated.timing(buttonAnimations[index].glow, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimations[index].glow, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (item.title === "EXIT INTERFACE") {
      setTimeout(handleClose, 100);
    } else {
      setTimeout(() => {
        item.onPress();
        handleClose();
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated backdrop with gradient */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={handleClose}
        />

        {/* Scanline effect */}
        <Animated.View
          style={[
            styles.scanline,
            {
              transform: [
                {
                  translateY: scanlinePosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, SCREEN_HEIGHT + 100],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Grid overlay */}
        <View style={styles.gridOverlay} />
      </Animated.View>

      {/* HUD Elements */}

      {/* Top HUD */}
      <Animated.View
        style={[styles.hudTop, { transform: [{ translateY: hudTop }] }]}
      >
        <View style={styles.hudTopContent}>
          <View style={styles.hudCenter}>
            <Text style={styles.hudTitle}>ADMIN CONSOLE</Text>
            <Text style={styles.hudSubtitle}>INTERNAL DEV TOOLS</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Stats HUD */}
      <Animated.View
        style={[styles.hudBottom, { transform: [{ translateY: hudBottom }] }]}
      >
        <View style={styles.hudBottomContent}>
          <View style={styles.statMini}>
            <Text style={styles.statMiniLabel}>BUGS</Text>
            <View style={styles.statMiniBar}>
              <View
                style={[
                  styles.statMiniFill,
                  {
                    width: `${systemStatus.bugs}%`,
                    backgroundColor: gameUIColors.error,
                  },
                ]}
              />
            </View>
            <Text style={styles.statMiniValue}>{systemStatus.bugs}</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statMiniLabel}>COFFEE</Text>
            <View style={styles.statMiniBar}>
              <View
                style={[
                  styles.statMiniFill,
                  {
                    width: `${systemStatus.coffee}%`,
                    backgroundColor: gameUIColors.warning,
                  },
                ]}
              />
            </View>
            <Text style={styles.statMiniValue}>{systemStatus.coffee}%</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={styles.statMiniLabel}>SANITY</Text>
            <View style={styles.statMiniBar}>
              <View
                style={[
                  styles.statMiniFill,
                  {
                    width: `${systemStatus.sanity}%`,
                    backgroundColor: gameUIColors.network,
                  },
                ]}
              />
            </View>
            <Text style={styles.statMiniValue}>{systemStatus.sanity}%</Text>
          </View>
        </View>
      </Animated.View>

      {/* Right Status Badges */}
      <Animated.View
        style={[styles.hudRight, { transform: [{ translateX: hudRight }] }]}
      >
        <View style={styles.hudVertical}>
          {/* Removed PROD SHIP IT NO BUGS badges */}
        </View>
      </Animated.View>

      {/* Main Menu */}
      <Animated.View
        style={[
          styles.menuContainer,
          {
            opacity: menuOpacity,
            transform: [
              { scale: menuScale },
              {
                translateX: glitchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 5],
                }),
              },
            ],
          },
        ]}
      >
        {/* Menu Header */}
        <Animated.View
          style={[
            styles.menuHeader,
            { transform: [{ translateY: headerSlide }] },
          ]}
        >
          <View style={styles.headerLeft}>
            <LayersIcon size={20} color={gameUIColors.info} />
            <Text style={styles.headerTitle}>ADMIN MENU</Text>
          </View>
          <View style={styles.headerRight}>
            <Animated.View
              style={[
                styles.envBadge,
                {
                  backgroundColor:
                    environment === "prod"
                      ? gameUIColors.error + "26"
                      : environment === "staging"
                      ? gameUIColors.warning + "26"
                      : environment === "qa"
                      ? gameUIColors.info + "26"
                      : gameUIColors.success + "26",
                  borderColor:
                    environment === "prod"
                      ? gameUIColors.error
                      : environment === "staging"
                      ? gameUIColors.warning
                      : environment === "qa"
                      ? gameUIColors.info
                      : gameUIColors.success,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.envDot,
                  {
                    backgroundColor:
                      environment === "prod"
                        ? gameUIColors.error
                        : environment === "staging"
                        ? gameUIColors.warning
                        : environment === "qa"
                        ? gameUIColors.info
                        : gameUIColors.success,
                    shadowColor:
                      environment === "prod"
                        ? gameUIColors.error
                        : environment === "staging"
                        ? gameUIColors.warning
                        : environment === "qa"
                        ? gameUIColors.info
                        : gameUIColors.success,
                    opacity: envPulse,
                  },
                ]}
              />
              <Text style={styles.envLabel}>ENV</Text>
              <Text
                style={[
                  styles.envValue,
                  {
                    color:
                      environment === "prod"
                        ? gameUIColors.error
                        : environment === "staging"
                        ? gameUIColors.warning
                        : environment === "qa"
                        ? gameUIColors.info
                        : gameUIColors.success,
                    textShadowColor:
                      environment === "prod"
                        ? gameUIColors.error
                        : environment === "staging"
                        ? gameUIColors.warning
                        : environment === "qa"
                        ? gameUIColors.info
                        : gameUIColors.success,
                  },
                ]}
              >
                {environment.toUpperCase()}
              </Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Menu Content */}
        <Animated.ScrollView
          style={[styles.menuContent, { opacity: contentFade }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuContentContainer}
        >
          {menuItems.map((item, index) => {
            const anim = buttonAnimations[index];
            const isSelected = selectedIndex === index;

            return (
              <Animated.View
                key={index}
                style={[
                  styles.menuItemWrapper,
                  {
                    transform: [
                      { scale: anim.scale },
                      { translateX: anim.slide },
                    ],
                  },
                ]}
              >
                <Pressable
                  onPress={() => handleItemPress(index)}
                  style={[
                    styles.menuItem,
                    isSelected && styles.menuItemSelected,
                    { borderColor: item.color + "40" },
                  ]}
                >
                  {/* Glow effect */}
                  <Animated.View
                    style={[
                      styles.itemGlow,
                      {
                        backgroundColor: item.color,
                        opacity: anim.glow.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 0.3],
                        }),
                      },
                    ]}
                  />

                  {/* Left side - Icon and main info */}
                  <View style={styles.itemLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: item.color + "20" },
                      ]}
                    >
                      {item.icon}
                      <View
                        style={[styles.iconBorder, { borderColor: item.color }]}
                      />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemTitle, { color: item.color }]}>
                        {item.title}
                      </Text>
                      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                      <View style={styles.itemStats}>
                        {Object.entries(item.stats)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <Text key={key} style={styles.statText}>
                              {key.toUpperCase()}: {value}
                            </Text>
                          ))}
                      </View>
                    </View>
                  </View>

                  {/* Right side - Level and status */}
                  <View style={styles.itemRight}>
                    <Text
                      style={[styles.itemLevel, { color: item.accentColor }]}
                    >
                      {item.level}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: item.color + "20" },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: item.color }]}>
                        {item.status}
                      </Text>
                    </View>
                    <ChevronRightIcon size={20} color={item.color} />
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>

        {/* Menu Footer */}
        <View style={styles.menuFooter}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerText}>SESSION: ACTIVE</Text>
          </View>
          <View style={styles.footerCenter}>
            <View style={styles.footerDots}>
              {[...Array(5)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.footerDot,
                    {
                      backgroundColor:
                        i < 3 ? gameUIColors.info : gameUIColors.muted,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerText}>v2.0.1</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default Dial2;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: gameUIColors.backdrop,
  },
  scanline: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: gameUIColors.info + "1A",
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: "transparent",
    backgroundImage: `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(0, 255, 255, 0.03) 20px,
      rgba(0, 255, 255, 0.03) 21px
    ), repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(255, 0, 255, 0.03) 20px,
      rgba(255, 0, 255, 0.03) 21px
    )`,
  },
  hudTop: {
    position: "absolute",
    top: TOP_SAFE_AREA,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  hudTopContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  hudSection: {
    alignItems: "center",
  },
  hudCenter: {
    alignItems: "center",
  },
  hudTitle: {
    fontSize: hasNotch ? 18 : 14,
    fontWeight: "900",
    color: gameUIColors.info,
    letterSpacing: hasNotch ? 3 : 2,
    textShadowColor: gameUIColors.info,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    fontFamily: "monospace",
  },
  hudSubtitle: {
    fontSize: hasNotch ? 10 : 8,
    color: gameUIColors.secondary,
    letterSpacing: hasNotch ? 2 : 1,
    marginTop: hasNotch ? 2 : 0,
    fontFamily: "monospace",
  },
  hudLabel: {
    fontSize: 9,
    color: gameUIColors.muted,
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  hudValue: {
    fontSize: 12,
    color: gameUIColors.info,
    fontWeight: "bold",
    marginTop: 2,
    fontFamily: "monospace",
  },
  hudBottom: {
    position: "absolute",
    bottom: BOTTOM_SAFE_AREA,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  hudBottomContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  hudRight: {
    position: "absolute",
    right: 15,
    top: "50%",
    marginTop: -80,
    zIndex: 1000,
  },
  hudVertical: {
    gap: 20,
  },
  statMini: {
    alignItems: "center",
    minWidth: 80,
  },
  statMiniLabel: {
    fontSize: hasNotch ? 8 : 7,
    color: gameUIColors.info,
    marginBottom: hasNotch ? 3 : 2,
    fontFamily: "monospace",
    letterSpacing: 1,
    fontWeight: "bold",
  },
  statMiniBar: {
    width: hasNotch ? 60 : 45,
    height: hasNotch ? 3 : 2,
    backgroundColor: gameUIColors.primary + "1A",
    borderRadius: 2,
    overflow: "hidden",
  },
  statMiniFill: {
    height: "100%",
    borderRadius: 2,
  },
  statMiniValue: {
    fontSize: 9,
    color: gameUIColors.secondary,
    marginTop: 2,
    fontFamily: "monospace",
  },
  hudBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 6,
    backgroundColor: gameUIColors.background + "B3",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: gameUIColors.primary + "1A",
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  menuContainer: {
    width: MENU_WIDTH,
    height: MENU_HEIGHT,
    maxHeight: MENU_HEIGHT,
    backgroundColor: gameUIColors.panel,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: gameUIColors.border,
    shadowColor: gameUIColors.info,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    overflow: "hidden",
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: hasNotch ? 20 : 15,
    paddingVertical: hasNotch ? 15 : 10,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.primary + "1A",
    backgroundColor: gameUIColors.background + "80",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: hasNotch ? 14 : 12,
    fontWeight: "bold",
    color: gameUIColors.primary,
    letterSpacing: hasNotch ? 2 : 1,
    fontFamily: "monospace",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  envBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  envDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  envLabel: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    letterSpacing: 1,
    fontWeight: "bold",
  },
  envValue: {
    fontSize: 11,
    fontFamily: "monospace",
    fontWeight: "bold",
    letterSpacing: 1.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  menuContent: {
    flex: 1,
    padding: hasNotch ? 15 : 10,
    gap: hasNotch ? 10 : 5,
  },
  menuContentContainer: {
    paddingBottom: 20, // Extra padding at bottom for scrolling
  },
  menuItemWrapper: {
    marginBottom: hasNotch ? 5 : 3,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: hasNotch ? 15 : 10,
    backgroundColor: gameUIColors.primary + "05",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: gameUIColors.primary + "0D",
    position: "relative",
    overflow: "hidden",
  },
  menuItemSelected: {
    backgroundColor: gameUIColors.info + "0D",
    borderColor: gameUIColors.info + "33",
  },
  itemGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: hasNotch ? 50 : 40,
    height: hasNotch ? 50 : 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: gameUIColors.primary + "33",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: hasNotch ? 14 : 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: hasNotch ? 2 : 1,
    fontFamily: "monospace",
  },
  itemSubtitle: {
    fontSize: hasNotch ? 10 : 8,
    color: gameUIColors.secondary,
    letterSpacing: 0.5,
    marginBottom: hasNotch ? 4 : 2,
    fontFamily: "monospace",
  },
  itemStats: {
    flexDirection: "row",
    gap: 10,
  },
  statText: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontFamily: "monospace",
  },
  itemRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  itemLevel: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
    fontFamily: "monospace",
  },
  menuFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: hasNotch ? 20 : 15,
    paddingVertical: hasNotch ? 12 : 8,
    borderTopWidth: 1,
    borderTopColor: gameUIColors.primary + "1A",
    backgroundColor: gameUIColors.background + "80",
  },
  footerLeft: {},
  footerCenter: {},
  footerRight: {},
  footerText: {
    fontSize: 9,
    color: gameUIColors.muted,
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  footerDots: {
    flexDirection: "row",
    gap: 5,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
