import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  FadeIn,
  interpolate,
} from "react-native-reanimated";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
  Activity,
  AlertOctagon,
} from "lucide-react-native";

import { useDynamicEnv } from "../hooks";
import { RequiredEnvVar } from "../types";
import { processEnvVars, calculateStats } from "../utils";
import { EnvVarSection } from "./EnvVarSection";
import { CyberpunkEnvVarStats } from "./CyberpunkEnvVarStats";
import { displayValue } from "../../../_shared/utils/displayValue";

// Game UI Color Palette
const gameColors = {
  background: "rgba(5, 5, 10, 0.98)",
  panel: "rgba(10, 10, 20, 0.98)",
  border: "rgba(0, 212, 255, 0.3)",

  // Alert colors
  success: "#00FF88",
  warning: "#FFD700",
  error: "#FF4444",
  info: "#00D4FF",
  critical: "#FF00FF",
  optional: "#9D4EDD",

  // Text
  primary: "#FFFFFF",
  secondary: "#AAA",
  muted: "#666",
};

// Alert states for testing
const ALERT_STATES = {
  OPTIMAL: {
    icon: CheckCircle,
    color: gameColors.success,
    label: "ALL SYSTEMS OPERATIONAL",
    subtitle: "Environment configured correctly",
    pulse: false,
  },
  WARNING: {
    icon: AlertTriangle,
    color: gameColors.warning,
    label: "WARNING DETECTED",
    subtitle: "Non-critical issues found",
    pulse: true,
  },
  ERROR: {
    icon: AlertCircle,
    color: gameColors.error,
    label: "ERROR STATE",
    subtitle: "Missing required variables",
    pulse: true,
  },
  CRITICAL: {
    icon: AlertOctagon,
    color: gameColors.critical,
    label: "CRITICAL FAILURE",
    subtitle: "Multiple system failures",
    pulse: true,
    glitch: true,
  },
  LOADING: {
    icon: Activity,
    color: gameColors.info,
    label: "SCANNING ENVIRONMENT",
    subtitle: "Analyzing configuration...",
    pulse: true,
  },
};

interface GameUIEnvContentProps {
  requiredEnvVars?: RequiredEnvVar[];
}

