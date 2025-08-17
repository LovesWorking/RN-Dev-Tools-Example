import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
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
  ChevronDown,
  ChevronUp,
  HelpCircle,
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
    label: "CONFIG OK",
    subtitle: "All required vars present",
    pulse: false,
  },
  WARNING: {
    icon: AlertTriangle,
    color: gameColors.warning,
    label: "CONFIG WARNING",
    subtitle: "Check variable types/values",
    pulse: false,
  },
  ERROR: {
    icon: AlertCircle,
    color: gameColors.error,
    label: "CONFIG ERROR",
    subtitle: "Missing required variables",
    pulse: false,
  },
  CRITICAL: {
    icon: AlertOctagon,
    color: gameColors.critical,
    label: "CONFIG FAILURE",
    subtitle: "Multiple required vars missing",
    pulse: false,
    glitch: false,
  },
  LOADING: {
    icon: Activity,
    color: gameColors.info,
    label: "LOADING CONFIG",
    subtitle: "Reading environment variables...",
    pulse: false,
  },
};

interface GameUIEnvContentProps {
  requiredEnvVars?: RequiredEnvVar[];
}

// Reusable collapsible section component
interface CollapsibleSectionProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
  title: string;
  count: number;
  subtitle: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  icon: Icon,
  iconColor,
  title,
  count,
  subtitle,
  expanded,
  onToggle,
  children,
}) => (
  <View style={styles.sectionContainer}>
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      style={styles.sectionHeaderTouchable}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <Icon size={14} color={iconColor} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={[styles.sectionBadge, { backgroundColor: iconColor + "20" }]}>
            <Text style={[styles.sectionCount, { color: iconColor }]}>{count}</Text>
          </View>
        </View>
        {expanded ? (
          <ChevronUp size={14} color={gameColors.muted} />
        ) : (
          <ChevronDown size={14} color={gameColors.muted} />
        )}
      </View>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
    
    {expanded && (
      <Animated.View entering={FadeIn.duration(200)}>
        {children}
      </Animated.View>
    )}
  </View>
);

