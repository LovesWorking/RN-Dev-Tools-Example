import { useMemo, useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import {
  Database,
  RefreshCw,
  Trash2,
  Search,
} from "rn-better-dev-tools/icons";
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
import { StorageFilterCards, type StorageFilterType } from "./StorageFilterCards";

// Import shared Game UI components
import {
  GameUIStatusHeader,
  useGameUIAlertState,
  gameUIColors,
  GAME_UI_ALERT_STATES,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { macOSColors } from "@/rn-better-dev-tools/src/shared/ui/gameUI/constants/macOSDesignSystemColors";
import { copyToClipboard as copyToClipboardUtil } from "@/rn-better-dev-tools/src/shared/clipboard/copyToClipboard";

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
    color: macOSColors.semantic.info,
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
  const [activeFilter, setActiveFilter] = useState<StorageFilterType>("all");

  // Get all storage queries from cache
  const allQueries = queryClient.getQueryCache().getAll();
  const storageQueriesData = allQueries.filter((query) =>
    isStorageQuery(query.queryKey)
  );

  // Process storage keys into StorageKeyInfo format
  const { storageKeys, devToolKeys, stats } = useMemo(() => {
    const keyInfoMap = new Map<string, StorageKeyInfo>();
    const devToolKeyInfoMap = new Map<string, StorageKeyInfo>();

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

    // Calculate stats
    const keys = Array.from(keyInfoMap.values());
    const devKeys = Array.from(devToolKeyInfoMap.values());
    
    const storageStats: StorageKeyStats & { devToolsCount: number } = {
      totalCount: keys.length + devKeys.length,
      requiredCount: keys.filter((k) => k.category === "required").length,
      missingCount: keys.filter((k) => k.status === "required_missing").length,
      wrongValueCount: keys.filter((k) => k.status === "required_wrong_value")
        .length,
      wrongTypeCount: keys.filter((k) => k.status === "required_wrong_type")
        .length,
      presentRequiredCount: keys.filter((k) => k.status === "required_present")
        .length,
      optionalCount: keys.filter((k) => k.category === "optional").length,
      mmkvCount: [...keys, ...devKeys].filter((k) => k.storageType === "mmkv").length,
      asyncCount: [...keys, ...devKeys].filter((k) => k.storageType === "async").length,
      secureCount: [...keys, ...devKeys].filter((k) => k.storageType === "secure").length,
      devToolsCount: devKeys.length,
    };

    return { storageKeys: keys, devToolKeys: devKeys, stats: storageStats };
  }, [storageQueriesData, requiredStorageKeys]);

  // Group storage keys by status
  const requiredKeys = storageKeys.filter((k) => k.category === "required");
  const optionalKeys = storageKeys.filter((k) => k.category === "optional");
  
  // Combine all keys and sort by priority (issues first)
  const allKeys = useMemo(() => {
    const combined = [...requiredKeys, ...optionalKeys, ...devToolKeys];
    
    // Sort by status priority: errors first, then warnings, then valid
    return combined.sort((a, b) => {
      const priorityMap: Record<string, number> = {
        "required_missing": 1,
        "required_wrong_type": 2,
        "required_wrong_value": 3,
        "required_present": 4,
        "optional_present": 5,
      };
      return (priorityMap[a.status] || 999) - (priorityMap[b.status] || 999);
    });
  }, [requiredKeys, optionalKeys, devToolKeys]);
  
  // Filter keys based on active filter
  const filteredKeys = useMemo(() => {
    switch (activeFilter) {
      case "all":
        return allKeys;
      case "missing":
        return allKeys.filter(k => k.status === "required_missing");
      case "issues":
        return allKeys.filter(k => 
          k.status === "required_missing" || 
          k.status === "required_wrong_type" || 
          k.status === "required_wrong_value"
        );
      default:
        return allKeys;
    }
  }, [allKeys, activeFilter]);

  // Use shared alert state hook
  const { alertConfig, alertAnimatedStyle } = useGameUIAlertState(
    stats,
    STORAGE_ALERT_STATES
  );

  // Copy to clipboard helper
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    const success = await copyToClipboardUtil(text);
    if (success) {
      Alert.alert("Copied!", `${label} copied to clipboard`);
    } else {
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  }, []);

  // Removed unused issues and statsConfig variables

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

      {/* Filter Cards Section */}
      <StorageFilterCards
        stats={stats}
        healthPercentage={healthPercentage}
        healthStatus={healthStatus}
        healthColor={healthColor}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Filtered Storage Keys */}
      {filteredKeys.length > 0 ? (
        <View style={styles.keysSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeFilter === "all" ? "ALL STORAGE KEYS" : 
               activeFilter === "missing" ? "MISSING KEYS" :
               "ISSUES TO FIX"}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredKeys.length}</Text>
            </View>
          </View>
          <StorageKeySection
            title=""
            count={-1}
            keys={filteredKeys}
            emptyMessage=""
          />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Search size={32} color={macOSColors.text.muted} />
          <Text style={styles.emptyTitle}>
            {activeFilter === "all" ? "No storage keys" : 
             activeFilter === "missing" ? "No missing keys" :
             "No issues found"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeFilter === "all" 
              ? "Your app hasn't stored any data yet"
              : activeFilter === "missing"
              ? "All required keys are present"
              : "All storage keys are correctly configured"}
          </Text>
        </View>
      )}

      <Text style={styles.techFooter}>
        ASYNC STORAGE | MMKV | SECURE STORAGE BACKENDS
      </Text>

      {/* Dev Test Mode removed - test component no longer needed */}
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
  
  // Keys section
  keysSection: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: macOSColors.text.muted,
    letterSpacing: 1.2,
    fontFamily: "monospace",
  },
  countBadge: {
    backgroundColor: macOSColors.semantic.infoBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: macOSColors.border.default + "50",
  },
  countText: {
    fontSize: 10,
    fontWeight: "500",
    color: macOSColors.semantic.info,
    fontFamily: "monospace",
  },
  
  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: macOSColors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: macOSColors.text.secondary,
    textAlign: "center",
  },
});
