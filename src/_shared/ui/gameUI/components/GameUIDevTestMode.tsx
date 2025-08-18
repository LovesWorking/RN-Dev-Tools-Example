import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import {
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  HelpCircle,
} from "lucide-react-native";
import { gameUIColors } from "../constants/gameUIColors";

export interface TestScenario {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
}

export interface GameUIDevTestModeProps {
  // Array of test scenarios
  scenarios: TestScenario[];
  // Currently selected test mode (null = live data)
  currentMode: string | null;
  // Callback when mode changes
  onModeChange: (mode: string | null) => void;
  // Container style
  style?: ViewStyle;
  // Title for the dev mode section
  title?: string;
}

// Default test scenarios used by both ENV and Storage
export const DEFAULT_TEST_SCENARIOS: TestScenario[] = [
  {
    id: "LIVE",
    label: "LIVE DATA",
    description: "Use actual data",
    icon: CheckCircle,
    iconColor: gameUIColors.success,
  },
  {
    id: "SUCCESS",
    label: "ALL VALID",
    description: "Everything configured correctly",
    icon: CheckCircle,
    iconColor: gameUIColors.success,
  },
  {
    id: "PARTIAL_FAILURE",
    label: "PARTIAL ISSUES",
    description: "Some missing, some wrong",
    icon: AlertTriangle,
    iconColor: gameUIColors.warning,
  },
  {
    id: "CRITICAL_FAILURE",
    label: "CRITICAL FAILURE",
    description: "Most data missing",
    icon: AlertOctagon,
    iconColor: gameUIColors.critical,
  },
  {
    id: "TYPE_ERRORS",
    label: "TYPE ERRORS",
    description: "Wrong data types",
    icon: Zap,
    iconColor: gameUIColors.info,
  },
  {
    id: "VALUE_ERRORS",
    label: "VALUE ERRORS",
    description: "Invalid values/formats",
    icon: AlertCircle,
    iconColor: gameUIColors.warning,
  },
  {
    id: "EMPTY",
    label: "NO DATA",
    description: "Empty state",
    icon: HelpCircle,
    iconColor: gameUIColors.muted,
  },
];

/**
 * Reusable dev test mode component
 * Provides dropdown menu for testing different data scenarios
 * Used in ENV and Storage pages for UI testing
 */
export function GameUIDevTestMode({
  scenarios,
  currentMode,
  onModeChange,
  style,
  title = "DEV TEST MODE",
}: GameUIDevTestModeProps) {
  const [expanded, setExpanded] = useState(false);

  const handleScenarioSelect = (scenarioId: string) => {
    onModeChange(scenarioId === "LIVE" ? null : scenarioId);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Zap size={12} color={gameUIColors.critical} />
          <Text style={styles.title}>{title}</Text>
          {currentMode && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{currentMode}</Text>
            </View>
          )}
        </View>
        {expanded ? (
          <ChevronUp size={12} color={gameUIColors.muted} />
        ) : (
          <ChevronDown size={12} color={gameUIColors.muted} />
        )}
      </TouchableOpacity>

      {expanded && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.menu}>
          {scenarios.map((scenario) => {
            const isActive =
              scenario.id === "LIVE"
                ? currentMode === null
                : currentMode === scenario.id;
            const IconComponent = scenario.icon;

            return (
              <TouchableOpacity
                key={scenario.id}
                onPress={() => handleScenarioSelect(scenario.id)}
                style={[styles.option, isActive && styles.optionActive]}
                activeOpacity={0.7}
              >
                <IconComponent
                  size={11}
                  color={isActive ? scenario.iconColor : gameUIColors.muted}
                />
                <Text
                  style={[
                    styles.optionText,
                    isActive && styles.optionTextActive,
                  ]}
                >
                  {scenario.label}
                </Text>
                <Text style={styles.optionDesc}>{scenario.description}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: gameUIColors.critical + "0D",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.critical + "33",
    borderStyle: "dashed",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 10,
    color: gameUIColors.critical,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: gameUIColors.critical + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    color: gameUIColors.critical,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  menu: {
    padding: 8,
    paddingTop: 0,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: gameUIColors.background + "33",
  },
  optionActive: {
    backgroundColor: gameUIColors.info + "1A",
    borderWidth: 1,
    borderColor: gameUIColors.border,
  },
  optionText: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    fontWeight: "600",
    marginLeft: 8,
    minWidth: 100,
  },
  optionTextActive: {
    color: gameUIColors.primary,
  },
  optionDesc: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    marginLeft: 8,
  },
});