export function GameUIEnvContent({ requiredEnvVars }: GameUIEnvContentProps) {
  // State for expanded issues and sections
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [issuesSectionExpanded, setIssuesSectionExpanded] = useState(true);
  const [requiredSectionExpanded, setRequiredSectionExpanded] = useState(true);
  const [optionalSectionExpanded, setOptionalSectionExpanded] = useState(false);
  
  // Dev test mode state
  const [devTestMode, setDevTestMode] = useState<string | null>(null);
  const [devMenuExpanded, setDevMenuExpanded] = useState(false);

  // Animation values (minimal, only for state changes)
  const alertOpacity = useSharedValue(1);
  const alertScale = useSharedValue(1);

  // Auto-collect environment variables
  const envResults = useDynamicEnv();

  const autoCollectedEnvVars = useMemo(() => {
    // Dev test mode mock data
    if (devTestMode) {
      switch (devTestMode) {
        case 'SUCCESS':
          return {
            EXPO_PUBLIC_API_URL: 'https://api.example.com',
            EXPO_PUBLIC_API_KEY: 'sk_test_1234567890',
            EXPO_PUBLIC_ENVIRONMENT: 'production',
            EXPO_PUBLIC_DEBUG_MODE: 'false',
            EXPO_PUBLIC_CACHE_TTL: '3600',
            EXPO_PUBLIC_MAX_RETRIES: '3',
            EXPO_PUBLIC_TIMEOUT: '30000',
            EXPO_PUBLIC_FEATURE_FLAG_A: 'true',
            EXPO_PUBLIC_FEATURE_FLAG_B: 'false',
            EXPO_PUBLIC_LOG_LEVEL: 'info',
          };
        case 'PARTIAL_FAILURE':
          return {
            EXPO_PUBLIC_API_URL: 'https://api.example.com',
            EXPO_PUBLIC_API_KEY: 'invalid_key_format',
            EXPO_PUBLIC_ENVIRONMENT: 'dev',
            EXPO_PUBLIC_DEBUG_MODE: 'yes', // Wrong type
            EXPO_PUBLIC_TIMEOUT: 'thirty', // Wrong type
          };
        case 'CRITICAL_FAILURE':
          return {
            EXPO_PUBLIC_LOG_LEVEL: 'debug',
            EXPO_PUBLIC_FEATURE_FLAG_A: 'true',
          };
        case 'EMPTY':
          return {};
        case 'TYPE_ERRORS':
          return {
            EXPO_PUBLIC_API_URL: '12345', // Should be URL
            EXPO_PUBLIC_API_KEY: 'sk_test_1234567890',
            EXPO_PUBLIC_ENVIRONMENT: 'production',
            EXPO_PUBLIC_DEBUG_MODE: 'yes', // Should be boolean
            EXPO_PUBLIC_CACHE_TTL: 'one hour', // Should be number
            EXPO_PUBLIC_MAX_RETRIES: 'three', // Should be number
            EXPO_PUBLIC_TIMEOUT: 'thirty seconds', // Should be number
          };
        case 'VALUE_ERRORS':
          return {
            EXPO_PUBLIC_API_URL: 'https://api.example.com',
            EXPO_PUBLIC_API_KEY: 'wrong_prefix_1234567890', // Wrong prefix
            EXPO_PUBLIC_ENVIRONMENT: 'staging', // Not allowed value
            EXPO_PUBLIC_DEBUG_MODE: 'false',
            EXPO_PUBLIC_LOG_LEVEL: 'verbose', // Invalid log level
            EXPO_PUBLIC_MAX_RETRIES: '-1', // Invalid negative
          };
        default:
          break;
      }
    }
    
    // Normal operation - use actual env vars
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
    // Use mock required vars for dev test mode
    const mockRequiredVars = devTestMode ? [
      { key: 'EXPO_PUBLIC_API_URL', expectedType: 'url', description: 'Base API endpoint URL' },
      { key: 'EXPO_PUBLIC_API_KEY', expectedType: 'string', expectedValue: 'sk_*', description: 'API authentication key' },
      { key: 'EXPO_PUBLIC_ENVIRONMENT', expectedType: 'string', expectedValue: 'production or development', description: 'Current environment' },
      { key: 'EXPO_PUBLIC_DEBUG_MODE', expectedType: 'boolean', description: 'Enable debug logging' },
      { key: 'EXPO_PUBLIC_CACHE_TTL', expectedType: 'number', description: 'Cache time-to-live in seconds' },
      { key: 'EXPO_PUBLIC_MAX_RETRIES', expectedType: 'number', description: 'Maximum retry attempts' },
      { key: 'EXPO_PUBLIC_TIMEOUT', expectedType: 'number', description: 'Request timeout in milliseconds' },
    ] as RequiredEnvVar[] : requiredEnvVars;
    
    return processEnvVars(autoCollectedEnvVars, mockRequiredVars);
  }, [autoCollectedEnvVars, requiredEnvVars, devTestMode]);

  // Calculate statistics
  const stats = useMemo(() => {
    // For dev test mode, ensure we're calculating stats based on mock data
    if (devTestMode === 'EMPTY') {
      return {
        totalCount: 0,
        requiredCount: 0,
        optionalCount: 0,
        presentRequiredCount: 0,
        missingCount: 0,
        wrongValueCount: 0,
        wrongTypeCount: 0,
      };
    }
    return calculateStats(requiredVars, optionalVars, autoCollectedEnvVars);
  }, [requiredVars, optionalVars, autoCollectedEnvVars, devTestMode]);

  // Determine actual alert state based on stats
  const actualAlertState = useMemo(() => {
    if (stats.missingCount > 2 || stats.wrongTypeCount > 2) return "CRITICAL";
    if (stats.missingCount > 0) return "ERROR";
    if (stats.wrongValueCount > 0 || stats.wrongTypeCount > 0) return "WARNING";
    return "OPTIMAL";
  }, [stats]);

  // Use actual state based on env vars
  const currentAlertState = actualAlertState;
  const alertConfig = ALERT_STATES[currentAlertState];
  const IconComponent = alertConfig.icon;

  // Toggle issue expansion
  const toggleIssue = useCallback((key: string) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  // Generate fix suggestions for issues
  const generateFixSuggestion = useCallback((varItem: any) => {
    if (varItem.status === 'required_missing') {
      return `Add to .env: ${varItem.key}=your_value_here`;
    } else if (varItem.status === 'required_wrong_type') {
      const expectedType = varItem.expectedType || 'unknown';
      return `Update type to ${expectedType} in .env file`;
    } else if (varItem.status === 'required_wrong_value') {
      const expectedVal = typeof varItem.expectedValue === 'string' 
        ? varItem.expectedValue 
        : 'valid value';
      return `Update to match: ${expectedVal}`;
    }
    return '';
  }, []);

  // Simple fade-in animation for state changes only
  useEffect(() => {
    // Just a simple fade when state changes
    alertOpacity.value = 0;
    alertOpacity.value = withTiming(1, { duration: 300 });
    alertScale.value = 0.95;
    alertScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
  }, [currentAlertState]);

  const alertAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: alertScale.value }],
    opacity: alertOpacity.value,
  }));


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
                STATIC
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



      {/* Stats Section with game UI styling */}
      <View style={styles.statsWrapper}>
        <CyberpunkEnvVarStats stats={stats} />
      </View>

      {/* Issues Section - Collapsible */}
      {(stats.missingCount > 0 || stats.wrongValueCount > 0 || stats.wrongTypeCount > 0) && (
        <CollapsibleSection
          icon={AlertCircle}
          iconColor={gameColors.warning}
          title="ISSUES TO FIX"
          count={stats.missingCount + stats.wrongValueCount + stats.wrongTypeCount}
          subtitle="Environment variables that need attention before deployment"
          expanded={issuesSectionExpanded}
          onToggle={() => setIssuesSectionExpanded(!issuesSectionExpanded)}
        >
          <View style={styles.issuesCompactList}>
            {requiredVars.filter(v => v.status !== 'required_present').map((varItem, index) => {
              const fixSuggestion = generateFixSuggestion(varItem);
              const isError = varItem.status === 'required_missing';
              const statusColor = isError ? gameColors.warning : gameColors.info;
              const StatusIcon = isError ? AlertOctagon : AlertTriangle;
              const isExpanded = expandedIssues.has(varItem.key);
              const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;
              
              return (
                <View key={`${varItem.key}-${index}`}>
                  <TouchableOpacity
                    onPress={() => toggleIssue(varItem.key)}
                    style={styles.issueCompactRow}
                    activeOpacity={0.7}
                  >
                    <StatusIcon size={14} color={statusColor} />
                    <View style={styles.issueCompactContent}>
                      <Text style={[styles.issueCompactKey, { color: gameColors.primary }]}>
                        {varItem.key}
                      </Text>
                      <Text style={styles.issueCompactDesc}>
                        {varItem.status === 'required_missing' && '• Not found'}
                        {varItem.status === 'required_wrong_type' && `• Expected ${varItem.expectedType}`}
                        {varItem.status === 'required_wrong_value' && `• Invalid: ${String(varItem.value).substring(0, 20)}`}
                      </Text>
                    </View>
                    <ChevronIcon size={12} color={gameColors.muted} />
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <Animated.View 
                      entering={FadeIn.duration(200)}
                      style={styles.issueDetails}
                    >
                      <View style={styles.issueDetailRow}>
                        <Text style={styles.issueDetailLabel}>Status:</Text>
                        <Text style={[styles.issueDetailValue, { color: gameColors.primary, fontWeight: "600" }]}>
                          {varItem.status === 'required_missing' && 'MISSING'}
                          {varItem.status === 'required_wrong_type' && 'TYPE ERROR'}
                          {varItem.status === 'required_wrong_value' && 'INVALID VALUE'}
                        </Text>
                      </View>
                      
                      {varItem.value !== undefined && varItem.status !== 'required_missing' && (
                        <View style={styles.issueDetailRow}>
                          <Text style={styles.issueDetailLabel}>Current:</Text>
                          <Text style={[styles.issueDetailValue, { color: gameColors.warning }]}>
                            "{String(varItem.value)}"
                          </Text>
                        </View>
                      )}
                      
                      {varItem.expectedType && varItem.status === 'required_wrong_type' && (
                        <View style={styles.issueDetailRow}>
                          <Text style={styles.issueDetailLabel}>Expected:</Text>
                          <Text style={[styles.issueDetailValue, { color: gameColors.success }]}>
                            {varItem.expectedType}
                          </Text>
                        </View>
                      )}
                      
                      {varItem.expectedValue && varItem.status === 'required_wrong_value' && (
                        <View style={styles.issueDetailRow}>
                          <Text style={styles.issueDetailLabel}>Expected:</Text>
                          <Text style={[styles.issueDetailValue, { color: gameColors.success }]}>
                            "{typeof varItem.expectedValue === 'string' ? varItem.expectedValue : 'valid value'}"
                          </Text>
                        </View>
                      )}
                      
                      {varItem.description && (
                        <View style={styles.issueDescSection}>
                          <Text style={styles.issueDescText}>{varItem.description}</Text>
                        </View>
                      )}
                      
                      <View style={styles.issueFixSection}>
                        <Text style={styles.issueFixLabel}>HOW TO FIX</Text>
                        <Text style={styles.issueFixText}>{fixSuggestion}</Text>
                      </View>
                    </Animated.View>
                  )}
                </View>
              );
            })}
            
            <Text style={styles.issueHint}>
              Tap any issue to view details
            </Text>
          </View>
        </CollapsibleSection>
      )}

      {/* Required Variables Section - Collapsible */}
      <CollapsibleSection
        icon={Shield}
        iconColor={gameColors.info}
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
      </CollapsibleSection>

      {/* Optional Variables Section - Collapsible */}
      <CollapsibleSection
        icon={Activity}
        iconColor={gameColors.optional}
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
      </CollapsibleSection>

      {/* Tech footer */}
      <Text style={styles.techFooter}>
        // EXPO_PUBLIC_* NAMESPACE REQUIRED FOR RN ACCESS
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
              <Text style={styles.devTestOptionDesc}>Use actual environment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('SUCCESS')}
              style={[styles.devTestOption, devTestMode === 'SUCCESS' && styles.devTestOptionActive]}
            >
              <CheckCircle size={11} color={devTestMode === 'SUCCESS' ? gameColors.success : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'SUCCESS' && styles.devTestOptionTextActive]}>
                ALL VALID
              </Text>
              <Text style={styles.devTestOptionDesc}>Everything configured correctly</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('PARTIAL_FAILURE')}
              style={[styles.devTestOption, devTestMode === 'PARTIAL_FAILURE' && styles.devTestOptionActive]}
            >
              <AlertTriangle size={11} color={devTestMode === 'PARTIAL_FAILURE' ? gameColors.warning : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'PARTIAL_FAILURE' && styles.devTestOptionTextActive]}>
                PARTIAL ISSUES
              </Text>
              <Text style={styles.devTestOptionDesc}>Some missing, some wrong</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setDevTestMode('CRITICAL_FAILURE')}
              style={[styles.devTestOption, devTestMode === 'CRITICAL_FAILURE' && styles.devTestOptionActive]}
            >
              <AlertOctagon size={11} color={devTestMode === 'CRITICAL_FAILURE' ? gameColors.critical : gameColors.muted} />
              <Text style={[styles.devTestOptionText, devTestMode === 'CRITICAL_FAILURE' && styles.devTestOptionTextActive]}>
                CRITICAL FAILURE
              </Text>
              <Text style={styles.devTestOptionDesc}>Most vars missing</Text>
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
                NO VARIABLES
              </Text>
              <Text style={styles.devTestOptionDesc}>Empty environment</Text>
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
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
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
    paddingHorizontal: 4,
    marginTop: 2,
    opacity: 0.7,
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
  
  // Issue details (expanded state)
  issueDetails: {
    marginTop: 8,
    marginLeft: 22,
    marginRight: 8,
    paddingLeft: 12,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderLeftWidth: 2,
    borderLeftColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
  },
  issueDetailRow: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "flex-start",
  },
  issueDetailLabel: {
    fontSize: 10,
    color: gameColors.secondary,
    fontFamily: "monospace",
    fontWeight: "600",
    width: 70,
  },
  issueDetailValue: {
    fontSize: 11,
    color: gameColors.primary,
    fontFamily: "monospace",
    flex: 1,
    lineHeight: 16,
  },
  issueFixSection: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "rgba(0, 212, 255, 0.08)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.2)",
  },
  issueFixLabel: {
    fontSize: 10,
    color: gameColors.info,
    fontFamily: "monospace",
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  issueFixText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: "monospace",
    lineHeight: 18,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  issueDescSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  issueDescText: {
    fontSize: 10,
    color: gameColors.secondary,
    fontFamily: "monospace",
    marginTop: 4,
    lineHeight: 14,
  },
  
  // Dev Test Mode styles
  devTestContainer: {
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "rgba(255, 0, 255, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 255, 0.2)",
    borderStyle: "dashed" as const,
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
