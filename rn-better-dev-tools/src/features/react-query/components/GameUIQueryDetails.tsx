import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Query, Mutation } from "@tanstack/react-query";
import {
  Clock,
  Users,
  Hash,
  Database,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  PauseCircle,
} from "lucide-react-native";

// Import shared Game UI components
import {
  GameUICollapsibleSection,
  gameUIColors,
} from "@/rn-better-dev-tools/src/shared/ui/gameUI";
import { displayValue } from "@/rn-better-dev-tools/src/shared/utils/displayValue";
import { getQueryStatusLabel } from "../utils/getQueryStatusLabel";

interface GameUIQueryDetailsProps {
  query?: Query;
  mutation?: Mutation;
  type: "query" | "mutation";
}

export function GameUIQueryDetails({ query, mutation, type }: GameUIQueryDetailsProps) {
  if (!query && !mutation) return null;

  const getStatusInfo = useMemo(() => {
    if (type === "query" && query) {
      const status = getQueryStatusLabel(query);
      switch (status) {
        case "fresh":
          return { label: "FRESH", color: gameUIColors.success, icon: CheckCircle2 };
        case "stale":
          return { label: "STALE", color: gameUIColors.warning, icon: Clock };
        case "fetching":
          return { label: "FETCHING", color: gameUIColors.info, icon: Loader2 };
        case "paused":
          return { label: "PAUSED", color: gameUIColors.storage, icon: PauseCircle };
        case "inactive":
          return { label: "INACTIVE", color: gameUIColors.muted, icon: Activity };
        default:
          return { label: "UNKNOWN", color: gameUIColors.secondary, icon: AlertCircle };
      }
    } else if (type === "mutation" && mutation) {
      if (mutation.state.isPaused) {
        return { label: "PAUSED", color: gameUIColors.storage, icon: PauseCircle };
      }
      switch (mutation.state.status) {
        case "success":
          return { label: "SUCCESS", color: gameUIColors.success, icon: CheckCircle2 };
        case "error":
          return { label: "ERROR", color: gameUIColors.error, icon: XCircle };
        case "pending":
          return { label: "PENDING", color: gameUIColors.info, icon: Loader2 };
        default:
          return { label: "IDLE", color: gameUIColors.muted, icon: Activity };
      }
    }
    return { label: "UNKNOWN", color: gameUIColors.secondary, icon: AlertCircle };
  }, [query, mutation, type]);

  const lastUpdated = useMemo(() => {
    const timestamp = type === "query" && query 
      ? query.state.dataUpdatedAt 
      : mutation?.state.submittedAt;
    
    if (!timestamp) return "Never";
    
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }, [query, mutation, type]);

  const key = type === "query" && query
    ? query.queryKey
    : mutation?.options.mutationKey;

  const observerCount = type === "query" && query
    ? query.getObserversCount()
    : null;

  const isDisabled = type === "query" && query?.isDisabled();

  const StatusIcon = getStatusInfo.icon;

  return (
    <View style={styles.container}>
      {/* Status Header */}
      <View style={styles.statusHeader}>
        <View style={styles.statusBadge}>
          <StatusIcon size={14} color={getStatusInfo.color} />
          <Text style={[styles.statusText, { color: getStatusInfo.color }]}>
            {getStatusInfo.label}
          </Text>
        </View>
        {isDisabled && (
          <View style={styles.disabledBadge}>
            <Text style={styles.disabledText}>DISABLED</Text>
          </View>
        )}
      </View>

      {/* Key Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Hash size={12} color={gameUIColors.info} />
          <Text style={styles.sectionTitle}>
            {type === "query" ? "QUERY KEY" : "MUTATION KEY"}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.keyScroll}
        >
          <Text style={styles.keyText}>
            {key ? displayValue(key, true) : "Anonymous"}
          </Text>
        </ScrollView>
      </View>

      {/* Metadata */}
      <View style={styles.metadataGrid}>
        {observerCount !== null && (
          <View style={styles.metadataItem}>
            <Users size={12} color={gameUIColors.secondary} />
            <Text style={styles.metadataLabel}>OBSERVERS</Text>
            <Text style={styles.metadataValue}>{observerCount}</Text>
          </View>
        )}
        
        <View style={styles.metadataItem}>
          <Clock size={12} color={gameUIColors.secondary} />
          <Text style={styles.metadataLabel}>
            {type === "query" ? "UPDATED" : "SUBMITTED"}
          </Text>
          <Text style={styles.metadataValue}>{lastUpdated}</Text>
        </View>

        {type === "query" && query && (
          <View style={styles.metadataItem}>
            <Database size={12} color={gameUIColors.secondary} />
            <Text style={styles.metadataLabel}>DATA SIZE</Text>
            <Text style={styles.metadataValue}>
              {query.state.data 
                ? `${JSON.stringify(query.state.data).length} bytes`
                : "Empty"}
            </Text>
          </View>
        )}
      </View>

      {/* Error Information */}
      {((type === "query" && query?.state.error) || 
        (type === "mutation" && mutation?.state.error)) && (
        <View style={styles.errorSection}>
          <View style={styles.errorHeader}>
            <XCircle size={12} color={gameUIColors.error} />
            <Text style={styles.errorTitle}>ERROR DETAILS</Text>
          </View>
          <Text style={styles.errorText}>
            {displayValue(
              type === "query" ? query?.state.error : mutation?.state.error,
              true
            )}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: gameUIColors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: gameUIColors.border + "40",
    overflow: "hidden",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: gameUIColors.background,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "20",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  disabledBadge: {
    backgroundColor: gameUIColors.error + "20",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: gameUIColors.error + "40",
  },
  disabledText: {
    fontSize: 9,
    color: gameUIColors.error,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: gameUIColors.border + "20",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    color: gameUIColors.secondary,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  keyScroll: {
    maxHeight: 60,
  },
  keyText: {
    fontSize: 11,
    color: gameUIColors.primary,
    fontFamily: "monospace",
    lineHeight: 16,
    backgroundColor: gameUIColors.info + "10",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: gameUIColors.info + "20",
  },
  metadataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 16,
  },
  metadataItem: {
    minWidth: 80,
    alignItems: "center",
    gap: 4,
  },
  metadataLabel: {
    fontSize: 9,
    color: gameUIColors.muted,
    fontWeight: "600",
    fontFamily: "monospace",
    letterSpacing: 0.5,
  },
  metadataValue: {
    fontSize: 11,
    color: gameUIColors.primary,
    fontWeight: "500",
    fontFamily: "monospace",
  },
  errorSection: {
    margin: 12,
    padding: 10,
    backgroundColor: gameUIColors.error + "10",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: gameUIColors.error + "30",
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 10,
    color: gameUIColors.error,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  errorText: {
    fontSize: 10,
    color: gameUIColors.error + "CC",
    fontFamily: "monospace",
    lineHeight: 14,
  },
});