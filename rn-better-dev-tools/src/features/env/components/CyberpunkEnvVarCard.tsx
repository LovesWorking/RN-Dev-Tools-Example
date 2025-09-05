import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "rn-better-dev-tools/icons";
import { EnvVarInfo } from "../types";
import { getEnvVarType } from "../utils/envTypeDetector";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { macOSColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/macOSDesignSystemColors";

// CONFIGURABLE: Glitch duration
const GLITCH_DURATION_MS = 80; // Shorter glitch for less distraction

interface CyberpunkEnvVarCardProps {
  envVar: EnvVarInfo;
  isExpanded: boolean;
  onToggle: () => void;
  index?: number;
}

const getStatusConfig = (status: EnvVarInfo["status"]) => {
  switch (status) {
    case "required_present":
      return {
        icon: CheckCircle2,
        color: macOSColors.semantic.success,
        bgColor: macOSColors.semantic.successBackground,
        borderColor: macOSColors.semantic.success + "80",
        label: "✓ VALID",
        labelColor: macOSColors.semantic.success,
      };
    case "required_missing":
      return {
        icon: AlertCircle,
        color: macOSColors.semantic.error,
        bgColor: macOSColors.semantic.errorBackground,
        borderColor: macOSColors.semantic.error + "80",
        label: "⚠ MISSING",
        labelColor: macOSColors.semantic.error,
      };
    case "required_wrong_value":
      return {
        icon: XCircle,
        color: macOSColors.semantic.warning,
        bgColor: macOSColors.semantic.warningBackground,
        borderColor: macOSColors.semantic.warning + "80",
        label: "⚠ WRONG VALUE",
        labelColor: macOSColors.semantic.warning,
      };
    case "required_wrong_type":
      return {
        icon: XCircle,
        color: macOSColors.semantic.info,
        bgColor: macOSColors.semantic.infoBackground,
        borderColor: macOSColors.semantic.info + "80",
        label: "⚠ WRONG TYPE",
        labelColor: macOSColors.semantic.info,
      };
    case "optional_present":
      return {
        icon: Eye,
        color: macOSColors.semantic.debug,
        bgColor: macOSColors.semantic.debug + "1A",
        borderColor: macOSColors.semantic.debug + "66",
        label: "OPTIONAL",
        labelColor: macOSColors.semantic.debug,
      };
  }
};

const formatValue = (value: unknown, isExpanded: boolean = false): string => {
  if (value === undefined || value === null) {
    return "undefined";
  }
  if (typeof value === "string") {
    if (isExpanded) return value;
    return value.length > 40 ? `${value.substring(0, 40)}...` : value;
  }
  const stringified = displayValue(value, isExpanded);
  if (isExpanded) return stringified;
  return stringified.length > 40
    ? `${stringified.substring(0, 40)}...`
    : stringified;
};

export function CyberpunkEnvVarCard({
  envVar,
  isExpanded,
  onToggle,
  index = 0,
}: CyberpunkEnvVarCardProps) {
  const config = getStatusConfig(envVar.status);
  const StatusIcon = config.icon;
  const hasValue = envVar.value !== undefined && envVar.value !== null;
  const hasExpectedValue = envVar.expectedValue !== undefined;
  const hasDescription = envVar.description !== undefined;

  // Animation values
  const glowIntensity = useRef(new Animated.Value(0.3)).current;
  const glitchX = useRef(new Animated.Value(0)).current;
  const glitchY = useRef(new Animated.Value(0)).current;
  const glitchOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;
  const expandHeight = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  // Handle expansion animation
  useEffect(() => {
    Animated.spring(expandHeight, {
      toValue: isExpanded ? 1 : 0,
      damping: 15,
      stiffness: 100,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, expandHeight]);

  // Random glitch effect (less frequent)
  useEffect(() => {
    const startRandomGlitch = () => {
      const nextGlitchDelay = 8000 + Math.random() * 10000 + index * 1000; // Less frequent

      const timeoutId = setTimeout(() => {
        const d = GLITCH_DURATION_MS;

        // Glitch opacity (more subtle)
        Animated.sequence([
          Animated.timing(glitchOpacity, {
            toValue: 0.4,
            duration: d * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(glitchOpacity, {
            toValue: 0.2,
            duration: d * 0.1,
            useNativeDriver: true,
          }),
          Animated.timing(glitchOpacity, {
            toValue: 0.3,
            duration: d * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(glitchOpacity, {
            toValue: 0,
            duration: d * 0.5,
            useNativeDriver: true,
          }),
        ]).start();

        // Glitch displacement
        Animated.sequence([
          Animated.timing(glitchX, {
            toValue: 5,
            duration: d * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(glitchX, {
            toValue: -5,
            duration: d * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(glitchX, {
            toValue: 3,
            duration: d * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(glitchX, {
            toValue: 0,
            duration: d * 0.3,
            useNativeDriver: true,
          }),
        ]).start();

        Animated.sequence([
          Animated.timing(glitchY, {
            toValue: -2,
            duration: d * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(glitchY, {
            toValue: 2,
            duration: d * 0.4,
            useNativeDriver: true,
          }),
          Animated.timing(glitchY, {
            toValue: 0,
            duration: d * 0.3,
            useNativeDriver: true,
          }),
        ]).start();

        // Glow intensity during glitch
        Animated.sequence([
          Animated.timing(glowIntensity, {
            toValue: 0.8,
            duration: d * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(glowIntensity, {
            toValue: 0.3,
            duration: d * 0.7,
            useNativeDriver: true,
          }),
        ]).start();

        startRandomGlitch();
      }, nextGlitchDelay);

      return () => clearTimeout(timeoutId);
    };

    const cleanup = startRandomGlitch();
    return cleanup;
  }, [index, glitchOpacity, glitchX, glitchY, glowIntensity]);

  const handlePressIn = () => {
    Animated.spring(pulseScale, {
      toValue: 0.98,
      damping: 15,
      stiffness: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(glowIntensity, {
      toValue: 0.8,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Quick glitch on press
    Animated.sequence([
      Animated.timing(glitchOpacity, {
        toValue: 1,
        duration: 20,
        useNativeDriver: true,
      }),
      Animated.timing(glitchOpacity, {
        toValue: 0,
        duration: 30,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.spring(pulseScale, {
      toValue: 1,
      damping: 15,
      stiffness: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(glowIntensity, {
      toValue: 0.3,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const containerAnimatedStyle = {
    transform: [{ scale: pulseScale }],
  };

  const borderAnimatedStyle = {
    borderColor: config.borderColor,
    shadowOpacity: glowIntensity.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    }),
  };

  const glitchStyle = {
    opacity: glitchOpacity,
    transform: [{ translateX: glitchX }, { translateY: glitchY }],
  };

  const expandStyle = {
    opacity: expandHeight,
    maxHeight: expandHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 300],
    }),
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 255, b: 255 };
  };

  const rgb = hexToRgb(config.color);

  return (
    <Pressable
      onPress={onToggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <Animated.View
          style={[
            styles.card,
            borderAnimatedStyle,
            { shadowColor: config.color },
          ]}
        >
          {/* Glass effect layers */}
          <View
            style={[
              styles.glassLayer1,
              { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.02)` },
            ]}
          />
          <View
            style={[
              styles.glassLayer2,
              { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.015)` },
            ]}
          />
          <View style={[styles.glassLayer3]} />

          {/* Corner accents */}
          <View
            style={[
              styles.cornerAccent,
              styles.cornerTL,
              { backgroundColor: config.color },
            ]}
          />
          <View
            style={[
              styles.cornerAccent,
              styles.cornerTR,
              { backgroundColor: `${config.color}60` },
            ]}
          />
          <View
            style={[
              styles.cornerAccent,
              styles.cornerBL,
              { backgroundColor: `${config.color}60` },
            ]}
          />
          <View
            style={[
              styles.cornerAccent,
              styles.cornerBR,
              { backgroundColor: config.color },
            ]}
          />

          {/* Glitch overlay */}
          <Animated.View
            style={[
              styles.glitchOverlay,
              glitchStyle,
              {
                backgroundColor: `${config.color}10`,
                borderColor: config.color,
              },
            ]}
            pointerEvents="none"
          />

          {/* Main content */}
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: config.bgColor,
                      borderColor: `${config.color}70`,
                    },
                  ]}
                >
                  <StatusIcon size={16} color={config.color} />
                </View>
                <View style={styles.headerInfo}>
                  <Text
                    style={[
                      styles.envVarKey,
                      { textShadowColor: config.color },
                    ]}
                  >
                    {envVar.key}
                  </Text>
                  {hasDescription && (
                    <Text style={styles.envVarDescription}>
                      {envVar.description}
                    </Text>
                  )}
                  <View style={styles.badges}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: config.bgColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: config.labelColor },
                        ]}
                      >
                        {config.label}
                      </Text>
                    </View>
                    {hasValue && (
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>
                          {getEnvVarType(envVar.value).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.headerRight}>
                <View
                  style={[
                    styles.expandButton,
                    { backgroundColor: `${config.color}10` },
                  ]}
                >
                  {isExpanded ? (
                    <ChevronUp size={14} color={config.color} />
                  ) : (
                    <ChevronDown size={14} color={config.color} />
                  )}
                </View>
              </View>
            </View>

            {/* Expanded content */}
            <Animated.View style={[styles.expandedContent, expandStyle]}>
              {hasValue && (
                <View style={styles.valueSection}>
                  <Text
                    style={[styles.valueLabel, { color: `${config.color}99` }]}
                  >
                    CURRENT VALUE
                  </Text>
                  <View
                    style={[
                      styles.valueBox,
                      { borderColor: `${config.color}60` },
                    ]}
                  >
                    <Text style={styles.valueContent} selectable>
                      {formatValue(envVar.value, true)}
                    </Text>
                  </View>
                </View>
              )}

              {hasExpectedValue && (
                <View style={styles.valueSection}>
                  <Text
                    style={[styles.valueLabel, { color: `${config.color}99` }]}
                  >
                    EXPECTED VALUE
                  </Text>
                  <View
                    style={[
                      styles.expectedBox,
                      { borderColor: `${config.color}70` },
                    ]}
                  >
                    <Text
                      style={[styles.valueContent, { color: config.color }]}
                      selectable
                    >
                      {envVar.expectedValue}
                    </Text>
                  </View>
                </View>
              )}

              {!hasValue && (
                <View
                  style={[
                    styles.emptyWarning,
                    { borderColor: `${config.color}60` },
                  ]}
                >
                  <AlertCircle size={14} color={config.color} />
                  <Text style={[styles.emptyText, { color: config.color }]}>
                    Variable not defined
                  </Text>
                </View>
              )}
            </Animated.View>

            {/* Data dots decoration */}
            <View style={styles.dataDots}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: config.color, opacity: 0.8 },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  { backgroundColor: config.color, opacity: 0.5 },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  { backgroundColor: config.color, opacity: 0.3 },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: macOSColors.background.card, // Card background from macOS design
  },
  glassLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: macOSColors.background.hover + "4D", // Hover state background
    opacity: 0.7,
  },
  glassLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: macOSColors.background.hover + "33",
    opacity: 0.5,
    top: "20%",
    left: "20%",
  },
  glassLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: macOSColors.text.primary + "03",
    opacity: 0.3,
  },
  glitchOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
    borderWidth: 0.5, // Thinner border
    zIndex: 5,
  },
  cornerAccent: {
    position: "absolute",
    width: 10,
    height: 1,
    opacity: 0.6, // More subtle
  },
  cornerTL: {
    top: 0,
    left: 0,
    width: 1,
    height: 10,
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
    width: 1,
    height: 10,
  },
  content: {
    zIndex: 1,
  },
  header: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  envVarKey: {
    fontSize: 14,
    fontWeight: "600",
    color: macOSColors.text.primary,
    letterSpacing: 0.3,
    fontFamily: "monospace",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  envVarDescription: {
    fontSize: 11,
    color: macOSColors.text.secondary, // Secondary text color
    fontFamily: "monospace",
    opacity: 0.9,
    marginTop: 2,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    fontFamily: "monospace",
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: macOSColors.text.primary + "0D",
    borderRadius: 4,
  },
  typeText: {
    fontSize: 8,
    color: macOSColors.text.secondary,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  headerRight: {
    marginLeft: 8,
  },
  expandButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: macOSColors.border.default,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
    overflow: "hidden",
  },
  valueSection: {
    gap: 6,
  },
  valueLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "monospace",
  },
  valueBox: {
    backgroundColor: macOSColors.background.input, // Input background
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
  },
  expectedBox: {
    backgroundColor: macOSColors.background.input + "80",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  valueContent: {
    color: macOSColors.text.primary, // Primary text
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  emptyWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    backgroundColor: macOSColors.background.base + "4D",
    borderRadius: 6,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  dataDots: {
    position: "absolute",
    right: 6,
    bottom: 4,
    flexDirection: "row",
    gap: 3,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
});
