import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { AlertCircle, CheckCircle2, Eye, XCircle } from "lucide-react-native";
import { EnvVarStats } from "../types";

interface CyberpunkEnvVarStatsProps {
  stats: EnvVarStats;
}

// Variable type configurations with cyberpunk colors
const variableTypeData = [
  {
    key: "valid",
    label: "VALID VARIABLES",
    description: "Correctly configured",
    icon: CheckCircle2,
    color: "#00FF88", // Bright green
    textColor: "#00FF88",
    bgColor: "rgba(0, 255, 136, 0.1)",
  },
  {
    key: "missing",
    label: "MISSING VARIABLES",
    description: "Required but not defined",
    icon: AlertCircle,
    color: "#FF006E", // Hot pink
    textColor: "#FF006E",
    bgColor: "rgba(255, 0, 110, 0.1)",
  },
  {
    key: "wrongValue",
    label: "WRONG VALUES",
    description: "Incorrect value",
    icon: XCircle,
    color: "#FF9500", // Orange
    textColor: "#FF9500",
    bgColor: "rgba(255, 149, 0, 0.1)",
  },
  {
    key: "wrongType",
    label: "WRONG TYPES",
    description: "Incorrect data type",
    icon: XCircle,
    color: "#00E5FF", // Cyan
    textColor: "#00E5FF",
    bgColor: "rgba(0, 229, 255, 0.1)",
  },
  {
    key: "optional",
    label: "OPTIONAL VARIABLES",
    description: "Available extras",
    icon: Eye,
    color: "#E040FB", // Purple
    textColor: "#E040FB",
    bgColor: "rgba(224, 64, 251, 0.1)",
  },
];

