import React, { useMemo, useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  AlertCircle,
  CheckCircle2,
  Shield,
  Database,
  RefreshCw,
  Trash2,
  HardDrive,
  Zap,
  XCircle,
  Server,
} from "lucide-react-native";
import { useQueryClient } from "@tanstack/react-query";
import {
  StorageType,
  getCleanStorageKey,
  getStorageType,
  isStorageQuery,
} from "../../react-query/utils/storageQueryUtils";
import { StorageKeyInfo, RequiredStorageKey, StorageKeyStats } from "../types";
import { isDevToolsStorageKey } from "@/rn-better-dev-tools/src/shared/storage/devToolsStorageKeys";
import { clearAllAppStorage } from "../utils/clearAllStorage";
import { StorageKeySection } from "./StorageKeySection";

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

// Custom alert states for Storage specific needs
const STORAGE_ALERT_STATES = {
  ...GAME_UI_ALERT_STATES,
  OPTIMAL: {
    ...GAME_UI_ALERT_STATES.OPTIMAL,
    label: "STORAGE HEALTHY",
    subtitle: "All required data is properly stored",
  },
  WARNING: {
    ...GAME_UI_ALERT_STATES.WARNING,
    label: "STORAGE WARNING",
    subtitle: "Some stored values have incorrect types or values",
  },
  ERROR: {
    ...GAME_UI_ALERT_STATES.ERROR,
    label: "STORAGE ERROR",
    subtitle: "Required data is missing from storage",
  },
  CRITICAL: {
    ...GAME_UI_ALERT_STATES.CRITICAL,
    label: "STORAGE FAILURE",
    subtitle: "Multiple critical keys are missing",
  },
  EMPTY: {
    ...GAME_UI_ALERT_STATES.EMPTY,
    icon: Database,
    color: gameUIColors.info,
    label: "NO STORAGE DATA",
    subtitle: "Your app hasn't stored any data yet",
  },
};

interface GameUIStorageBrowserProps {
  requiredStorageKeys?: RequiredStorageKey[];
}

