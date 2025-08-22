import React, { useMemo, useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  AlertCircle,
  CheckCircle2,
  Shield,
  Activity,
  Zap,
  XCircle,
} from "lucide-react-native";

// Import shared Game UI components
import {
  GameUICollapsibleSection,
  GameUIStatusHeader,
  GameUICompactStats,
  GameUIIssuesList,
  GameUIDevTestMode,
  useGameUIAlertState,
  gameUIColors,
  GAME_UI_ALERT_STATES,
  DEFAULT_TEST_SCENARIOS,
  type IssueItem,
  type StatCardConfig,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";

// Local imports
import { useDynamicEnv } from "../hooks";
import { RequiredEnvVar } from "../types";
import { processEnvVars, calculateStats } from "../utils";
import { EnvVarSection } from "./EnvVarSection";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";

interface GameUIEnvContentRefactoredProps {
  requiredEnvVars?: RequiredEnvVar[];
}

// Custom alert states for ENV specific needs
const ENV_ALERT_STATES = {
  ...GAME_UI_ALERT_STATES,
  OPTIMAL: {
    ...GAME_UI_ALERT_STATES.OPTIMAL,
    label: "CONFIG OK",
    subtitle: "All required vars present",
  },
  ERROR: {
    ...GAME_UI_ALERT_STATES.ERROR,
    label: "CONFIG ERROR",
    subtitle: "Missing required variables",
  },
  CRITICAL: {
    ...GAME_UI_ALERT_STATES.CRITICAL,
    label: "CONFIG FAILURE",
    subtitle: "Multiple required vars missing",
  },
};

export function GameUIEnvContentRefactored({
  requiredEnvVars,
}: GameUIEnvContentRefactoredProps) {
  // State
  const [issuesSectionExpanded, setIssuesSectionExpanded] = useState(true);
  const [requiredSectionExpanded, setRequiredSectionExpanded] = useState(true);
  const [optionalSectionExpanded, setOptionalSectionExpanded] = useState(false);
  const [devTestMode, setDevTestMode] = useState<string | null>(null);

  // Auto-collect environment variables
  const envResults = useDynamicEnv();

  const autoCollectedEnvVars = useMemo(() => {
    // Dev test mode mock data (simplified for example)
    if (devTestMode === "SUCCESS") {
      return {
        EXPO_PUBLIC_API_URL: "https://api.example.com",
        EXPO_PUBLIC_API_KEY: "sk_test_1234567890",
        EXPO_PUBLIC_ENVIRONMENT: "production",
        EXPO_PUBLIC_DEBUG_MODE: "false",
      };
    }
    // ... other test modes

    // Normal operation
    const envVars: Record<string, string> = {};
    envResults.forEach(({ key, data }) => {
      if (data !== undefined && data !== null) {
        envVars[key] = typeof data === "string" ? data : displayValue(data);
      }
    });
    return envVars;
  }, [envResults, devTestMode]);

  // Process and categorize environment variables
  const { requiredVars, optionalVars } = useMemo(() => {
    const mockRequiredVars = devTestMode
      ? [
          { key: "EXPO_PUBLIC_API_URL", expectedType: "url", description: "Base API endpoint URL" },
          { key: "EXPO_PUBLIC_API_KEY", expectedType: "string", description: "API authentication key" },
        ] as RequiredEnvVar[]
      : requiredEnvVars;

    return processEnvVars(autoCollectedEnvVars, mockRequiredVars);
  }, [autoCollectedEnvVars, requiredEnvVars, devTestMode]);

  // Calculate statistics
  const stats = useMemo(() => {
    return calculateStats(requiredVars, optionalVars, autoCollectedEnvVars);
  }, [requiredVars, optionalVars, autoCollectedEnvVars]);

  // Use shared alert state hook
  const { alertConfig, alertAnimatedStyle } = useGameUIAlertState(stats, ENV_ALERT_STATES);

  // Transform issues for GameUIIssuesList
  const issues = useMemo<IssueItem[]>(() => {
    return requiredVars
      .filter((v) => v.status !== "required_present")
      .map((varItem) => ({
        key: varItem.key,
        status:
          varItem.status === "required_missing"
            ? "missing"
            : varItem.status === "required_wrong_type"
            ? "wrong_type"
            : "wrong_value",
        value: varItem.value,
        expectedType: varItem.expectedType,
        expectedValue: varItem.expectedValue as string,
        description: varItem.description,
        fixSuggestion:
          varItem.status === "required_missing"
            ? `Add to .env: ${varItem.key}=your_value_here`
            : varItem.status === "required_wrong_type"
            ? `Update type to ${varItem.expectedType} in .env file`
            : `Check valid values for ${varItem.key}`,
      }));
  }, [requiredVars]);

  // Stats configuration for GameUICompactStats
  const statsConfig = useMemo<StatCardConfig[]>(() => [
    {
      key: "valid",
      label: "VALID VARIABLES",
      subtitle: "Correctly configured",
      icon: CheckCircle2,
      color: gameUIColors.success,
      value: stats.presentRequiredCount,
      pulseDelay: 0,
    },
    {
      key: "missing",
      label: "CRITICAL ERROR",
      subtitle: "Missing required data",
      icon: AlertCircle,
      color: gameUIColors.error,
      value: stats.missingCount,
      pulseDelay: 200,
    },
    {
      key: "wrongValue",
      label: "CONFIG MISMATCH",
      subtitle: "Invalid parameters",
      icon: XCircle,
      color: gameUIColors.warning,
      value: stats.wrongValueCount,
      pulseDelay: 400,
    },
    {
      key: "wrongType",
      label: "TYPE ERROR",
      subtitle: "Incorrect format",
      icon: Zap,
      color: gameUIColors.info,
      value: stats.wrongTypeCount,
      pulseDelay: 600,
    },
    {
      key: "optional",
      label: "OPTIONAL VARS",
      subtitle: "Available extras",
      icon: Activity,
      color: gameUIColors.optional,
      value: stats.optionalCount,
      pulseDelay: 800,
    },
  ], [stats]);

  // Calculate health percentage
  const healthPercentage =
    stats.totalCount > 0
      ? Math.round((stats.presentRequiredCount / (stats.totalCount - stats.optionalCount)) * 100)
      : 0;

  const healthStatus =
    healthPercentage >= 90 ? "OPTIMAL" : healthPercentage >= 70 ? "WARNING" : "CRITICAL";

  const healthColor =
    healthPercentage >= 90
      ? gameUIColors.success
      : healthPercentage >= 70
      ? gameUIColors.warning
      : gameUIColors.error;

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backgroundGrid} />

      {/* Status Header using shared component */}
      <GameUIStatusHeader
        alertConfig={alertConfig}
        badgeText="STATIC"
        animatedStyle={alertAnimatedStyle}
      />

      {/* Stats Section using shared component */}
      <GameUICompactStats
        statsConfig={statsConfig}
        totalCount={stats.totalCount}
        header={{
          title: "ENV CONFIG",
          subtitle: "Snapshot from startup",
          healthPercentage,
          healthStatus,
          healthColor,
        }}
        bottomStats={[
          { label: "TOTAL", value: stats.totalCount },
          {
            label: "ACTIVE",
            value: stats.presentRequiredCount + stats.optionalCount,
            color: gameUIColors.success,
          },
          {
            label: "ERRORS",
            value: stats.missingCount + stats.wrongValueCount + stats.wrongTypeCount,
            color: gameUIColors.error,
          },
        ]}
      />

      {/* Issues Section using shared components */}
      {issues.length > 0 && (
        <GameUICollapsibleSection
          icon={AlertCircle}
          iconColor={gameUIColors.warning}
          title="ISSUES TO FIX"
          count={issues.length}
          subtitle="Environment variables that need attention before deployment"
          expanded={issuesSectionExpanded}
          onToggle={() => setIssuesSectionExpanded(!issuesSectionExpanded)}
        >
          <GameUIIssuesList issues={issues} />
        </GameUICollapsibleSection>
      )}

      {/* Required Variables Section using shared component */}
      <GameUICollapsibleSection
        icon={Shield}
        iconColor={gameUIColors.info}
        title="REQUIRED VARIABLES"
        count={stats.requiredCount}
        subtitle="Variables that must be set for the app to function properly"
        expanded={requiredSectionExpanded}
        onToggle={() => setRequiredSectionExpanded(!requiredSectionExpanded)}
      >
        <EnvVarSection
          title=""
          count={0}
          vars={requiredVars}
          emptyMessage="No required variables configured"
        />
      </GameUICollapsibleSection>

      {/* Optional Variables Section using shared component */}
      <GameUICollapsibleSection
        icon={Activity}
        iconColor={gameUIColors.optional}
        title="OPTIONAL VARIABLES"
        count={stats.optionalCount}
        subtitle="Additional configuration for enhanced features and customization"
        expanded={optionalSectionExpanded}
        onToggle={() => setOptionalSectionExpanded(!optionalSectionExpanded)}
      >
        <EnvVarSection
          title=""
          count={0}
          vars={optionalVars}
          emptyMessage="No optional variables detected"
        />
      </GameUICollapsibleSection>

      <Text style={styles.techFooter}>
        // EXPO_PUBLIC_* NAMESPACE REQUIRED FOR RN ACCESS
      </Text>

      {/* Dev Test Mode using shared component */}
      <GameUIDevTestMode
        scenarios={DEFAULT_TEST_SCENARIOS}
        currentMode={devTestMode}
        onModeChange={setDevTestMode}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: gameUIColors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  backgroundGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.01,
    backgroundColor: gameUIColors.info,
  },
  techFooter: {
    fontSize: 8,
    color: gameUIColors.muted,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 20,
    letterSpacing: 1,
    opacity: 0.5,
  },
});