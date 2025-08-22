import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  interpolate,
  Easing,
} from "react-native-reanimated";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { EnvVarInfo } from "../types";
import { getEnvVarType } from "../utils/envTypeDetector";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";
import { gameUIColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI";

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
        color: gameUIColors.success,
        bgColor: gameUIColors.success + "1A",
        borderColor: gameUIColors.success + "4D",
        label: "✓ VALID",
        labelColor: gameUIColors.success,
      };
    case "required_missing":
      return {
        icon: AlertCircle,
        color: gameUIColors.error,
        bgColor: gameUIColors.error + "1A",
        borderColor: gameUIColors.error + "4D",
        label: "⚠ MISSING",
        labelColor: gameUIColors.error,
      };
    case "required_wrong_value":
      return {
        icon: XCircle,
        color: gameUIColors.warning,
        bgColor: gameUIColors.warning + "1A",
        borderColor: gameUIColors.warning + "4D",
        label: "⚠ WRONG VALUE",
        labelColor: gameUIColors.warning,
      };
    case "required_wrong_type":
      return {
        icon: XCircle,
        color: gameUIColors.info,
        bgColor: gameUIColors.info + "1A",
        borderColor: gameUIColors.info + "4D",
        label: "⚠ WRONG TYPE",
        labelColor: gameUIColors.info,
      };
    case "optional_present":
      return {
        icon: Eye,
        color: gameUIColors.optional,
        bgColor: gameUIColors.optional + "1A",
        borderColor: gameUIColors.optional + "33",
        label: "OPTIONAL",
        labelColor: gameUIColors.optional,
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
  const hasExpectedType = envVar.expectedType !== undefined;
  const hasDescription = envVar.description !== undefined;

  // Animation values
  const glowIntensity = useSharedValue(0.3);
  const borderGlow = useSharedValue(0);
  const glitchX = useSharedValue(0);
  const glitchY = useSharedValue(0);
  const glitchOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const expandHeight = useSharedValue(isExpanded ? 1 : 0);

  // Handle expansion animation
  useEffect(() => {
    expandHeight.value = withSpring(isExpanded ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  }, [isExpanded]);

  // Random glitch effect (less frequent)
  useEffect(() => {
    const startRandomGlitch = () => {
      const nextGlitchDelay = 8000 + Math.random() * 10000 + index * 1000; // Less frequent

      const timeoutId = setTimeout(() => {
        const d = GLITCH_DURATION_MS;

        // Glitch opacity (more subtle)
        glitchOpacity.value = withSequence(
          withTiming(0.4, { duration: d * 0.2 }), // Less intense
          withTiming(0.2, { duration: d * 0.1 }),
          withTiming(0.3, { duration: d * 0.2 }),
          withTiming(0, { duration: d * 0.5 })
        );

        // Glitch displacement
        glitchX.value = withSequence(
          withTiming(5, { duration: d * 0.2 }),
          withTiming(-5, { duration: d * 0.3 }),
          withTiming(3, { duration: d * 0.2 }),
          withTiming(0, { duration: d * 0.3 })
        );

        glitchY.value = withSequence(
          withTiming(-2, { duration: d * 0.3 }),
          withTiming(2, { duration: d * 0.4 }),
          withTiming(0, { duration: d * 0.3 })
        );

        // Glow intensity during glitch
        glowIntensity.value = withSequence(
          withTiming(0.8, { duration: d * 0.3 }),
          withTiming(0.3, { duration: d * 0.7 })
        );

        startRandomGlitch();
      }, nextGlitchDelay);

      return () => clearTimeout(timeoutId);
    };

    const cleanup = startRandomGlitch();
    return cleanup;
  }, [index]);

  const handlePressIn = () => {
    pulseScale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    glowIntensity.value = withTiming(0.8, { duration: 100 });

    // Quick glitch on press
    glitchOpacity.value = withSequence(
      withTiming(1, { duration: 20 }),
      withTiming(0, { duration: 30 })
    );
  };

  const handlePressOut = () => {
    pulseScale.value = withSpring(1, { damping: 15, stiffness: 400 });
    glowIntensity.value = withTiming(0.3, { duration: 200 });
  };

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const borderAnimatedStyle = useAnimatedStyle(() => ({
    borderColor:
      interpolate(glowIntensity.value, [0, 1], [0.2, 0.8]) > 0.5
        ? config.borderColor
        : `${config.borderColor}80`,
    shadowOpacity: glowIntensity.value * 0.5,
  }));

  const glitchStyle = useAnimatedStyle(() => ({
    opacity: glitchOpacity.value,
    transform: [{ translateX: glitchX.value }, { translateY: glitchY.value }],
  }));

  const expandStyle = useAnimatedStyle(() => ({
    opacity: expandHeight.value,
    maxHeight: expandHeight.value * 300,
  }));

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
                      borderColor: `${config.color}40`,
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
                      { borderColor: `${config.color}20` },
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
                      { borderColor: `${config.color}30` },
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
                    { borderColor: `${config.color}30` },
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
    backgroundColor: gameUIColors.background + "F2", // Darker, more opaque background
  },
  glassLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: gameUIColors.panel + "4D", // Reduced transparency
    opacity: 0.7,
  },
  glassLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: gameUIColors.panel + "33",
    opacity: 0.5,
    top: "20%",
    left: "20%",
  },
  glassLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: gameUIColors.primary + "03",
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
    color: gameUIColors.primary,
    letterSpacing: 0.3,
    fontFamily: "monospace",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  envVarDescription: {
    fontSize: 11,
    color: gameUIColors.secondary, // Lighter gray for better readability
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
    backgroundColor: gameUIColors.primary + "0D",
    borderRadius: 4,
  },
  typeText: {
    fontSize: 8,
    color: gameUIColors.secondary,
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
    borderTopColor: gameUIColors.primary + "0D",
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
    backgroundColor: gameUIColors.background + "B3", // Darker background for better contrast
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
  },
  expectedBox: {
    backgroundColor: gameUIColors.background + "80",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  valueContent: {
    color: gameUIColors.primaryLight, // Brighter text
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  emptyWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    backgroundColor: gameUIColors.background + "4D",
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
    right: 12,
    bottom: 8,
    flexDirection: "row",
    gap: 3,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
});
