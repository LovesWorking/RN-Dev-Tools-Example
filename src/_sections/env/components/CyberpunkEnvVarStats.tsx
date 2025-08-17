import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import { AlertCircle, CheckCircle2, Eye, XCircle, Zap, Server } from "lucide-react-native";
import { EnvVarStats } from "../types";

interface CyberpunkEnvVarStatsProps {
  stats: EnvVarStats;
}

// Game UI Color Palette - matching Dial2 design
const gameColors = {
  // Primary UI
  background: '#0A0A0F',
  panel: 'rgba(10, 10, 20, 0.98)',
  border: 'rgba(0, 212, 255, 0.3)',
  
  // Status Colors (matching game design)
  online: '#00FF88',
  warning: '#FFD700',
  error: '#FF4444',
  info: '#00D4FF',
  optional: '#9D4EDD',
  
  // Text
  primary: '#FFFFFF',
  secondary: '#AAA',
  muted: '#666',
};

// Variable type configurations with game UI colors
const variableTypeData = [
  {
    key: "valid",
    label: "VALID VARIABLES",
    subtitle: "Correctly configured",
    icon: CheckCircle2,
    color: gameColors.online,
    pulseDelay: 0,
  },
  {
    key: "missing",
    label: "CRITICAL ERROR",
    subtitle: "Missing required data",
    icon: AlertCircle,
    color: gameColors.error,
    pulseDelay: 200,
  },
  {
    key: "wrongValue",
    label: "CONFIG MISMATCH",
    subtitle: "Invalid parameters",
    icon: XCircle,
    color: gameColors.warning,
    pulseDelay: 400,
  },
  {
    key: "wrongType",
    label: "TYPE ERROR",
    subtitle: "Incorrect format",
    icon: Zap,
    color: gameColors.info,
    pulseDelay: 600,
  },
  {
    key: "optional",
    label: "OPTIONAL VARS",
    subtitle: "Available extras",
    icon: Server,
    color: gameColors.optional,
    pulseDelay: 800,
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

  // Minimal animation values - only for status indicator
  const statusPulse = useSharedValue(1);

  useEffect(() => {
    // Simple status pulse for critical states only
    if (missingCount > 0 || wrongValueCount > 0 || wrongTypeCount > 0) {
      statusPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0.6, { duration: 1500 })
        ),
        -1,
        true
      );
    } else {
      statusPulse.value = withTiming(1, { duration: 300 });
    }
  }, [missingCount, wrongValueCount, wrongTypeCount]);

  const statusPulseStyle = useAnimatedStyle(() => ({
    opacity: statusPulse.value,
  }));

  // Calculate system health
  const healthPercentage = totalCount > 0 
    ? Math.round((presentRequiredCount / (totalCount - optionalCount)) * 100)
    : 0;
  
  const healthStatus = healthPercentage >= 90 ? "OPTIMAL" : 
                      healthPercentage >= 70 ? "WARNING" : 
                      "CRITICAL";
  
  const healthColor = healthPercentage >= 90 ? gameColors.online : 
                     healthPercentage >= 70 ? gameColors.warning : 
                     gameColors.error;

  // If no variables at all, show minimal UI
  if (totalCount === 0) {
    return (
      <View style={styles.mainPanel}>
        <View style={styles.compactHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>ENV CONFIG</Text>
            <Text style={styles.headerSubtitle}>Loaded at startup</Text>
          </View>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: gameColors.muted }]} />
            <Text style={styles.statusText}>OFFLINE</Text>
          </View>
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>⚠</Text>
          <Text style={styles.emptyTitle}>NO VARIABLES DETECTED</Text>
          <Text style={styles.emptySubtitle}>Initialize environment config</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainPanel}>
      {/* Compact Header with inline health */}
      <View style={styles.compactHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>ENV CONFIG</Text>
          <Text style={styles.headerSubtitle}>Snapshot from startup</Text>
        </View>
        <View style={styles.headerRight}>
          <Animated.View style={[styles.statusIndicator, statusPulseStyle]}>
            <View style={[styles.statusDot, { backgroundColor: healthColor }]} />
            <Text style={[styles.statusText, { color: healthColor }]}>{healthStatus}</Text>
          </Animated.View>
        </View>
      </View>

      {/* Compact Health Bar */}
      <View style={styles.compactHealthSection}>
        <Text style={styles.healthLabel}>SYSTEM HEALTH</Text>
        <View style={styles.healthBarWrapper}>
          <View style={styles.healthBarBg}>
            <Animated.View 
              entering={FadeIn.duration(500)}
              style={[
                styles.healthBarFill, 
                { 
                  width: `${healthPercentage}%`,
                  backgroundColor: healthColor,
                }
              ]} 
            />
          </View>
        </View>
        <Text style={[styles.healthPercentage, { color: healthColor }]}>
          {healthPercentage}%
        </Text>
      </View>

      {/* Compact Stats Grid */}
      <View style={styles.compactStatsGrid}>
        {variableTypeData.map((item, index) => {
          let count = 0;
          let isActive = false;

          switch (item.key) {
            case "valid":
              count = presentRequiredCount;
              isActive = count > 0;
              break;
            case "missing":
              count = missingCount;
              isActive = count > 0;
              break;
            case "wrongValue":
              count = wrongValueCount;
              isActive = count > 0;
              break;
            case "wrongType":
              count = wrongTypeCount;
              isActive = count > 0;
              break;
            case "optional":
              count = optionalCount;
              isActive = count > 0;
              break;
          }

          if (!isActive) return null;

          const IconComponent = item.icon;
          const isError = item.key === "missing" || item.key === "wrongValue" || item.key === "wrongType";

          return (
            <Animated.View
              key={item.key}
              entering={FadeIn.duration(300).delay(item.pulseDelay)}
              style={[
                styles.compactStatCard,
                { borderColor: item.color + "30" },
              ]}
            >
              <View style={styles.compactCardContent}>
                <IconComponent size={12} color={item.color} />
                <View style={styles.compactCardInfo}>
                  <Text style={[styles.compactCardLabel, { color: item.color }]}>
                    {item.label}
                  </Text>
                  <Text style={styles.compactCardSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={[styles.compactStatNumber, { color: item.color }]}>
                  {count.toString().padStart(2, '0')}
                </Text>
              </View>
              <View style={[styles.compactStatBar, { backgroundColor: item.color + "10" }]}>
                <View 
                  style={[
                    styles.compactStatBarFill,
                    { 
                      width: `${(count / totalCount) * 100}%`,
                      backgroundColor: item.color 
                    }
                  ]}
                />
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* Bottom status bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomStats}>
          <Text style={styles.bottomStatLabel}>TOTAL</Text>
          <Text style={styles.bottomStatValue}>{totalCount}</Text>
        </View>
        <View style={styles.bottomDivider} />
        <View style={styles.bottomStats}>
          <Text style={styles.bottomStatLabel}>ACTIVE</Text>
          <Text style={[styles.bottomStatValue, { color: gameColors.online }]}>
            {presentRequiredCount + optionalCount}
          </Text>
        </View>
        <View style={styles.bottomDivider} />
        <View style={styles.bottomStats}>
          <Text style={styles.bottomStatLabel}>ERRORS</Text>
          <Text style={[styles.bottomStatValue, { color: gameColors.error }]}>
            {missingCount + wrongValueCount + wrongTypeCount}
          </Text>
        </View>
      </View>

      {/* Tech decoration */}
      <View style={styles.techPattern}>
        <Text style={styles.techText}>{'<ENV>'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainPanel: {
    backgroundColor: gameColors.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: gameColors.border,
    overflow: "hidden",
    position: "relative",
  },

  // Compact Header
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerLeft: {
    gap: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: gameColors.primary,
    fontFamily: "monospace",
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 8,
    color: gameColors.secondary,
    fontFamily: "monospace",
    opacity: 0.7,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },

  // Compact Health section
  compactHealthSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  healthLabel: {
    fontSize: 8,
    color: gameColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  healthBarWrapper: {
    flex: 1,
  },
  healthBarBg: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 2,
    overflow: "hidden",
  },
  healthBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  healthPercentage: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "monospace",
  },

  // Compact Stats grid
  compactStatsGrid: {
    gap: 6,
    marginBottom: 8,
  },
  compactStatCard: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
    marginBottom: 4,
  },
  compactCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  compactCardInfo: {
    flex: 1,
  },
  compactCardLabel: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  compactCardSubtitle: {
    fontSize: 8,
    color: gameColors.secondary,
    fontFamily: "monospace",
    opacity: 0.7,
  },
  compactStatNumber: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    minWidth: 28,
  },
  compactStatBar: {
    height: 3,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  compactStatBarFill: {
    height: "100%",
    borderRadius: 1.5,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  bottomStats: {
    flex: 1,
    alignItems: "center",
  },
  bottomStatLabel: {
    fontSize: 7,
    color: gameColors.muted,
    fontFamily: "monospace",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  bottomStatValue: {
    fontSize: 11,
    fontWeight: "700",
    color: gameColors.primary,
    fontFamily: "monospace",
  },
  bottomDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  // Empty state
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    fontSize: 32,
    color: gameColors.muted,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 12,
    color: gameColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  emptySubtitle: {
    fontSize: 10,
    color: gameColors.muted,
    fontFamily: "monospace",
  },

  // Tech decoration
  techPattern: {
    position: "absolute",
    top: 16,
    right: 16,
    opacity: 0.03,
  },
  techText: {
    fontSize: 8,
    fontFamily: "monospace",
    color: gameColors.info,
    letterSpacing: 1,
  },
});