export function GameUIEnvContent({ requiredEnvVars }: GameUIEnvContentProps) {
  // Test state management
  const [testAlertState, setTestAlertState] =
    useState<keyof typeof ALERT_STATES>("OPTIMAL");
  const [showTestControls, setShowTestControls] = useState(false);

  // Animation values
  const alertOpacity = useSharedValue(1);
  const alertScale = useSharedValue(1);
  const glitchValue = useSharedValue(0);
  const scanLineY = useSharedValue(-100);

  // Auto-collect environment variables
  const envResults = useDynamicEnv();

  const autoCollectedEnvVars = useMemo(() => {
    const envVars: Record<string, string> = {};
    envResults.forEach(({ key, data }) => {
      if (data !== undefined && data !== null) {
        envVars[key] = typeof data === "string" ? data : displayValue(data);
      }
    });
    return envVars;
  }, [envResults]);

  // Process and categorize environment variables
  const { requiredVars, optionalVars } = useMemo(() => {
    return processEnvVars(autoCollectedEnvVars, requiredEnvVars);
  }, [autoCollectedEnvVars, requiredEnvVars]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateStats(requiredVars, optionalVars, autoCollectedEnvVars);
  }, [requiredVars, optionalVars, autoCollectedEnvVars]);

  // Determine actual alert state based on stats
  const actualAlertState = useMemo(() => {
    if (stats.missingCount > 2 || stats.wrongTypeCount > 2) return "CRITICAL";
    if (stats.missingCount > 0) return "ERROR";
    if (stats.wrongValueCount > 0 || stats.wrongTypeCount > 0) return "WARNING";
    return "OPTIMAL";
  }, [stats]);

  // Use test state if test controls are shown, otherwise use actual state
  const currentAlertState = showTestControls
    ? testAlertState
    : actualAlertState;
  const alertConfig = ALERT_STATES[currentAlertState];
  const IconComponent = alertConfig.icon;

  // Setup animations
  useEffect(() => {
    // Scan line animation
    scanLineY.value = withRepeat(
      withTiming(400, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    // Alert pulse animation
    if (alertConfig.pulse) {
      alertScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
      alertOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.7, { duration: 500 })
        ),
        -1,
        true
      );
    } else {
      alertScale.value = withTiming(1, { duration: 300 });
      alertOpacity.value = withTiming(1, { duration: 300 });
    }

    // Glitch effect for critical state
    if (alertConfig.glitch) {
      const startGlitch = () => {
        glitchValue.value = withSequence(
          withTiming(1, { duration: 50 }),
          withTiming(0, { duration: 30 }),
          withTiming(0.5, { duration: 40 }),
          withTiming(0, { duration: 100 })
        );
        setTimeout(startGlitch, 2000 + Math.random() * 3000);
      };
      startGlitch();
    }
  }, [currentAlertState]);

  const alertAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: alertScale.value }],
    opacity: alertOpacity.value,
  }));

  const glitchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          glitchValue.value,
          [0, 1],
          [0, Math.random() * 4 - 2]
        ),
      },
    ],
    opacity: interpolate(glitchValue.value, [0, 1], [1, 0.8]),
  }));

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Background effects */}
      <View style={styles.backgroundGrid} />
      <Animated.View style={[styles.scanLine, scanLineStyle]} />

      {/* Status Alert Header */}
      <Animated.View
        style={[
          styles.alertContainer,
          { borderColor: alertConfig.color + "40" },
          alertAnimatedStyle,
        ]}
      >
        <Animated.View style={glitchAnimatedStyle}>
          <View
            style={[
              styles.alertGlow,
              { backgroundColor: alertConfig.color + "10" },
            ]}
          />

          <View style={styles.alertContent}>
            <View
              style={[
                styles.alertIconWrapper,
                { backgroundColor: alertConfig.color + "15" },
              ]}
            >
              <IconComponent size={20} color={alertConfig.color} />
            </View>

            <View style={styles.alertTextContainer}>
              <Text style={[styles.alertLabel, { color: alertConfig.color }]}>
                {alertConfig.label}
              </Text>
              <Text style={styles.alertSubtitle}>{alertConfig.subtitle}</Text>
            </View>

            <View
              style={[
                styles.alertBadge,
                { backgroundColor: alertConfig.color + "20" },
              ]}
            >
              <Text
                style={[styles.alertBadgeText, { color: alertConfig.color }]}
              >
                LIVE
              </Text>
            </View>
          </View>

          {/* Alert indicator lights */}
          <View style={styles.alertIndicators}>
            {[...Array(3)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicatorDot,
                  {
                    backgroundColor: alertConfig.color,
                    opacity: alertConfig.pulse
                      ? i === 0
                        ? 1
                        : 0.5 - i * 0.2
                      : 0.3,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </Animated.View>

      {/* Test Controls Toggle */}
      <TouchableOpacity
        onPress={() => setShowTestControls(!showTestControls)}
        style={styles.testToggle}
      >
        <Zap size={14} color={gameColors.info} />
        <Text style={styles.testToggleText}>
          {showTestControls ? "HIDE" : "SHOW"} TEST CONTROLS
        </Text>
      </TouchableOpacity>

      {/* Test Alert State Controls */}
      {showTestControls && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.testControlsContainer}
        >
          <Text style={styles.testControlsTitle}>ALERT STATE SIMULATOR</Text>
          <View style={styles.testButtons}>
            {Object.keys(ALERT_STATES).map((state) => (
              <TouchableOpacity
                key={state}
                onPress={() =>
                  setTestAlertState(state as keyof typeof ALERT_STATES)
                }
                style={[
                  styles.testButton,
                  {
                    borderColor:
                      ALERT_STATES[state as keyof typeof ALERT_STATES].color +
                      "60",
                    backgroundColor:
                      testAlertState === state
                        ? ALERT_STATES[state as keyof typeof ALERT_STATES]
                            .color + "20"
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.testButtonText,
                    {
                      color:
                        ALERT_STATES[state as keyof typeof ALERT_STATES].color,
                    },
                  ]}
                >
                  {state}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Stats Section with game UI styling */}
      <View style={styles.statsWrapper}>
        <CyberpunkEnvVarStats stats={stats} />
      </View>

      {/* Required Variables Section with game UI label */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Shield size={14} color={gameColors.info} />
          <Text style={styles.sectionTitle}>REQUIRED MODULES</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionCount}>{stats.requiredCount}</Text>
          </View>
        </View>
        <EnvVarSection
          title=""
          count={stats.requiredCount}
          vars={requiredVars}
          emptyMessage="No required modules configured"
        />
      </View>

      {/* Optional Variables Section with game UI label */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Activity size={14} color={gameColors.optional} />
          <Text style={styles.sectionTitle}>OPTIONAL MODULES</Text>
          <View
            style={[
              styles.sectionBadge,
              { backgroundColor: gameColors.optional + "20" },
            ]}
          >
            <Text style={[styles.sectionCount, { color: gameColors.optional }]}>
              {stats.optionalCount}
            </Text>
          </View>
        </View>
        <EnvVarSection
          title=""
          count={stats.optionalCount}
          vars={optionalVars}
          emptyMessage="No optional modules detected"
        />
      </View>

      {/* Tech footer */}
      <Text style={styles.techFooter}>
        // EXPO_PUBLIC_* NAMESPACE REQUIRED FOR RN ACCESS
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: gameColors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  backgroundGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    backgroundColor: gameColors.info,
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(0, 212, 255, 0.05)",
  },

  // Alert Header
  alertContainer: {
    backgroundColor: gameColors.panel,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    position: "relative",
    overflow: "hidden",
  },
  alertGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  alertIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  alertTextContainer: {
    flex: 1,
    gap: 2,
  },
  alertLabel: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1.5,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  alertSubtitle: {
    fontSize: 10,
    color: gameColors.secondary,
    fontFamily: "monospace",
  },
  alertBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  alertBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  alertIndicators: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    gap: 3,
  },
  indicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Test Controls
  testToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: gameColors.panel,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: gameColors.border,
    marginBottom: 12,
  },
  testToggleText: {
    fontSize: 9,
    color: gameColors.info,
    fontFamily: "monospace",
    letterSpacing: 1,
    fontWeight: "600",
  },
  testControlsContainer: {
    backgroundColor: gameColors.panel,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: gameColors.border,
  },
  testControlsTitle: {
    fontSize: 10,
    color: gameColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 1,
    marginBottom: 8,
    textAlign: "center",
  },
  testButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  testButton: {
    flex: 1,
    minWidth: "30%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
  },
  testButtonText: {
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Stats wrapper
  statsWrapper: {
    marginBottom: 16,
  },

  // Section styling
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 11,
    color: gameColors.primary,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 2,
    opacity: 0.9,
  },
  sectionBadge: {
    backgroundColor: gameColors.info + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionCount: {
    fontSize: 10,
    color: gameColors.info,
    fontFamily: "monospace",
    fontWeight: "700",
  },

  // Tech footer
  techFooter: {
    fontSize: 8,
    color: gameColors.muted,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1,
    opacity: 0.5,
  },
});
