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
    label: "SYSTEMS ONLINE",
    subtitle: "Ready to ship",
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
    label: "OPTIONAL MODS",
    subtitle: "Extra features",
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

  // Animation values for game effects
  const scanLineY = useSharedValue(-100);
  const glitchOpacity = useSharedValue(0);
  const pulseValue = useSharedValue(1);
  
  // Status pulse animations
  const statusPulse = useSharedValue(0);

  useEffect(() => {
    // Continuous scan line
    scanLineY.value = withRepeat(
      withTiming(400, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    // Status indicator pulse
    statusPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );

    // Occasional glitch effect
    const startGlitch = () => {
      const nextDelay = 3000 + Math.random() * 5000;
      setTimeout(() => {
        glitchOpacity.value = withSequence(
          withTiming(0.5, { duration: 50 }),
          withTiming(0, { duration: 30 }),
          withTiming(0.3, { duration: 40 }),
          withTiming(0, { duration: 100 })
        );
        startGlitch();
      }, nextDelay);
    };
    
    // Only start glitch if there are errors
    if (missingCount > 0 || wrongValueCount > 0 || wrongTypeCount > 0) {
      startGlitch();
    }
  }, [missingCount, wrongValueCount, wrongTypeCount]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const glitchStyle = useAnimatedStyle(() => ({
    opacity: glitchOpacity.value,
  }));

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
        <View style={styles.headerBar}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>ENV SCANNER</Text>
            <Text style={styles.headerSubtitle}>v2.0.1</Text>
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
      {/* Scan line effect */}
      <Animated.View style={[styles.scanLine, scanLineStyle]} />
      
      {/* Glitch overlay for errors */}
      {(missingCount > 0 || wrongValueCount > 0) && (
        <Animated.View style={[styles.glitchOverlay, glitchStyle]} />
      )}

      {/* Header with status */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>ENV SCANNER</Text>
          <Text style={styles.headerSubtitle}>LIVE MONITORING</Text>
        </View>
        <Animated.View style={[styles.statusIndicator, statusPulseStyle]}>
          <View style={[styles.statusDot, { backgroundColor: healthColor }]} />
          <Text style={[styles.statusText, { color: healthColor }]}>{healthStatus}</Text>
        </Animated.View>
      </View>

      {/* System Health Bar */}
      <View style={styles.healthSection}>
        <View style={styles.healthHeader}>
          <Text style={styles.healthLabel}>SYSTEM HEALTH</Text>
          <Text style={[styles.healthPercentage, { color: healthColor }]}>
            {healthPercentage}%
          </Text>
        </View>
        <View style={styles.healthBarContainer}>
          <View style={styles.healthBarBg}>
            <Animated.View 
              entering={FadeIn.duration(500)}
              style={[
                styles.healthBarFill, 
                { 
                  width: `${healthPercentage}%`,
                  backgroundColor: healthColor,
                  shadowColor: healthColor,
                }
              ]} 
            />
          </View>
          <View style={styles.healthGridOverlay} />
        </View>
      </View>

      {/* Variable Stats Grid */}
      <View style={styles.statsGrid}>
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
                styles.statCard,
                { borderColor: item.color + "40" },
                isError && styles.statCardError
              ]}
            >
              {/* Glow effect for active cards */}
              <View style={[styles.cardGlow, { backgroundColor: item.color + "10" }]} />
              
              {/* Card content */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: item.color + "15" }]}>
                  <IconComponent size={14} color={item.color} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardLabel, { color: item.color }]}>
                    {item.label}
                  </Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              
              {/* Count display */}
              <View style={styles.cardStats}>
                <Text style={[styles.statNumber, { color: item.color }]}>
                  {count.toString().padStart(2, '0')}
                </Text>
                <View style={[styles.statBar, { backgroundColor: item.color + "20" }]}>
                  <View 
                    style={[
                      styles.statBarFill,
                      { 
                        width: `${(count / totalCount) * 100}%`,
                        backgroundColor: item.color 
                      }
                    ]}
                  />
                </View>
              </View>

              {/* Corner indicators */}
              <View style={[styles.cornerIndicator, styles.cornerTL, { backgroundColor: item.color }]} />
              <View style={[styles.cornerIndicator, styles.cornerBR, { backgroundColor: item.color }]} />
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: gameColors.border,
    overflow: "hidden",
    position: "relative",
  },

  // Scan line effect
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    zIndex: 10,
  },

  // Glitch overlay
  glitchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 0, 0, 0.05)",
    zIndex: 9,
  },

  // Header
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerLeft: {
    gap: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: gameColors.primary,
    fontFamily: "monospace",
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 9,
    color: gameColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 1,
  },

  // Health section
  healthSection: {
    marginBottom: 20,
  },
  healthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 10,
    color: gameColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  healthPercentage: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "monospace",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  healthBarContainer: {
    position: "relative",
  },
  healthBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 3,
    overflow: "hidden",
  },
  healthBarFill: {
    height: "100%",
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  healthGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
  },

  // Stats grid
  statsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    position: "relative",
    overflow: "hidden",
  },
  statCardError: {
    backgroundColor: "rgba(255, 0, 0, 0.02)",
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  cardSubtitle: {
    fontSize: 9,
    color: gameColors.secondary,
    fontFamily: "monospace",
    marginTop: 1,
  },
  cardStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "monospace",
    minWidth: 40,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  cornerIndicator: {
    position: "absolute",
    width: 8,
    height: 1,
    opacity: 0.6,
  },
  cornerTL: {
    top: 0,
    left: 0,
    width: 1,
    height: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    width: 1,
    height: 8,
  },

  // Bottom bar
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  bottomStats: {
    flex: 1,
    alignItems: "center",
  },
  bottomStatLabel: {
    fontSize: 8,
    color: gameColors.muted,
    fontFamily: "monospace",
    letterSpacing: 1,
    marginBottom: 2,
  },
  bottomStatValue: {
    fontSize: 14,
    fontWeight: "700",
    color: gameColors.primary,
    fontFamily: "monospace",
  },
  bottomDivider: {
    width: 1,
    height: 20,
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