export function GameUIStorageBrowser({
  requiredStorageKeys = [],
}: GameUIStorageBrowserProps) {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // State for collapsible sections
  const [issuesSectionExpanded, setIssuesSectionExpanded] = useState(true);
  const [requiredSectionExpanded, setRequiredSectionExpanded] = useState(true);
  const [optionalSectionExpanded, setOptionalSectionExpanded] = useState(false);
  const [devToolsSectionExpanded, setDevToolsSectionExpanded] = useState(false);

  // Dev test mode state
  const [devTestMode, setDevTestMode] = useState<string | null>(null);

  // Get all storage queries from cache
  const allQueries = queryClient.getQueryCache().getAll();
  const storageQueriesData = allQueries.filter((query) =>
    isStorageQuery(query.queryKey)
  );

  // Generate mock storage data for dev test mode
  const getMockStorageData = () => {
    switch (devTestMode) {
      case "SUCCESS":
        return [
          {
            key: "user_token",
            value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            type: "secure",
          },
          {
            key: "user_preferences",
            value: { theme: "dark", notifications: true },
            type: "mmkv",
          },
          { key: "app_version", value: "1.2.3", type: "async" },
          { key: "last_sync", value: "2024-01-20T10:30:00Z", type: "async" },
          {
            key: "cache_data",
            value: { items: 150, size: "2.5MB" },
            type: "mmkv",
          },
          { key: "user_id", value: "usr_abc123", type: "secure" },
          { key: "onboarding_complete", value: true, type: "async" },
          {
            key: "api_endpoint",
            value: "https://api.example.com",
            type: "async",
          },
        ];
      case "PARTIAL_FAILURE":
        return [
          { key: "user_token", value: undefined, type: "secure" }, // Missing required
          { key: "user_preferences", value: "dark", type: "mmkv" }, // Wrong type
          { key: "app_version", value: "1.2.3", type: "async" },
          { key: "last_sync", value: "yesterday", type: "async" }, // Wrong format
        ];
      case "CRITICAL_FAILURE":
        return [{ key: "onboarding_complete", value: false, type: "async" }];
      case "TYPE_ERRORS":
        return [
          { key: "user_token", value: 12345, type: "secure" }, // Should be string
          { key: "user_preferences", value: "preferences", type: "mmkv" }, // Should be object
          { key: "onboarding_complete", value: "yes", type: "async" }, // Should be boolean
          { key: "cache_data", value: true, type: "mmkv" }, // Should be object
        ];
      case "VALUE_ERRORS":
        return [
          { key: "user_token", value: "invalid_token", type: "secure" },
          { key: "api_endpoint", value: "not-a-url", type: "async" },
          { key: "user_id", value: "", type: "secure" }, // Empty value
          { key: "app_version", value: "v1.2.3.4.5", type: "async" }, // Invalid format
        ];
      case "EMPTY":
        return [];
      default:
        return null;
    }
  };

  // Process storage keys into StorageKeyInfo format
  const { storageKeys, devToolKeys, stats } = useMemo(() => {
    const keyInfoMap = new Map<string, StorageKeyInfo>();
    const devToolKeyInfoMap = new Map<string, StorageKeyInfo>();

    // Use mock data if in dev test mode
    const mockData = getMockStorageData();

    // Define mock required keys for test mode
    const testRequiredKeys = devTestMode
      ? [
          {
            key: "user_token",
            expectedType: "string",
            storageType: "secure" as StorageType,
            description: "Authentication token",
          },
          {
            key: "user_preferences",
            expectedType: "object",
            storageType: "mmkv" as StorageType,
            description: "User settings",
          },
          {
            key: "app_version",
            expectedType: "string",
            storageType: "async" as StorageType,
            description: "Current app version",
          },
          {
            key: "user_id",
            expectedType: "string",
            storageType: "secure" as StorageType,
            description: "Unique user identifier",
          },
        ]
      : requiredStorageKeys;

    if (mockData) {
      // Process mock data
      mockData.forEach(({ key, value, type }) => {
        const requiredConfig = testRequiredKeys.find(
          (req) => typeof req === "object" && req.key === key
        );

        let status: StorageKeyInfo["status"] = "optional_present";

        if (requiredConfig) {
          if (value === undefined || value === null) {
            status = "required_missing";
          } else if (
            typeof requiredConfig === "object" &&
            "expectedType" in requiredConfig
          ) {
            const actualType =
              value === null
                ? "null"
                : Array.isArray(value)
                ? "array"
                : typeof value;
            status =
              actualType === requiredConfig.expectedType
                ? "required_present"
                : "required_wrong_type";
          } else {
            status = "required_present";
          }
        }

        const keyInfo: StorageKeyInfo = {
          key,
          value,
          storageType: type as StorageType,
          status,
          category: requiredConfig ? "required" : "optional",
          ...(requiredConfig &&
            typeof requiredConfig === "object" &&
            "description" in requiredConfig && {
              description: requiredConfig.description,
            }),
          ...(requiredConfig &&
            typeof requiredConfig === "object" &&
            "expectedType" in requiredConfig && {
              expectedType: requiredConfig.expectedType,
            }),
        };

        keyInfoMap.set(key, keyInfo);
      });

      // Add missing required keys
      testRequiredKeys.forEach((req) => {
        const key = typeof req === "string" ? req : req.key;
        if (!keyInfoMap.has(key)) {
          const keyInfo: StorageKeyInfo = {
            key,
            value: undefined,
            storageType:
              typeof req === "object" && "storageType" in req
                ? req.storageType
                : "async",
            status: "required_missing",
            category: "required",
            ...(typeof req === "object" &&
              "description" in req && {
                description: req.description,
              }),
            ...(typeof req === "object" &&
              "expectedType" in req && {
                expectedType: req.expectedType,
              }),
          };
          keyInfoMap.set(key, keyInfo);
        }
      });
    } else {
      // Normal processing - use actual storage queries
      storageQueriesData.forEach((query) => {
        const storageType = getStorageType(query.queryKey);
        if (!storageType) return;

        const cleanKey = getCleanStorageKey(query.queryKey);
        const value = query.state.data;

        // Check if this is a dev tool key
        if (isDevToolsStorageKey(cleanKey)) {
          const devKeyInfo: StorageKeyInfo = {
            key: cleanKey,
            value,
            storageType,
            status: "optional_present",
            category: "optional",
            description: "Dev Tools internal storage key",
          };
          devToolKeyInfoMap.set(cleanKey, devKeyInfo);
          return;
        }

        // Check if this is a required key
        const requiredConfig = requiredStorageKeys.find((req) => {
          if (typeof req === "string") return req === cleanKey;
          return req.key === cleanKey;
        });

        let status: StorageKeyInfo["status"] = "optional_present";

        if (requiredConfig) {
          if (value === undefined || value === null) {
            status = "required_missing";
          } else if (
            typeof requiredConfig === "object" &&
            "expectedValue" in requiredConfig
          ) {
            status =
              value === requiredConfig.expectedValue
                ? "required_present"
                : "required_wrong_value";
          } else if (
            typeof requiredConfig === "object" &&
            "expectedType" in requiredConfig
          ) {
            const actualType = value === null ? "null" : typeof value;
            status =
              actualType.toLowerCase() ===
              requiredConfig.expectedType.toLowerCase()
                ? "required_present"
                : "required_wrong_type";
          } else {
            status = "required_present";
          }
        }

        const keyInfo: StorageKeyInfo = {
          key: cleanKey,
          value,
          storageType,
          status,
          category: requiredConfig ? "required" : "optional",
          ...(typeof requiredConfig === "object" &&
            "expectedValue" in requiredConfig && {
              expectedValue: requiredConfig.expectedValue,
            }),
          ...(typeof requiredConfig === "object" &&
            "expectedType" in requiredConfig && {
              expectedType: requiredConfig.expectedType,
            }),
          ...(typeof requiredConfig === "object" &&
            "description" in requiredConfig && {
              description: requiredConfig.description,
            }),
        };

        keyInfoMap.set(cleanKey, keyInfo);
      });

      // Process required storage keys that weren't found in actual storage
      requiredStorageKeys.forEach((req) => {
        const key = typeof req === "string" ? req : req.key;

        if (!keyInfoMap.has(key)) {
          let storageType: StorageType = "async";

          if (typeof req === "object" && "storageType" in req) {
            storageType = req.storageType;
          }

          const keyInfo: StorageKeyInfo = {
            key,
            value: undefined,
            storageType,
            status: "required_missing",
            category: "required",
            ...(typeof req === "object" &&
              "expectedValue" in req && {
                expectedValue: req.expectedValue,
              }),
            ...(typeof req === "object" &&
              "expectedType" in req && {
                expectedType: req.expectedType,
              }),
            ...(typeof req === "object" &&
              "description" in req && {
                description: req.description,
              }),
          };

          keyInfoMap.set(key, keyInfo);
        }
      });
    }

    // Calculate stats
    const keys = Array.from(keyInfoMap.values());
    const storageStats: StorageKeyStats = {
      totalCount: keys.length,
      requiredCount: keys.filter((k) => k.category === "required").length,
      missingCount: keys.filter((k) => k.status === "required_missing").length,
      wrongValueCount: keys.filter((k) => k.status === "required_wrong_value")
        .length,
      wrongTypeCount: keys.filter((k) => k.status === "required_wrong_type")
        .length,
      presentRequiredCount: keys.filter((k) => k.status === "required_present")
        .length,
      optionalCount: keys.filter((k) => k.category === "optional").length,
      mmkvCount: keys.filter((k) => k.storageType === "mmkv").length,
      asyncCount: keys.filter((k) => k.storageType === "async").length,
      secureCount: keys.filter((k) => k.storageType === "secure").length,
    };

    const devKeys = Array.from(devToolKeyInfoMap.values());

    return { storageKeys: keys, devToolKeys: devKeys, stats: storageStats };
  }, [storageQueriesData, requiredStorageKeys, devTestMode]);

  // Group storage keys by status
  const requiredKeys = storageKeys.filter((k) => k.category === "required");
  const optionalKeys = storageKeys.filter((k) => k.category === "optional");

  // Use shared alert state hook
  const { alertConfig, alertAnimatedStyle } = useGameUIAlertState(
    stats,
    STORAGE_ALERT_STATES
  );

  // Copy to clipboard helper
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", `${label} copied to clipboard`);
  }, []);

  // Transform issues for GameUIIssuesList
  const issues = useMemo<IssueItem[]>(() => {
    return requiredKeys
      .filter((k) => k.status !== "required_present")
      .map((keyItem) => ({
        key: keyItem.key,
        status:
          keyItem.status === "required_missing"
            ? "missing"
            : keyItem.status === "required_wrong_type"
            ? "wrong_type"
            : "wrong_value",
        value: keyItem.value,
        expectedType: keyItem.expectedType,
        expectedValue: keyItem.expectedValue as string,
        description: keyItem.description,
        fixSuggestion:
          keyItem.status === "required_missing"
            ? `Store key: await AsyncStorage.setItem('${keyItem.key}', 'value')`
            : keyItem.status === "required_wrong_type"
            ? `Update to ${keyItem.expectedType} type for key: ${keyItem.key}`
            : `Check valid values for key: ${keyItem.key}`,
      }));
  }, [requiredKeys]);

  // Stats configuration for GameUICompactStats
  const statsConfig = useMemo<StatCardConfig[]>(
    () => [
      {
        key: "valid",
        label: "VALID KEYS",
        subtitle: "Properly stored",
        icon: CheckCircle2,
        color: gameUIColors.success,
        value: stats.presentRequiredCount,
        pulseDelay: 0,
      },
      {
        key: "missing",
        label: "MISSING KEYS",
        subtitle: "Not in storage",
        icon: AlertCircle,
        color: gameUIColors.error,
        value: stats.missingCount,
        pulseDelay: 200,
      },
      {
        key: "wrongValue",
        label: "VALUE ERRORS",
        subtitle: "Invalid values",
        icon: XCircle,
        color: gameUIColors.warning,
        value: stats.wrongValueCount,
        pulseDelay: 400,
      },
      {
        key: "wrongType",
        label: "TYPE ERRORS",
        subtitle: "Wrong data type",
        icon: Zap,
        color: gameUIColors.info,
        value: stats.wrongTypeCount,
        pulseDelay: 600,
      },
      {
        key: "optional",
        label: "OPTIONAL KEYS",
        subtitle: "User preferences",
        icon: Server,
        color: gameUIColors.optional,
        value: stats.optionalCount,
        pulseDelay: 800,
      },
    ],
    [stats]
  );

  // Calculate health percentage
  const healthPercentage =
    stats.requiredCount > 0
      ? Math.round((stats.presentRequiredCount / stats.requiredCount) * 100)
      : stats.totalCount > 0
      ? 100
      : 0;

  const healthStatus =
    healthPercentage >= 90
      ? "OPTIMAL"
      : healthPercentage >= 70
      ? "WARNING"
      : "CRITICAL";

  const healthColor =
    healthPercentage >= 90
      ? gameUIColors.success
      : healthPercentage >= 70
      ? gameUIColors.warning
      : gameUIColors.error;

  // Handle clear all storage
  const handleClearAll = useCallback(async () => {
    Alert.alert(
      "Clear Storage",
      "This will clear all app storage data. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllAppStorage();
              await queryClient.invalidateQueries({
                predicate: (query) => isStorageQuery(query.queryKey),
              });
            } catch (error) {
              console.error("Failed to clear storage:", error);
              Alert.alert("Error", "Failed to clear storage");
            }
          },
        },
      ]
    );
  }, [queryClient]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        predicate: (query) => isStorageQuery(query.queryKey),
      });
      await queryClient.refetchQueries({
        predicate: (query) => isStorageQuery(query.queryKey),
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  }, [queryClient]);

  // Handle export
  const handleExport = useCallback(async () => {
    const exportData = storageKeys.reduce((acc, keyInfo) => {
      acc[keyInfo.key] = keyInfo.value;
      return acc;
    }, {} as Record<string, unknown>);

    const serialized = JSON.stringify(exportData, null, 2);
    await copyToClipboard(serialized, "Storage data");
  }, [storageKeys, copyToClipboard]);

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
        badgeText="PERSISTENT"
        animatedStyle={alertAnimatedStyle}
      />

      {/* Action Controls */}
      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          <Text style={styles.keyCount}>
            {stats.totalCount} {stats.totalCount === 1 ? "KEY" : "KEYS"} STORED
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[
              styles.actionButton,
              isRefreshing && styles.actionButtonActive,
            ]}
            activeOpacity={0.7}
          >
            <RefreshCw
              size={14}
              color={isRefreshing ? gameUIColors.success : gameUIColors.info}
            />
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: isRefreshing
                    ? gameUIColors.success
                    : gameUIColors.info,
                },
              ]}
            >
              SCAN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleExport}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Database size={14} color={gameUIColors.storage} />
            <Text
              style={[styles.actionButtonText, { color: gameUIColors.storage }]}
            >
              EXPORT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Trash2 size={14} color={gameUIColors.error} />
            <Text
              style={[styles.actionButtonText, { color: gameUIColors.error }]}
            >
              PURGE
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section using shared component */}
      <GameUICompactStats
        statsConfig={statsConfig}
        totalCount={stats.totalCount}
        header={{
          title: "STORAGE OVERVIEW",
          subtitle: "Runtime persistence layer",
          healthPercentage,
          healthStatus,
          healthColor,
        }}
        bottomStats={[
          { label: "TOTAL", value: stats.totalCount },
          {
            label: "MMKV",
            value: stats.mmkvCount,
            color: gameUIColors.info,
          },
          {
            label: "ASYNC",
            value: stats.asyncCount,
            color: gameUIColors.warning,
          },
          {
            label: "SECURE",
            value: stats.secureCount,
            color: gameUIColors.success,
          },
        ]}
      />

      {/* Issues Section using shared components */}
      {issues.length > 0 && (
        <GameUICollapsibleSection
          icon={AlertCircle}
          iconColor={gameUIColors.warning}
          title="CRITICAL ISSUES"
          count={issues.length}
          subtitle="Storage keys that need immediate attention"
          expanded={issuesSectionExpanded}
          onToggle={() => setIssuesSectionExpanded(!issuesSectionExpanded)}
        >
          <GameUIIssuesList
            issues={issues}
            hintText="Tap any issue to view details"
            statusLabels={{
              missing: "Not stored",
              wrong_type: "Type error",
              wrong_value: "Invalid value",
            }}
          />
        </GameUICollapsibleSection>
      )}

      {/* Required Storage Keys Section using shared component */}
      <GameUICollapsibleSection
        icon={Shield}
        iconColor={gameUIColors.info}
        title="REQUIRED KEYS"
        count={stats.requiredCount}
        subtitle="Data your app needs to function properly"
        expanded={requiredSectionExpanded}
        onToggle={() => setRequiredSectionExpanded(!requiredSectionExpanded)}
      >
        <StorageKeySection
          title=""
          count={-1}
          keys={requiredKeys}
          emptyMessage="No required storage keys configured"
        />
      </GameUICollapsibleSection>

      {/* Optional Storage Keys Section using shared component */}
      <GameUICollapsibleSection
        icon={Database}
        iconColor={gameUIColors.optional}
        title="OPTIONAL KEYS"
        count={stats.optionalCount}
        subtitle="User preferences and non-critical data"
        expanded={optionalSectionExpanded}
        onToggle={() => setOptionalSectionExpanded(!optionalSectionExpanded)}
      >
        <StorageKeySection
          title=""
          count={-1}
          keys={optionalKeys}
          emptyMessage="No optional storage keys found"
        />
      </GameUICollapsibleSection>

      {/* Dev Tools Keys Section using shared component */}
      {devToolKeys.length > 0 && (
        <GameUICollapsibleSection
          icon={HardDrive}
          iconColor={gameUIColors.storage}
          title="DEV TOOLS DATA"
          count={devToolKeys.length}
          subtitle="Internal storage used by development tools"
          expanded={devToolsSectionExpanded}
          onToggle={() => setDevToolsSectionExpanded(!devToolsSectionExpanded)}
        >
          <StorageKeySection
            title=""
            count={-1}
            keys={devToolKeys}
            emptyMessage=""
            headerColor={gameUIColors.storage}
          />
        </GameUICollapsibleSection>
      )}

      <Text style={styles.techFooter}>
        // ASYNC STORAGE | MMKV | SECURE STORAGE BACKENDS
      </Text>

      {/* Dev Test Mode using shared component */}
      <GameUIDevTestMode
        scenarios={DEFAULT_TEST_SCENARIOS.map((s) => {
          // Customize labels for storage context
          if (s.id === "SUCCESS")
            return { ...s, description: "All keys stored correctly" };
          if (s.id === "PARTIAL_FAILURE")
            return { ...s, description: "Some missing, wrong types" };
          if (s.id === "CRITICAL_FAILURE")
            return { ...s, description: "Most keys missing" };
          if (s.id === "EMPTY")
            return {
              ...s,
              label: "NO STORAGE",
              description: "Empty storage state",
            };
          return s;
        })}
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

  // Action bar
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
  },
  actionLeft: {
    flex: 1,
  },
  keyCount: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontFamily: "monospace",
    letterSpacing: 1,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: gameUIColors.primary + "08",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.primary + "14",
  },
  actionButtonActive: {
    backgroundColor: gameUIColors.success + "1A",
    borderColor: gameUIColors.success + "4D",
  },
  actionButtonText: {
    fontSize: 9,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 0.5,
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
