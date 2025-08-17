import React, { useMemo, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Shield,
  Database,
  AlertOctagon,
  Copy,
  RefreshCw,
  Trash2,
  HardDrive,
  ChevronDown,
  ChevronUp,
  Zap,
  HelpCircle,
} from "lucide-react-native";
import { Query, useQueryClient } from "@tanstack/react-query";
import {
  StorageType,
  getCleanStorageKey,
  getStorageType,
  isStorageQuery,
} from "../../react-query/utils/storageQueryUtils";
import { StorageKeyInfo, RequiredStorageKey, StorageKeyStats } from "../types";
import { isDevToolsStorageKey } from "../../../_shared/storage/devToolsStorageKeys";
import { clearAllAppStorage } from "../utils/clearAllStorage";
import { GameUIStorageStats } from "./GameUIStorageStats";
import { StorageKeySection } from "./StorageKeySection";
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
  storage: "#FFD700",

  // Text
  primary: "#FFFFFF",
  secondary: "#AAA",
  muted: "#666",
};

// Alert states for storage status
const ALERT_STATES = {
  OPTIMAL: {
    icon: CheckCircle,
    color: gameColors.success,
    label: "STORAGE HEALTHY",
    subtitle: "All required data is properly stored",
  },
  WARNING: {
    icon: AlertTriangle,
    color: gameColors.warning,
    label: "STORAGE WARNING",
    subtitle: "Some stored values have incorrect types or values",
  },
  ERROR: {
    icon: AlertCircle,
    color: gameColors.error,
    label: "STORAGE ERROR",
    subtitle: "Required data is missing from storage",
  },
  CRITICAL: {
    icon: AlertOctagon,
    color: gameColors.critical,
    label: "STORAGE FAILURE",
    subtitle: "Multiple critical keys are missing",
  },
  EMPTY: {
    icon: Database,
    color: gameColors.info,
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
  const [requiredSectionExpanded, setRequiredSectionExpanded] = useState(true);
  const [optionalSectionExpanded, setOptionalSectionExpanded] = useState(false);
  const [devToolsSectionExpanded, setDevToolsSectionExpanded] = useState(false);
  
  // Dev test mode state
  const [devTestMode, setDevTestMode] = useState<string | null>(null);
  const [devMenuExpanded, setDevMenuExpanded] = useState(false);

  // Animation values (minimal, only for state changes)
  const alertOpacity = useSharedValue(1);
  const alertScale = useSharedValue(1);

  // Get all storage queries from cache
  const allQueries = queryClient.getQueryCache().getAll();
  const storageQueriesData = allQueries.filter((query) =>
    isStorageQuery(query.queryKey)
  );

  // Generate mock storage data for dev test mode
  const getMockStorageData = () => {
    switch (devTestMode) {
      case 'SUCCESS':
        return [
          { key: 'user_token', value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', type: 'secure' },
          { key: 'user_preferences', value: { theme: 'dark', notifications: true }, type: 'mmkv' },
          { key: 'app_version', value: '1.2.3', type: 'async' },
          { key: 'last_sync', value: '2024-01-20T10:30:00Z', type: 'async' },
          { key: 'cache_data', value: { items: 150, size: '2.5MB' }, type: 'mmkv' },
          { key: 'user_id', value: 'usr_abc123', type: 'secure' },
          { key: 'onboarding_complete', value: true, type: 'async' },
          { key: 'api_endpoint', value: 'https://api.example.com', type: 'async' },
        ];
      case 'PARTIAL_FAILURE':
        return [
          { key: 'user_token', value: undefined, type: 'secure' }, // Missing required
          { key: 'user_preferences', value: 'dark', type: 'mmkv' }, // Wrong type
          { key: 'app_version', value: '1.2.3', type: 'async' },
          { key: 'last_sync', value: 'yesterday', type: 'async' }, // Wrong format
        ];
      case 'CRITICAL_FAILURE':
        return [
          { key: 'onboarding_complete', value: false, type: 'async' },
        ];
      case 'TYPE_ERRORS':
        return [
          { key: 'user_token', value: 12345, type: 'secure' }, // Should be string
          { key: 'user_preferences', value: 'preferences', type: 'mmkv' }, // Should be object
          { key: 'onboarding_complete', value: 'yes', type: 'async' }, // Should be boolean
          { key: 'cache_data', value: true, type: 'mmkv' }, // Should be object
        ];
      case 'VALUE_ERRORS':
        return [
          { key: 'user_token', value: 'invalid_token', type: 'secure' },
          { key: 'api_endpoint', value: 'not-a-url', type: 'async' },
          { key: 'user_id', value: '', type: 'secure' }, // Empty value
          { key: 'app_version', value: 'v1.2.3.4.5', type: 'async' }, // Invalid format
        ];
      case 'EMPTY':
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
    const testRequiredKeys = devTestMode ? [
      { key: 'user_token', expectedType: 'string', storageType: 'secure' as StorageType, description: 'Authentication token' },
      { key: 'user_preferences', expectedType: 'object', storageType: 'mmkv' as StorageType, description: 'User settings' },
      { key: 'app_version', expectedType: 'string', storageType: 'async' as StorageType, description: 'Current app version' },
      { key: 'user_id', expectedType: 'string', storageType: 'secure' as StorageType, description: 'Unique user identifier' },
    ] : requiredStorageKeys;

    if (mockData) {
      // Process mock data
      mockData.forEach(({ key, value, type }) => {
        const requiredConfig = testRequiredKeys.find(req => 
          typeof req === 'object' && req.key === key
        );

        let status: StorageKeyInfo["status"] = "optional_present";
        
        if (requiredConfig) {
          if (value === undefined || value === null) {
            status = "required_missing";
          } else if (typeof requiredConfig === 'object' && 'expectedType' in requiredConfig) {
            const actualType = value === null ? "null" : 
                             Array.isArray(value) ? "array" :
                             typeof value;
            status = actualType === requiredConfig.expectedType ? "required_present" : "required_wrong_type";
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
          ...(requiredConfig && typeof requiredConfig === 'object' && 'description' in requiredConfig && {
            description: requiredConfig.description,
          }),
          ...(requiredConfig && typeof requiredConfig === 'object' && 'expectedType' in requiredConfig && {
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
            storageType: (typeof req === 'object' && 'storageType' in req) ? req.storageType : 'async',
            status: "required_missing",
            category: "required",
            ...(typeof req === 'object' && 'description' in req && {
              description: req.description,
            }),
            ...(typeof req === 'object' && 'expectedType' in req && {
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

  // Determine alert state based on stats
  const actualAlertState = useMemo(() => {
    if (stats.totalCount === 0) return "EMPTY";
    if (stats.missingCount > 2 || stats.wrongTypeCount > 2) return "CRITICAL";
    if (stats.missingCount > 0) return "ERROR";
    if (stats.wrongValueCount > 0 || stats.wrongTypeCount > 0) return "WARNING";
    return "OPTIMAL";
  }, [stats]);

  const alertConfig = ALERT_STATES[actualAlertState];
  const IconComponent = alertConfig.icon;

  // Copy to clipboard helper
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', `${label} copied to clipboard`);
  }, []);

  // Generate fix suggestions for issues
  const generateFixSuggestion = useCallback((keyItem: StorageKeyInfo) => {
    if (keyItem.status === 'required_missing') {
      return `Store key: await AsyncStorage.setItem('${keyItem.key}', 'value')`;
    } else if (keyItem.status === 'required_wrong_type') {
      const expectedType = keyItem.expectedType || 'unknown';
      return `Update to ${expectedType} type for key: ${keyItem.key}`;
    } else if (keyItem.status === 'required_wrong_value') {
      return `Check valid values for key: ${keyItem.key}`;
    }
    return '';
  }, []);

  // Simple fade-in animation for state changes only
  useEffect(() => {
    alertOpacity.value = 0;
    alertOpacity.value = withTiming(1, { duration: 300 });
    alertScale.value = 0.95;
    alertScale.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [actualAlertState]);

  const alertAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: alertScale.value }],
    opacity: alertOpacity.value,
  }));

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
    await copyToClipboard(serialized, 'Storage data');
  }, [storageKeys, copyToClipboard]);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Subtle background grid */}
      <View style={styles.backgroundGrid} />

      {/* Status Alert Header */}
      <Animated.View
        style={[
          styles.alertContainer,
          { borderColor: alertConfig.color + "40" },
          alertAnimatedStyle,
        ]}
      >
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
              PERSISTENT
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
                  opacity: 0.3 - i * 0.1,
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Action Controls */}
      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          <Text style={styles.keyCount}>
            {stats.totalCount} {stats.totalCount === 1 ? 'KEY' : 'KEYS'} STORED
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.actionButton, isRefreshing && styles.actionButtonActive]}
            activeOpacity={0.7}
          >
            <RefreshCw 
              size={14} 
              color={isRefreshing ? gameColors.success : gameColors.info} 
            />
            <Text style={[styles.actionButtonText, { color: isRefreshing ? gameColors.success : gameColors.info }]}>
              SCAN
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleExport}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Copy size={14} color={gameColors.storage} />
            <Text style={[styles.actionButtonText, { color: gameColors.storage }]}>
              EXPORT
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Trash2 size={14} color={gameColors.error} />
            <Text style={[styles.actionButtonText, { color: gameColors.error }]}>
              PURGE
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section with game UI styling */}
      <View style={styles.statsWrapper}>
        <GameUIStorageStats stats={stats} />
      </View>

      {/* Issues Section - Show problems first */}
      {(stats.missingCount > 0 || stats.wrongValueCount > 0 || stats.wrongTypeCount > 0) && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <AlertCircle size={14} color={gameColors.error} />
            <Text style={[styles.sectionTitle, { color: gameColors.error }]}>CRITICAL ISSUES</Text>
            <View style={[styles.sectionBadge, { backgroundColor: gameColors.error + "20" }]}>
              <Text style={[styles.sectionCount, { color: gameColors.error }]}>
                {stats.missingCount + stats.wrongValueCount + stats.wrongTypeCount}
              </Text>
            </View>
          </View>
          
          <View style={styles.issuesCompactList}>
            {requiredKeys.filter(k => k.status !== 'required_present').map((keyItem, index) => {
              const fixSuggestion = generateFixSuggestion(keyItem);
              const isError = keyItem.status === 'required_missing';
              const statusColor = isError ? gameColors.error : gameColors.warning;
              const StatusIcon = isError ? AlertOctagon : AlertTriangle;
              
              return (
                <TouchableOpacity
                  key={`${keyItem.key}-${index}`}
                  onPress={() => copyToClipboard(fixSuggestion || keyItem.key, keyItem.key)}
                  style={styles.issueCompactRow}
                  activeOpacity={0.7}
                >
                  <StatusIcon size={14} color={statusColor} />
                  <View style={styles.issueCompactContent}>
                    <Text style={[styles.issueCompactKey, { color: statusColor }]}>
                      {keyItem.key}
                    </Text>
                    <Text style={styles.issueCompactDesc}>
                      {keyItem.status === 'required_missing' && '• Not stored'}
                      {keyItem.status === 'required_wrong_type' && `• Expected ${keyItem.expectedType}`}
                      {keyItem.status === 'required_wrong_value' && `• Invalid: ${String(keyItem.value).substring(0, 20)}`}
                    </Text>
                  </View>
                  <Copy size={12} color={gameColors.muted} />
                </TouchableOpacity>
              );
            })}
            
            <Text style={styles.issueHint}>
              Tap any issue to copy fix suggestion
            </Text>
          </View>
        </View>
      )}

      {/* Required Storage Keys Section - Collapsible */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          onPress={() => setRequiredSectionExpanded(!requiredSectionExpanded)}
          activeOpacity={0.7}
          style={styles.sectionHeaderTouchable}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Shield size={14} color={gameColors.info} />
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>REQUIRED KEYS</Text>
                <Text style={styles.sectionSubtitle}>Data your app needs to function properly</Text>
              </View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionCount}>{stats.requiredCount}</Text>
              </View>
            </View>
            {requiredSectionExpanded ? (
              <ChevronUp size={14} color={gameColors.muted} />
            ) : (
              <ChevronDown size={14} color={gameColors.muted} />
            )}
          </View>
        </TouchableOpacity>
        
        {requiredSectionExpanded && (
          <Animated.View entering={FadeIn.duration(200)}>
            <StorageKeySection
              title=""
              count={-1}
              keys={requiredKeys}
              emptyMessage="No required storage keys configured"
            />
          </Animated.View>
        )}
      </View>

      {/* Optional Storage Keys Section - Collapsible */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          onPress={() => setOptionalSectionExpanded(!optionalSectionExpanded)}
          activeOpacity={0.7}
          style={styles.sectionHeaderTouchable}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Database size={14} color={gameColors.optional} />
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>OPTIONAL KEYS</Text>
                <Text style={styles.sectionSubtitle}>User preferences and non-critical data</Text>
              </View>
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
            {optionalSectionExpanded ? (
              <ChevronUp size={14} color={gameColors.muted} />
            ) : (
              <ChevronDown size={14} color={gameColors.muted} />
            )}
          </View>
        </TouchableOpacity>
        
        {optionalSectionExpanded && (
          <Animated.View entering={FadeIn.duration(200)}>
            <StorageKeySection
              title=""
              count={-1}
              keys={optionalKeys}
              emptyMessage="No optional storage keys found"
            />
          </Animated.View>
        )}
      </View>

      {/* Dev Tools Keys Section - Collapsible */}
      {devToolKeys.length > 0 && (
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            onPress={() => setDevToolsSectionExpanded(!devToolsSectionExpanded)}
            activeOpacity={0.7}
            style={styles.sectionHeaderTouchable}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <HardDrive size={14} color={gameColors.storage} />
                <View style={styles.sectionTitleContainer}>
                  <Text style={styles.sectionTitle}>DEV TOOLS DATA</Text>
                  <Text style={styles.sectionSubtitle}>Internal storage used by development tools</Text>
                </View>
                <View
                  style={[
                    styles.sectionBadge,
                    { backgroundColor: gameColors.storage + "20" },
                  ]}
                >
                  <Text style={[styles.sectionCount, { color: gameColors.storage }]}>
                    {devToolKeys.length}
                  </Text>
                </View>
              </View>
              {devToolsSectionExpanded ? (
                <ChevronUp size={14} color={gameColors.muted} />
              ) : (
                <ChevronDown size={14} color={gameColors.muted} />
              )}
            </View>
          </TouchableOpacity>
          
          {devToolsSectionExpanded && (
            <Animated.View entering={FadeIn.duration(200)}>
              <StorageKeySection
                title=""
                count={-1}
                keys={devToolKeys}
                emptyMessage=""
                headerColor={gameColors.storage}
              />
            </Animated.View>
          )}
        </View>
      )}

      {/* Tech footer */}
      <Text style={styles.techFooter}>
        // ASYNC STORAGE | MMKV | SECURE STORAGE BACKENDS
      </Text>
      
      {/* Dev Test Mode */}
      <View style={styles.devTestContainer}>
        <TouchableOpacity
          onPress={() => setDevMenuExpanded(!devMenuExpanded)}
          activeOpacity={0.7}
          style={styles.devTestHeader}
        >
          <View style={styles.devTestHeaderContent}>
            <Zap size={12} color={gameColors.critical} />
            <Text style={styles.devTestTitle}>DEV TEST MODE</Text>
            {devTestMode && (
              <View style={styles.devTestBadge}>
                <Text style={styles.devTestBadgeText}>{devTestMode}</Text>
              </View>
            )}
          </View>
          {devMenuExpanded ? (
            <ChevronUp size={12} color={gameColors.muted} />
          ) : (
            <ChevronDown size={12} color={gameColors.muted} />
          )}
        </TouchableOpacity>
        
        {devMenuExpanded && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.devTestMenu}>
            <TouchableOpacity
              onPress={() => setDevTestMode(null)}
              style={[styles.devTestOption, !devTestMode && styles.devTestOptionActive]}
            >
              <CheckCircle size={11} color={!devTestMode ? gameColors.success : gameColors.muted} />
              <Text style={[styles.devTestOptionText, !devTestMode && styles.devTestOptionTextActive]}>
                LIVE DATA
              </Text>
              <Text style={styles.devTestOptionDesc}>Use actual storage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('SUCCESS')}
              style={[styles.devTestOption, devTestMode === 'SUCCESS' && styles.devTestOptionActive]}
            >
              <CheckCircle size={11} color={devTestMode === 'SUCCESS' ? gameColors.success : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'SUCCESS' && styles.devTestOptionTextActive]}>
                ALL VALID
              </Text>
              <Text style={styles.devTestOptionDesc}>All keys stored correctly</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('PARTIAL_FAILURE')}
              style={[styles.devTestOption, devTestMode === 'PARTIAL_FAILURE' && styles.devTestOptionActive]}
            >
              <AlertTriangle size={11} color={devTestMode === 'PARTIAL_FAILURE' ? gameColors.warning : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'PARTIAL_FAILURE' && styles.devTestOptionTextActive]}>
                PARTIAL ISSUES
              </Text>
              <Text style={styles.devTestOptionDesc}>Some missing, wrong types</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('CRITICAL_FAILURE')}
              style={[styles.devTestOption, devTestMode === 'CRITICAL_FAILURE' && styles.devTestOptionActive]}
            >
              <AlertOctagon size={11} color={devTestMode === 'CRITICAL_FAILURE' ? gameColors.critical : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'CRITICAL_FAILURE' && styles.devTestOptionTextActive]}>
                CRITICAL FAILURE
              </Text>
              <Text style={styles.devTestOptionDesc}>Most keys missing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('TYPE_ERRORS')}
              style={[styles.devTestOption, devTestMode === 'TYPE_ERRORS' && styles.devTestOptionActive]}
            >
              <Zap size={11} color={devTestMode === 'TYPE_ERRORS' ? gameColors.info : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'TYPE_ERRORS' && styles.devTestOptionTextActive]}>
                TYPE ERRORS
              </Text>
              <Text style={styles.devTestOptionDesc}>Wrong data types</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('VALUE_ERRORS')}
              style={[styles.devTestOption, devTestMode === 'VALUE_ERRORS' && styles.devTestOptionActive]}
            >
              <AlertCircle size={11} color={devTestMode === 'VALUE_ERRORS' ? gameColors.warning : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'VALUE_ERRORS' && styles.devTestOptionTextActive]}>
                VALUE ERRORS
              </Text>
              <Text style={styles.devTestOptionDesc}>Invalid values/formats</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('EMPTY')}
              style={[styles.devTestOption, devTestMode === 'EMPTY' && styles.devTestOptionActive]}
            >
              <HelpCircle size={11} color={devTestMode === 'EMPTY' ? gameColors.muted : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'EMPTY' && styles.devTestOptionTextActive]}>
                NO STORAGE
              </Text>
              <Text style={styles.devTestOptionDesc}>Empty storage state</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
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
    opacity: 0.01,
    backgroundColor: gameColors.info,
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

  // Action bar
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: gameColors.panel,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: gameColors.border + "40",
  },
  actionLeft: {
    flex: 1,
  },
  keyCount: {
    fontSize: 10,
    color: gameColors.secondary,
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
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  actionButtonActive: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderColor: "rgba(0, 255, 136, 0.3)",
  },
  actionButtonText: {
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
  sectionHeaderTouchable: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  sectionTitleContainer: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 11,
    color: gameColors.primary,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 2,
    opacity: 0.9,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: gameColors.secondary,
    fontFamily: "monospace",
    opacity: 0.7,
    marginTop: 2,
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

  // Compact issues section
  issuesCompactList: {
    backgroundColor: gameColors.panel,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 68, 68, 0.2)",
  },
  issueCompactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  issueCompactContent: {
    flex: 1,
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  issueCompactKey: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  issueCompactDesc: {
    fontSize: 10,
    color: gameColors.secondary,
    fontFamily: "monospace",
    flex: 1,
  },
  issueHint: {
    fontSize: 9,
    color: gameColors.muted,
    fontFamily: "monospace",
    textAlign: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
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
  
  // Dev Test Mode styles
  devTestContainer: {
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "rgba(255, 0, 255, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 255, 0.2)",
    borderStyle: "dashed",
  },
  devTestHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  devTestHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  devTestTitle: {
    fontSize: 10,
    color: gameColors.critical,
    fontFamily: "monospace",
    fontWeight: "700",
    letterSpacing: 1,
  },
  devTestBadge: {
    backgroundColor: gameColors.critical + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  devTestBadgeText: {
    fontSize: 8,
    color: gameColors.critical,
    fontFamily: "monospace",
    fontWeight: "600",
  },
  devTestMenu: {
    padding: 8,
    paddingTop: 0,
  },
  devTestOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  devTestOptionActive: {
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.3)",
  },
  devTestOptionText: {
    fontSize: 10,
    color: gameColors.secondary,
    fontFamily: "monospace",
    fontWeight: "600",
    marginLeft: 8,
    minWidth: 100,
  },
  devTestOptionTextActive: {
    color: gameColors.primary,
  },
  devTestOptionDesc: {
    fontSize: 9,
    color: gameColors.muted,
    fontFamily: "monospace",
    marginLeft: 8,
  },
});