export function CyberpunkEnvVarStats({ stats }: CyberpunkEnvVarStatsProps) {
  const {
    totalCount,
    missingCount,
    wrongValueCount,
    wrongTypeCount,
    presentRequiredCount,
    optionalCount,
  } = stats;

  // Animation values for glitch effects
  const glitchOpacity = useSharedValue(0);
  const scanLineY = useSharedValue(-100);

  useEffect(() => {
    // Scan line animation
    scanLineY.value = withRepeat(
      withTiming(400, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );

    // Random glitch effect
    const startGlitch = () => {
      const nextDelay = 5000 + Math.random() * 5000;
      setTimeout(() => {
        glitchOpacity.value = withSequence(
          withTiming(0.3, { duration: 50 }),
          withTiming(0, { duration: 30 }),
          withTiming(0.2, { duration: 40 }),
          withTiming(0, { duration: 50 })
        );
        startGlitch();
      }, nextDelay);
    };
    startGlitch();
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const glitchStyle = useAnimatedStyle(() => ({
    opacity: glitchOpacity.value,
  }));

  // If no variables at all, show minimal stats
  if (totalCount === 0) {
    return (
      <View style={styles.statsContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>SYSTEM STATUS</Text>
          <View style={styles.dataDots}>
            <View style={[styles.dot, { backgroundColor: "#00FFFF" }]} />
            <View style={[styles.dot, { backgroundColor: "#00FFFF", opacity: 0.6 }]} />
            <View style={[styles.dot, { backgroundColor: "#00FFFF", opacity: 0.3 }]} />
          </View>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {"NO ENVIRONMENT VARIABLES DETECTED"}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.statsContainer}>
      {/* Glass layers */}
      <View style={styles.glassLayer1} />
      <View style={styles.glassLayer2} />
      
      {/* Scan line effect */}
      <Animated.View style={[styles.scanLine, scanLineStyle]} />
      
      {/* Glitch overlay */}
      <Animated.View style={[styles.glitchOverlay, glitchStyle]} />

      {/* Corner accents */}
      <View style={[styles.cornerAccent, styles.cornerTL]} />
      <View style={[styles.cornerAccent, styles.cornerTR]} />
      <View style={[styles.cornerAccent, styles.cornerBL]} />
      <View style={[styles.cornerAccent, styles.cornerBR]} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>SYSTEM STATUS</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>TOTAL: {totalCount}</Text>
        </View>
      </View>

      {/* Variable Breakdown */}
      <View style={styles.breakdownSection}>
        <View style={styles.breakdownGrid}>
          {variableTypeData.map((item) => {
            let count = 0;
            let shouldShow = false;

            switch (item.key) {
              case "valid":
                count = presentRequiredCount;
                shouldShow = count > 0;
                break;
              case "missing":
                count = missingCount;
                shouldShow = count > 0;
                break;
              case "wrongValue":
                count = wrongValueCount;
                shouldShow = count > 0;
                break;
              case "wrongType":
                count = wrongTypeCount;
                shouldShow = count > 0;
                break;
              case "optional":
                count = optionalCount;
                shouldShow = count > 0;
                break;
            }

            if (!shouldShow) return null;

            const percentage =
              totalCount > 0 ? ((count / totalCount) * 100).toFixed(0) : "0";
            const IconComponent = item.icon;

            return (
              <View key={item.key} style={styles.breakdownItem}>
                <View style={[styles.itemGlow, { backgroundColor: `${item.color}10` }]} />
                <View style={[styles.itemBorder, { borderColor: `${item.color}30` }]}>
                  <View style={styles.itemContent}>
                    <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                      <IconComponent size={16} color={item.color} />
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemLabel, { color: item.textColor }]}>
                        {item.label}
                      </Text>
                      <Text style={styles.itemDesc}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.itemStats}>
                      <Text style={[styles.itemCount, { color: item.textColor }]}>
                        {count}
                      </Text>
                      <View style={[styles.percentageBadge, { backgroundColor: `${item.color}15` }]}>
                        <Text style={[styles.percentageText, { color: item.color }]}>
                          {percentage}%
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* Progress bar */}
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Binary pattern decoration */}
      <View style={styles.binaryPattern}>
        <Text style={styles.binaryText}>10110101</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(10, 12, 18, 0.95)", // Darker, more opaque
    borderRadius: 12,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "rgba(0, 255, 255, 0.25)",
    overflow: "hidden",
    position: "relative",
  },

  // Glass effect layers
  glassLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 255, 255, 0.02)",
    opacity: 0.3,
  },
  glassLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 229, 255, 0.01)",
    opacity: 0.2,
    top: "30%",
    left: "30%",
  },

  // Scan line effect
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(0, 255, 255, 0.1)",
  },

  // Glitch overlay
  glitchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 255, 255, 0.05)",
    borderRadius: 12,
  },

  // Corner accents
  cornerAccent: {
    position: "absolute",
    width: 16,
    height: 2,
    backgroundColor: "#00FFFF",
    opacity: 0.8,
  },
  cornerTL: {
    top: 0,
    left: 0,
    width: 2,
    height: 16,
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
    height: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    zIndex: 1,
  },
  sectionTitle: {
    color: "#00FFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    textShadowColor: "#00FFFF",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    opacity: 0.9,
  },
  totalBadge: {
    backgroundColor: "rgba(0, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 255, 0.25)",
  },
  totalText: {
    color: "#00FFFF",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.3,
  },

  // Breakdown section
  breakdownSection: {
    zIndex: 1,
  },
  breakdownGrid: {
    gap: 10,
  },
  breakdownItem: {
    position: "relative",
  },
  itemGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    opacity: 0.3,
  },
  itemBorder: {
    backgroundColor: "rgba(5, 8, 12, 0.8)", // Darker background
    borderRadius: 8,
    borderWidth: 1.2,
    overflow: "hidden",
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.3,
  },
  itemDesc: {
    color: "#B8BCC8", // Lighter gray
    fontSize: 10,
    fontFamily: "monospace",
    marginTop: 2,
    opacity: 0.9,
  },
  itemStats: {
    alignItems: "flex-end",
    gap: 4,
  },
  itemCount: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  progressBar: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  progressFill: {
    height: "100%",
    opacity: 0.7,
  },

  // Data dots
  dataDots: {
    flexDirection: "row",
    gap: 3,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },

  // Binary pattern
  binaryPattern: {
    position: "absolute",
    top: 8,
    right: 12,
    opacity: 0.03,
  },
  binaryText: {
    fontSize: 8,
    fontFamily: "monospace",
    color: "#00FFFF",
    letterSpacing: 1,
  },

  // Empty state
  emptyState: {
    padding: 20,
    backgroundColor: "rgba(0, 255, 255, 0.02)",
    borderRadius: 6,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#00FFFF",
    fontSize: 10,
    fontFamily: "monospace",
    letterSpacing: 1,
    opacity: 0.6,
  },
});